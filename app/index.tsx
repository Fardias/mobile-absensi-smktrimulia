import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect ke halaman login saat aplikasi dimuat
  return <Redirect href="/login" />;
}