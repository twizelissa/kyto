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
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded px-2 py-1">
              <span className="text-purple-800 font-bold text-lg">京都市</span>
              <span className="text-purple-600 text-xs ml-1">CITY OF KYOTO</span>
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold mb-0">マイナンバーカード手続きガイド</h1>
              <p className="text-sm opacity-90">必要書類確認システム</p>
            </div>
          </div>
          <div></div>
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
