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
        title: "FESTTAGSGEIST",
        description:
          "Einmal während deines Zuges, wenn du eine Karte unter einen deiner anderen Charaktere legst, lege die oberste Karte deines Decks verdeckt unter diesen Charakter.",
      },
      {
        title: "URLAUBSSTIMMUNG",
        description: "Dieser Charakter erhält für jede Karte unter ihm +1.",
      },
    ],
  },
  fr: {
    name: "Jojo",
    version: "Tiny Tim",
    text: [
      {
        title: "ESPRIT DES FÊTES",
        description:
          "Une fois durant votre tour, lorsque vous placez une carte sous l'un de vos autres personnages, placez la carte du dessus de votre pioche, face cachée, sous ce personnage-ci.",
      },
      {
        title: "AMBIANCE DES FÊTES",
        description: "Ce personnage gagne +1 pour chaque carte sous lui.",
      },
    ],
  },
  it: {
    name: "Tip",
    version: "Il Piccolo Tim",
    text: [
      {
        title: "SPIRITO FESTIVO",
        description:
          "Una volta durante il tuo turno, ogni volta che metti una carta sotto a uno dei tuoi altri personaggi, metti la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.",
      },
      {
        title: "ALLEGRIA NATALIZIA",
        description: "Questo personaggio riceve +1 per ogni carta sotto di sé.",
      },
    ],
  },
};
