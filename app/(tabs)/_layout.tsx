import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { palette } from '@/theme/tokens';

const symbols = ['⌂', '▦', '✎', '✓', '✚'];
function TabIcon({ symbol, focused }: { symbol: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, color: focused ? palette.plum : palette.muted, fontWeight: '700' }}>{symbol}</Text>;
}

export default function TabsLayout() {
  const options = (label: string, index: number) => ({
    title: label,
    tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon symbol={symbols[index]} focused={focused} />,
  });
  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: palette.plum, tabBarInactiveTintColor: palette.muted,
    tabBarStyle: { borderTopColor: palette.border, backgroundColor: palette.paper, minHeight: 63, paddingTop: 5 },
    tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
  }}>
    <Tabs.Screen name="index" options={options('Сегодня', 0)} />
    <Tabs.Screen name="weeks" options={options('Недели', 1)} />
    <Tabs.Screen name="journal" options={options('Дневник', 2)} />
    <Tabs.Screen name="plan" options={options('План', 3)} />
    <Tabs.Screen name="help" options={options('Помощь', 4)} />
  </Tabs>;
}
