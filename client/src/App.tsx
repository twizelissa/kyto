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
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 京都市章をモチーフにしたSVGロゴ */}
              <circle cx="50" cy="50" r="45" fill="#6B46C1" stroke="#D4AF37" strokeWidth="2"/>
              <g transform="translate(50,50)">
                {/* 中央の6つの花弁 */}
                <path d="M0,-25 L8,-8 L0,0 L-8,-8 Z" fill="#D4AF37"/>
                <path d="M22,-12 L8,8 L0,0 L8,-8 Z" fill="#D4AF37" transform="rotate(60)"/>
                <path d="M22,12 L8,8 L0,0 L8,8 Z" fill="#D4AF37" transform="rotate(120)"/>
                <path d="M0,25 L-8,8 L0,0 L8,8 Z" fill="#D4AF37" transform="rotate(180)"/>
                <path d="M-22,12 L-8,-8 L0,0 L-8,8 Z" fill="#D4AF37" transform="rotate(240)"/>
                <path d="M-22,-12 L-8,-8 L0,0 L-8,-8 Z" fill="#D4AF37" transform="rotate(300)"/>
                {/* 中央の円 */}
                <circle cx="0" cy="0" r="3" fill="#D4AF37"/>
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
