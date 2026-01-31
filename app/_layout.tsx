import { Stack, Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { AlertNotificationRoot } from 'react-native-alert-notification/lib/commonjs';
import { useEffect } from "react";
import { LogBox, useColorScheme, View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

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
          href={user?.role === "siswa" ? "/" : "/" as any}
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

export default function RootLayout() {
  return (
    <AuthProvider>
      <AlertNotificationRoot
        colors={[
          {
            label: '#1f2937',
            card: '#ffffff',
            overlay: '#003366',
            success: '#16a34a',
            danger: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6',
          },
          {
            label: '#ffffff',
            card: '#1f2937',
            overlay: '#003366',
            success: '#22c55e',
            danger: '#f87171',
            warning: '#f59e0b',
            info: '#60a5fa',
          },
        ]}
      >
        <RootNavigation />
      </AlertNotificationRoot>
    </AuthProvider>
  );
}
