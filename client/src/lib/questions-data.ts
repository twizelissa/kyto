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
    "text": "お手続きの種類をお選びください",
    "options": [
      {"v": "card_application", "label": "カードの申請・更新", "icon": "fas fa-id-card"},
      {"v": "card_issuance", "label": "カードの交付（受け取り）", "icon": "fas fa-hand-holding"},
      {"v": "digital_cert", "label": "電子証明書の発行・更新", "icon": "fas fa-certificate"},
      {"v": "pin_change", "label": "暗証番号の変更・初期化", "icon": "fas fa-key"},
      {"v": "info_change", "label": "住所・氏名等の変更", "icon": "fas fa-edit"},
      {"v": "card_lost", "label": "カードの紛失", "icon": "fas fa-exclamation-triangle"},
      {"v": "card_return", "label": "カードの返納", "icon": "fas fa-minus-circle"}
    ]
  },
  {
    "id": "application_type",
    "text": "お手続きの種類をお選びください",
    "options": [
      {"v": "new", "label": "新規", "icon": "fas fa-plus"},
      {"v": "renewal", "label": "更新", "icon": "fas fa-sync-alt"},
      {"v": "lost_reissue", "label": "紛失による再発行", "icon": "fas fa-exclamation-triangle"},
      {"v": "other_reissue", "label": "紛失以外の理由による再発行", "icon": "fas fa-redo"}
    ],
    "showWhen": (answers) => answers.procedure === "card_application"
  },
  {
    "id": "lost_procedures",
    "text": "紛失手続きの確認",
    "options": [],
    "showWhen": (answers) => answers.procedure === "card_application" && answers.application_type === "lost_reissue"
  },
  {
    "id": "application_method",
    "text": "申請方法をお選びください",
    "options": [
      {"v": "online", "label": "オンライン（スマートフォンやパソコン）で申請する", "icon": "fas fa-laptop"},
      {"v": "photo_booth", "label": "まちなかの写真機から申請する", "icon": "fas fa-camera"},
      {"v": "mail", "label": "郵送で申請する", "icon": "fas fa-envelope"},
      {"v": "center", "label": "マイナンバーカードセンターで申請する", "icon": "fas fa-building"},
      {"v": "mobile_service", "label": "出張申請窓口又は出張申請サポートで申請する", "icon": "fas fa-truck"},
      {"v": "office_support", "label": "区役所・支所の窓口での申請サポートを受ける", "icon": "fas fa-hands-helping"}
    ],
    "showWhen": (answers) => 
      answers.procedure === "card_application" && 
      answers.application_type && 
      answers.application_type !== "lost_reissue" || 
      (answers.application_type === "lost_reissue" && answers.lost_check_complete === "true")
  },
  {
    "id": "mail_type",
    "text": "郵送申請の種類をお選びください",
    "options": [
      {"v": "notification_form", "label": "通知カード又は個人番号通知書に同封されているマイナンバーカード交付申請書による申請", "icon": "fas fa-file-alt"},
      {"v": "handwritten_form", "label": "手書き交付申請書による申請", "icon": "fas fa-pen"}
    ],
    "showWhen": (answers) => answers.application_method === "mail"
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
