import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Answer } from "@shared/schema";
import { resolveItems, getItemDetails, getProxySpecialNotice } from "@/lib/rules-engine";
import { printResults, generatePDF } from "@/lib/print-utils";
import QRCodeDisplay from "./qr-code-display";

interface ResultsDisplayProps {
  answers: Answer;
  onRestart: () => void;
  onBack: () => void;
}

export default function ResultsDisplay({ answers, onRestart, onBack }: ResultsDisplayProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showQRCode, setShowQRCode] = useState(false);
  const [showLostConfirmation, setShowLostConfirmation] = useState(
    answers.procedure === "card_lost" && answers.lost_situation === "lost"
  );
  const [procedureCompleted, setProcedureCompleted] = useState(false);
  
  // Check if this is an application method result
  const isApplicationMethodResult = answers.application_method;
  
  const requiredItems = isApplicationMethodResult ? [] : resolveItems(answers);
  
  // 手続きタイプを取得
  const procedureType = answers.procedure_type;
  
  // 代理人の特別案内を取得
  const proxySpecialNotice = getProxySpecialNotice(answers);
  
  // 特別案内の内容を定義
  const getSpecialNoticeContent = (noticeType: string) => {
    switch (noticeType) {
      case "hospitalized":
      case "facility_resident":
        return {
          title: "",
          content: `なお、申請者が長期で入院や介護施設等に入所している方については、下記様式に申請者ご本人の顔写真を貼付し、病院・施設長等が署名又は記名押印することでB欄の本人確認書類1点（顔写真証明書）とすることができます。
※「長期の入院」につきましては、概ね90日以上の入院が見込まれる場合を示しています。`,
          documents: [
            { name: "施設等入居者用", format: "PDF形式, 43.37KB" },
            { name: "施設等入居者用（記入例）", format: "PDF形式, 93.26KB" }
          ]
        };
      
      case "care_certified":
        return {
          title: "",
          content: `なお、在宅で保健医療サービス又は福祉サービスの提供を受けている方については、下記様式に申請者ご本人の顔写真を貼布し、ご本人に対して居宅介護支援を行う介護支援専門員とその専門員が属する指定居宅介護支援事業者の長が署名又は記名押印することでB欄の本人確認書類の1点（顔写真証明書）とすることができます。`,
          documents: [
            { name: "在宅で保健医療サービス等を受けている方用", format: "PDF形式, 46.35KB" },
            { name: "在宅で保健医療サービス等を受けている方用（記入例）", format: "PDF形式, 1.24MB" }
          ]
        };
      
      case "minor_guardian":
        return {
          title: "",
          content: `なお、未成年及び成年被後見人又は被保佐人、被補助人、被任意後見人の方については、下記様式に申請者ご本人の顔写真を貼付し、法定代理人（親権者又は成年後見人、保佐人、補助人、任意後見人）の方が署名又は記名押印することでB欄の本人確認書類の1点（顔写真証明書）とすることができます。`,
          documents: [
            { name: "未成年及び成年被後見人又は被保佐人、被補助人、被任意後見人の方用", format: "PDF形式, 43.01KB" },
            { name: "未成年及び成年被後見人又は被保佐人、被補助人、任意被後見人の方用（記入例）", format: "PDF形式, 1.09MB" }
          ]
        };
      
      case "hikikomori":
        return {
          title: "",
          content: `なお、社会的参加を回避し長期にわたって概ね家庭にとどまり続けている状態である方については、下記様式に申請者ご本人の顔写真を貼付し、相談している公的な支援機関の職員及び当該支援機関の長が署名又は記名押印することでB欄の本人確認書類の1点（顔写真証明書）とすることができます。`,
          documents: [
            { name: "社会的参加を回避し長期にわたって概ね家庭にとどまり続けている状態である方用", format: "PDF形式, 47.07KB" },
            { name: "社会的参加を回避し長期にわたって概ね家庭にとどまり続けている状態である方用（記入例）", format: "PDF形式, 99.17KB" }
          ]
        };
      
      default:
        return null;
    }
  };

  const handleItemCheck = (itemKey: string, checked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [itemKey]: checked }));
  };

  const handleGeneratePDF = async () => {
    const itemNames = requiredItems.map(itemKey => {
      const item = getItemDetails(itemKey);
      return item ? item.name : itemKey;
    });
    
    await generatePDF(answers, itemNames);
  };

  // 本人確認書類一覧表を表示する条件をチェック（本人申請のみ）
  const shouldShowIdentityDocTable = () => {
    // カード交付以外は表示しない
    if (answers.procedure !== "card_issuance") return false;
    
    // 代理人の場合は絶対に表示しない
    if (answers.visitor_type === "proxy") return false;
    
    // 本人の場合のみ表示
    return answers.visitor_type === "self";
  };

  // 代理人の特定理由での本人確認書類一覧表を表示する条件をチェック
  const shouldShowProxyOtherDocTable = () => {
    if (answers.procedure !== "card_issuance" || answers.visitor_type !== "proxy") return false;
    
    // 15歳未満の代理人の場合
    if (answers.applicant_age === "under_15") {
      return true;
    }
    
    // 15歳以上の代理人の場合
    if (answers.applicant_age === "15_over") {
      const guardianReason = answers.guardian_reason_15_over;
      
      // 成年被後見人、被保佐人、被補助人、任意被後見人の場合
      if (["adult_guardian", "conservatee", "assisted_person", "voluntary_guardian"].includes(guardianReason)) {
        return true;
      }
      
      // 「それ以外」を選択し、具体的理由が特定の値の場合
      if (guardianReason === "other") {
        const specificReason = answers.specific_reason;
        const targetReasons = ["over_75", "hospitalized", "facility_resident", "care_certified", 
                              "pregnant", "study_abroad", "student", "hikikomori", "disabled"];
        return targetReasons.includes(specificReason);
      }
    }
    
    return false;
  };

  const getApplicationMethodContent = () => {
    const method = answers.application_method;
    const mailType = answers.mail_type;
    
    if (method === "online") {
      return {
        title: "オンライン申請について",
        content: (
          <div className="space-y-4">
            <p>オンライン申請が選択されました。</p>
          </div>
        )
      };
    }
    
    if (method === "photo_booth") {
      return {
        title: "まちなかの写真機からの申請について",
        content: (
          <div className="space-y-4">
            <p>マイナンバーカードの申請に対応した証明写真機から申請することができます。</p>
            <p>
              詳しい申請方法は，
              <a 
                href="https://www.kojinbango-card.go.jp/apprec/apply/photobooth_apply/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-bold"
              >
                マイナンバーカード総合サイト
              </a>
              をご確認ください。
            </p>
          </div>
        )
      };
    }
    
    if (method === "mail") {
      if (mailType === "notification_form") {
        return {
          title: "郵送申請について（通知カード同封の申請書）",
          content: (
            <div className="space-y-4">
              <p>マイナンバーカード交付申請書に必要事項を記入していただき、顔写真を貼って、通知カード又は個人番号通知書と一緒に同封されている返信用封筒に交付申請書を入れてポストに投函してください。</p>
              <p>※返信用封筒をお持ちでない場合は、以下の申請書送付用封筒（切手不要）をダウンロードし、必要事項を記入していただき、ポストに投函してください。</p>
              <p>※詳しい申請方法はマイナンバーカード総合サイトをご確認ください。</p>
              <div className="bg-gray-100 p-4 rounded-lg mt-6">
                <h4 className="font-bold mb-2">マイナンバーカード交付申請書の送付先</h4>
                <div className="text-sm space-y-1">
                  <p>〒219－8650</p>
                  <p>日本郵便株式会社　川崎東郵便局　郵便私書箱第2号</p>
                  <p>地方公共団体情報システム機構</p>
                  <p>個人番号カード交付申請書受付センター　宛</p>
                </div>
              </div>
            </div>
          )
        };
      }
      
      if (mailType === "handwritten_form") {
        return {
          title: "郵送申請について（手書き申請書）",
          content: (
            <div className="space-y-4">
              <p>以下の手書き交付申請書及び申請書送付用封筒（切手不要）をダウンロードして、交付申請書に必要事項を御記入いただき、顔写真を貼ってポストに投函してください。</p>
              <p>※マイナンバーの記入漏れ、誤記載にはお気を付けください。書類に不備があった場合は、交付申請書を受理できないことや返却できないことがありますのでご留意願います。</p>
              <p>※顔写真については、マイナンバーカード総合サイト（顔写真のチェックポイント）にてご確認ください。</p>
              <div className="space-y-2">
                <p>手書き交付申請書(PDF形式, 620.41KB)</p>
                <p>申請書送付用封筒(PDF形式, 760.93KB)</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mt-6">
                <h4 className="font-bold mb-2">マイナンバーカード交付申請書の送付先</h4>
                <div className="text-sm space-y-1">
                  <p>〒219－8650</p>
                  <p>日本郵便株式会社　川崎東郵便局　郵便私書箱第2号</p>
                  <p>地方公共団体情報システム機構</p>
                  <p>個人番号カード交付申請書受付センター　宛</p>
                </div>
              </div>
            </div>
          )
        };
      }
    }
    
    if (method === "center") {
      return {
        title: "マイナンバーカードセンターでの申請について",
        content: (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold mb-3">開庁時間</h4>
              <p className="text-sm mb-2">※事前予約制ですので、事前にこちらからご予約のうえお越しください。</p>
              <div className="text-sm space-y-1">
                <p><strong>月・水曜日：</strong>午前9時～午後7時</p>
                <p><strong>その他：</strong>午前9時～午後5時</p>
                <p>※年末年始（12月29日～1月3日）・祝休日・システム停止日は除きます。</p>
                <p>※上記システム停止日について、詳細はこちらをご覧ください。</p>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold mb-3">所在地</h4>
              <div className="text-sm space-y-1">
                <p>京都市下京区西洞院通塩小路上る東塩小路町608番地の8</p>
                <p>下京区総合庁舎内（平日9時～17時は3階、月・水曜日17時～19時及び土日は1階）</p>
              </div>
              <div className="mt-3">
                <img 
                  src="https://www.city.kyoto.lg.jp/bunshi/cmsfiles/contents/0000287/287997/kuyakusyo_annnai_zu.gif" 
                  alt="下京区総合庁舎案内図" 
                  className="max-w-xs border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-bold mb-3">アクセス</h4>
              <div className="text-sm space-y-1">
                <p>※駐輪場には数に限りがあります。また、一般用駐車場はありませんので、公共交通機関をご利用のうえお越しください。</p>
                <p>※平日9時～17時は南側、月・水曜日17時～19時及び土日は北側の入り口からお入りください。</p>
                <p className="mt-2"><strong>センター電話番号：075-746-6855</strong></p>
              </div>
            </div>
          </div>
        )
      };
    }
    
    if (method === "mobile_service") {
      return {
        title: "出張申請窓口・出張申請サポートについて",
        content: (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold mb-3">出張申請窓口</h4>
              <div className="text-sm space-y-2">
                <p>商業施設等において、本人確認のうえ申請を受け付けるブースを開設します。京都市民の方については、カードができあがりましたら、原則としてカードをご自宅へ郵送します。</p>
                <p>※事前予約優先。今後の実施予定や予約方法など、詳しくはこちらのホームページをご確認ください。</p>
                <p>※マイナンバー通知カードや本人確認書類（運転免許証やパスポート等）のご持参が必要です。</p>
              </div>
            </div>
            
            <div className="bg-kyoto-purple-light border border-purple-200 rounded-lg p-4">
              <h4 className="font-bold mb-3 text-kyoto-purple-dark">出張申請サポート</h4>
              <div className="text-sm space-y-2">
                <p>商業施設等において、申請のサポート（交付申請書の記入補助、顔写真の無料撮影）を行うブースを開設します。</p>
                <p>※予約不要。今後の実施予定など、詳しくはこちらのページをご確認ください。</p>
                <p>※当日は本人確認書類のご持参は不要ですが、できる限りマイナンバー通知カード等のマイナンバーが分かるものをお持ちください。（メモなどでも結構です。）</p>
                <p>※申請書はご自身で投函していただきます。また、カードはマイナンバーカードセンター等へ受け取りに来庁していただく必要があります。</p>
              </div>
            </div>
          </div>
        )
      };
    }
    
    if (method === "office_support") {
      return {
        title: "区役所・支所での申請サポートについて",
        content: (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-sm space-y-2">
                <p>区役所・支所の窓口（マイナンバーカードセンター交付コーナー）で、申請のサポート（交付申請書の記入補助、顔写真の無料撮影）を行っており、交付申請書はご自身で投函していただいております。</p>
                <p>なお、予約制によるマイナンバーカードの交付業務を優先するため、お待ちいただく場合がありますので御了承ください。</p>
              </div>
            </div>
          </div>
        )
      };
    }
    
    return {
      title: "申請方法について",
      content: <p>選択された申請方法の詳細情報を準備中です。</p>
    };
  };

  return (
    <div className="max-w-none mx-auto px-1 sm:px-4 py-8">
      {isApplicationMethodResult ? (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-kyoto-purple-dark mb-4">{getApplicationMethodContent().title}</h2>
          </div>

          {/* 用意するもの（カードの申請・更新用） */}
          <Card className="shadow-lg border-gray-200 mb-8">
            <CardContent className="p-2 sm:p-6">
              <h3 className="text-xl font-bold text-kyoto-purple-dark mb-4 flex items-center">
                <i className="fas fa-clipboard-list mr-2"></i>用意するもの
              </h3>
              <div className="space-y-4 mb-6">
                {answers.application_method === "online" ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
                      <Checkbox
                        id="online-application-id"
                        checked={checkedItems["online-application-id"] || false}
                        onCheckedChange={(checked) => handleItemCheck("online-application-id", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="online-application-id" className="flex items-start space-x-3 cursor-pointer">
                          <i className="fas fa-id-card text-kyoto-purple text-lg mt-1"></i>
                          <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                            申請書ID（半角数字23桁）
                            {"\n"}※交付申請書のQRコードを読み取りサイトにアクセスした場合、申請書IDはすでに記載され変更できません。
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
                      <Checkbox
                        id="online-email"
                        checked={checkedItems["online-email"] || false}
                        onCheckedChange={(checked) => handleItemCheck("online-email", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="online-email" className="flex items-start space-x-3 cursor-pointer">
                          <i className="fas fa-envelope text-kyoto-purple text-lg mt-1"></i>
                          <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                            メールアドレス
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
                      <Checkbox
                        id="online-photo"
                        checked={checkedItems["online-photo"] || false}
                        onCheckedChange={(checked) => handleItemCheck("online-photo", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="online-photo" className="flex items-start space-x-3 cursor-pointer">
                          <i className="fas fa-camera text-kyoto-purple text-lg mt-1"></i>
                          <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                            顔写真（スマホの場合、操作中に撮影することも可能）
                            {"\n"}※申請者が1歳未満の場合は顔写真の登録が不要
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : answers.application_method === "photo_booth" ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
                      <Checkbox
                        id="photo-booth-money"
                        checked={checkedItems["photo-booth-money"] || false}
                        onCheckedChange={(checked) => handleItemCheck("photo-booth-money", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="photo-booth-money" className="flex items-start space-x-3 cursor-pointer">
                          <i className="fas fa-coins text-kyoto-purple text-lg mt-1"></i>
                          <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                            撮影用のお金
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
                      <Checkbox
                        id="photo-booth-qr"
                        checked={checkedItems["photo-booth-qr"] || false}
                        onCheckedChange={(checked) => handleItemCheck("photo-booth-qr", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="photo-booth-qr" className="flex items-start space-x-3 cursor-pointer">
                          <i className="fas fa-qrcode text-kyoto-purple text-lg mt-1"></i>
                          <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                            交付申請書のQRコード
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : answers.application_method === "mail" && answers.mail_type === "notification_form" ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
                      <Checkbox
                        id="mail-application-form"
                        checked={checkedItems["mail-application-form"] || false}
                        onCheckedChange={(checked) => handleItemCheck("mail-application-form", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="mail-application-form" className="flex items-start space-x-3 cursor-pointer">
                          <i className="fas fa-file-alt text-kyoto-purple text-lg mt-1"></i>
                          <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                            マイナンバーカード交付申請書
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
                      <Checkbox
                        id="mail-return-envelope"
                        checked={checkedItems["mail-return-envelope"] || false}
                        onCheckedChange={(checked) => handleItemCheck("mail-return-envelope", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="mail-return-envelope" className="flex items-start space-x-3 cursor-pointer">
                          <i className="fas fa-envelope text-kyoto-purple text-lg mt-1"></i>
                          <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                            返信用封筒（通知カード又は個人番号通知書と一緒に同封されているもの）
                            {"\n"}※お持ちでない場合は、
                            <a 
                              href="https://www.city.kyoto.lg.jp/bunshi/cmsfiles/contents/0000290/290445/shinseisyohuto2025.pdf" 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline mx-1 font-bold"
                            >
                              申請書送付用封筒
                            </a>
                            （切手不要）をダウンロードし、必要事項をご記入ください
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
                      <Checkbox
                        id="mail-photo"
                        checked={checkedItems["mail-photo"] || false}
                        onCheckedChange={(checked) => handleItemCheck("mail-photo", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="mail-photo" className="flex items-start space-x-3 cursor-pointer">
                          <i className="fas fa-camera text-kyoto-purple text-lg mt-1"></i>
                          <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                            顔写真
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : answers.application_method === "mail" && answers.mail_type === "handwritten_form" ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
                      <Checkbox
                        id="handwritten-application-form"
                        checked={checkedItems["handwritten-application-form"] || false}
                        onCheckedChange={(checked) => handleItemCheck("handwritten-application-form", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="handwritten-application-form" className="flex items-start space-x-3 cursor-pointer">
                          <i className="fas fa-file-alt text-kyoto-purple text-lg mt-1"></i>
                          <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                            手書き交付申請書
                            {"\n"}▶︎ダウンロードは
                            <a 
                              href="https://www.city.kyoto.lg.jp/bunshi/cmsfiles/contents/0000290/290445/tegaki-kofu-shinseisho2025.pdf" 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline mx-1 font-bold"
                            >
                              こちら
                            </a>
                            {"\n"}※マイナンバーの記入漏れ、誤記載にはお気を付けください。
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
                      <Checkbox
                        id="handwritten-envelope"
                        checked={checkedItems["handwritten-envelope"] || false}
                        onCheckedChange={(checked) => handleItemCheck("handwritten-envelope", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="handwritten-envelope" className="flex items-start space-x-3 cursor-pointer">
                          <i className="fas fa-envelope text-kyoto-purple text-lg mt-1"></i>
                          <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                            申請書送付用封筒（切手不要）
                            {"\n"}▶︎ダウンロードは
                            <a 
                              href="https://www.city.kyoto.lg.jp/bunshi/cmsfiles/contents/0000290/290445/shinseisyohuto2025.pdf" 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline mx-1 font-bold"
                            >
                              こちら
                            </a>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
                      <Checkbox
                        id="handwritten-photo"
                        checked={checkedItems["handwritten-photo"] || false}
                        onCheckedChange={(checked) => handleItemCheck("handwritten-photo", checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="handwritten-photo" className="flex items-start space-x-3 cursor-pointer">
                          <i className="fas fa-camera text-kyoto-purple text-lg mt-1"></i>
                          <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                            顔写真
                            {"\n"}※詳しくは、マイナンバーカード総合サイト（
                            <a 
                              href="https://www.kojinbango-card.go.jp/apprec/apply/facephoto/" 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline font-bold"
                            >
                              顔写真のチェックポイント
                            </a>
                            ）にてご確認ください。
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : answers.application_method === "card_center" ? (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">※保留</p>
                  </div>
                ) : (
                  <p>※他の申請方法の内容を後で追加します。</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 手続場所について（カードの申請・更新用） */}
          <Card className="shadow-lg border-gray-200 mb-8">
            <CardContent className="p-2 sm:p-6">
              <h3 className="text-xl font-bold text-kyoto-purple-dark mb-4 flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>手続場所について
              </h3>
              <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
                {answers.application_method === "online" ? (
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-globe text-kyoto-purple text-lg mt-1"></i>
                    <div>
                      <div className="font-medium">オンライン申請サイト：</div>
                      <a 
                        href="https://net.kojinbango-card.go.jp/SS_SERVICE_OUT/FA01S001Action.do" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        https://net.kojinbango-card.go.jp/SS_SERVICE_OUT/FA01S001Action.do
                      </a>
                    </div>
                  </div>
                ) : answers.application_method === "photo_booth" ? (
                  <div>
                    <div className="flex items-start space-x-3">
                      <i className="fas fa-camera text-kyoto-purple text-lg mt-1"></i>
                      <div>
                        <div className="font-medium">まちなかの証明写真機</div>
                        <div className="text-xs text-gray-600 mt-1">※申請できるものとできないものがあります。</div>
                      </div>
                    </div>
                    <div className="mt-3 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3">
                      <div className="font-medium text-sm mb-2 text-yellow-700">＜対応しているまちなかの証明写真機＞</div>
                      <ul className="text-sm space-y-1 ml-3 text-yellow-700">
                        <li>• <a href="https://www.dnpphoto.jp/products/kirei/mynumber/" target="_blank" rel="noopener noreferrer" className="text-yellow-700 hover:text-yellow-800 underline">株式会社DNPフォトイメージングジャパン</a></li>
                        <li>• <a href="https://me-group.jp/individual/photo-me#mynumber" target="_blank" rel="noopener noreferrer" className="text-yellow-700 hover:text-yellow-800 underline">ME Group Japan 株式会社</a></li>
                        <li>• <a href="https://www.hokuryou.co.jp/id_photo.html" target="_blank" rel="noopener noreferrer" className="text-yellow-700 hover:text-yellow-800 underline">株式会社北菱プリントテクノロジー</a></li>
                        <li>• <a href="https://www.miyoshi-jp.com" target="_blank" rel="noopener noreferrer" className="text-yellow-700 hover:text-yellow-800 underline">三吉工業株式会社</a></li>
                      </ul>
                    </div>
                  </div>
                ) : answers.application_method === "mail" && answers.mail_type === "notification_form" ? (
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-mailbox text-kyoto-purple text-lg mt-1"></i>
                    <div>
                      <div className="font-medium">お近くのポストに投函</div>
                    </div>
                  </div>
                ) : answers.application_method === "mail" && answers.mail_type === "handwritten_form" ? (
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-mailbox text-kyoto-purple text-lg mt-1"></i>
                    <div>
                      <div className="font-medium">お近くのポストに投函</div>
                    </div>
                  </div>
                ) : answers.application_method === "card_center" ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <i className="fas fa-building text-kyoto-purple text-lg mt-1"></i>
                      <div>
                        <div className="font-medium">マイナンバーカードセンター</div>
                        <div className="text-sm text-gray-600 mt-1">
                          京都市下京区西洞院通塩小路上る東塩小路町608番地の8<br/>
                          下京区総合庁舎内（平日9時～17時は3階、月・水曜日17時～19時及び土日は1階）
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <img 
                        src="/attached_assets/kuyakusyo_annnai_zu.gif" 
                        alt="下京区総合庁舎案内図" 
                        className="max-w-full h-auto border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                ) : (
                  <p>※他の申請方法の内容を後で追加します。</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 申請方法について（カードの申請・更新用） */}
          {(answers.application_method === "online" || answers.application_method === "photo_booth" || (answers.application_method === "mail" && (answers.mail_type === "notification_form" || answers.mail_type === "handwritten_form")) || answers.application_method === "card_center") && (
            <Card className="shadow-lg border-gray-200 mb-8">
              <CardContent className="p-2 sm:p-6">
                <h3 className="text-xl font-bold text-kyoto-purple-dark mb-4 flex items-center">
                  <i className="fas fa-calendar-alt mr-2"></i>申請方法について
                </h3>
                <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
                  {answers.application_method === "online" ? (
                    <div className="space-y-4">
                      <p>マイナンバーカード総合サイト（地方公共団体情報システム機構のホームページ）をご確認ください。</p>
                      <div className="space-y-2">
                        <p>
                          <a 
                            href="https://www.kojinbango-card.go.jp/apprec/apply/online_apply/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            ▶︎パソコンからの申請はこちら
                          </a>
                        </p>
                        <p>
                          <a 
                            href="https://www.kojinbango-card.go.jp/apprec/apply/online_apply/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            ▶︎スマートフォンからの申請はこちら
                          </a>
                        </p>
                      </div>
                    </div>
                  ) : answers.application_method === "photo_booth" ? (
                    <p>
                      <a 
                        href="https://www.kojinbango-card.go.jp/apprec/apply/photobooth_apply/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline font-bold"
                      >
                        マイナンバーカード総合サイト
                      </a>
                      をご確認ください。
                    </p>
                  ) : answers.application_method === "mail" && answers.mail_type === "notification_form" ? (
                    <div className="space-y-3">
                      <p>マイナンバーカード交付申請書に必要事項を記入していただき、顔写真を貼って、通知カード又は個人番号通知書と一緒に同封されている返信用封筒に交付申請書を入れてポストに投函してください。</p>
                      <p>※詳しい申請方法は
                        <a 
                          href="https://www.kojinbango-card.go.jp/apprec/apply/mail_apply/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline font-bold mx-1"
                        >
                          マイナンバーカード総合サイト
                        </a>
                        をご確認ください。
                      </p>
                    </div>
                  ) : answers.application_method === "mail" && answers.mail_type === "handwritten_form" ? (
                    <p>交付申請書に必要事項を御記入いただき、顔写真を貼ってポストに投函してください。</p>
                  ) : answers.application_method === "card_center" ? (
                    <p>写真撮影や申請書の記入方法の案内等、申請書の作成をお手伝いします。<br/>なお、完成した申請書はご自身でポストに投函いただきます（切手不要）。</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : showLostConfirmation ? (
        /* カードの紛失手続きの確認画面 */
        <Card className="rounded-xl shadow-lg mb-6 bg-white border-gray-200">
          <CardContent className="p-2 sm:p-6">
            <div className="text-sm text-black leading-relaxed space-y-4">
              <p>マイナンバーカードを紛失した時は，マイナンバーカード一時停止のお手続きが必要となりますので，</p>
              
              <div className="border border-red-500 rounded-lg p-3 bg-red-50 text-center">
                <p className="font-normal text-red-600 text-base">個人番号カードコールセンター（TEL 0120-95-0178）</p>
              </div>
              
              <p>へご連絡をお願いします。</p>
              
              <p>あわせて，警察に遺失届を出していただき、<span className="text-red-600 font-bold">受理番号</span>を控えてください。<br />※マイナンバーカードの再発行手続きの際，警察署で発行される受理番号の控えが必要となります。</p>
            </div>
            
            {/* 手続き完了確認チェックボックス */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="procedure-completed"
                  checked={procedureCompleted}
                  onCheckedChange={(checked) => setProcedureCompleted(checked as boolean)}
                />
                <label
                  htmlFor="procedure-completed"
                  className="text-sm text-black leading-relaxed cursor-pointer"
                >
                  手続きを完了した
                </label>
              </div>
              
              <div className="text-center">
                <Button
                  onClick={() => setShowLostConfirmation(false)}
                  disabled={!procedureCompleted}
                  className={`px-6 py-2 rounded-lg ${
                    procedureCompleted 
                      ? 'bg-kyoto-purple text-white hover:bg-kyoto-purple-dark' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  次へ進む
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-center mb-8">
            <i className="fas fa-check-circle text-kyoto-purple text-6xl mb-4"></i>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-6">以下の内容に沿ってお手続きください</h2>
            {/* 電子証明書更新の場合の暗証番号説明 */}
            {answers.procedure === "digital_cert" && answers.cert_type === "renewal" && (
              <p className="text-sm text-red-600 mt-2">※カード発行時に設定した暗証番号が必要となります。</p>
            )}
            {/* 住所・氏名等の変更の場合の期限説明 */}
            {answers.procedure === "info_change" && (
              <div className="mt-2 space-y-1 text-left">
                <p className="text-sm text-red-600">※変更のあった日から14日以内にお越しください。</p>
                {/* 任意代理人以外の場合の暗証番号説明 */}
                {(answers.info_visitor_type === "self" || (answers.info_visitor_type === "proxy" && answers.info_proxy_reason !== "voluntary_proxy")) && (
                  <p className="text-sm text-red-600">※マイナンバーカードの交付時に設定した住民基本台帳用の暗証番号（4桁の数字）が必要になります。</p>
                )}
                <p className="text-sm text-red-600">※ご本人が届出と併せて代理で同一世帯員の方のマイナンバーカードの電子証明書の発行等を行う場合は<span className="underline text-yellow-600">こちら</span>をご確認ください。</p>
                <p className="text-sm text-red-600">※引越しの場合は<span className="underline text-yellow-600">こちら</span>もご覧ください。</p>
              </div>
            )}
            {/* カードの発見の場合の一時停止解除説明 */}
            {answers.procedure === "card_lost" && answers.lost_situation === "found" && (
              <p className="text-sm text-red-600 mt-2">※一時停止解除を行うまではマイナンバーカードやマイナンバーカードに搭載されている電子証明書は利用できません。</p>
            )}
            {/* カードの返納の場合の手数料説明 */}
            {answers.procedure === "card_return" && (
              <p className="text-sm text-red-600 mt-2">※自主的に返納された後のマイナンバーカードの再交付に当たっては手数料がかかります。</p>
            )}
          </div>





          {/* 必要書類リスト */}
          <Card className="shadow-lg border-gray-200 mb-8">
            <CardContent className="p-2 sm:p-6">
              <h3 className="text-xl font-bold text-kyoto-purple-dark mb-4 flex items-center">
                <i className="fas fa-clipboard-list mr-2"></i>必要書類リスト
              </h3>
              <div className="space-y-4 mb-6">
              {requiredItems.map((itemKey, index) => {
                const item = getItemDetails(itemKey);
                if (!item) return null;
                
                return (
                  <div key={itemKey} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
                    <Checkbox
                      id={`item-${index}`}
                      checked={checkedItems[itemKey] || false}
                      onCheckedChange={(checked) => handleItemCheck(itemKey, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor={`item-${index}`} className="flex items-start space-x-3 cursor-pointer">
                        <i className={`${item.icon} text-kyoto-purple text-lg mt-1`}></i>
                        <div className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                          {item.name}
                        </div>
                      </label>
                    </div>
                  </div>
                );
              })}
              </div>

              {/* 本人確認書類一覧表（特定条件で表示） */}
              {shouldShowIdentityDocTable() && (
                <div className="mb-6">
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td colSpan={2} className="px-3 py-3 font-bold bg-kyoto-purple text-white text-center">
                            本人確認書類一覧（有効期限内のもの）
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-3 py-4 font-bold bg-gray-50 align-top" style={{width: 'min(35%, 180px)'}}>
                            A欄<br/>
                            <span className="text-xs font-normal text-gray-600">顔写真付きの公的機関が発行した書類</span>
                          </td>
                          <td className="px-3 py-4">
                            <div className="space-y-1 text-xs leading-relaxed">
                              <div>マイナンバーカード、住民基本台帳カード（顔写真付きに限る。）、運転免許証、</div>
                              <div>運転経歴証明書（平成24年4月1日以降の交付日のものに限る。）、旅券、</div>
                              <div>身体障害者手帳、精神障害者保健福祉手帳、療育手帳、在留カード、</div>
                              <div>特別永住者証明書、一時庇護許可書、仮滞在許可証</div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-4 font-bold bg-gray-50 align-top" style={{width: 'min(35%, 180px)'}}>
                            B欄<br/>
                            <span className="text-xs font-normal text-gray-600">「氏名と住所」又は「氏名と生年月日」の記載がある</span>
                          </td>
                          <td className="px-3 py-4">
                            <div className="space-y-1 text-xs leading-relaxed">
                              <div>海技免状、電気工事士免状、無線従事者免許証、動力車操縦者運転免許証、</div>
                              <div>運行管理者技能検定合格証、猟銃・空気銃所持許可証、</div>
                              <div>戦傷病者手帳、宅地建物取引士証、教習資格認定証、船員手帳、海技免許証、耐空検査員の証、</div>
                              <div>航空従事者技能証明書、宅地建物取引士証、船員手帳、戦傷病者手帳、</div>
                              <div>教習資格認定証、官公署がその職員に対して発行した身分証明書、</div>
                              <div>Aの書類が更新中の場合に交付される仮証明書や引換証類、</div>
                              <div>地方公共団体が交付する敬老手帳、生活保護受給証明書、</div>
                              <div>資格確認書（健康保険証）、介護保険証、医療受給者証、各種年金証書、</div>
                              <div>児童扶養手当証書、母子健康手帳（出生届出済証明書欄に証明があり、現在の氏名と一致するものに限り、子の本人確認書類として有効）　等</div>
                              <div>社員証、学生証、学校で発行された在籍証明書（「氏名・生年月日」又は「氏名・住所」が記載されているものに限る）　等</div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 代理人（その他理由）の本人確認書類一覧表 */}
              {shouldShowProxyOtherDocTable() && (
                <div className="mb-6">
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td colSpan={2} className="px-3 py-3 font-bold bg-kyoto-purple text-white text-center">
                            本人確認書類一覧（必ず原本をお持ちください。）
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-3 py-4 font-bold bg-gray-50 align-top" style={{width: '35%', maxWidth: '180px'}}>
                            A欄<br/>
                            <span className="text-xs font-normal text-gray-600">顔写真付きの公的機関が発行した書類</span>
                          </td>
                          <td className="px-3 py-4" style={{width: '65%'}}>
                            <div className="text-xs leading-relaxed text-justify">
                              マイナンバーカード、住民基本台帳カード、運転免許証、運転経歴証明書（平成24年4月1日以降の交付年月日のものに限る。）、旅券（パスポート）、障害者手帳（身体障害者手帳、精神障害者保健福祉手帳、療育手帳）、在留カード、特別永住者証明書、一時庇護許可証、仮滞在許可証　等
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-4 font-bold bg-gray-50 align-top" style={{width: '35%', maxWidth: '180px'}}>B欄</td>
                          <td className="px-3 py-4" style={{width: '65%'}}>
                            <div className="text-xs leading-relaxed text-justify">
                              資格確認書（健康保険証）、年金手帳、社員証、学生証、医療受給者証、母子健康手帳（出生届済証明書欄に証明があり、現在の氏名と一致するものに限り、子の本人確認書類として有効）、敬老乗車証（氏名、生年月日の記載がある「フリーパス証」に限る。「敬老バス回数券」不可）、介護保険被保険者証、生活保護受給証明書、顔写真証明書（施設等入所者用・在宅で保健医療サービス等を受けている方・未成年及び成年被後見人の方用・社会的参加（義務教育を含む就学、非常勤職を含む就労、家庭外での交遊など）を回避し長期にわたって概ね家庭にとどまり続けている状態である方用）　等
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 代理人の特別案内 */}
              {proxySpecialNotice && (() => {
                const specialNotice = getSpecialNoticeContent(proxySpecialNotice);
                if (!specialNotice) return null;
                
                return (
                  <div className="mb-2 mt-2">
                    <div className="p-2">
                      {specialNotice.title && (
                        <h4 className="font-bold text-gray-900 mb-2 text-sm">{specialNotice.title}</h4>
                      )}
                      <p className="text-xs text-gray-700 mb-2 leading-relaxed whitespace-pre-line">
                        {specialNotice.content}
                      </p>
                      <div className="space-y-1">
                        {specialNotice.documents.map((doc, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-700">
                            <i className="fas fa-file-pdf mr-2 text-red-600"></i>
                            <span className="font-medium text-yellow-600 underline">{doc.name}</span>
                            <span className="ml-2 text-gray-500">({doc.format})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 代理人の本人確認書類一覧表（電子証明書の場合のみ） */}
              {answers.procedure === "digital_cert" && answers.cert_visitor_type === "proxy" ? (
                <div className="mt-6">
                  <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th colSpan={2} className="px-4 py-3 font-bold bg-kyoto-purple text-white text-center text-sm">
                            本人確認書類一覧
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 text-xs text-gray-800 leading-relaxed">
                            マイナンバーカード、住民基本台帳カード（顔写真付きに限る。）、運転免許証、
                            運転経歴証明書（平成24年4月1日以降の交付年月日のものに限る。）、
                            旅券（パスポート）、身体障害者手帳、精神障害者保健福祉手帳（顔写真付きに限る。）、
                            療育手帳、在留カード（顔写真付きに限る。）、特別永住者証明書（顔写真付きに限る。）、
                            一時庇護許可証、仮滞在許可証、官公署が発行する資格者証や免状（海技免状や電気工事士免状など） 等
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {/* 本人確認書類一覧表（暗証番号変更・初期化の場合のみ） */}
              {answers.procedure === "pin_change" && (
                <div className="mt-6">
                  <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th colSpan={2} className="px-4 py-3 font-bold bg-kyoto-purple text-white text-center text-sm">
                            本人確認書類一覧（有効期限内のもの）
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 bg-gray-50 border-b border-gray-300 w-[30%]">
                            <div className="font-bold text-sm text-gray-900 mb-2">A欄</div>
                            <div className="text-xs text-gray-700 font-medium mb-1">顔写真付きの公的機関が発行したもの</div>
                          </td>
                          <td className="px-4 py-3 border-b border-gray-300 w-[70%]">
                            <div className="text-xs text-gray-800 leading-relaxed">
                              運転免許証、運転経歴証明書（平成24年4月1日以降の交付年月日のものに限る。）、旅券、身体障害者手帳、精神障害者保健福祉手帳、療育手帳、在留カード、特別永住者証明書、一時庇護許可証、仮滞在許可証
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 bg-gray-50 w-[30%]">
                            <div className="font-bold text-sm text-gray-900 mb-2">B欄</div>
                            <div className="text-xs text-gray-700 font-medium mb-1">「氏名と住所」又は「氏名と生年月日」の記載があるもの</div>
                          </td>
                          <td className="px-4 py-3 w-[70%]">
                            <div className="text-xs text-gray-800 leading-relaxed">
                              海技免状、電気工事士免状、無線従事者許可証、動力車操縦者運転免許証、運行管理者技能検定合格所、猟銃・空気銃所持許可証、特殊電気工事資格者認定証、認定電気工事従事者認定証、耐空検査員の証、航空従事者技能証明書、宅地建物取引士証、船員手帳、戦傷病者手帳、教習資格認定証、検定合格証、官公署がその職員に対して発行した身分証明書、Aの書類が更新中の場合に交付される仮証明書や引換証類、地方公共団体が交付する敬老手帳、生活保護受給証明証、資格確認書（健康保険証）、介護保険証、医療受給者証、各種年金証書、児童扶養手当証書、特別児童扶養手当証書、母子健康手帳　等<br />
                              社員証、学生証、学校で発行された在籍証明書　等
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 委任状について（電子証明書で同一世帯員を選択した場合） */}
              {answers.procedure === "digital_cert" && answers.cert_proxy_reason === "same_household" && (
                <div className="mt-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-bold text-kyoto-purple-dark mb-3 flex items-center">
                      <i className="fas fa-file-signature mr-2"></i>委任状について
                    </h4>
                    <div className="space-y-3 text-sm text-gray-800 leading-relaxed">
                      <p>委任状の様式は任意ですが、次の記載事項が必要です。</p>
                      <ul className="space-y-1 ml-4">
                        <li>・委任する事項（「電子証明書の発行等手続き」など）</li>
                        <li>・電子証明書等の暗証番号</li>
                        <li>・委任者及び受任者の住所・氏名</li>
                        <li>・委任者の署名又は記名・押印</li>
                      </ul>
                      <p>なお、下記より「委任状」様式をダウンロードのうえ、使用していただけます。</p>
                      
                      <div className="mt-2 mb-3">
                        <div className="flex items-center text-sm">
                          <i className="fas fa-file-pdf mr-2 text-red-600"></i>
                          <span className="font-medium text-yellow-600 underline">委任状(PDF形式, 88.48KB)</span>
                        </div>
                      </div>
                      
                      <p className="text-red-600">※ご本人が必要事項を記入し、暗証番号を知られないよう封筒に封入・封緘したものを、代理人の方が手続きの際、お持ちください。封入・封緘されていない場合は受付できませんので、あらかじめご了承ください。</p>
                      
                      <div className="text-red-600 mt-3">
                        <div>※転入届又は転居届の手続きを行うに当たり、後日に同一世帯員の方が電子証明書の発行等の手続きを行う場合、又は同一世帯員以外の方に手続きを委任する場合は、照会書兼回答書が必要となりますので、マイナンバーカードセンターにお問合せください（電話：075－746－6855）。</div>
                        <div>例）・転入届を提出した日にマイナンバーカードを忘れて後日手続きする場合</div>
                        <div style={{paddingLeft: '2em'}}>・転入届を提出した日に委任状がなく、後日の手続きとなった場合　など</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 委任状について（住所・氏名等の変更で任意代理人を選択した場合） */}
              {answers.procedure === "info_change" && answers.info_proxy_reason === "voluntary_proxy" && (
                <div className="mt-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-bold text-kyoto-purple-dark mb-3 flex items-center">
                      <i className="fas fa-file-signature mr-2"></i>委任状について
                    </h4>
                    <div className="space-y-3 text-sm text-gray-800 leading-relaxed">
                      <p>下記の委任状をお使いいただけます。</p>
                      
                      <div className="mt-2 mb-3">
                        <div className="flex items-center text-sm">
                          <i className="fas fa-file-pdf mr-2 text-red-600"></i>
                          <span className="font-medium text-yellow-600 underline">委任状(PDF形式, 14.70KB)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 交付場所/手続場所（カードの紛失確認画面以外の場合のみ表示） */}
          {!showLostConfirmation && (
            <Card className="shadow-lg border-gray-200 mb-8">
              <CardContent className="p-2 sm:p-6">
                <h3 className="text-xl font-bold text-kyoto-purple-dark mb-4 flex items-center">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {answers.procedure === "card_issuance" ? "交付場所について" : "手続場所について"}
                </h3>
              <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
                {/* 住所・氏名等の変更の場合はシンプルな案内のみ */}
                {answers.procedure === "info_change" ? (
                  <div>
                    <p>住所地を管轄する区役所・支所区役所・支所の市民総合窓口室　戸籍住民担当</p>
                  </div>
                ) : (answers.procedure === "card_lost" && answers.lost_situation === "found") || (answers.procedure === "card_lost" && answers.lost_situation === "lost") || answers.procedure === "card_return" ? (
                  /* カードの紛失・発見・返納の場合はマイナンバーカードセンターのみ */
                  <div>
                    <p>マイナンバーカードセンター（<span className="underline text-red-600">事前予約</span>が必要です。）</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <ul className="space-y-2">
                        {/* 暗証番号の変更・初期化の場合のみコンビニ案内を追加 */}
                        {answers.procedure === "pin_change" && (
                          <li>・<strong>全国のコンビニエンスストア（セブンイレブン、ローソン等）やイオングループの一部の商業施設に設置されているキオスク端末（マルチコピー機）</strong><br />
                            ※詳細な手順等については地方公共団体情報システム機構（J-LIS）のページをご覧ください。<br />
                            ※ 一部の店舗ではマイナンバーカード署名用パスワード初期化・再設定（「署名用電子証明書（6桁から16桁までの暗証番号」）だけが可能となっておりますので、ご利用に応じた手続きが出来るストアをこちらからご確認ください。
                          </li>
                        )}
                        <li>・<strong>マイナンバーカードセンター</strong>（<span className="underline text-red-600">事前予約</span>が必要です。）</li>
                        <li>・<strong>各区役所・支所のマイナンバーカード交付コーナー</strong>（<span className="underline text-red-600">事前予約</span>が必要です。京都市民の方でしたら、住所地に関わらずいずれの区役所・支所でも手続可能です。）</li>
                      </ul>
                    </div>

                  </>
                )}
              </div>
            </CardContent>
          </Card>
          )}

          {/* 予約方法（住所・氏名等の変更及びカード紛失確認画面以外の場合のみ表示） */}
          {answers.procedure !== "info_change" && !showLostConfirmation && (
            <Card className="shadow-lg border-gray-200 mb-8">
              <CardContent className="p-2 sm:p-6">
                <h3 className="text-xl font-bold text-kyoto-purple-dark mb-4 flex items-center">
                  <i className="fas fa-calendar-alt mr-2"></i>予約方法について
                </h3>
                <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
                  <p>{answers.procedure === "card_issuance" ? "交付希望日" : "手続希望日"}から祝休日・年末年始を除いた概ね<span className="text-red-600 font-bold">5日前</span>に予約を締め切ります。</p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold mb-2 text-blue-600">＜下記のいずれかの方法で予約＞</p>
                    <ul className="space-y-2">
                      <li>・<strong>インターネット受付</strong>（24時間　年中無休）：<a href="https://mncard.city.kyoto.lg.jp/mynumpo-kyoto-u/?method=all" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://mncard.city.kyoto.lg.jp/mynumpo-kyoto-u/?method=all</a></li>
                      <li>・<strong>電話受付</strong>（平日の午前9時～午後5時）：075－777－6201</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <p>※　区役所・支所では予約を受け付けておりません。</p>
                    {/* カードの交付（受け取り）の場合のみ製造管理番号の注意事項を表示 */}
                    {answers.procedure === "card_issuance" && (
                      <>
                        <p>※　交付通知書に記載の「製造管理番号」が必要となりますので、お手元にご用意ください。交付通知書の紛失等により「製造管理番号」が不明な際は、事前にマイナンバーカードセンターにお問い合わせいただき、ご確認ください。</p>
                        <p>※　電話受付によるご予約をご希望の方は、「発送番号」も併せて事前にご確認ください。</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Action buttons for all procedures (except lost confirmation screen) */}
      {!showLostConfirmation && (
        <div className="space-y-4">
          {/* Print, PDF, Share buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => printResults()}
              className="bg-white hover:bg-gray-50 text-kyoto-purple border border-kyoto-purple px-6 py-3 rounded-lg font-semibold text-center justify-center shadow transition-colors"
            >
              <i className="fas fa-print mr-2"></i>印刷
            </Button>
            <Button
              onClick={handleGeneratePDF}
              className="bg-white hover:bg-gray-50 text-kyoto-purple border border-kyoto-purple px-6 py-3 rounded-lg font-semibold text-center justify-center shadow transition-colors"
            >
              <i className="fas fa-file-pdf mr-2"></i>PDF作成
            </Button>
            <Button
              onClick={() => setShowQRCode(true)}
              className="bg-white hover:bg-gray-50 text-kyoto-purple border border-kyoto-purple px-6 py-3 rounded-lg font-semibold text-center justify-center shadow transition-colors"
            >
              <i className="fas fa-share mr-2"></i>共有
            </Button>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onBack}
              className="kyoto-button px-4 py-2 rounded-lg font-semibold text-center justify-center"
            >
              <i className="fas fa-chevron-left mr-2"></i>前のページへ戻る
            </Button>
            <Button
              onClick={onRestart}
              className="kyoto-button px-4 py-2 rounded-lg font-semibold text-center justify-center"
            >
              <i className="fas fa-redo mr-2"></i>最初から
            </Button>
          </div>
        </div>
      )}
      
      {showQRCode && (
        <QRCodeDisplay 
          answers={answers} 
          onClose={() => setShowQRCode(false)} 
        />
      )}
    </div>
  );
}
