import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function KyotoHeader() {
  const [, navigate] = useLocation();
  
  const handleHomeClick = () => {
    navigate('/');
  };
  
  return (
    <header className="kyoto-header text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="text-left cursor-pointer" onClick={handleHomeClick}>
          <h1 className="text-lg font-bold mb-0 hover:opacity-80 transition-opacity">京都市マイナンバーカード手続きガイド</h1>
          <p className="text-sm opacity-90 hover:opacity-70 transition-opacity">必要書類確認システム</p>
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
