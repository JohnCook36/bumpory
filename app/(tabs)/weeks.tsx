import { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getLmp } from '@/data/database';
import { getWeekCard } from '@/data/weeks';
import { calculatePregnancy } from '@/domain/pregnancy';
import { Body, Card, Heading, Screen, Subheading } from '@/ui/Components';
import { palette } from '@/theme/tokens';

export default function WeeksScreen() {
  const [week, setWeek] = useState(5);
  const [actual, setActual] = useState(5);
  useFocusEffect(useCallback(() => {
    let active = true;
    getLmp().then(date => {
      if (!date || !active) return;
      const w = calculatePregnancy(date).currentWeek;
      setActual(w);
      setWeek(w);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []));

  const card = getWeekCard(week);
  return <Screen>
    <Heading>Неделя за неделей</Heading>
    <Body muted>Каждая неделя – часть вашей истории. Выберите любую, чтобы посмотреть материалы и дела.</Body>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 8 }}>
      {Array.from({ length: 42 }, (_, n) => n + 1).map(n =>
        <TouchableOpacity key={n} accessibilityRole="button" accessibilityLabel={`Неделя ${n}`} onPress={() => setWeek(n)} style={{
          minWidth: 55, padding: 15, borderRadius: 16, backgroundColor: n === week ? palette.plum : palette.paper,
          borderWidth: n === actual ? 2 : 1, borderColor: n === actual ? palette.rose : palette.border, alignItems: 'center',
        }}>
          <Text style={{ color: n === week ? '#fff' : palette.ink, fontWeight: '700' }}>{n}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
    <Card tint={palette.plumSoft}>
      <Body muted>НЕДЕЛЯ {week}</Body>
      <Subheading>{card.headline}</Subheading>
      <Body>{card.note}</Body>
    </Card>
    <Subheading>Задачи этой недели</Subheading>
    <Card>{card.tasks.map(t => <Body key={t.id}>• {t.title}</Body>)}</Card>
    {!card.reviewed && <Card tint={palette.roseSoft}>
      <Body style={{ fontWeight: '700' }}>Редакционная версия</Body>
      <Body muted>Подробные материалы о развитии ребёнка и медицинские сведения ещё не прошли экспертную проверку. Пока здесь только общие организационные подсказки.</Body>
    </Card>}
    <View style={{ height: 10 }} />
  </Screen>;
}
