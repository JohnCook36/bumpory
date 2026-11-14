import { useCallback, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { getEntries, type JournalEntry } from '@/data/database';
import { Action, Body, Card, Heading, Screen, Subheading } from '@/ui/Components';
import { palette } from '@/theme/tokens';

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  useFocusEffect(useCallback(() => {
    let active = true;
    getEntries().then(rows => { if (active) setEntries(rows); })
      .catch(() => Alert.alert('Ошибка дневника', 'Не удалось прочитать записи.'));
    return () => { active = false; };
  }, []));

  return <Screen>
    <Heading>Мой дневник</Heading>
    <Body muted>Здесь будут маленькие события, тёплые слова и фотографии, которые хочется сохранить.</Body>
    <Action title="+ Новая запись" onPress={() => router.push('/entry')} />
    {entries.length === 0 ?
      <Card tint={palette.roseSoft}>
        <Subheading>Первая страница ждёт вас</Subheading>
        <Body>Напишите, как вы узнали о беременности, или просто сохраните первое фото.</Body>
      </Card> :
      entries.map(e => <TouchableOpacity key={e.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/entry', params: { id: e.id } })}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: palette.plum, fontWeight: '700' }}>{e.week}-я неделя</Text>
            <Text style={{ color: palette.muted, fontSize: 12 }}>{e.created_at.slice(0, 10)}</Text>
          </View>
          {e.photo_uri && <Image source={{ uri: e.photo_uri }} accessibilityLabel="Фотография дневника" style={{ width: '100%', height: 190, borderRadius: 14 }} resizeMode="cover" />}
          <Body>{e.note || 'Фотография без подписи'}</Body>
          <Text style={{ color: palette.rose, fontWeight: '700' }}>Посмотреть и изменить →</Text>
        </Card>
      </TouchableOpacity>)
    }
    <Body muted style={{ fontSize: 12 }}>Записи хранятся только на устройстве. Не удаляйте приложение, пока не появится функция резервного копирования.</Body>
  </Screen>;
}
