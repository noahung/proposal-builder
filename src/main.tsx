import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { queryClient } from "./lib/queryClient";
import { SetupErrorScreen } from "./components/utility/SetupErrorScreen";
import App from "./App.tsx";
import "./index.css";

// Check for required environment variables
const hasSupabaseConfig = 
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY;

const rootElement = document.getElementById("root")!;

// If Supabase is not configured, show setup error
if (!hasSupabaseConfig) {
  console.error('❌ Supabase configuration missing');
  console.error('Please create .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  
  createRoot(rootElement).render(<SetupErrorScreen />);
} else {
  // Normal app rendering
  createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  );
}
  