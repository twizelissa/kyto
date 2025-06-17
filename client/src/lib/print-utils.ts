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

export function generatePDF() {
  // For now, use browser's print to PDF functionality
  printResults();
}
