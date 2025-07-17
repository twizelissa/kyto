import { Answer } from "@shared/schema";
import { ITEMS } from "./questions-data";

interface Rule {
  cond: Answer;
  add: string[];
  description?: string;
}

const RULES: Rule[] = [
  // ①カード申請・交付
  {
    cond: {procedure: "new_application", age: "u15", visitor: "legal"},
    add: ["notification_card", "self_id_a1_b1", "legal_rep_id_a1", "legal_authority_proof"],
    description: "15歳未満の方の新規申請（法定代理人）"
  },
  {
    cond: {procedure: "new_application", age: "u15", visitor: "self"},
    add: ["notification_card", "self_id_a1_b1", "legal_rep_id_a1", "legal_authority_proof"],
    description: "15歳未満の方は法定代理人の同伴が必要"
  },
  {
    cond: {procedure: "new_application", visitor: "self", notification: "have"},
    add: ["notification_card", "self_id_a1_b1"],
    description: "本人による新規申請・交付"
  },
  {
    cond: {procedure: "new_application", visitor: "self", notification: "lost"},
    add: ["self_id_a2", "self_id_a1_b1"],
    description: "交付通知書なしの新規申請"
  },
  {
    cond: {procedure: "new_application", visitor: "proxy"},
    add: ["notification_card", "self_id_a2", "proxy_id_a1_b1", "power_of_attorney", "reason_certificate"],
    description: "任意代理人による新規申請・交付"
  },

  // ②カード・電子証明書更新
  {
    cond: {procedure: "card_renewal", visitor: "self"},
    add: ["mynumber_card", "old_card"],
    description: "本人によるカード更新"
  },
  {
    cond: {procedure: "card_renewal", age: "u15", visitor: "legal"},
    add: ["mynumber_card", "legal_rep_id_a1", "legal_authority_proof"],
    description: "15歳未満の方のカード更新（法定代理人）"
  },
  {
    cond: {procedure: "card_renewal", visitor: "proxy"},
    add: ["mynumber_card", "proxy_id_a1", "inquiry_response"],
    description: "任意代理人によるカード更新"
  },
  {
    cond: {procedure: "cert_renewal", visitor: "self"},
    add: ["mynumber_card", "pin_number"],
    description: "本人による電子証明書更新"
  },
  {
    cond: {procedure: "cert_renewal", age: "u15", visitor: "legal"},
    add: ["mynumber_card", "legal_rep_id_a1", "legal_authority_proof"],
    description: "15歳未満の方の電子証明書更新（法定代理人）"
  },
  {
    cond: {procedure: "cert_renewal", visitor: "proxy"},
    add: ["mynumber_card", "proxy_id_a1", "inquiry_response"],
    description: "任意代理人による電子証明書更新"
  },

  // ③暗証番号初期化・変更・ロック解除
  {
    cond: {procedure: "pin_reset", visitor: "self"},
    add: ["mynumber_card", "self_id_a1_b1"],
    description: "本人による暗証番号初期化"
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
