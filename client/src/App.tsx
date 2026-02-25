import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import SipAccounts from "@/pages/SipAccounts";
import CallHistory from "@/pages/CallHistory";
import Contacts from "@/pages/Contacts";
import Users from "@/pages/Users";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

/**
 * Design: Modern Tech Dark Premium
 * - Tema escuro por padrão
 * - Paleta: Cyan (#06B6D4) + Roxo (#A78BFA)
 * - Tipografia: Geist + Inter + JetBrains Mono
 * - Glassmorphism e animações fluidas
 */

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/dashboard/sip-accounts" component={() => <ProtectedRoute component={SipAccounts} />} />
      <Route path="/dashboard/call-history" component={() => <ProtectedRoute component={CallHistory} />} />
      <Route path="/dashboard/contacts" component={() => <ProtectedRoute component={Contacts} />} />
      <Route path="/dashboard/users" component={() => <ProtectedRoute component={Users} />} />
      <Route path="/404" component={NotFound} />
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
