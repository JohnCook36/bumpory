import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { palette } from '@/theme/tokens';

export default function RootLayout() {
  return <>
    <StatusBar style="dark" backgroundColor={palette.canvas} />
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.canvas } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="entry" />
      <Stack.Screen name="settings" />
    </Stack>
  </>;
}
