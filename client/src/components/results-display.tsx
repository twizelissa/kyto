import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Answer } from "@shared/schema";
import { resolveItems, getItemDetails } from "@/lib/rules-engine";
import { printResults } from "@/lib/print-utils";

interface ResultsDisplayProps {
  answers: Answer;
  onRestart: () => void;
  onModify: () => void;
}

export default function ResultsDisplay({ answers, onRestart, onModify }: ResultsDisplayProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const requiredItems = resolveItems(answers);

  const handleItemCheck = (itemKey: string, checked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [itemKey]: checked }));
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
              onClick={printResults}
              className="bg-gov-orange hover:bg-orange-700 text-white"
            >
              <i className="fas fa-print mr-2"></i>印刷する
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
    </div>
  );
}
