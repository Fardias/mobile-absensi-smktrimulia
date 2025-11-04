import { Stack, Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox, useColorScheme, View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();
LogBox.ignoreAllLogs(true);

// Komponen utama yang akan mengatur redirect & splash screen
function RootNavigation() {
  const { isAuthenticated, loading, user } = useAuth();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  // Tampilkan loading screen sementara auth context inisialisasi
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <>
      {/* Jika user belum login, arahkan ke /login */}
      {!isAuthenticated ? (
        <Redirect href="/login" />
      ) : (
        // Jika sudah login, arahkan ke dashboard sesuai role
        <Redirect
          href={user?.role === "siswa" ? "/siswa/home" : "/dashboard" as any}
        />
      )}

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />

        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            gestureEnabled: false, // tidak bisa swipe balik ke login
          }}
        />

        <Stack.Screen
          name="+not-found"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={colorScheme === "dark" ? "#000" : "#fff"}
      />
    </>
  );
}

// Bungkus semuanya dengan AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
