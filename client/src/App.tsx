import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function KyotoHeader({ onHomeClick }: { onHomeClick?: () => void }) {
  return (
    <header className="bg-white border-b-8 border-kyoto-purple shadow-sm">
      <div className="px-2 sm:px-4 py-4">
        <div 
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onHomeClick}
        >
          <div className="mr-4">
            <img 
              src="https://cdn.ttzk.graffer.jp/guides/img_e1075b88a8562c1d2e7bf2c7b66e80f0.png" 
              alt="京都市ロゴ" 
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="text-left">
            <h1 className="text-sm sm:text-base md:text-lg font-bold mb-0 text-black">京都市マイナンバーカード手続きガイド</h1>
            <p className="text-xs sm:text-sm text-black">必要書類確認システム</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function Router({ onHomeClick }: { onHomeClick?: () => void }) {
  return (
    <Switch>
      <Route path="/">{() => <Home onHomeClick={onHomeClick} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [homeResetKey, setHomeResetKey] = useState(0);
  
  const handleHomeClick = () => {
    setHomeResetKey(prev => prev + 1);
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <KyotoHeader onHomeClick={handleHomeClick} />
          <main>
            <Toaster />
            <Home key={homeResetKey} onHomeClick={handleHomeClick} />
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
