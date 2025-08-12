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

function resolveIssuanceItems(answers: Answer): string[] {
  const items: string[] = [];
  
  // 1. 交付通知書（基本必須）
  if (answers.notification_card === "yes") {
    items.push("mynumber_card_notification");
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
  
  // 4. 本人確認書類と来庁者別の処理
  if (answers.visitor_type === "self") {
    // 本人の場合
    if (answers.notification_card === "yes") {
      items.push("identity_document_self_with_notification");
    } else {
      items.push("identity_document_self_no_notification");
    }
  } else if (answers.visitor_type === "proxy") {
    // 代理人の場合
    if (answers.notification_card === "no" && answers.applicant_age !== "under_15") {
      // 交付通知書なし、かつ15歳未満以外の場合は受取不可
      items.push("no_notification_warning");
      return items;
    }
    
    // 75歳以上や特定の理由の場合
    if (answers.applicant_age === "15_over" && answers.guardian_reason_15_over === "other") {
      const reason = answers.specific_reason;
      if (reason === "over_75" || reason === "disabled" || reason === "hospitalized" || 
          reason === "facility_resident" || reason === "care_certified" || reason === "pregnant" || 
          reason === "study_abroad" || reason === "student" || reason === "hikikomori") {
        items.push("identity_document_proxy_75_over");
        
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
        items.push("identity_document_proxy_other");
      }
    } else if (answers.applicant_age === "15_over") {
      // 成年被後見人等の場合
      const reason = answers.guardian_reason_15_over;
      items.push("identity_document_proxy_guardian");
      
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
      items.push("identity_document_proxy_guardian");
      
      if (answers.cohabitation_status === "not_cohabiting" && answers.koseki_location === "other") {
        items.push("family_register_under_15");
      }
    }
  }
  
  return Array.from(new Set(items));
}

export function getItemDetails(itemKey: string) {
  return ITEMS[itemKey] || null;
}