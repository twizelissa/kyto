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
      {"v": "card_lost", "label": "カードの紛失・紛失手続き後の発見", "icon": "fas fa-exclamation-triangle"},
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
      {"v": "mobile_service", "label": "出張申請窓口又は出張申請サポートを利用する", "icon": "fas fa-truck"},
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
  },
  // カードの交付（受け取り）の質問
  {
    "id": "issuance_type",
    "text": "お手続きの種類をお選びください",
    "options": [
      {"v": "new", "label": "新規", "icon": "fas fa-plus"},
      {"v": "renewal", "label": "更新", "icon": "fas fa-sync-alt"},
      {"v": "lost_reissue", "label": "紛失による再発行", "icon": "fas fa-exclamation-triangle"},
      {"v": "other_reissue", "label": "紛失以外の理由による再発行", "icon": "fas fa-redo"}
    ],
    "showWhen": (answers) => answers.procedure === "card_issuance"
  },
  {
    "id": "notification_card",
    "text": "交付通知書を持っていますか",
    "options": [
      {"v": "yes", "label": "持っている", "icon": "fas fa-check"},
      {"v": "no", "label": "持っていない", "icon": "fas fa-times"}
    ],
    "showWhen": (answers) => answers.procedure === "card_issuance" && Boolean(answers.issuance_type)
  },
  {
    "id": "return_documents",
    "text": "下記の書類をお持ちですか？\nお持ちの場合は返納していただきます。",
    "options": [
      {"v": "basic_resident_card", "label": "住民基本台帳カード", "icon": "fas fa-id-card"},
      {"v": "mynumber_notification", "label": "マイナンバー通知カード又は個人番号通知書", "icon": "fas fa-id-card-alt"}
    ],
    "showWhen": (answers) => answers.procedure === "card_issuance" && answers.issuance_type === "new" && Boolean(answers.notification_card)
  },
  {
    "id": "visitor_type",
    "text": "手続きに来られる方をお選びください",
    "options": [
      {"v": "self", "label": "本人（代理人が同行する場合を含む）", "icon": "fas fa-user"},
      {"v": "proxy", "label": "代理人", "icon": "fas fa-user-friends"}
    ],
    "showWhen": (answers) => {
      if (answers.procedure !== "card_issuance") return false;
      if (answers.issuance_type === "new") {
        // 新規の場合は return_documents が存在する（空文字でも良い）かチェック
        return "return_documents" in answers;
      } else {
        return answers.notification_card !== undefined;
      }
    }
  },
  // 本人選択時の詳細質問
  {
    "id": "self_detail_type",
    "text": "手続きに来られる方をお選びください",
    "options": [
      {"v": "self_only", "label": "本人のみ", "icon": "fas fa-user"},
      {"v": "with_proxy", "label": "代理人が同行する", "icon": "fas fa-user-friends"}
    ],
    "showWhen": (answers) => answers.procedure === "card_issuance" && answers.visitor_type === "self"
  },
  {
    "id": "self_proxy_reason",
    "text": "下記の中から理由を選択してください",
    "options": [
      {"v": "adult_guardian", "label": "成年被後見人", "icon": "fas fa-shield-alt"},
      {"v": "conservatee", "label": "被保佐人", "icon": "fas fa-shield-alt"},
      {"v": "assisted_person", "label": "被補助人", "icon": "fas fa-shield-alt"},
      {"v": "voluntary_guardian", "label": "任意被後見人", "icon": "fas fa-shield-alt"},
      {"v": "under_15", "label": "15歳未満", "icon": "fas fa-child"}
    ],
    "showWhen": (answers) => answers.procedure === "card_issuance" && answers.visitor_type === "self" && answers.self_detail_type === "with_proxy"
  },
  {
    "id": "self_cohabitation",
    "text": "申請者と代理人の同居の有無をお選びください",
    "options": [
      {"v": "cohabiting", "label": "同居", "icon": "fas fa-home"},
      {"v": "not_cohabiting", "label": "非同居", "icon": "fas fa-home"}
    ],
    "showWhen": (answers) => answers.procedure === "card_issuance" && answers.visitor_type === "self" && answers.self_detail_type === "with_proxy" && answers.self_proxy_reason === "under_15"
  },
  {
    "id": "self_domicile",
    "text": "申請者の方の本籍地についてお選びください",
    "options": [
      {"v": "kyoto", "label": "京都市内", "icon": "fas fa-map-marker-alt"},
      {"v": "other", "label": "それ以外", "icon": "fas fa-map"}
    ],
    "showWhen": (answers) => answers.procedure === "card_issuance" && answers.visitor_type === "self" && answers.self_detail_type === "with_proxy" && answers.self_proxy_reason === "under_15" && answers.self_cohabitation === "not_cohabiting"
  },

  {
    "id": "applicant_age",
    "text": "申請者の年齢をお選びください",
    "options": [
      {"v": "15_over", "label": "15歳以上", "icon": "fas fa-user"},
      {"v": "under_15", "label": "15歳未満", "icon": "fas fa-child"}
    ],
    "showWhen": (answers) => answers.procedure === "card_issuance" && answers.visitor_type === "proxy"
  },
  {
    "id": "guardian_reason_15_over",
    "text": "下記の中から理由を選択してください",
    "options": [
      {"v": "adult_guardian", "label": "成年被後見人", "icon": "fas fa-shield-alt"},
      {"v": "conservatee", "label": "被保佐人", "icon": "fas fa-shield-alt"},
      {"v": "assisted_person", "label": "被補助人", "icon": "fas fa-shield-alt"},
      {"v": "voluntary_guardian", "label": "任意被後見人", "icon": "fas fa-shield-alt"},
      {"v": "other", "label": "それ以外", "icon": "fas fa-ellipsis-h"}
    ],
    "showWhen": (answers) => answers.procedure === "card_issuance" && answers.visitor_type === "proxy" && answers.applicant_age === "15_over"
  },
  {
    "id": "inquiry_response_check",
    "text": "照会書兼回答書について",
    "options": [],
    "showWhen": (answers) => answers.procedure === "card_issuance" && 
                           answers.notification_card === "no" && 
                           answers.visitor_type === "proxy" && 
                           answers.applicant_age === "15_over" && 
                           answers.guardian_reason_15_over === "other"
  },
  {
    "id": "specific_reason",
    "text": "下記の中から理由を選択してください",
    "options": [
      {"v": "over_75", "label": "75歳以上", "icon": "fas fa-user-clock"},
      {"v": "disabled", "label": "障害者", "icon": "fas fa-wheelchair"},
      {"v": "hospitalized", "label": "長期で入院されている", "icon": "fas fa-hospital"},
      {"v": "facility_resident", "label": "施設に入所されている", "icon": "fas fa-building"},
      {"v": "care_certified", "label": "要介護・要支援認定者", "icon": "fas fa-hands-helping"},
      {"v": "pregnant", "label": "妊婦", "icon": "fas fa-baby"},
      {"v": "study_abroad", "label": "海外留学", "icon": "fas fa-plane"},
      {"v": "student", "label": "中学生・高校生・高専生", "icon": "fas fa-graduation-cap"},
      {"v": "hikikomori", "label": "社会的参加を回避し長期にわたって概ね家庭にとどまり続けている状態である", "icon": "fas fa-home"}
    ],
    "showWhen": (answers) => answers.procedure === "card_issuance" && 
                           answers.visitor_type === "proxy" &&
                           answers.applicant_age === "15_over" &&
                           answers.guardian_reason_15_over === "other" && 
                           (answers.notification_card === "yes" || answers.inquiry_response_confirmed === "true")
  },
  {
    "id": "cohabitation_status",
    "text": "申請者と代理人の同居の有無をお選びください",
    "options": [
      {"v": "cohabiting", "label": "同居", "icon": "fas fa-home"},
      {"v": "not_cohabiting", "label": "非同居", "icon": "fas fa-exchange-alt"}
    ],
    "showWhen": (answers) => answers.procedure === "card_issuance" && answers.visitor_type === "proxy" && answers.applicant_age === "under_15"
  },
  {
    "id": "koseki_location",
    "text": "申請者の方の本籍地についてお選びください",
    "options": [
      {"v": "kyoto_city", "label": "京都市内", "icon": "fas fa-map-marker-alt"},
      {"v": "other", "label": "それ以外", "icon": "fas fa-map"}
    ],
    "showWhen": (answers) => answers.procedure === "card_issuance" && answers.cohabitation_status === "not_cohabiting"
  },
  
  // 電子証明書の発行・更新の質問
  {
    "id": "cert_type",
    "text": "お手続きの種類をお選びください",
    "options": [
      {"v": "issuance", "label": "発行", "icon": "fas fa-plus"},
      {"v": "renewal", "label": "更新", "icon": "fas fa-sync-alt"}
    ],
    "showWhen": (answers) => answers.procedure === "digital_cert"
  },
  {
    "id": "cert_visitor_type",
    "text": "手続きに来られる方をお選びください",
    "options": [
      {"v": "self", "label": "本人", "icon": "fas fa-user"},
      {"v": "proxy", "label": "代理人", "icon": "fas fa-user-friends"}
    ],
    "showWhen": (answers) => answers.procedure === "digital_cert" && Boolean(answers.cert_type)
  },
  {
    "id": "cert_proxy_reason",
    "text": "下記の中から理由を選択してください",
    "options": [
      {"v": "adult_guardian", "label": "成年被後見人", "icon": "fas fa-shield-alt"},
      {"v": "conservatee", "label": "被保佐人", "icon": "fas fa-shield-alt"},
      {"v": "assisted_person", "label": "被補助人", "icon": "fas fa-shield-alt"},
      {"v": "voluntary_guardian", "label": "任意被後見人", "icon": "fas fa-shield-alt"},
      {"v": "under_15", "label": "15歳未満", "icon": "fas fa-child"},
      {"v": "voluntary_proxy", "label": "任意代理人", "icon": "fas fa-user-friends"},
      {"v": "same_household", "label": "同一世帯員（転入届又は転居届と併せて行う手続き）", "icon": "fas fa-home"}
    ],
    "showWhen": (answers) => answers.procedure === "digital_cert" && answers.cert_visitor_type === "proxy"
  },
  {
    "id": "cert_cohabitation_status",
    "text": "申請者と代理人の同居の有無をお選びください",
    "options": [
      {"v": "cohabiting", "label": "同居", "icon": "fas fa-home"},
      {"v": "not_cohabiting", "label": "非同居", "icon": "fas fa-exchange-alt"}
    ],
    "showWhen": (answers) => answers.procedure === "digital_cert" && answers.cert_proxy_reason === "under_15"
  },
  {
    "id": "cert_koseki_location",
    "text": "申請者の方の本籍地についてお選びください",
    "options": [
      {"v": "kyoto_city", "label": "京都市内", "icon": "fas fa-map-marker-alt"},
      {"v": "other", "label": "それ以外", "icon": "fas fa-map"}
    ],
    "showWhen": (answers) => answers.procedure === "digital_cert" && answers.cert_cohabitation_status === "not_cohabiting"
  },
  
  // 暗証番号の変更・初期化の質問
  {
    "id": "pin_type",
    "text": "お手続きの種類をお選びください",
    "options": [
      {"v": "change", "label": "変更", "icon": "fas fa-edit"},
      {"v": "reset", "label": "初期化", "icon": "fas fa-redo"}
    ],
    "showWhen": (answers) => answers.procedure === "pin_change"
  },
  {
    "id": "pin_visitor_type",
    "text": "手続きに来られる方をお選びください",
    "options": [
      {"v": "self", "label": "本人", "icon": "fas fa-user"},
      {"v": "proxy", "label": "代理人", "icon": "fas fa-user-friends"}
    ],
    "showWhen": (answers) => answers.procedure === "pin_change" && Boolean(answers.pin_type)
  },
  {
    "id": "pin_proxy_reason",
    "text": "下記の中から理由を選択してください",
    "options": [
      {"v": "adult_guardian", "label": "成年被後見人", "icon": "fas fa-shield-alt"},
      {"v": "conservatee", "label": "被保佐人", "icon": "fas fa-shield-alt"},
      {"v": "assisted_person", "label": "被補助人", "icon": "fas fa-shield-alt"},
      {"v": "voluntary_guardian", "label": "任意被後見人", "icon": "fas fa-shield-alt"},
      {"v": "under_15", "label": "15歳未満", "icon": "fas fa-child"},
      {"v": "voluntary_proxy", "label": "任意代理人", "icon": "fas fa-user-friends"}
    ],
    "showWhen": (answers) => answers.procedure === "pin_change" && answers.pin_visitor_type === "proxy"
  },
  {
    "id": "pin_cohabitation_status",
    "text": "申請者と代理人の同居の有無をお選びください",
    "options": [
      {"v": "cohabiting", "label": "同居", "icon": "fas fa-home"},
      {"v": "not_cohabiting", "label": "非同居", "icon": "fas fa-exchange-alt"}
    ],
    "showWhen": (answers) => answers.procedure === "pin_change" && answers.pin_proxy_reason === "under_15"
  },
  {
    "id": "pin_koseki_location",
    "text": "申請者の方の本籍地についてお選びください",
    "options": [
      {"v": "kyoto_city", "label": "京都市内", "icon": "fas fa-map-marker-alt"},
      {"v": "other", "label": "それ以外", "icon": "fas fa-map"}
    ],
    "showWhen": (answers) => answers.procedure === "pin_change" && answers.pin_cohabitation_status === "not_cohabiting"
  },
  {
    "id": "pin_knowledge",
    "text": "住民基本台帳用4桁の暗証番号がわかりますか",
    "options": [
      {"v": "know", "label": "わかる", "icon": "fas fa-check"},
      {"v": "unknown_or_change_only", "label": "わからない（又は暗証番号の変更のみ）", "icon": "fas fa-question"}
    ],
    "showWhen": (answers) => {
      if (answers.procedure !== "pin_change") return false;
      
      // 本人の場合
      if (answers.pin_visitor_type === "self") return true;
      
      // 代理人の場合
      if (answers.pin_visitor_type === "proxy") {
        const reason = answers.pin_proxy_reason;
        
        // 成年被後見人、被保佐人、被補助人、任意被後見人、任意代理人の場合
        if (reason === "adult_guardian" || reason === "conservatee" || 
            reason === "assisted_person" || reason === "voluntary_guardian" || 
            reason === "voluntary_proxy") {
          return true;
        }
        
        // 15歳未満の場合
        if (reason === "under_15") {
          // 同居の場合
          if (answers.pin_cohabitation_status === "cohabiting") return true;
          // 非同居で本籍地質問に答えた場合
          if (answers.pin_cohabitation_status === "not_cohabiting" && 
              answers.pin_koseki_location !== undefined) return true;
        }
      }
      
      return false;
    }
  },
  
  // 住所・氏名等の変更の質問
  {
    "id": "info_visitor_type",
    "text": "手続きに来られる方をお選びください",
    "options": [
      {"v": "self", "label": "本人", "icon": "fas fa-user"},
      {"v": "proxy", "label": "代理人", "icon": "fas fa-user-friends"}
    ],
    "showWhen": (answers) => answers.procedure === "info_change"
  },
  {
    "id": "info_proxy_reason",
    "text": "下記の中から理由を選択してください",
    "options": [
      {"v": "adult_guardian", "label": "成年被後見人", "icon": "fas fa-shield-alt"},
      {"v": "conservatee", "label": "被保佐人", "icon": "fas fa-shield-alt"},
      {"v": "assisted_person", "label": "被補助人", "icon": "fas fa-shield-alt"},
      {"v": "voluntary_guardian", "label": "任意被後見人", "icon": "fas fa-shield-alt"},
      {"v": "under_15", "label": "15歳未満", "icon": "fas fa-child"},
      {"v": "voluntary_proxy", "label": "任意代理人", "icon": "fas fa-user-friends"},
      {"v": "same_household", "label": "同一世帯員（転入届又は転居届と併せて行う手続き）", "icon": "fas fa-home"}
    ],
    "showWhen": (answers) => answers.procedure === "info_change" && answers.info_visitor_type === "proxy"
  },
  {
    "id": "info_cohabitation_status",
    "text": "申請者と代理人の同居の有無をお選びください",
    "options": [
      {"v": "cohabiting", "label": "同居", "icon": "fas fa-home"},
      {"v": "not_cohabiting", "label": "非同居", "icon": "fas fa-exchange-alt"}
    ],
    "showWhen": (answers) => answers.procedure === "info_change" && answers.info_proxy_reason === "under_15"
  },
  {
    "id": "info_koseki_location",
    "text": "申請者の方の本籍地についてお選びください",
    "options": [
      {"v": "kyoto_city", "label": "京都市内", "icon": "fas fa-map-marker-alt"},
      {"v": "other", "label": "それ以外", "icon": "fas fa-map"}
    ],
    "showWhen": (answers) => answers.procedure === "info_change" && answers.info_cohabitation_status === "not_cohabiting"
  },
  {
    "id": "issuance_inquiry_response_check",
    "text": "次のいずれかに該当する場合は**照会書兼回答書**が必要となります。\n\n[conditions]・カードの申請後からカードのお受取りのまでの間に住所や氏名の変更がある場合\n・在留期間の変更（更新）がある場合\n・カードの申請時に電子証明書の発行を希望していない方で、カードの交付時に電子証明書の発行を新たに希望される場合[/conditions]\n\n照会書兼回答書については、京都市マイナンバーカードセンターにお問い合わせください。",
    "options": [
      {"v": "applicable", "label": "該当する", "icon": "fas fa-check"},
      {"v": "not_applicable", "label": "該当しない", "icon": "fas fa-times"}
    ],
    "showWhen": (answers) => {
      if (answers.procedure !== "card_issuance" || answers.visitor_type !== "proxy") return false;
      
      const reason = answers.applicant_age === "under_15" ? answers.guardian_reason : answers.guardian_reason_15_over;
      
      // 対象となる理由の一覧
      const targetReasons = [
        "conservatee", "assisted_person", "voluntary_guardian", "other",
        "over_75", "hospitalized", "facility_resident", "care_certified",
        "pregnant", "overseas_study", "student", "social_withdrawal", "disabled"
      ];
      
      return targetReasons.includes(reason);
    }
  },
  
  // カードの紛失の質問
  {
    "id": "lost_situation",
    "text": "該当する状況をお選びください",
    "options": [
      {"v": "lost", "label": "紛失した", "icon": "fas fa-exclamation-triangle"},
      {"v": "found", "label": "紛失したカードを発見した", "icon": "fas fa-search"}
    ],
    "showWhen": (answers) => answers.procedure === "card_lost"
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
  "notification_card_proxy_other": {name: "交付通知書（はがき）\n・申請者ご本人が、裏面の「回答書」、「委任状」及び「暗証番号」の各欄をご記入ください。\n・暗証番号欄には目隠しシールを貼付してください。（貼り直しができませんのでご注意ください。）\n・封筒に入れて封緘後、代理人に預けてください。", icon: "fas fa-envelope"},
  "notification_card_proxy_75_over": {name: "交付通知書（はがき）\n・申請者ご本人が、裏面の「回答書」、「委任状」及び「暗証番号」の各欄をご記入ください。\n・委任状には外出困難である旨を記載してください。\n・暗証番号欄には目隠しシールを貼付してください。（貼り直しができませんのでご注意ください。）\n・封筒に入れて封緘後、代理人に預けてください。", icon: "fas fa-envelope"},
  "identity_document_with_notification": {name: "申請者ご本人の本人確認書類（A欄から1点、又はB欄から2点）", icon: "fas fa-id-badge"},
  "identity_document_no_notification": {name: "申請者ご本人の本人確認書類（A欄から2点、又はA欄1点＋B欄1点）", icon: "fas fa-id-badge"},
  "mynumber_notification_card_old": {name: "マイナンバー通知カード（お持ちの方は返納していただきます。）", icon: "fas fa-id-card-alt"},
  "resident_card": {name: "住民基本台帳カード（お持ちの方は返納していただきます。）", icon: "fas fa-id-card"},
  "basic_resident_card": {name: "住民基本台帳カード", icon: "fas fa-id-card"},
  "mynumber_notification_card": {name: "マイナンバー通知カード又は個人番号通知書", icon: "fas fa-id-card-alt"},
  "current_mynumber_card": {name: "現在お持ちのマイナンバーカード（マイナンバーカード再交付申請の方は、現在お持ちのマイナンバーカードを返納してください。返納がない場合、再交付手数料として1,000円頂戴します。）", icon: "fas fa-id-card"},
  "current_mynumber_card_with_fee": {name: "現在お持ちのマイナンバーカード\n※返納がない場合は、再交付手数料として1,000円頂戴します。", icon: "fas fa-id-card"},
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
  "inquiry_response": {name: "照会書兼回答書", icon: "fas fa-envelope-open"},
  "power_of_attorney": {name: "委任状", icon: "fas fa-file-signature"},
  "reason_certificate": {name: "来庁できない理由を証明する書類", icon: "fas fa-file-medical"},
  
  // 特殊な書類
  "lost_report": {name: "遺失届受理番号控え", icon: "fas fa-file-signature"},
  "reissue_fee": {name: "再発行手数料（1,000円）", icon: "fas fa-yen-sign"},
  "broken_card": {name: "破損したマイナンバーカード", icon: "fas fa-id-card"},
  "old_card": {name: "旧マイナンバーカード（返納用）", icon: "fas fa-id-card"},
  "temp_stop_release_form": {name: "個人番号カード一時停止解除届", icon: "fas fa-play-circle"},
  "return_form": {name: "個人番号カード紛失・廃止・返納届", icon: "fas fa-minus-circle"},
  
  // カードの交付（受け取り）用書類
  "mynumber_card_notification": {name: "交付通知書（はがき）", icon: "fas fa-envelope"},
  "current_mynumber_card_for_renewal": {name: "現在お持ちのマイナンバーカード ※返納がない場合は、再交付手数料として1,000円頂戴します。", icon: "fas fa-id-card"},
  "identity_document_self_with_notification": {name: "本人確認書類（A欄1点、又はB欄2点）", icon: "fas fa-id-badge"},
  "identity_document_self_no_notification": {name: "本人確認書類（A欄2点、又はA欄1点＋B欄1点）", icon: "fas fa-id-badge"},
  // 申請者本人の本人確認書類（代理人が来る場合）
  "applicant_identity_document": {name: "申請者ご本人の本人確認書類（以下のいずれかのパターン）\n・A欄2点\n・A欄1点＋B欄1点\n・B欄3点（うち1点は顔写真付のもの）\n※顔写真付の本人確認書類がない場合は、ご本人の来庁が必要となります。\n※ ただし、1歳未満の乳児の方につきましては、B欄2点（顔写真なし）で可", icon: "fas fa-id-badge"},
  
  // 代理人の本人確認書類
  "proxy_identity_document_other": {name: "代理人の本人確認書類（A欄2点、又はA欄1点＋B欄1点）", icon: "fas fa-user-friends"},
  "proxy_identity_document_guardian": {name: "代理人の本人確認書類（A欄1点、又はB欄2点）", icon: "fas fa-user-friends"},
  "no_notification_warning": {name: "交付通知書の提出がない場合は、マイナンバーカードのお受取ができません。\n紛失等でお手元にない場合は、京都市マイナンバーカードセンターへお問い合わせください。", icon: "fas fa-exclamation-triangle"},
  
  // 後見人関連書類（詳細）
  "adult_guardian_cert": {name: "成年後見人に関する登記事項証明書", icon: "fas fa-file-certificate"},
  "conservatee_cert": {name: "保佐人に関する登記事項証明書、代理行為目録", icon: "fas fa-file-certificate"},
  "assisted_person_cert": {name: "補助人に関する登記事項証明書、代理行為目録", icon: "fas fa-file-certificate"},
  "voluntary_guardian_cert": {name: "任意後見人に関する登記事項証明書、代理権目録", icon: "fas fa-file-certificate"},
  "family_register_under_15": {name: "戸籍全部事項証明書", icon: "fas fa-file-alt"},
  
  // 代理人同行時の追加書類
  "proxy_accompanying_id": {name: "代理人の本人確認書類（A欄1点又はB欄2点）", icon: "fas fa-user-friends"},
  
  // 来庁困難理由証明書類
  "hospitalized_cert": {name: "申請者ご本人がお越しになれないことを証する書類\n例）診断書、入院診療計画書、入院費用の領収書、診療明細書、病院長が作成する顔写真証明書", icon: "fas fa-file-medical"},
  "disabled_cert": {name: "申請者ご本人がお越しになれないことを証する書類\n例）障害者手帳（［身体障害者手帳］［療育手帳］［精神障害者福祉手帳］）、障害者福祉サービス受給者証、自立支援医療受給者証", icon: "fas fa-file-medical"},
  "facility_cert": {name: "申請者ご本人がお越しになれないことを証する書類\n例）施設入所証明書、施設長が作成する顔写真証明書", icon: "fas fa-file-medical"},
  "care_cert": {name: "申請者ご本人がお越しになれないことを証する書類\n例）介護保険被保険者証、認定結果通知書、ケアマネージャー及びその所属する事業者の長が作成する顔写真証明書", icon: "fas fa-file-medical"},
  "pregnant_cert": {name: "申請者ご本人がお越しになれないことを証する書類\n例）母子健康手帳、妊婦検診を受診したことが確認できる領収書又は受診券", icon: "fas fa-file-medical"},
  "study_abroad_cert": {name: "申請者ご本人がお越しになれないことを証する書類\n例）査証のコピー、留学先の学生証のコピー", icon: "fas fa-file-medical"},
  "student_cert": {name: "申請者ご本人がお越しになれないことを証する書類\n例）学生証、在学証明書", icon: "fas fa-file-medical"},
  "hikikomori_cert": {name: "申請者ご本人がお越しになれないことを証する書類\n例）相談している公的な支援機関の職員及び当該支援機関の長が作成する顔写真証明書", icon: "fas fa-file-medical"},
  
  // 電子証明書発行・更新用書類
  "mynumber_card_certificate": {name: "ご本人のマイナンバーカード", icon: "fas fa-id-card"},
  "proxy_identity_document": {name: "代理人の本人確認書類（A欄1点又はB欄2点）", icon: "fas fa-user-friends"},
  "proxy_authorization_letter": {name: "委任状", icon: "fas fa-file-signature"}
};
