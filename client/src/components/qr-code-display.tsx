import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateQRCode } from "@/lib/print-utils";
import { Answer } from "@shared/schema";

interface QRCodeDisplayProps {
  answers: Answer;
  onClose: () => void;
}

export default function QRCodeDisplay({ answers, onClose }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const generateCode = async () => {
      // Create a URL with the answers encoded
      const params = new URLSearchParams();
      Object.entries(answers).forEach(([key, value]) => {
        params.append(key, value);
      });
      
      const shareUrl = `${window.location.origin}?${params.toString()}`;
      const qrUrl = await generateQRCode(shareUrl);
      setQrCodeUrl(qrUrl);
    };

    generateCode();
  }, [answers]);

  const handleShareLine = () => {
    const message = "マイナンバーカード手続きの必要書類を確認しました。";
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(message)}%0A${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleShareSMS = () => {
    const message = "マイナンバーカード手続きの必要書類を確認しました。";
    const url = `sms:?body=${encodeURIComponent(message)}%0A${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="bg-white rounded-xl shadow-xl max-w-md mx-4">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            <i className="fas fa-qrcode mr-2"></i>結果を共有
          </h3>
          
          {qrCodeUrl && (
            <div className="flex justify-center">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-48 h-48 border border-slate-200 rounded-lg"
              />
            </div>
          )}
          
          <p className="text-sm text-slate-600">
            QRコードを読み取るか、下のボタンで共有できます
          </p>
          
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleShareLine}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <i className="fab fa-line mr-2"></i>LINEで共有
            </Button>
            
            <Button
              onClick={handleShareSMS}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <i className="fas fa-sms mr-2"></i>SMSで共有
            </Button>
          </div>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            閉じる
          </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}