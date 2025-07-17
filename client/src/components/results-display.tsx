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
  const requiredItems = resolveItems(answers);

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

  return (
    <div>
      <Card className="rounded-xl shadow-lg p-8 mb-6">
        <CardContent className="space-y-8">
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
        </CardContent>
      </Card>

      {/* Booking Information */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 no-print">
        <h3 className="font-semibold text-green-900 mb-3">
          <i className="fas fa-calendar-alt mr-2"></i>予約方法
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-green-800">事前予約が必要です</p>
            <p className="text-green-700">マイナンバーカードセンターまたは各区役所・支所で手続きが可能です。</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-green-800 mb-2">
                <i className="fas fa-globe mr-1"></i>インターネット予約
              </h4>
              <p className="text-green-700">24時間年中無休</p>
              <p className="text-xs text-green-600">推奨方法</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-green-800 mb-2">
                <i className="fas fa-phone mr-1"></i>電話予約
              </h4>
              <p className="text-green-700">平日 9:00-17:00</p>
              <p className="text-xs text-green-600">京都市マイナンバーカードセンター</p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-sm text-yellow-800">
              <i className="fas fa-info-circle mr-1"></i>
              予約は交付希望日から祝休日・年末年始を除いた概ね5日前に締切となります。
            </p>
          </div>
        </div>
      </div>

      {/* Document Categories */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 no-print">
        <h3 className="font-semibold text-gray-900 mb-3">
          <i className="fas fa-info-circle mr-2"></i>本人確認書類について
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-800 mb-2">A欄（顔写真付き公的書類）</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• マイナンバーカード</li>
              <li>• 運転免許証</li>
              <li>• パスポート</li>
              <li>• 住民基本台帳カード</li>
              <li>• 在留カード</li>
              <li>• 身体障害者手帳 等</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-800 mb-2">B欄（氏名・住所/生年月日記載書類）</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 健康保険証</li>
              <li>• 介護保険証</li>
              <li>• 年金手帳</li>
              <li>• 各種医療受給者証</li>
              <li>• 学生証・社員証</li>
              <li>• 母子健康手帳 等</li>
            </ul>
          </div>
        </div>
      </div>

      {/* References */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 no-print">
        <h3 className="font-semibold text-blue-900 mb-3">
          <i className="fas fa-external-link-alt mr-2"></i>参考情報
        </h3>
        <div className="space-y-2 text-sm">
          <a
            href="https://www.kojinbango-card.go.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 block"
          >
            マイナンバーカード総合サイト
          </a>
          <a
            href="https://www.digital.go.jp/policies/mynumber/expiration-date"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 block"
          >
            デジタル庁 - 更新手続きについて
          </a>
          <a
            href="https://www.kojinbango-card.go.jp/municipal/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 block"
          >
            各自治体の窓口情報
          </a>
        </div>
      </div>
      
      {showQRCode && (
        <QRCodeDisplay 
          answers={answers} 
          onClose={() => setShowQRCode(false)} 
        />
      )}
    </div>
  );
}
