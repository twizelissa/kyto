export interface QuestionOption {
  v: string;
  label: string;
  icon: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    "id": "age",
    "text": "申請者の年齢を選んでください",
    "options": [
      {"v": "u15", "label": "15歳未満", "icon": "fas fa-child"},
      {"v": "u18", "label": "15〜17歳", "icon": "fas fa-user-graduate"},
      {"v": "adult", "label": "18歳以上", "icon": "fas fa-user"}
    ]
  },
  {
    "id": "actor",
    "text": "窓口に行く人は？",
    "options": [
      {"v": "self", "label": "本人", "icon": "fas fa-user-check"},
      {"v": "legal", "label": "法定代理人（親／成年後見人）", "icon": "fas fa-user-shield"},
      {"v": "proxy", "label": "任意代理人", "icon": "fas fa-user-friends"}
    ]
  },
  {
    "id": "proc",
    "text": "手続の種類",
    "options": [
      {"v": "renew", "label": "有効期限更新", "icon": "fas fa-sync-alt"},
      {"v": "cert", "label": "電子証明書のみ更新", "icon": "fas fa-certificate"},
      {"v": "reissue", "label": "再発行（紛失・破損）", "icon": "fas fa-exclamation-triangle"},
      {"v": "change", "label": "氏名・住所変更", "icon": "fas fa-edit"}
    ]
  },
  {
    "id": "card",
    "text": "いまカードは？",
    "options": [
      {"v": "have", "label": "手元にある", "icon": "fas fa-check-circle"},
      {"v": "lost", "label": "なくした／盗難", "icon": "fas fa-times-circle"},
      {"v": "broken", "label": "破損・汚損", "icon": "fas fa-exclamation-circle"}
    ]
  },
  {
    "id": "pin",
    "text": "暗証番号は？",
    "options": [
      {"v": "ok", "label": "覚えている", "icon": "fas fa-lock"},
      {"v": "ng", "label": "不明・ロック中", "icon": "fas fa-lock-open"}
    ]
  }
];

export interface RequiredItem {
  name: string;
  icon: string;
}

export const ITEMS: Record<string, RequiredItem> = {
  "card": {name: "マイナンバーカード本体", icon: "fas fa-id-card"},
  "notice": {name: "有効期限通知書（無くても可）", icon: "fas fa-envelope"},
  "pin": {name: "暗証番号", icon: "fas fa-key"},
  "own_ID": {name: "顔写真付き本人確認書類1点", icon: "fas fa-id-badge"},
  "parent_ID": {name: "法定代理人の本人確認書類1点", icon: "fas fa-user-shield"},
  "family_cert": {name: "戸籍謄本など親子関係証明", icon: "fas fa-file-alt"},
  "reply_form": {name: "照会書兼回答書（封入済）", icon: "fas fa-envelope-open"},
  "proxy_ID": {name: "代理人本人確認書類1点", icon: "fas fa-user-friends"},
  "ID_set": {name: "本人確認書類（A欄1点又はB欄2点）", icon: "fas fa-id-card-alt"},
  "lost_report": {name: "遺失届受理番号控え", icon: "fas fa-file-signature"},
  "fee": {name: "再発行手数料（1,000円目安）", icon: "fas fa-yen-sign"},
  "pin_reset_app": {name: "暗証番号再設定申請書", icon: "fas fa-file-contract"},
  "child_card": {name: "お子様のマイナンバーカード", icon: "fas fa-id-card"},
  "change_docs": {name: "変更内容を証明する書類", icon: "fas fa-file-text"},
  "broken_card": {name: "破損したマイナンバーカード", icon: "fas fa-id-card"}
};
