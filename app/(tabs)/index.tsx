import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { getLmp, getTaskDone } from '@/data/database';
import { getWeekCard } from '@/data/weeks';
import { calculatePregnancy, type PregnancyProgress } from '@/domain/pregnancy';
import { Action, Body, Card, Heading, Screen, Subheading, Wordmark } from '@/ui/Components';
import { palette } from '@/theme/tokens';

function displayDate(iso: string) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export default function TodayScreen() {
  const [progress, setProgress] = useState<PregnancyProgress | null>(null);
  const [complete, setComplete] = useState(false);

  useFocusEffect(useCallback(() => {
    let mounted = true;
    (async () => {
      const lmp = await getLmp();
      if (!lmp) { router.replace('/onboarding'); return; }
      try {
        const next = calculatePregnancy(lmp);
        if (mounted) setProgress(next);
        const card = getWeekCard(next.currentWeek);
        if (card.tasks[0]) {
          const done = await getTaskDone(`week:${next.currentWeek}:${card.tasks[0].id}`);
          if (mounted) setComplete(done);
        }
      } catch {
        router.replace('/settings');
      }
    })().catch(() => { if (mounted) router.replace('/settings'); });
    return () => { mounted = false; };
  }, []));

  const weekCard = progress ? getWeekCard(progress.currentWeek) : null;
  return <Screen>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Wordmark />
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Настройки" onPress={() => router.push('/settings')}>
        <Text style={{ fontSize: 24, color: palette.plum }}>⚙</Text>
      </TouchableOpacity>
    </View>
    <Body muted>Сегодня – ещё один день вашей истории</Body>
    {progress ? <>
      <Card tint={palette.plumSoft}>
        <Text style={{ color: palette.plum, fontWeight: '700', fontSize: 14 }}>ВАШ СРОК</Text>
        <Heading>{progress.completedWeeks} недель {progress.dayInWeek} дней</Heading>
        <Body>Сейчас идёт {progress.currentWeek}-я неделя</Body>
        <View style={{ height: 8, backgroundColor: '#E3D4E6', borderRadius: 12, overflow: 'hidden' }}>
          <View style={{ backgroundColor: palette.plum, height: 8, width: `${Math.min(100, progress.gestationalDays / 280 * 100)}%` }} />
        </View>
        <Body muted style={{ fontSize: 13 }}>Ориентировочная дата родов – {displayDate(progress.dueDate)}. Срок предварительный.</Body>
      </Card>
      <View style={{ gap: 10 }}>
        <Subheading>{weekCard?.headline}</Subheading>
        <Body>{weekCard?.note}</Body>
      </View>
      <Card>
        <Subheading>Одно небольшое дело</Subheading>
        <Text style={{ fontSize: 16, color: palette.ink }}>{complete ? '✓  ' : '○  '}{weekCard?.tasks[0]?.title}</Text>
        <Action title="Открыть план недели" secondary onPress={() => router.push('/(tabs)/plan')} />
      </Card>
      <Card tint={palette.roseSoft}>
        <Subheading>Моя история</Subheading>
        <Body>Что запомнилось вам сегодня? Сохраните небольшой момент для себя и малыша.</Body>
        <Action title="Добавить запись в дневник" onPress={() => router.push('/entry')} />
      </Card>
      <Action title="Нужна медицинская помощь?" danger onPress={() => router.push('/(tabs)/help')} />
    </> : <Body muted>Загружаем вашу неделю...</Body>}
    <Body muted style={{ fontSize: 12 }}>Материалы носят информационный характер и не заменяют консультацию врача.</Body>
  </Screen>;
}
