import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { Answer } from '@shared/schema';

export function printResults() {
  // Add print-specific styles temporarily
  const printStyles = document.createElement('style');
  printStyles.textContent = `
    @media print {
      .no-print { display: none !important; }
      body { background: white !important; color: black !important; }
      .bg-white { box-shadow: none !important; }
      .shadow-lg, .shadow-xl { box-shadow: none !important; }
      .rounded-xl, .rounded-lg { border-radius: 0 !important; }
      .text-gov-blue { color: #2563eb !important; }
      .bg-slate-50 { background: white !important; }
      .border-slate-200 { border-color: #ccc !important; }
    }
  `;
  
  document.head.appendChild(printStyles);
  
  // Trigger print
  window.print();
  
  // Remove styles after print
  setTimeout(() => {
    document.head.removeChild(printStyles);
  }, 1000);
}

export async function generatePDF(answers: Answer, items: string[]) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Add title
  pdf.setFontSize(20);
  pdf.text('マイナンバーカード手続き書類チェックリスト', pageWidth / 2, 30, { align: 'center' });
  
  // Add generation date
  pdf.setFontSize(12);
  const today = new Date().toLocaleDateString('ja-JP');
  pdf.text(`作成日: ${today}`, pageWidth / 2, 45, { align: 'center' });
  
  // Add procedure info
  let yPos = 70;
  pdf.setFontSize(14);
  pdf.text('手続き情報:', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(12);
  const procedureLabels: { [key: string]: string } = {
    'new_application': '新規申請・カード交付',
    'card_renewal': 'カード更新',
    'cert_renewal': '電子証明書更新',
    'pin_reset': '暗証番号初期化・変更・ロック解除',
    'info_change': '住所・氏名変更等に伴うカード券面変更',
    'suspension_release': '一時停止の解除',
    'card_return': 'カード返納'
  };
  
  if (answers.procedure) {
    pdf.text(`手続き: ${procedureLabels[answers.procedure] || answers.procedure}`, 25, yPos);
    yPos += 8;
  }
  
  if (answers.visitor) {
    const visitorLabels: { [key: string]: string } = {
      'self': '本人',
      'legal': '法定代理人',
      'proxy': '任意代理人'
    };
    pdf.text(`来庁者: ${visitorLabels[answers.visitor] || answers.visitor}`, 25, yPos);
    yPos += 8;
  }
  
  if (answers.age) {
    const ageLabels: { [key: string]: string } = {
      'u15': '15歳未満',
      'u18': '15〜17歳',
      'adult': '18歳以上'
    };
    pdf.text(`年齢: ${ageLabels[answers.age] || answers.age}`, 25, yPos);
    yPos += 20;
  }
  
  // Add checklist
  pdf.setFontSize(16);
  pdf.text('必要書類チェックリスト:', 20, yPos);
  yPos += 15;
  
  pdf.setFontSize(12);
  items.forEach((item, index) => {
    if (yPos > pageHeight - 30) {
      pdf.addPage();
      yPos = 30;
    }
    
    // Add checkbox
    pdf.rect(20, yPos - 5, 5, 5);
    pdf.text(`${index + 1}. ${item}`, 30, yPos);
    yPos += 12;
  });
  
  // Add QR code for returning to the app
  try {
    const qrDataUrl = await QRCode.toDataURL(window.location.href, {
      width: 100,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Add QR code to PDF
    pdf.addImage(qrDataUrl, 'PNG', pageWidth - 60, pageHeight - 60, 40, 40);
    
    // Add QR code label
    pdf.setFontSize(10);
    pdf.text('再度アクセス', pageWidth - 50, pageHeight - 15, { align: 'center' });
  } catch (error) {
    console.error('QR code generation failed:', error);
  }
  
  // Add footer
  pdf.setFontSize(10);
  pdf.text('※自治体により必要書類が異なる場合があります。詳細は各自治体にご確認ください。', 
    pageWidth / 2, pageHeight - 30, { align: 'center' });
  
  // Save PDF
  pdf.save('マイナンバーカード手続き書類チェックリスト.pdf');
}

export async function generateQRCode(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('QR code generation failed:', error);
    return '';
  }
}
