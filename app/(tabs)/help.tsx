import { Alert, Linking, Text } from 'react-native';
import { Action, Body, Card, Heading, Screen, Subheading } from '@/ui/Components';
import { palette } from '@/theme/tokens';

async function call(number: string) {
  const url = `tel:${number}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Не удалось открыть набор номера', `Наберите ${number} в приложении телефона.`);
  }
}

export default function HelpScreen() {
  return <Screen>
    <Heading>Помощь рядом</Heading>
    <Body muted>Справочник не определяет, насколько опасен именно ваш симптом. Если что-то тревожит, обращайтесь к медицинским специалистам.</Body>
    <Card tint={palette.dangerSoft}>
      <Text style={{ color: palette.danger, fontWeight: '800', fontSize: 18 }}>Экстренная ситуация</Text>
      <Body>При сильном кровотечении, обмороке, судорогах, выраженной одышке, боли в груди или сильной непрекращающейся боли в животе – немедленно обратитесь за экстренной помощью.</Body>
      <Action title="Позвонить 112" danger onPress={() => { void call('112'); }} />
      <Action title="Скорая помощь – 103 (Россия)" secondary onPress={() => { void call('103'); }} />
    </Card>
    <Card>
      <Subheading>Когда не стоит ждать</Subheading>
      <Body>Сильная или не проходящая головная боль, изменения зрения, высокая температура, подтекание жидкости, а на соответствующих сроках – уменьшение привычных шевелений плода требуют оперативной медицинской оценки.</Body>
      <Body muted>Не полагайтесь на приложение, если у вас есть тревожные симптомы. Свяжитесь с медицинской организацией даже при отсутствии признака в списке.</Body>
    </Card>
    <Card tint={palette.plumSoft}>
      <Subheading>Ваш врач</Subheading>
      <Body>Сохраните номер своей женской консультации в контактах телефона, чтобы он был под рукой и вне приложения.</Body>
    </Card>
    <Body muted style={{ fontSize: 12 }}>Телефоны 112 и 103 указаны для России. В других странах номера экстренных служб отличаются. Содержание ожидает медицинской рецензии до публичного запуска.</Body>
  </Screen>;
}
