import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Answer } from "@shared/schema";
import { resolveItems, getItemDetails } from "@/lib/rules-engine";
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
  
  // Check if this is an application method result
  const isApplicationMethodResult = answers.application_method;
  
  const requiredItems = isApplicationMethodResult ? [] : resolveItems(answers);

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

  const getApplicationMethodContent = () => {
    const method = answers.application_method;
    const mailType = answers.mail_type;
    
    if (method === "online") {
      return {
        title: "オンライン申請について",
        content: (
          <div className="space-y-4">
            <p>スマートフォンや自宅のパソコン等で申請される場合は、IDや二次元バーコードが記載されたマイナンバーカード交付申請書をご利用ください。</p>
            <p>詳しい申請方法は、マイナンバーカード総合サイト（地方公共団体情報システム機構のホームページ）をご確認ください。</p>
            <div className="space-y-2">
              <p>▶︎パソコンからの申請はこちら</p>
              <p>▶︎スマートフォンからの申請はこちら</p>
            </div>
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
            <p>詳しい申請方法は，マイナンバーカード総合サイトをご確認ください。</p>
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="rounded-xl shadow-lg p-8 mb-6">
        <CardContent className="space-y-8">
          {isApplicationMethodResult ? (
            <>
              <div className="text-center mb-8">
                <i className="fas fa-info-circle text-kyoto-purple text-6xl mb-4"></i>
                <h2 className="text-3xl font-bold text-kyoto-purple-dark mb-4">{getApplicationMethodContent().title}</h2>
              </div>
              <div className="text-gray-800 leading-relaxed">
                {getApplicationMethodContent().content}
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <i className="fas fa-check-circle text-kyoto-purple text-6xl mb-4"></i>
                <h2 className="text-3xl font-bold text-kyoto-purple-dark mb-4">カードの交付について</h2>
                <p className="text-lg text-gray-600">必要書類・交付場所・予約方法をご確認ください</p>
              </div>

              {/* 必要書類リスト */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-kyoto-purple-dark mb-4 flex items-center">
                  <i className="fas fa-clipboard-list mr-2"></i>必要書類リスト
                </h3>
                <div className="space-y-4">
                {requiredItems.map((itemKey, index) => {
                  const item = getItemDetails(itemKey);
                  if (!item) return null;
                  
                  return (
                    <div key={itemKey} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-kyoto-purple-light transition-colors">
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
              </div>

              {/* 交付場所・予約方法 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-kyoto-purple-dark mb-4 flex items-center">
                  <i className="fas fa-map-marker-alt mr-2"></i>交付場所・予約方法
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">交付場所</h4>
                      <p className="text-sm text-blue-800">京都市マイナンバーカードセンター、区役所・支所のマイナンバーカードセンター交付コーナー</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">予約方法</h4>
                      <p className="text-sm text-blue-800">
                        予約制です。京都市マイナンバーカードセンターの予約システムまたは電話でご予約ください。<br/>
                        予約なしでの来庁も可能ですが、お待ちいただく場合があります。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  onClick={() => printResults()}
                  className="kyoto-button px-4 py-2 rounded-lg font-semibold text-center justify-center"
                >
                  <i className="fas fa-print mr-2"></i>印刷する
                </Button>
                <Button
                  onClick={handleGeneratePDF}
                  className="kyoto-button px-4 py-2 rounded-lg font-semibold text-center justify-center"
                >
                  <i className="fas fa-file-pdf mr-2"></i>PDFで保存
                </Button>
                <Button
                  onClick={() => setShowQRCode(true)}
                  className="kyoto-button px-4 py-2 rounded-lg font-semibold text-center justify-center"
                >
                  <i className="fas fa-qrcode mr-2"></i>QRコード表示
                </Button>
              </div>
            </>
          )}

          {/* Common action buttons for all results */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
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
        </CardContent>
      </Card>
      
      {showQRCode && (
        <QRCodeDisplay 
          answers={answers} 
          onClose={() => setShowQRCode(false)} 
        />
      )}
    </div>
  );
}
