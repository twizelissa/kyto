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
    <header className="kyoto-header text-white">
      <div className="container mx-auto px-2 sm:px-4 py-4">
        <div 
          className="text-left cursor-pointer block hover:opacity-80 transition-opacity"
          onClick={onHomeClick}
        >
          <h1 className="text-lg font-bold mb-0">京都市マイナンバーカード手続きガイド</h1>
          <p className="text-sm opacity-90">必要書類確認システム</p>
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
            <Router onHomeClick={handleHomeClick} />
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
