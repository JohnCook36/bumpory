import { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { deleteEntry, getEntry, getLmp, saveEntry } from '@/data/database';
import { deleteLocalPhoto, savePickedPhoto } from '@/data/photos';
import { calculatePregnancy } from '@/domain/pregnancy';
import { Action, Body, Field, Heading, Screen } from '@/ui/Components';
import { palette } from '@/theme/tokens';

export default function EntryScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [week, setWeek] = useState(5);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string>(new Date().toISOString());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (id) {
        const entry = await getEntry(id);
        if (entry && active) {
          setWeek(entry.week); setNote(entry.note); setPhoto(entry.photo_uri); setCreatedAt(entry.created_at);
        }
      } else {
        const lmp = await getLmp();
        if (active && lmp) setWeek(calculatePregnancy(lmp).currentWeek);
      }
    })().catch(() => Alert.alert('Ошибка', 'Не удалось загрузить запись.'));
    return () => { active = false; };
  }, [id]);

  const choosePhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1, allowsEditing: false });
    if (!res.canceled && res.assets[0]) setPicked(res.assets[0].uri);
  };

  const save = async () => {
    if (!note.trim() && !picked && !photo) { Alert.alert('Пустая запись', 'Добавьте текст или фотографию.'); return; }
    setBusy(true);
    let newUri: string | null = null;
    try {
      newUri = picked ? savePickedPhoto(picked) : photo;
      await saveEntry({
        id: id || `j-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        week, note: note.trim(), photo_uri: newUri, created_at: createdAt
      });
      if (picked && photo) deleteLocalPhoto(photo);
      router.back();
    } catch {
      if (picked) deleteLocalPhoto(newUri);
      Alert.alert('Не удалось сохранить', 'Запись не сохранена. Попробуйте ещё раз.');
    } finally { setBusy(false); }
  };

  const remove = () => {
    if (!id) return;
    Alert.alert('Удалить запись?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: async () => {
        try {
          await deleteEntry(id);
          deleteLocalPhoto(photo);
          router.back();
        } catch { Alert.alert('Ошибка', 'Не удалось удалить запись.'); }
      } },
    ]);
  };

  return <Screen>
    <TouchableOpacity accessibilityRole="button" onPress={() => router.back()}>
      <Text style={{ color: palette.plum, fontSize: 16 }}>‹ Вернуться</Text>
    </TouchableOpacity>
    <Heading>{id ? 'Моё воспоминание' : 'Новая запись'}</Heading>
    <Body muted>Можно вернуться к любой неделе и написать о ней позже.</Body>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Предыдущая неделя" onPress={() => setWeek(w => Math.max(1, w - 1))} style={{ padding: 12, backgroundColor: palette.roseSoft, borderRadius: 12 }}>
        <Text style={{ fontSize: 22, color: palette.plum }}>−</Text>
      </TouchableOpacity>
      <Body>{week}-я неделя</Body>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Следующая неделя" onPress={() => setWeek(w => Math.min(42, w + 1))} style={{ padding: 12, backgroundColor: palette.roseSoft, borderRadius: 12 }}>
        <Text style={{ fontSize: 22, color: palette.plum }}>+</Text>
      </TouchableOpacity>
    </View>
    <Field label="Что хочется запомнить?" multiline textAlignVertical="top" value={note} onChangeText={setNote} placeholder="Сегодня я почувствовала..." maxLength={5000} style={{ minHeight: 190, paddingTop: 16 }} />
    {(picked || photo) && <Image source={{ uri: picked || photo || '' }} style={{ height: 230, width: '100%', borderRadius: 20 }} resizeMode="contain" accessibilityLabel="Выбранная фотография" />}
    <Action title={picked || photo ? 'Заменить фото' : '+ Добавить фотографию'} secondary onPress={() => { void choosePhoto(); }} />
    <Action title={busy ? 'Сохраняем...' : 'Сохранить воспоминание'} onPress={() => { void save(); }} disabled={busy} />
    {id && <Action danger title="Удалить запись" onPress={remove} />}
  </Screen>;
}
