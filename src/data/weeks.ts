export type WeekCard = { headline: string; note: string; tasks: { id: string; title: string }[]; reviewed: boolean };

const draftWeeks: Record<number, Pick<WeekCard, 'headline' | 'note' | 'tasks'>> = {
  5: { headline: 'Начало большой истории', note: 'Можно записать вопросы перед первым обращением к специалисту. Точные сроки наблюдения и обследований уточняйте у врача.', tasks: [{ id:'questions', title:'Составить вопросы врачу' }, { id:'contacts', title:'Сохранить контакты медицинской организации' }] },
  12: { headline: 'Время уточнить план наблюдения', note: 'Если вы наблюдаетесь в России, уточните у своего врача запланированные обследования первого триместра.', tasks: [{ id:'appointment', title:'Проверить записи на назначенные приёмы' }, { id:'questions', title:'Подготовить вопросы на консультацию' }] },
  20: { headline: 'Вторая половина пути', note: 'Запишите важные события этой недели и проверьте назначенные врачом встречи.', tasks: [{ id:'appointment', title:'Проверить календарь консультаций' }, { id:'memory', title:'Сохранить воспоминание в дневнике' }] },
  34: { headline: 'Готовимся к встрече', note: 'Уточните свой план медицинского наблюдения и практические вопросы организации родов.', tasks: [{ id:'contacts', title:'Уточнить контакты выбранного роддома' }, { id:'bag', title:'Составить список вещей для поездки' }] },
  38: { headline: 'Важные контакты под рукой', note: 'Обсудите с медицинским специалистом ваш индивидуальный план обращения за помощью.', tasks: [{ id:'contacts', title:'Проверить номера экстренных и медицинских служб' }, { id:'documents', title:'Подготовить необходимые документы' }] },
};

export function getWeekCard(week: number): WeekCard {
  if (!Number.isInteger(week) || week < 1 || week > 42) throw new Error('Неделя должна быть от 1 до 42.');
  const draft = draftWeeks[week];
  return draft
    ? { ...draft, reviewed: false }
    : { headline: 'Неделя ' + week, note: 'Материалы этой недели готовятся и ожидают проверки специалистом. Вы можете вести дневник и записывать вопросы врачу.', tasks: [{ id: 'questions', title: 'Записать вопросы для следующей консультации' }, { id: 'memory', title: 'Сохранить событие недели в дневнике' }], reviewed: false };
}
