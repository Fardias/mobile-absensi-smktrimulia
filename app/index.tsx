import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { isAuthenticated, user, loading } = useAuth();

  // Saat masih loading, jangan tampilkan apa pun
  if (loading) return null;

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Jika login, arahkan sesuai role user
  if (user?.role === "siswa") {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(tabs)" />;
}
