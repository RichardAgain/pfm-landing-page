import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { authApi } from "../../lib/api";
import { sessionManager } from "../../lib/session";

export default function Header() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      // Call logout API to invalidate token on server
      try {
        await authApi.logout();
      } catch (error) {
        // Even if server logout fails, we should clear local session
        console.warn("Server logout failed, but clearing local session:", error);
      }

      // Clear local session data
      sessionManager.clearSession();

      // Redirect to login
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Force clear session and redirect anyway
      sessionManager.clearSession();
      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-[5vw] bg-gradient-to-b from-[#4B0C0C] to-[#7A1F1F] py-[6px]">
      <div className="flex h-16 items-center justify-start">
        <div className="flex-1">
          <img src="/logo-icon.png" alt="Academia Internacional de Música - Maestro José Calabrese" className="w-10 h-10" />
        </div>
        <nav className="flex gap-6 justify-end">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex bg-[#C19310] hover:bg-[#C19310]/80 disabled:bg-[#C19310]/50 px-4 py-1 gap-2 rounded-full items-center justify-center text-xs font-montserrat text-white font-medium cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4"></ChevronLeft>
            {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
          </button>
        </nav>
      </div>
    </header>
  )
}
