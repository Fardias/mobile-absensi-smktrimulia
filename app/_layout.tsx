import { Redirect, Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from "react";
import { LogBox, useColorScheme } from "react-native";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

LogBox.ignoreAllLogs(true);

// Fungsi untuk mengecek apakah user sudah login atau belum
// Untuk contoh ini, kita anggap belum login
const isAuthenticated = false;

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Sembunyikan splash screen setelah komponen dimuat
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 1000);
  }, []);

  return (
    <Stack>
      <Stack.Screen 
        name="index"
        redirect={true}
      />
      
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
          // Mencegah navigasi kembali ke halaman login
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="+not-found"
        options={{
          headerShown: false
        }}
      />

      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={colorScheme === "dark" ? "#000" : "#fff"}
      />
    </Stack>
  );
}
