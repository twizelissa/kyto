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
        <div className="flex items-center">
          <div className="mr-4 bg-white rounded px-2 py-1">
            <img 
              src="https://monakaya.com/wp-content/uploads/2024/12/京都市ロゴマーク-1024x395-1.webp" 
              alt="京都市ロゴ" 
              className="h-6 w-auto object-contain"
            />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-bold mb-0">マイナンバーカード手続きガイド</h1>
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
