export interface QuestionOption {
  v: string;
  label: string;
  icon: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  showWhen?: (answers: Record<string, string>) => boolean;
}

export const QUESTIONS: Question[] = [
  {
    "id": "procedure",
    "text": "手続きの種類を選んでください",
    "options": [
      {"v": "card_application", "label": "①カード申請・交付", "icon": "fas fa-id-card"},
      {"v": "card_renewal", "label": "②カード・電子証明書更新", "icon": "fas fa-sync-alt"},
      {"v": "info_change", "label": "③情報変更（引越し・氏名・ログイン解除）", "icon": "fas fa-edit"},
      {"v": "address_name_change", "label": "④住所・氏名変更に伴うカード券面更新", "icon": "fas fa-address-card"},
      {"v": "time_deletion", "label": "⑤カード紛失等による一時停止の解除", "icon": "fas fa-play-circle"},
      {"v": "card_return", "label": "⑥カード返納", "icon": "fas fa-minus-circle"}
    ]
  },
  {
    "id": "card_number",
    "text": "カードの申請は何枚目ですか？",
    "options": [
      {"v": "first", "label": "1枚目", "icon": "fas fa-star"},
      {"v": "second_plus", "label": "2枚目以降", "icon": "fas fa-redo"}
    ],
    "showWhen": (answers) => answers.procedure === "card_application"
  },
  {
    "id": "age",
    "text": "申請者の年齢を選んでください",
    "options": [
      {"v": "adult", "label": "成人", "icon": "fas fa-user"},
      {"v": "minor", "label": "未成年者", "icon": "fas fa-child"}
    ]
  },
  {
    "id": "minor_age",
    "text": "未成年者の詳細な年齢を選んでください",
    "options": [
      {"v": "u15", "label": "15歳未満", "icon": "fas fa-baby"},
      {"v": "legal_representative", "label": "法定代理人", "icon": "fas fa-user-shield"},
      {"v": "any_representative", "label": "任意代理人", "icon": "fas fa-user-friends"}
    ],
    "showWhen": (answers) => answers.age === "minor"
  },
  {
    "id": "visitor",
    "text": "窓口に行く人は？",
    "options": [
      {"v": "self", "label": "本人", "icon": "fas fa-user-check"},
      {"v": "legal", "label": "法定代理人（親権者・成年後見人）", "icon": "fas fa-user-shield"},
      {"v": "proxy", "label": "任意代理人", "icon": "fas fa-user-friends"}
    ]
  },
  {
    "id": "card_status",
    "text": "現在のカードの状況は？",
    "options": [
      {"v": "have", "label": "手元にある", "icon": "fas fa-check-circle"},
      {"v": "lost", "label": "紛失・盗難", "icon": "fas fa-times-circle"},
      {"v": "broken", "label": "破損・汚損", "icon": "fas fa-exclamation-circle"},
      {"v": "none", "label": "持っていない（新規申請）", "icon": "fas fa-question-circle"}
    ],
    "showWhen": (answers) => answers.procedure !== "new_application"
  },
  {
    "id": "pin_status",
    "text": "暗証番号の状況は？",
    "options": [
      {"v": "ok", "label": "覚えている・問題なし", "icon": "fas fa-lock"},
      {"v": "forgot", "label": "忘れた・不明", "icon": "fas fa-lock-open"},
      {"v": "locked", "label": "ロックされている", "icon": "fas fa-times-circle"}
    ],
    "showWhen": (answers) => ["cert_renewal", "pin_reset", "info_change"].includes(answers.procedure)
  },
  {
    "id": "notification",
    "text": "交付通知書（はがき）はありますか？",
    "options": [
      {"v": "have", "label": "手元にある", "icon": "fas fa-envelope"},
      {"v": "lost", "label": "なくした・届いていない", "icon": "fas fa-envelope-open"}
    ],
    "showWhen": (answers) => answers.procedure === "new_application"
  }
];

export interface RequiredItem {
  name: string;
  icon: string;
}

export const ITEMS: Record<string, RequiredItem> = {
  // 基本書類
  "mynumber_card": {name: "マイナンバーカード本体", icon: "fas fa-id-card"},
  "notification_card": {name: "交付通知書（はがき）", icon: "fas fa-envelope"},
  "pin_number": {name: "暗証番号（4桁数字）", icon: "fas fa-key"},
  
  // 本人確認書類
  "self_id_a1": {name: "本人確認書類（A欄から1点）", icon: "fas fa-id-badge"},
  "self_id_a2": {name: "本人確認書類（A欄から2点）", icon: "fas fa-id-badge"},
  "self_id_a1_b1": {name: "本人確認書類（A欄1点＋B欄1点）", icon: "fas fa-id-badge"},
  "self_id_b2": {name: "本人確認書類（B欄から2点）", icon: "fas fa-id-badge"},
  "self_id_b3_with_photo": {name: "本人確認書類（B欄3点、うち1点は顔写真付き）", icon: "fas fa-id-badge"},
  
  // 法定代理人関連書類
  "legal_rep_id_a1": {name: "法定代理人の本人確認書類（A欄から1点）", icon: "fas fa-user-shield"},
  "legal_rep_id_a2": {name: "法定代理人の本人確認書類（A欄から2点）", icon: "fas fa-user-shield"},
  "legal_rep_id_a1_b1": {name: "法定代理人の本人確認書類（A欄1点＋B欄1点）", icon: "fas fa-user-shield"},
  "legal_authority_proof": {name: "法定代理権を証明する書類（戸籍謄本等）", icon: "fas fa-file-alt"},
  "guardian_cert": {name: "成年後見登記事項証明書", icon: "fas fa-file-certificate"},
  
  // 任意代理人関連書類
  "proxy_id_a1": {name: "任意代理人の本人確認書類（A欄から1点）", icon: "fas fa-user-friends"},
  "proxy_id_a2": {name: "任意代理人の本人確認書類（A欄から2点）", icon: "fas fa-user-friends"},
  "proxy_id_a1_b1": {name: "任意代理人の本人確認書類（A欄1点＋B欄1点）", icon: "fas fa-user-friends"},
  "inquiry_response": {name: "照会書兼回答書（封入・封緘済み）", icon: "fas fa-envelope-open"},
  "power_of_attorney": {name: "委任状", icon: "fas fa-file-signature"},
  "reason_certificate": {name: "来庁できない理由を証明する書類", icon: "fas fa-file-medical"},
  
  // 特殊な書類
  "lost_report": {name: "遺失届受理番号控え", icon: "fas fa-file-signature"},
  "reissue_fee": {name: "再発行手数料（1,000円）", icon: "fas fa-yen-sign"},
  "broken_card": {name: "破損したマイナンバーカード", icon: "fas fa-id-card"},
  "old_card": {name: "旧マイナンバーカード（返納用）", icon: "fas fa-id-card"},
  "temp_stop_release_form": {name: "個人番号カード一時停止解除届", icon: "fas fa-play-circle"},
  "return_form": {name: "個人番号カード紛失・廃止・返納届", icon: "fas fa-minus-circle"}
};
