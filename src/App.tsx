import { useMemo, lazy, Suspense } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme, compactLightTheme, compactDarkTheme } from "./theme";
import { ThemeModeProvider, useThemeMode } from "./contexts/ThemeModeContext";
import { FundProvider } from "./contexts/FundContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LocaleProvider } from "./i18n/IntlContext";
import MaterialLayout from "./components/MaterialLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { DashboardSkeleton } from "./components/LoadingSkeleton";
import RouteErrorBoundary from "./components/RouteErrorBoundary";

const withErrorBoundary = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <RouteErrorBoundary><Component /></RouteErrorBoundary>
);

const withProtection = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <ProtectedRoute><RouteErrorBoundary><Component /></RouteErrorBoundary></ProtectedRoute>
);

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Search = lazy(() => import("./pages/Search"));
const Results = lazy(() => import("./pages/Results"));
const About = lazy(() => import("./pages/About"));
const Portfolios = lazy(() => import("./pages/Portfolios"));
const Data = lazy(() => import("./pages/Data"));
const Workflows = lazy(() => import("./pages/Workflows"));
const WorkflowConfiguration = lazy(() => import("./pages/WorkflowConfiguration"));
const KnowledgeGraph = lazy(() => import("./pages/KnowledgeGraph"));
const KnowledgeBase = lazy(() => import("./pages/KnowledgeBase"));
const FrontOffice = lazy(() => import("./pages/FrontOffice"));
const MiddleOffice = lazy(() => import("./pages/MiddleOffice"));
const BackOffice = lazy(() => import("./pages/BackOffice"));
const Agents = lazy(() => import("./pages/Agents"));
const AgentDetail = lazy(() => import("./pages/AgentDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PlatformConfig = lazy(() => import("./pages/PlatformConfig"));
const LayerDataCollection = lazy(() => import("./pages/platform/LayerDataCollection"));
const LayerOntology = lazy(() => import("./pages/platform/LayerOntology"));
const LayerCalculations = lazy(() => import("./pages/platform/LayerCalculations"));
const LayerRulesValidation = lazy(() => import("./pages/platform/LayerRulesValidation"));
const LayerIntelligence = lazy(() => import("./pages/platform/LayerIntelligence"));
const LayerRAG = lazy(() => import("./pages/platform/LayerRAG"));
const LayerWorkflowOrchestration = lazy(() => import("./pages/platform/LayerWorkflowOrchestration"));
const LayerReporting = lazy(() => import("./pages/platform/LayerReporting"));
const LayerOutbound = lazy(() => import("./pages/platform/LayerOutbound"));
const ProcedureViewer = lazy(() => import("./pages/ProcedureViewer"));
const NavCalculation = lazy(() => import("./pages/NavCalculation"));

const queryClient = new QueryClient();

// Simple page wrapper without framer-motion animations for finance users
const SimplePageWrapper = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const AppRoutes = () => {
  const location = useLocation();
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Routes location={location}>
        <Route path="/" element={<RouteErrorBoundary><Index /></RouteErrorBoundary>} />
        <Route path="/auth" element={withErrorBoundary(Auth)} />
        <Route path="/dashboard" element={withProtection(Dashboard)} />
        <Route path="/search" element={withProtection(Search)} />
        <Route path="/results" element={withProtection(Results)} />
        <Route path="/portfolios" element={withProtection(Portfolios)} />
        <Route path="/data" element={withProtection(Data)} />
        <Route path="/workflows" element={withProtection(Workflows)} />
        <Route path="/workflow-config" element={withProtection(WorkflowConfiguration)} />
        <Route path="/knowledge-graph" element={withProtection(KnowledgeGraph)} />
        <Route path="/knowledge-base" element={withProtection(KnowledgeBase)} />
        <Route path="/agents" element={withProtection(Agents)} />
        <Route path="/agents/:id" element={withProtection(AgentDetail)} />
        <Route path="/front-office" element={withProtection(FrontOffice)} />
        <Route path="/middle-office" element={withProtection(MiddleOffice)} />
        <Route path="/back-office" element={withProtection(BackOffice)} />
        <Route path="/platform-config" element={withProtection(PlatformConfig)} />
        <Route path="/platform-config/layer-0" element={withProtection(LayerDataCollection)} />
        <Route path="/platform-config/layer-1" element={withProtection(LayerOntology)} />
        <Route path="/platform-config/layer-2" element={withProtection(LayerCalculations)} />
        <Route path="/platform-config/layer-3" element={withProtection(LayerRulesValidation)} />
        <Route path="/platform-config/layer-4" element={withProtection(LayerIntelligence)} />
        <Route path="/platform-config/layer-5" element={withProtection(LayerRAG)} />
        <Route path="/platform-config/layer-6" element={withProtection(LayerWorkflowOrchestration)} />
        <Route path="/platform-config/layer-7" element={withProtection(LayerReporting)} />
        <Route path="/platform-config/layer-8" element={withProtection(LayerOutbound)} />
        <Route path="/nav-calculation" element={withProtection(NavCalculation)} />
        <Route path="/about" element={withErrorBoundary(About)} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const ThemedApp = () => {
  const { mode, density } = useThemeMode();
  const theme = useMemo(() => {
    if (density === 'compact') {
      return mode === 'dark' ? compactDarkTheme : compactLightTheme;
    }
    return mode === 'dark' ? darkTheme : lightTheme;
  }, [mode, density]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="bottom-right" richColors closeButton />
      <HashRouter>
        <FundProvider>
          <MaterialLayout>
            <AppRoutes />
          </MaterialLayout>
        </FundProvider>
      </HashRouter>
    </ThemeProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeModeProvider>
      <AuthProvider>
        <LocaleProvider>
          <ThemedApp />
        </LocaleProvider>
      </AuthProvider>
    </ThemeModeProvider>
  </QueryClientProvider>
);

export default App;
