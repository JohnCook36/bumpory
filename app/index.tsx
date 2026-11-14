import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';
import { getLmp } from '@/data/database';
import { palette } from '@/theme/tokens';
import { Wordmark, Body } from '@/ui/Components';

export default function InitialRoute() {
  useEffect(() => {
    let active = true;
    getLmp().then(lmp => { if (active) router.replace(lmp ? '/(tabs)' : '/onboarding'); })
      .catch(() => { if (active) router.replace('/onboarding'); });
    return () => { active = false; };
  }, []);
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, backgroundColor: palette.canvas }}>
    <Wordmark />
    <Body muted>Ваша история начинается здесь</Body>
    <ActivityIndicator color={palette.plum} />
  </View>;
}
