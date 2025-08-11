import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function KyotoHeader() {
  return (
    <header className="kyoto-header text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg width="120" height="40" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 京都市章 */}
              <g transform="translate(50,50)">
                {/* 外側の円形パターン */}
                <circle cx="0" cy="0" r="35" fill="#4A3B7A"/>
                {/* 6つの放射状の要素 */}
                <g>
                  <path d="M0,-30 L6,-10 L0,-5 L-6,-10 Z" fill="#D4AF37"/>
                  <path d="M26,-15 L10,5 L5,0 L10,-10 Z" fill="#D4AF37"/>
                  <path d="M26,15 L10,10 L5,5 L10,5 Z" fill="#D4AF37"/>
                  <path d="M0,30 L-6,10 L0,5 L6,10 Z" fill="#D4AF37"/>
                  <path d="M-26,15 L-10,-5 L-5,0 L-10,10 Z" fill="#D4AF37"/>
                  <path d="M-26,-15 L-10,-10 L-5,-5 L-10,-5 Z" fill="#D4AF37"/>
                  {/* 紫の装飾部分 */}
                  <circle cx="0" cy="-25" r="8" fill="#4A3B7A"/>
                  <circle cx="22" cy="-12" r="8" fill="#4A3B7A"/>
                  <circle cx="22" cy="12" r="8" fill="#4A3B7A"/>
                  <circle cx="0" cy="25" r="8" fill="#4A3B7A"/>
                  <circle cx="-22" cy="12" r="8" fill="#4A3B7A"/>
                  <circle cx="-22" cy="-12" r="8" fill="#4A3B7A"/>
                </g>
                {/* 中央の円 */}
                <circle cx="0" cy="0" r="4" fill="#D4AF37"/>
              </g>
              
              {/* 京都市テキスト */}
              <g transform="translate(120,30)">
                <text x="0" y="0" fill="white" fontSize="24" fontWeight="bold" fontFamily="serif">京都市</text>
                <text x="0" y="25" fill="white" fontSize="8" fontFamily="serif">CITY OF KYOTO</text>
              </g>
            </svg>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">必要書類確認システム</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <KyotoHeader />
          <main>
            <Toaster />
            <Router />
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
