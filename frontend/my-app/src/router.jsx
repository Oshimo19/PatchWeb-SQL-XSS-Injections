// frontend/my-app/src/router.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { isPathValid } from "./utils/safe-url-decode";

import App from "./App";
import NotFound from "./pages/NotFound";
import UsersList from "./components/UsersList";
import Comments from "./components/Comments";

// Protection contre les URLs invalides (%)
function SafeGuard({ children }) {
  const path = window.location.pathname;

  if (!isPathValid(path)) {
    return <NotFound />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <SafeGuard>
        <Routes>
          {/* Page principale = App.jsx */}
          <Route path="/" element={<App />} />

          {/* Pages fonctionnelles */}
          <Route path="/users" element={<UsersList />} />
          <Route path="/comments" element={<Comments />} />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SafeGuard>
    </BrowserRouter>
  );
}
