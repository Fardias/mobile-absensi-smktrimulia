import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={colorScheme === "dark" ? "#000" : "#fff"}
      />

      {/* Tabs harus langsung punya child <Tabs.Screen> */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#4A90E2",
          tabBarInactiveTintColor: "#9CA3AF",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
            letterSpacing: 0.3,
            fontFamily: "Times New Roman",
          },
          tabBarStyle: {
            backgroundColor: "#ffffffff",
            height: Platform.OS === "ios" ? 85 : 68,
            paddingBottom: Platform.OS === "ios" ? 24 : 8,
            paddingTop: 8,
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            letterSpacing: 0.3,
            marginTop: 4,
            marginBottom: 0,
          },
          tabBarIconStyle: {
            marginTop: -3,
          },
        }}
      >
        
        <Tabs.Screen
          name="riwayat"
          options={{
            title: "Riwayat",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "time" : "time-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Beranda",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
