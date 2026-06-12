import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const safetyRopeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Safety Rope",
    text: [
      {
        title: "GRAB HOLD!",
        description:
          "When you play this item, you may put a character card from your discard on the top of your deck.",
      },
      {
        title: "PACK IT UP",
        description: "At the end of your turn, you may banish this item to draw a card.",
      },
    ],
  },
  de: {
    name: "Sicherungsseil",
    text: [
      {
        title: "Festhalten!",
        description:
          "Wenn du diesen Gegenstand ausspielst, darfst du 1 Charakterkarte aus deinem Ablagestapel zurück auf dein Deck legen.",
      },
      {
        title: "Pack es ein",
        description:
          "Am Ende deines Zuges darfst du diesen Gegenstand verbannen, um 1 Karte zu ziehen.",
      },
    ],
  },
  fr: {
    name: "Corde de sécurité",
    text: [
      {
        title: "Accroche-toi!",
        description:
          "Lorsque vous jouez cet objet, vous pouvez placer sur votre pioche une carte Personnage de votre défausse.",
      },
      {
        title: "Range ça",
        description: "À la fin de votre tour, vous pouvez bannir cet objet pour piocher une carte.",
      },
    ],
  },
  it: {
    name: "Fune di Sicurezza",
    text: [
      {
        title: "Afferrala!",
        description:
          "Quando giochi questo oggetto, puoi mettere una carta personaggio dai tuoi scarti in cima al tuo mazzo.",
      },
      {
        title: "Mettila Via",
        description: "Alla fine del tuo turno, puoi esiliare questo oggetto per pescare una carta.",
      },
    ],
  },
};
