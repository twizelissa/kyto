import { Answer } from "@shared/schema";
import { ITEMS } from "./questions-data";

interface Rule {
  cond: Answer;
  add: string[];
  description?: string;
}

// Simplified rules - most procedures now end with application method selection and show info instead of checklist
const RULES: Rule[] = [];

export function resolveItems(answers: Answer): string[] {
  // For most application flows, we now show information instead of document checklist
  if (answers.application_method) {
    return []; // No documents needed, just show application method info
  }
  
  // For card issuance (pickup), generate document list based on flow
  if (answers.procedure === "card_issuance") {
    return resolveIssuanceItems(answers);
  }
  
  // For electronic certificate issuance/renewal
  if (answers.procedure === "digital_cert") {
    return resolveCertificateItems(answers);
  }
  
  // For PIN change/reset procedures
  if (answers.procedure === "pin_change") {
    return resolvePinChangeItems(answers);
  }
  
  // For other procedures that might need document lists
  const requiredItems: string[] = [];
  
  for (const rule of RULES) {
    const matches = Object.entries(rule.cond).every(([key, value]) => {
      return answers[key] === value;
    });
    
    if (matches) {
      requiredItems.push(...rule.add);
    }
  }
  
  return Array.from(new Set(requiredItems));
}

// 代理人の理由に基づく特別案内の判定
export function getProxySpecialNotice(answers: Answer): string | null {
  if (answers.procedure !== "card_issuance" || answers.visitor_type !== "proxy") {
    return null;
  }
  
  // 15歳未満の場合
  if (answers.applicant_age === "under_15") {
    return "minor_guardian";
  }
  
  // 15歳以上の代理人の場合
  if (answers.applicant_age === "15_over") {
    const guardianReason = answers.guardian_reason_15_over;
    
    // 成年被後見人等の場合
    if (["adult_guardian", "conservatee", "assisted_person", "voluntary_guardian"].includes(guardianReason)) {
      return "minor_guardian"; // 同じ様式を使用
    }
    
    // 「それ以外」を選択した場合の具体的理由
    if (guardianReason === "other") {
      const specificReason = answers.specific_reason;
      
      switch (specificReason) {
        case "hospitalized":
          return "hospitalized";
        case "facility_resident":
          return "facility_resident";
        case "care_certified":
          return "care_certified";
        case "hikikomori":
          return "hikikomori";
        default:
          return null;
      }
    }
  }
  
  return null;
}

