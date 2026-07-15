import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mortyFieldmouseTinyTimI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Morty Fieldmouse",
    version: "Tiny Tim",
    text: [
      {
        title: "HOLIDAY SPIRIT",
        description:
          "Once during your turn, whenever you put a card under one of your other characters, put the top card of your deck facedown under this character.",
      },
      {
        title: "HOLIDAY CHEER",
        description: "This character gets +1 {L} for each card under him.",
      },
    ],
  },
  de: {
    name: "Morty Maus",
    version: "kleiner Tim",
    text: [
      {
        title: "Festtagsgeist",
        description:
          "Einmal während deines Zuges, wenn du eine Karte unter einen deiner anderen Charaktere legst, lege die oberste Karte deines Decks verdeckt unter diesen Charakter.",
      },
      {
        title: "Urlaubsstimmung",
        description: "Dieser Charakter erhält für jede Karte unter ihm +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Jojo",
    version: "Tiny Tim",
    text: [
      {
        title: "Esprit des fêtes",
        description:
          "Une fois durant votre tour, lorsque vous placez une carte sous l'un de vos autres personnages, placez la carte du dessus de votre pioche, face cachée, sous ce personnage-ci.",
      },
      {
        title: "Ambiance des fêtes",
        description: "Ce personnage gagne +1 {L} pour chaque carte sous lui.",
      },
    ],
  },
  it: {
    name: "Tip",
    version: "Il Piccolo Tim",
    text: [
      {
        title: "Spirito Festivo",
        description:
          "Una volta durante il tuo turno, ogni volta che metti una carta sotto a uno dei tuoi altri personaggi, metti la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.",
      },
      {
        title: "Allegria Natalizia",
        description: "Questo personaggio riceve +1 {L} per ogni carta sotto di sé.",
      },
    ],
  },
};
