
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Leaderboard from "./pages/Leaderboard";
import StockDetails from "./pages/StockDetails";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Setup query client
const queryClient = new QueryClient();

// Add motion library
const MotionProvider = lazy(() => import('framer-motion').then(mod => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> })));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Suspense fallback={null}>
        <MotionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/stock/:stockId" element={<StockDetails />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MotionProvider>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