function resolveIssuanceItems(answers: Answer): string[] {
  const items: string[] = [];
  
  // 1. 交付通知書（持っている場合のみ）
  if (answers.notification_card === "yes") {
    // 代理人で特定の条件の場合は注意書き付きの交付通知書
    if (answers.visitor_type === "proxy" && answers.applicant_age === "15_over" && answers.guardian_reason_15_over === "other") {
      const reason = answers.specific_reason;
      if (reason === "over_75") {
        items.push("notification_card_proxy_75_over");
      } else {
        items.push("notification_card_proxy_other");
      }
    } else {
      items.push("notification_card");
    }
    
    // 交付通知書がある場合かつ本人の場合のみ本人確認書類
    if (answers.visitor_type === "self") {
      items.push("identity_document_with_notification");
    }
  }
  
  // 2. 更新・再発行（紛失以外）の場合の現在のマイナンバーカード
  // 質問2で「更新」「紛失以外の理由による再発行」を選択した場合のみ必要
  if (answers.issuance_type === "renewal" || answers.issuance_type === "other_reissue") {
    items.push("current_mynumber_card_with_fee");
  }
  
  // 3. 返納書類（住民基本台帳カード、マイナンバー通知カード）
  if (answers.return_documents) {
    const documents = answers.return_documents.split(',');
    if (documents.includes('basic_resident_card')) {
      items.push("basic_resident_card");
    }
    if (documents.includes('mynumber_notification')) {
      items.push("mynumber_notification_card");
    }
  }
  
  // 4. 交付通知書がない場合の処理
  if (answers.notification_card === "no") {
    if (answers.visitor_type === "proxy" && answers.applicant_age !== "under_15") {
      // 成年被後見人等の場合は本人確認書類不要（applicant_identity_documentのみで十分）
      if (answers.guardian_reason_15_over && 
          ["adult_guardian", "conservatee", "assisted_person", "voluntary_guardian"].includes(answers.guardian_reason_15_over)) {
        // 成年被後見人等の場合は何も追加しない
      } else if (answers.inquiry_response_confirmed === "true") {
        // 照会書兼回答書を持っている場合
        items.push("inquiry_response");
        items.push("identity_document_with_notification");
      } else {
        // その他の代理人で15歳未満以外の場合は受取不可
        items.push("no_notification_warning");
        return items;
      }
    } else if (answers.visitor_type === "self") {
      // 本人の場合は別の本人確認書類が必要
      items.push("identity_document_no_notification");
    }
    // 15歳未満の場合の処理は別途実装
  }

  // 5. 代理人の場合の追加処理
  if (answers.visitor_type === "proxy") {
    // 代理人の場合は必ず申請者本人の本人確認書類が必要
    items.push("applicant_identity_document");
    
    // 75歳以上や特定の理由の場合
    if (answers.applicant_age === "15_over" && answers.guardian_reason_15_over === "other") {
      const reason = answers.specific_reason;
      if (reason === "over_75" || reason === "disabled" || reason === "hospitalized" || 
          reason === "facility_resident" || reason === "care_certified" || reason === "pregnant" || 
          reason === "study_abroad" || reason === "student" || reason === "hikikomori") {
        // 代理人の本人確認書類（その他の場合）
        items.push("proxy_identity_document_other");
        
        // 来庁困難理由証明書類を追加
        switch (reason) {
          case "hospitalized":
            items.push("hospitalized_cert");
            break;
          case "disabled":
            items.push("disabled_cert");
            break;
          case "facility_resident":
            items.push("facility_cert");
            break;
          case "care_certified":
            items.push("care_cert");
            break;
          case "pregnant":
            items.push("pregnant_cert");
            break;
          case "study_abroad":
            items.push("study_abroad_cert");
            break;
          case "student":
            items.push("student_cert");
            break;
          case "hikikomori":
            items.push("hikikomori_cert");
            break;
        }
      } else {
        // 代理人の本人確認書類（その他の場合）
        items.push("proxy_identity_document_other");
      }
    } else if (answers.applicant_age === "15_over" && 
               answers.guardian_reason_15_over && 
               ["adult_guardian", "conservatee", "assisted_person", "voluntary_guardian"].includes(answers.guardian_reason_15_over)) {
      // 成年被後見人等の場合
      const reason = answers.guardian_reason_15_over;
      // 代理人の本人確認書類（成年被後見人等）
      items.push("proxy_identity_document_guardian");
      
      switch (reason) {
        case "adult_guardian":
          items.push("adult_guardian_cert");
          break;
        case "conservatee":
          items.push("conservatee_cert");
          break;
        case "assisted_person":
          items.push("assisted_person_cert");
          break;
        case "voluntary_guardian":
          items.push("voluntary_guardian_cert");
          break;
      }
    } else if (answers.applicant_age === "under_15") {
      // 15歳未満の場合
      // 代理人の本人確認書類（15歳未満）
      items.push("proxy_identity_document_guardian");
      
      if (answers.cohabitation_status === "not_cohabiting" && answers.koseki_location === "other") {
        items.push("family_register_under_15");
      }
    }
  }
  
  // 6. 本人（代理人が同行する場合を含む）で代理人同行の場合の追加処理
  if (answers.visitor_type === "self" && answers.self_detail_type === "with_proxy") {
    // 代理人の本人確認書類を追加
    items.push("proxy_accompanying_id");
    
    // 後見人関連の証明書類を追加
    if (answers.self_proxy_reason) {
      switch (answers.self_proxy_reason) {
        case "adult_guardian":
          items.push("adult_guardian_cert");
          break;
        case "conservatee":
          items.push("conservatee_cert");
          break;
        case "assisted_person":
          items.push("assisted_person_cert");
          break;
        case "voluntary_guardian":
          items.push("voluntary_guardian_cert");
          break;
      }
    }
    
    // 15歳未満かつ非同居かつ本籍地が京都以外の場合
    if (answers.self_proxy_reason === "under_15" && answers.self_cohabitation === "not_cohabiting" && answers.self_domicile === "other") {
      items.push("family_register_under_15");
    }
  }
  
  // 8. 照会書兼回答書（該当する場合のみ）
  if (answers.issuance_inquiry_response_check === "applicable") {
    items.push("inquiry_response");
  }
  
  return Array.from(new Set(items));
}

