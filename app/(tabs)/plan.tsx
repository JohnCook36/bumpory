import { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getLmp, getTaskDone, setTaskDone } from '@/data/database';
import { getWeekCard } from '@/data/weeks';
import { calculatePregnancy } from '@/domain/pregnancy';
import { Body, Card, Heading, Screen, Subheading } from '@/ui/Components';
import { palette } from '@/theme/tokens';

export default function PlanScreen() {
  const [week, setWeek] = useState(5);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (w: number) => {
    const tasks = getWeekCard(w).tasks;
    const results = await Promise.all(tasks.map(t => getTaskDone(`week:${w}:${t.id}`)));
    setDone(Object.fromEntries(tasks.map((t, i) => [t.id, results[i]])));
  }, []);

  useFocusEffect(useCallback(() => {
    let active = true;
    getLmp().then(date => {
      if (!date || !active) return;
      const w = calculatePregnancy(date).currentWeek;
      if (active) { setWeek(w); void load(w).catch(() => Alert.alert('Ошибка', 'Не удалось загрузить задачи.')); }
    }).catch(() => undefined);
    return () => { active = false; };
  }, [load]));

  const switchWeek = (next: number) => {
    setWeek(next);
    setDone({});
    void load(next).catch(() => Alert.alert('Ошибка', 'Не удалось загрузить задачи.'));
  };

  const toggle = async (id: string) => {
    if (loading) return;
    const value = !done[id];
    setLoading(true);
    try {
      await setTaskDone(`week:${week}:${id}`, value);
      setDone(old => ({ ...old, [id]: value }));
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить изменение.');
    } finally { setLoading(false); }
  };

  return <Screen>
    <Heading>Мой план</Heading>
    <Body muted>Небольшие организационные задачи. Конкретный план медицинского наблюдения устанавливает ваш врач.</Body>
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Предыдущая неделя" onPress={() => switchWeek(Math.max(1, week - 1))}>
        <Text style={{ padding: 12, fontSize: 23, color: palette.plum }}>‹</Text>
      </TouchableOpacity>
      <Subheading>{week}-я неделя</Subheading>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Следующая неделя" onPress={() => switchWeek(Math.min(42, week + 1))}>
        <Text style={{ padding: 12, fontSize: 23, color: palette.plum }}>›</Text>
      </TouchableOpacity>
    </View>
    {getWeekCard(week).tasks.map(t => <TouchableOpacity key={t.id} accessibilityRole="checkbox" accessibilityState={{ checked: done[t.id] === true }} onPress={() => { void toggle(t.id); }}>
      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: palette.plum, fontSize: 23 }}>{done[t.id] ? '☑' : '☐'}</Text>
        <View style={{ flex: 1 }}><Body style={{ textDecorationLine: done[t.id] ? 'line-through' : 'none' }}>{t.title}</Body></View>
      </Card>
    </TouchableOpacity>)}
    <Card tint={palette.sageSoft}><Body>Совет: сохраняйте на приёме точные даты обследований и вопросы к специалисту. Их не следует заменять автоматическим календарём.</Body></Card>
  </Screen>;
}
