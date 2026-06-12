import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const arielEtherealVoiceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ariel",
    version: "Ethereal Voice",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "COMMAND PERFORMANCE",
        description:
          "Once during your turn, whenever you play a song, if there's a card under this character, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Arielle",
    version: "Ätherische Stimme",
    text: [
      {
        title: "Stärken 1",
      },
      {
        title: "ANORDNUNG ZUM AUFTRITT",
        description:
          "Einmal während deines Zuges, wenn du ein Lied ausspielst und falls dieser Charakter mindestens eine Karte unter sich hat, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Ariel",
    version: "Voix éthérée",
    text: [
      {
        title: "Boost 1",
      },
      {
        title: "COMMANDE SPÉCIALE",
        description:
          "Une fois durant votre tour, lorsque vous jouez une chanson, s'il y a une carte sous ce personnage, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Ariel",
    version: "Voce Eterea",
    text: [
      {
        title: "Potenziamento 1",
      },
      {
        title: "RICHIESTA DI ESIBIZIONE",
        description:
          "Una volta durante il tuo turno, ogni volta che giochi una canzone, se c'è una carta sotto a questo personaggio, puoi pescare una carta.",
      },
    ],
  },
};
