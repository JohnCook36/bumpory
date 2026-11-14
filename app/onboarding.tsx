import { useState } from 'react';
import { Alert, View } from 'react-native';
import { router } from 'expo-router';
import { saveLmp } from '@/data/database';
import { calculatePregnancy, todayLocal } from '@/domain/pregnancy';
import { Action, Body, Card, Field, Heading, Screen, Subheading, Wordmark } from '@/ui/Components';
import { palette } from '@/theme/tokens';

export default function Onboarding() {
  const [date, setDate] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    try {
      calculatePregnancy(date.trim(), todayLocal());
      setBusy(true);
      await saveLmp(date.trim());
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Проверьте дату', error instanceof Error ? error.message : 'Не удалось сохранить дату.');
    } finally {
      setBusy(false);
    }
  };

  return <Screen>
    <Wordmark />
    <View style={{ height: 24 }} />
    <Heading>Рядом с первых недель</Heading>
    <Body muted>Поможем следить за делами, узнавать новое и сохранять важные воспоминания.</Body>
    <Card tint={palette.plumSoft}>
      <Subheading>Начнём с даты</Subheading>
      <Body>Укажите первый день последней менструации. Программа рассчитает предварительный акушерский срок.</Body>
      <Field label="Первый день последней менструации" value={date} onChangeText={setDate} placeholder="ГГГГ-ММ-ДД" keyboardType="numbers-and-punctuation" maxLength={10} autoCapitalize="none" />
      <Body muted style={{ fontSize: 13 }}>Если срок неизвестен или установлен врачом иначе, его уточнение нужно обсудить со специалистом.</Body>
    </Card>
    <Action title={busy ? 'Сохраняем...' : 'Продолжить'} onPress={save} disabled={busy} />
    <Card>
      <Body muted>Ваши записи и фотографии сохраняются на этом устройстве. Регистрация и доступ к интернету не требуются.</Body>
      <Body muted style={{ fontSize: 13 }}>Bumpory не определяет диагноз и не заменяет медицинское наблюдение.</Body>
    </Card>
  </Screen>;
}
