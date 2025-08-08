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
    "id": "card_process",
    "text": "手続きの種類を選んでください",
    "options": [
      {"v": "application", "label": "カード申請", "icon": "fas fa-file-alt"},
      {"v": "issuance", "label": "カード交付", "icon": "fas fa-id-card"}
    ],
    "showWhen": (answers) => answers.procedure === "card_application"
  },
  {
    "id": "renewal_type",
    "text": "更新の種類を選んでください",
    "options": [
      {"v": "card_renewal", "label": "カード更新", "icon": "fas fa-id-card"},
      {"v": "cert_renewal", "label": "電子証明書更新", "icon": "fas fa-certificate"}
    ],
    "showWhen": (answers) => answers.procedure === "card_renewal"
  },
  {
    "id": "renewal_process",
    "text": "手続きの種類を選んでください",
    "options": [
      {"v": "application", "label": "カード申請", "icon": "fas fa-file-alt"},
      {"v": "issuance", "label": "カード交付", "icon": "fas fa-id-card"}
    ],
    "showWhen": (answers) => answers.procedure === "card_renewal"
  },
  {
    "id": "visitor",
    "text": "窓口に行く人は？",
    "options": [
      {"v": "self", "label": "a 本人", "icon": "fas fa-user-check"},
      {"v": "legal", "label": "b 法定代理人（親権者・成年後見人）", "icon": "fas fa-user-shield"},
      {"v": "proxy", "label": "c 任意代理人", "icon": "fas fa-user-friends"}
    ]
  },
  {
    "id": "legal_details",
    "text": "該当する項目を選んでください",
    "options": [
      {"v": "u15", "label": "15歳未満", "icon": "fas fa-baby"},
      {"v": "adult_guardian", "label": "成年被後見人", "icon": "fas fa-user-shield"}
    ],
    "showWhen": (answers) => answers.visitor === "legal"
  },
  {
    "id": "minor_residence",
    "text": "居住状況を選んでください",
    "options": [
      {"v": "same", "label": "同居", "icon": "fas fa-home"},
      {"v": "separate", "label": "非同居", "icon": "fas fa-home"}
    ],
    "showWhen": (answers) => answers.visitor === "legal" && answers.legal_details === "u15"
  },
  {
    "id": "proxy_details",
    "text": "該当する項目を選んでください",
    "options": [
      {"v": "guardian", "label": "被保佐人・被補助人", "icon": "fas fa-user-shield"},
      {"v": "other", "label": "それ以外", "icon": "fas fa-user-friends"}
    ],
    "showWhen": (answers) => answers.visitor === "proxy"
  },
  {
    "id": "id_document",
    "text": "本人確認書類の有無を選んでください",
    "options": [
      {"v": "photo_id", "label": "顔写真付本人確認書類あり", "icon": "fas fa-id-card"},
      {"v": "no_photo_id", "label": "顔写真付本人確認書類なし", "icon": "fas fa-file-alt"}
    ],
    "showWhen": (answers) => 
      answers.visitor === "self" || 
      (answers.visitor === "legal" && (answers.legal_details === "adult_guardian" || Boolean(answers.minor_residence))) ||
      (answers.visitor === "proxy" && Boolean(answers.proxy_details))
  },

];

export interface RequiredItem {
  name: string;
  icon: string;
}

export const ITEMS: Record<string, RequiredItem> = {
  // 基本書類
  "mynumber_card": {name: "マイナンバーカード本体", icon: "fas fa-id-card"},
  "notification_card": {name: "交付通知書（はがき）", icon: "fas fa-envelope"},
  "mynumber_notification_card": {name: "マイナンバー通知カード（お持ちの方は返納していただきます。）", icon: "fas fa-id-card-alt"},
  "resident_card": {name: "住民基本台帳カード（お持ちの方は返納していただきます。）", icon: "fas fa-id-card"},
  "current_mynumber_card": {name: "現在お持ちのマイナンバーカード（マイナンバーカード再交付申請の方は、現在お持ちのマイナンバーカードを返納してください。返納がない場合、再交付手数料として1,000円頂戴します。）", icon: "fas fa-id-card"},
  "pin_number": {name: "暗証番号（4桁数字）", icon: "fas fa-key"},
  
  // 本人確認書類
  "self_id_a1": {name: "本人確認書類（A欄から1点）", icon: "fas fa-id-badge"},
  "self_id_a2": {name: "本人確認書類（A欄から2点）", icon: "fas fa-id-badge"},
  "self_id_a1_b1": {name: "本人確認書類（下表（本人確認書類一覧）のA欄から1点又はB欄から2点）※　交付通知書（はがき）をお持ちでない場合は、下表のA欄2点又はA欄1点＋B欄1点が必要になります。（例：運転免許証＋パスポート　又は　運転免許証＋資格確認書（健康保険証）　等）", icon: "fas fa-id-badge"},
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
