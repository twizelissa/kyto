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
  onModify: () => void;
}

export default function ResultsDisplay({ answers, onRestart, onModify }: ResultsDisplayProps) {
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
            <p>マイナンバーカードセンターで申請できます。申請時に顔写真の撮影も無料で行います。</p>
            <p>手続きには事前予約が必要です。</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="font-bold mb-2">京都市マイナンバーカードセンター</h4>
              <div className="text-sm space-y-1">
                <p>住所：〒600-8009　京都市下京区四条通室町東入函谷鉾町78番地　京都経済センター SUINA室町3階</p>
                <p>営業時間：平日・土日祝　午前9時～午後5時（年末年始を除く）</p>
                <p>TEL：075-585-5503</p>
                <p>予約サイト：オンライン予約システムをご利用ください</p>
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
            <p>定期的に市内各所で開催される出張申請窓口や出張申請サポートをご利用いただけます。</p>
            <p>申請時に顔写真の撮影も無料で行います。</p>
            <p>開催日程や場所については京都市ホームページでご確認いただくか、お問い合わせください。</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <h4 className="font-bold mb-2">出張申請について</h4>
              <div className="text-sm space-y-1">
                <p>・事前予約が必要な場合があります</p>
                <p>・開催場所：公民館、図書館、商業施設など</p>
                <p>・最新の開催情報は京都市ホームページをご確認ください</p>
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
            <p>各区役所・支所の窓口で申請サポートを受けることができます。</p>
            <p>職員がオンライン申請のお手伝いをいたします。申請時に顔写真の撮影も無料で行います。</p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
              <h4 className="font-bold mb-2">申請サポート窓口</h4>
              <div className="text-sm space-y-1">
                <p>・各区役所・支所の市民窓口課</p>
                <p>・営業時間：平日　午前8時45分～午後5時30分</p>
                <p>・土日祝日は休業（一部の区役所で土曜開庁あり）</p>
                <p>・事前予約をおすすめします</p>
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
    <div>
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
                <i className="fas fa-check-circle text-gov-green text-6xl mb-4"></i>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">必要書類リスト</h2>
                <p className="text-lg text-slate-600">以下の書類をご準備ください</p>
              </div>

              {/* Checklist */}
              <div className="space-y-4 mb-8">
                {requiredItems.map((itemKey) => {
                  const item = getItemDetails(itemKey);
                  if (!item) return null;

                  return (
                    <div
                      key={itemKey}
                      className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-shrink-0">
                        <i className={`${item.icon} text-gov-blue text-xl`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800">{item.name}</h4>
                      </div>
                      <div className="flex-shrink-0">
                        <Checkbox
                          checked={checkedItems[itemKey] || false}
                          onCheckedChange={(checked) => handleItemCheck(itemKey, !!checked)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
                <Button
                  onClick={handleGeneratePDF}
                  className="bg-gov-red hover:bg-red-700 text-white"
                >
                  <i className="fas fa-file-pdf mr-2"></i>PDF生成
                </Button>
                <Button
                  onClick={printResults}
                  className="bg-gov-orange hover:bg-orange-700 text-white"
                >
                  <i className="fas fa-print mr-2"></i>印刷する
                </Button>
                <Button
                  onClick={() => setShowQRCode(true)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <i className="fas fa-share-alt mr-2"></i>共有
                </Button>
                <Button
                  onClick={onModify}
                  variant="outline"
                  className="border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white"
                >
                  <i className="fas fa-edit mr-2"></i>回答を修正
                </Button>
                <Button
                  onClick={onRestart}
                  className="bg-gov-blue hover:bg-blue-700"
                >
                  <i className="fas fa-redo mr-2"></i>最初から
                </Button>
              </div>
            </>
          )}

          {/* Common action buttons for application method results */}
          {isApplicationMethodResult && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                onClick={onRestart}
                className="kyoto-button"
              >
                <i className="fas fa-redo mr-2"></i>最初から
              </Button>
            </div>
          )}
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
