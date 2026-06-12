import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theFatesOnlyOneEyeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Fates",
    version: "Only One Eye",
    text: [
      {
        title: "ALL WILL BE SEEN",
        description: "When you play this character, look at the top card of each opponent's deck.",
      },
    ],
  },
  de: {
    name: "Die Schicksalsgöttinnen",
    version: "Nur ein Auge",
    text: [
      {
        title: "ALLES WIRD GESEHEN",
        description:
          "Wenn du diesen Charakter ausspielst, schaue dir die oberste Karte des Decks aller gegnerischen Mitspielenden an.",
      },
    ],
  },
  fr: {
    name: "Les Moires",
    version: "Œil unique",
    text: [
      {
        title: "NOUS VOYONS TOUT",
        description:
          "Lorsque vous jouez ce personnage, regardez la première carte de la pioche de chaque adversaire.",
      },
    ],
  },
  it: {
    name: "Le Parche",
    version: "Con un Solo Occhio",
    text: [
      {
        title: "ONNISCIENZA",
        description:
          "Quando giochi questo personaggio, guarda la prima carta del mazzo di ogni avversario.",
      },
    ],
  },
};
