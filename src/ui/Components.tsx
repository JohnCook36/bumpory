import type { ReactNode } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, type TextStyle, type ViewStyle, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette, radius, space, type } from '@/theme/tokens';

export function Screen({ children }: { children: ReactNode }) {
  return <SafeAreaView style={{ flex: 1, backgroundColor: palette.canvas }} edges={['top', 'left', 'right']}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: space.xl, paddingBottom: 42, gap: space.lg }}>{children}</ScrollView>
  </SafeAreaView>;
}

export function Heading({ children }: { children: ReactNode }) {
  return <Text style={{ fontSize: type.hero, color: palette.ink, fontWeight: '700', letterSpacing: -0.8 }}>{children}</Text>;
}

export function Subheading({ children }: { children: ReactNode }) {
  return <Text style={{ fontSize: type.section, color: palette.ink, fontWeight: '700' }}>{children}</Text>;
}

export function Body({ children, muted = false, style }: { children: ReactNode; muted?: boolean; style?: TextStyle }) {
  return <Text style={[{ color: muted ? palette.muted : palette.ink, fontSize: type.body, lineHeight: 24 }, style]}>{children}</Text>;
}

export function Card({ children, tint, style }: { children: ReactNode; tint?: string; style?: ViewStyle }) {
  return <View style={[{ padding: space.xl, borderRadius: radius.lg, backgroundColor: tint ?? palette.paper, gap: space.md, borderWidth: tint ? 0 : 1, borderColor: palette.border }, style]}>{children}</View>;
}

export function Action({ title, onPress, secondary = false, danger = false, disabled = false }: { title: string; onPress: () => void; secondary?: boolean; danger?: boolean; disabled?: boolean }) {
  const bg = danger ? palette.danger : secondary ? palette.roseSoft : palette.plum;
  return <TouchableOpacity disabled={disabled} accessibilityRole="button" onPress={onPress} activeOpacity={0.8} style={{ backgroundColor: bg, opacity: disabled ? 0.5 : 1, borderRadius: 18, paddingVertical: 15, paddingHorizontal: 18, alignItems: 'center', minHeight: 52, justifyContent: 'center' }}>
    <Text style={{ color: secondary ? palette.plum : '#FFFFFF', fontSize: 16, fontWeight: '700' }}>{title}</Text>
  </TouchableOpacity>;
}

export function Field(props: TextInputProps & { label: string }) {
  return <View style={{ gap: 8 }}>
    <Text style={{ fontWeight: '700', color: palette.ink }}>{props.label}</Text>
    <TextInput {...props} placeholderTextColor={palette.muted} style={[{ borderWidth: 1, borderColor: palette.border, backgroundColor: palette.paper, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, color: palette.ink, fontSize: 16, minHeight: 52 }, props.style]} />
  </View>;
}

export function Wordmark() {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <View style={{ height: 33, width: 33, backgroundColor: palette.roseSoft, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: palette.rose, fontSize: 19, fontWeight: '700' }}>♥</Text>
    </View>
    <Text style={{ fontSize: 23, fontWeight: '800', letterSpacing: -1, color: palette.plum }}>bumpory.</Text>
  </View>;
}
