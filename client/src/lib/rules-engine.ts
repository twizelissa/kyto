import { Answer } from "@shared/schema";
import { ITEMS } from "./questions-data";

interface Rule {
  cond: Answer;
  add: string[];
  description?: string;
}

const RULES: Rule[] = [
  // ①カード申請・交付 - a本人
  {
    cond: {procedure: "card_application", card_number: "first", card_process: "application", visitor: "self", id_document: "photo_id"},
    add: ["notification_card", "self_id_a1_b1"],
    description: "本人による初回カード申請（顔写真付ID有）"
  },
  {
    cond: {procedure: "card_application", card_number: "first", card_process: "application", visitor: "self", id_document: "no_photo_id"},
    add: ["notification_card", "self_id_a2", "self_id_a1_b1"],
    description: "本人による初回カード申請（顔写真付ID無）"
  },
  {
    cond: {procedure: "card_application", card_number: "first", card_process: "issuance", visitor: "self", id_document: "photo_id"},
    add: ["notification_card", "self_id_a1_b1"],
    description: "本人による初回カード交付（顔写真付ID有）"
  },
  {
    cond: {procedure: "card_application", card_number: "first", card_process: "issuance", visitor: "self", id_document: "no_photo_id"},
    add: ["notification_card", "self_id_a2", "self_id_a1_b1"],
    description: "本人による初回カード交付（顔写真付ID無）"
  },
  
  // ①カード申請・交付 - b法定代理人
  {
    cond: {procedure: "card_application", card_number: "first", card_process: "application", visitor: "legal", legal_details: "u15", minor_residence: "same", id_document: "photo_id"},
    add: ["notification_card", "self_id_a1_b1", "legal_rep_id_a1", "legal_authority_proof"],
    description: "15歳未満（同居）の初回カード申請（法定代理人・顔写真付ID有）"
  },
  {
    cond: {procedure: "card_application", card_number: "first", card_process: "application", visitor: "legal", legal_details: "u15", minor_residence: "separate", id_document: "photo_id"},
    add: ["notification_card", "self_id_a1_b1", "legal_rep_id_a1", "legal_authority_proof"],
    description: "15歳未満（非同居）の初回カード申請（法定代理人・顔写真付ID有）"
  },
  {
    cond: {procedure: "card_application", card_number: "first", card_process: "application", visitor: "legal", legal_details: "adult_guardian", id_document: "photo_id"},
    add: ["notification_card", "self_id_a1_b1", "legal_rep_id_a1", "legal_authority_proof"],
    description: "成年被後見人の初回カード申請（法定代理人・顔写真付ID有）"
  },
  
  // ①カード申請・交付 - c任意代理人
  {
    cond: {procedure: "card_application", card_number: "first", card_process: "application", visitor: "proxy", proxy_details: "guardian", id_document: "photo_id"},
    add: ["notification_card", "self_id_a2", "proxy_id_a1_b1", "power_of_attorney", "reason_certificate"],
    description: "被保佐人・被補助人の初回カード申請（任意代理人・顔写真付ID有）"
  },
  {
    cond: {procedure: "card_application", card_number: "first", card_process: "application", visitor: "proxy", proxy_details: "other", id_document: "photo_id"},
    add: ["notification_card", "self_id_a2", "proxy_id_a1_b1", "power_of_attorney", "reason_certificate"],
    description: "その他の初回カード申請（任意代理人・顔写真付ID有）"
  },

  // ②カード・電子証明書更新 - a本人
  {
    cond: {procedure: "card_renewal", renewal_type: "card_renewal", renewal_process: "application", visitor: "self", id_document: "photo_id"},
    add: ["mynumber_card", "self_id_a1_b1"],
    description: "本人によるカード更新申請（顔写真付ID有）"
  },
  {
    cond: {procedure: "card_renewal", renewal_type: "card_renewal", renewal_process: "issuance", visitor: "self", id_document: "photo_id"},
    add: ["mynumber_card", "self_id_a1_b1"],
    description: "本人によるカード更新交付（顔写真付ID有）"
  },
  {
    cond: {procedure: "card_renewal", renewal_type: "cert_renewal", renewal_process: "application", visitor: "self", id_document: "photo_id"},
    add: ["mynumber_card", "self_id_a1_b1"],
    description: "本人による電子証明書更新申請（顔写真付ID有）"
  },
  {
    cond: {procedure: "card_renewal", renewal_type: "cert_renewal", renewal_process: "issuance", visitor: "self", id_document: "photo_id"},
    add: ["mynumber_card", "self_id_a1_b1"],
    description: "本人による電子証明書更新交付（顔写真付ID有）"
  },
  
  // ②カード・電子証明書更新 - b法定代理人
  {
    cond: {procedure: "card_renewal", renewal_type: "card_renewal", renewal_process: "application", visitor: "legal", legal_details: "u15", id_document: "photo_id"},
    add: ["mynumber_card", "legal_rep_id_a1", "legal_authority_proof"],
    description: "15歳未満のカード更新申請（法定代理人・顔写真付ID有）"
  },
  {
    cond: {procedure: "card_renewal", renewal_type: "card_renewal", renewal_process: "application", visitor: "legal", legal_details: "adult_guardian", id_document: "photo_id"},
    add: ["mynumber_card", "legal_rep_id_a1", "legal_authority_proof"],
    description: "成年被後見人のカード更新申請（法定代理人・顔写真付ID有）"
  },
  
  // ②カード・電子証明書更新 - c任意代理人
  {
    cond: {procedure: "card_renewal", renewal_type: "card_renewal", renewal_process: "application", visitor: "proxy", proxy_details: "guardian", id_document: "photo_id"},
    add: ["mynumber_card", "proxy_id_a1", "inquiry_response"],
    description: "被保佐人・被補助人のカード更新申請（任意代理人・顔写真付ID有）"
  },
  {
    cond: {procedure: "card_renewal", renewal_type: "card_renewal", renewal_process: "application", visitor: "proxy", proxy_details: "other", id_document: "photo_id"},
    add: ["mynumber_card", "proxy_id_a1", "inquiry_response"],
    description: "その他のカード更新申請（任意代理人・顔写真付ID有）"
  },

  // ③情報変更（引越し・氏名・ログイン解除）
  {
    cond: {procedure: "info_change", visitor: "self", id_document: "photo_id"},
    add: ["mynumber_card", "self_id_a1_b1"],
    description: "本人による情報変更（顔写真付ID有）"
  },
  {
    cond: {procedure: "info_change", visitor: "legal", id_document: "photo_id"},
    add: ["mynumber_card", "legal_rep_id_a1", "legal_authority_proof"],
    description: "法定代理人による情報変更（顔写真付ID有）"
  },
  {
    cond: {procedure: "info_change", visitor: "proxy", id_document: "photo_id"},
    add: ["mynumber_card", "proxy_id_a1", "inquiry_response"],
    description: "任意代理人による情報変更（顔写真付ID有）"
  },

  // ④住所・氏名変更に伴うカード券面更新
  {
    cond: {procedure: "address_name_change", visitor: "self", id_document: "photo_id"},
    add: ["mynumber_card", "self_id_a1_b1"],
    description: "本人による住所・氏名変更に伴うカード券面更新（顔写真付ID有）"
  },
  {
    cond: {procedure: "address_name_change", visitor: "legal", id_document: "photo_id"},
    add: ["mynumber_card", "legal_rep_id_a1", "legal_authority_proof"],
    description: "法定代理人による住所・氏名変更に伴うカード券面更新（顔写真付ID有）"
  },
  {
    cond: {procedure: "address_name_change", visitor: "proxy", id_document: "photo_id"},
    add: ["mynumber_card", "proxy_id_a1", "inquiry_response"],
    description: "任意代理人による住所・氏名変更に伴うカード券面更新（顔写真付ID有）"
  },

  // ⑤カード紛失等による一時停止の解除
  {
    cond: {procedure: "time_deletion", visitor: "self", id_document: "photo_id"},
    add: ["mynumber_card", "self_id_a1_b1"],
    description: "本人による一時停止の解除（顔写真付ID有）"
  },
  {
    cond: {procedure: "time_deletion", visitor: "legal", id_document: "photo_id"},
    add: ["mynumber_card", "legal_rep_id_a1", "legal_authority_proof"],
    description: "法定代理人による一時停止の解除（顔写真付ID有）"
  },
  {
    cond: {procedure: "time_deletion", visitor: "proxy", id_document: "photo_id"},
    add: ["mynumber_card", "proxy_id_a1", "inquiry_response"],
    description: "任意代理人による一時停止の解除（顔写真付ID有）"
  },

  // ⑥カード返納
  {
    cond: {procedure: "card_return", visitor: "self", id_document: "photo_id"},
    add: ["mynumber_card"],
    description: "本人によるカード返納（顔写真付ID有）"
  },
  {
    cond: {procedure: "card_return", visitor: "legal", id_document: "photo_id"},
    add: ["mynumber_card", "legal_rep_id_a1", "legal_authority_proof"],
    description: "法定代理人によるカード返納（顔写真付ID有）"
  },
  {
    cond: {procedure: "card_return", visitor: "proxy", id_document: "photo_id"},
    add: ["mynumber_card", "proxy_id_a1", "inquiry_response"],
    description: "任意代理人によるカード返納（顔写真付ID有）"
  },
  {
    cond: {procedure: "pin_reset", age: "u15", visitor: "legal"},
    add: ["mynumber_card", "legal_rep_id_a2", "legal_authority_proof"],
    description: "15歳未満の方の暗証番号初期化（法定代理人）"
  },
  {
    cond: {procedure: "pin_reset", visitor: "proxy"},
    add: ["mynumber_card", "proxy_id_a2", "inquiry_response"],
    description: "任意代理人による暗証番号初期化"
  },

  // ④住所・氏名変更等に伴うカード券面変更
  {
    cond: {procedure: "info_change", visitor: "self"},
    add: ["mynumber_card", "pin_number"],
    description: "本人による住所・氏名変更"
  },
  {
    cond: {procedure: "info_change", age: "u15", visitor: "legal"},
    add: ["mynumber_card", "pin_number", "legal_rep_id_a1", "legal_authority_proof"],
    description: "15歳未満の方の住所・氏名変更（法定代理人）"
  },
  {
    cond: {procedure: "info_change", visitor: "proxy"},
    add: ["mynumber_card", "proxy_id_a1", "power_of_attorney"],
    description: "任意代理人による住所・氏名変更（2回来庁必要）"
  },

  // ⑤カード紛失等による一時停止の解除
  {
    cond: {procedure: "suspension_release", visitor: "self"},
    add: ["temp_stop_release_form", "mynumber_card"],
    description: "本人による一時停止の解除"
  },

  // ⑥カード返納
  {
    cond: {procedure: "card_return", visitor: "self"},
    add: ["return_form", "mynumber_card"],
    description: "本人によるカード返納"
  },

  // 紛失・破損のケース
  {
    cond: {card_status: "lost"},
    add: ["lost_report", "reissue_fee"],
    description: "カード紛失時の追加書類"
  },
  {
    cond: {card_status: "broken"},
    add: ["broken_card", "reissue_fee"],
    description: "カード破損時の追加書類"
  }
];

export function resolveItems(answers: Answer): string[] {
  const items = new Set<string>();
  
  // Apply all matching rules (not just first match)
  for (const rule of RULES) {
    const matches = Object.entries(rule.cond).every(([key, value]) => answers[key] === value);
    if (matches) {
      rule.add.forEach(item => items.add(item));
    }
  }
  
  // If no specific rule matches, provide basic defaults
  if (items.size === 0) {
    items.add('mynumber_card');
    items.add('self_id_a1');
  }
  
  return Array.from(items).filter(key => ITEMS[key]);
}

export function getItemDetails(itemKey: string) {
  return ITEMS[itemKey];
}
