import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { getLmp, saveLmp } from '@/data/database';
import { calculatePregnancy } from '@/domain/pregnancy';
import { Action, Body, Card, Field, Heading, Screen, Subheading } from '@/ui/Components';
import { palette } from '@/theme/tokens';

export default function SettingsScreen() {
  const [date, setDate] = useState('');
  useEffect(() => { getLmp().then(v => setDate(v || '')).catch(() => undefined); }, []);

  const save = async () => {
    try {
      calculatePregnancy(date);
      await saveLmp(date);
      Alert.alert('Срок обновлён', 'Записи дневника остаются привязанными к ранее выбранным неделям.');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Проверьте дату', error instanceof Error ? error.message : 'Не удалось сохранить.');
    }
  };
  return <Screen>
    <TouchableOpacity accessibilityRole="button" onPress={() => router.back()}>
      <Text style={{ color: palette.plum, fontSize: 16 }}>‹ Назад</Text>
    </TouchableOpacity>
    <Heading>Настройки</Heading>
    <Card>
      <Subheading>Мой срок</Subheading>
      <Body muted>Первый день последней менструации, формат ГГГГ-ММ-ДД. Изменение даты влияет на текущую неделю, но не переносит уже созданные записи дневника.</Body>
      <Field label="Дата" placeholder="ГГГГ-ММ-ДД" value={date} onChangeText={setDate} maxLength={10} keyboardType="numbers-and-punctuation" />
      <Action title="Сохранить дату" onPress={() => { void save(); }} />
    </Card>
    <Card tint={palette.roseSoft}>
      <Subheading>Конфиденциальность</Subheading>
      <Body>Данные пока хранятся локально. Шифрование фотографий и резервное копирование ещё не реализованы. Не используйте эту тестовую сборку для хранения единственной копии важных снимков.</Body>
    </Card>
    <Body muted style={{ fontSize: 12 }}>Bumpory v0.1 • ознакомительная сборка</Body>
  </Screen>;
}
