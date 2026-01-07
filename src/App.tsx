// src/App.tsx
import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { router } from "./router";

function AppContent() {
  const auth = useAuth();

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
