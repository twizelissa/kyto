import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Answer } from "@shared/schema";
import { QUESTIONS } from "@/lib/questions-data";

interface ModifyAnswersProps {
  currentAnswers: Answer;
  onApply: (answers: Answer) => void;
  onCancel: () => void;
}

export default function ModifyAnswers({ currentAnswers, onApply, onCancel }: ModifyAnswersProps) {
  const [answers, setAnswers] = useState<Answer>(currentAnswers);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleApply = () => {
    onApply(answers);
  };

  return (
    <Card className="rounded-xl shadow-lg p-6 mb-6">
      <CardContent className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">回答を修正</h3>
        
        <div className="space-y-4">
          {QUESTIONS.map((question) => {
            const currentAnswer = answers[question.id];
            
            return (
              <div key={question.id} className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-3">{question.text}</h4>
                <Select
                  value={currentAnswer || ""}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {question.options.map((option) => (
                      <SelectItem key={option.v} value={option.v}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleApply}
            className="bg-gov-green hover:bg-green-700 text-white"
          >
            変更を適用
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-slate-400 text-slate-400 hover:bg-slate-400 hover:text-white"
          >
            キャンセル
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
