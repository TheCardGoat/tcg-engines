import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const henWenPropheticPigI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hen Wen",
    version: "Prophetic Pig",
    text: [
      {
        title: "FUTURE SIGHT",
        description:
          "Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      },
    ],
  },
  de: {
    name: "Hen Wen",
    version: "Hellseherisches Schwein",
    text: [
      {
        title: "BLICK IN DIE ZUKUNFT",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, schaue dir die oberste Karte deines Decks an. Lege sie anschließend entweder auf dein Deck oder darunter.",
      },
    ],
  },
  fr: {
    name: "Tirelire",
    version: "Cochon oracle",
    text: [
      {
        title: "VISION DU FUTUR",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, regardez la carte du dessus de votre pioche. Remettez-la soit sur le dessus de votre pioche, soit en dessous.",
      },
    ],
  },
  it: {
    name: "Ewy",
    version: "Maialina Profetica",
    text: [
      {
        title: "PREVEGGENZA",
        description:
          "Ogni volta che questo personaggio va all'avventura, guarda la prima carta del tuo mazzo. Mettila o in cima o in fondo al tuo mazzo.",
      },
    ],
  },
};
