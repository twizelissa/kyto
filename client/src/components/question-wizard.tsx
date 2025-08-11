import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Answer } from "@shared/schema";
import { QUESTIONS } from "@/lib/questions-data";

interface QuestionWizardProps {
  onComplete: (answers: Answer) => void;
}

export default function QuestionWizard({ onComplete }: QuestionWizardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Filter questions based on current answers
  const relevantQuestions = QUESTIONS.filter(q => 
    !q.showWhen || q.showWhen(answers)
  );

  const question = relevantQuestions[currentQuestion];
  // Calculate progress based on relevant questions for this flow, ensuring 100% at the end
  const progress = ((currentQuestion + 1) / relevantQuestions.length) * 100;

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    
    // Auto-advance after selection with slight delay for better UX
    setTimeout(() => {
      // Recalculate relevant questions with new answers
      const updatedRelevantQuestions = QUESTIONS.filter(q => 
        !q.showWhen || q.showWhen(newAnswers)
      );
      
      if (currentQuestion < updatedRelevantQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        const nextQuestion = updatedRelevantQuestions[currentQuestion + 1];
        setSelectedOption(newAnswers[nextQuestion?.id] || "");
      } else {
        onComplete(newAnswers);
      }
    }, 300);
  };

  const handleNext = () => {
    if (currentQuestion < relevantQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(answers[relevantQuestions[currentQuestion + 1].id] || "");
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[relevantQuestions[currentQuestion - 1].id] || "");
    }
  };

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">
            質問 {currentQuestion + 1}
          </span>
          <span className="text-sm text-slate-600">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="kyoto-card rounded-lg shadow-lg p-8 mb-6">
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-bold text-kyoto-purple-dark mb-6">{question.text}</h2>
          <div className="space-y-4">
            {question.options.map((option) => (
              <div
                key={option.v}
                className={`option-card p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOption === option.v
                    ? "border-kyoto-purple bg-kyoto-purple-light"
                    : "border-gray-200 hover:border-kyoto-purple hover:bg-kyoto-purple-light"
                }`}
                onClick={() => handleOptionSelect(option.v)}
              >
                <div className="flex items-center space-x-4">
                  <i className={`${option.icon} text-kyoto-purple text-xl`}></i>
                  <span className="font-medium text-slate-800">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Previous Button Only */}
      <div className="flex justify-start">
        {currentQuestion > 0 && (
          <Button
            onClick={handlePrev}
            variant="outline"
            className="kyoto-button-outline"
          >
            <i className="fas fa-chevron-left mr-2"></i>前の質問
          </Button>
        )}
      </div>
    </div>
  );
}
