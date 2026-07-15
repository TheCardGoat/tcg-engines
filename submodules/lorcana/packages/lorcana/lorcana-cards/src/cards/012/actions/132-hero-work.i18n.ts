import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const heroWorkI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hero Work",
    text: 'Your characters get +1 {S} this turn. Your Hero characters gain "Whenever this character challenges another character, each opponent loses 1 lore and you gain 1 lore" this turn.',
  },
  de: {
    name: "Heldenarbeit",
    text: 'Deine Charaktere erhalten in diesem Zug +1 {S}. Deine Helden erhalten in diesem Zug "Jedes Mal, wenn dieser Charakter einen anderen Charakter herausfordert, verlieren alle gegnerischen Mitspielenden je 1 Legende und du sammelst 1 Legende".',
  },
  fr: {
    name: "Super-héroïsme",
    text: "Vos personnages gagnent +1 {S} pour le reste de ce tour. Vos personnages Héros gagnent « Chaque fois que ce personnage en défie un autre, chaque adversaire perd 1 éclat de Lore et vous gagnez 1 éclat de Lore. » pour le reste de ce tour.",
  },
  it: {
    name: "Lavoro da Eroi",
    text: 'I tuoi personaggi ricevono +1 {S} per questo turno. I tuoi personaggi Eroe ottengono "Ogni volta che questo personaggio sfida un altro personaggio, ogni avversario perde 1 leggenda e tu ottieni 1 leggenda" per questo turno.',
  },
};