function resolveCertificateItems(answers: Answer): string[] {
  const items: string[] = [];
  
  // 必ず「ご本人のマイナンバーカード」を追加
  items.push("mynumber_card_certificate");
  
  // 代理人の場合の追加書類
  if (answers.cert_visitor_type === "proxy") {
    items.push("proxy_identity_document_photo");
    
    // 代理人の理由による証明書類
    if (answers.cert_proxy_reason) {
      switch (answers.cert_proxy_reason) {
        case "adult_guardian":
          items.push("cert_adult_guardian_cert");
          break;
        case "conservatee":
          items.push("cert_conservatee_cert");
          break;
        case "assisted_person":
          items.push("cert_assisted_person_cert");
          break;
        case "voluntary_guardian":
          items.push("cert_voluntary_guardian_cert");
          break;
        case "under_15":
          // 15歳未満かつ非同居かつ本籍が京都市以外の場合
          if (answers.cert_cohabitation_status === "not_cohabiting" && answers.cert_koseki_location === "other") {
            items.push("cert_family_register_under_15");
          }
          break;
        case "voluntary_proxy":
          // 任意代理人かつ発行の場合
          if (answers.cert_type === "issuance") {
            items.push("cert_inquiry_response_voluntary");
          }
          // 任意代理人かつ更新の場合
          if (answers.cert_type === "renewal") {
            items.push("cert_inquiry_response_renewal");
          }
          break;
        case "same_household":
          // 同一世帯員（転入届又は転居届と併せて行う手続き）の場合
          items.push("power_of_attorney");
          break;
      }
    }
  }
  
  return Array.from(new Set(items));
}

// PIN変更・初期化の必要書類解決
function resolvePinChangeItems(answers: Answer): string[] {
  const items: string[] = [];
  
  // 本人の場合の必要書類
  if (answers.pin_visitor_type === "self") {
    items.push("mynumber_card");
    items.push("identity_document_ab");
    return Array.from(new Set(items));
  }
  
  // 代理人の場合の必要書類
  if (answers.pin_visitor_type === "proxy") {
    items.push("pin_applicant_mynumber_card");
    items.push("pin_proxy_identity_options");
    
    // 代理人理由による追加書類
    if (answers.pin_proxy_reason) {
      switch (answers.pin_proxy_reason) {
        case "adult_guardian":
          items.push("pin_adult_guardian_cert");
          break;
        case "conservatee":
          items.push("pin_conservatee_cert");
          break;
        case "assisted_person":
          items.push("pin_assisted_person_cert");
          break;
        case "voluntary_guardian":
          items.push("pin_voluntary_guardian_cert");
          break;
        case "voluntary_proxy":
          items.push("pin_inquiry_response_with_instructions");
          break;
        case "under_15":
          // 15歳未満かつ非同居かつ本籍が京都市以外の場合
          if (answers.pin_cohabitation_status === "not_cohabiting" && answers.pin_koseki_location === "other") {
            items.push("pin_family_register_under_15");
          }
          break;
      }
    }
    
    return Array.from(new Set(items));
  }
  
  return Array.from(new Set(items));
}

export function getItemDetails(itemKey: string) {
  return ITEMS[itemKey] || null;
}