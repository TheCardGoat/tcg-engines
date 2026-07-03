import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const motherGothelEvilAsEverI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mother Gothel",
    version: "Evil as Ever",
    text: [
      {
        title: "MUMMY'S BACK",
        description:
          "During your turn, when you discard this card, you may play this character from your discard. (You pay all costs.)",
      },
    ],
  },
  de: {
    name: "Mutter Gothel",
    version: "Böse wie eh und je",
    text: [
      {
        title: "Mama ist zurück",
        description:
          "Wenn du diese Karte in deinem Zug abwirfst, darfst du sie von deinem Ablagestapel ausspielen. (Du bezahlst dabei alle Kosten.)",
      },
    ],
  },
  fr: {
    name: "Mère Gothel",
    version: "Plus maléfique que jamais",
    text: [
      {
        title: "Maman est de retour",
        description:
          "Durant votre tour, lorsque vous défaussez cette carte, vous pouvez jouer ce personnage depuis votre défausse. (Vous payez tous ses coûts.)",
      },
    ],
  },
  it: {
    name: "Madre Gothel",
    version: "Malvagia Come Sempre",
    text: [
      {
        title: "La Mamma È Tornata",
        description:
          "Durante il tuo turno, quando scarti questa carta, puoi giocare questo personaggio dai tuoi scarti. (Paga tutti i costi.)",
      },
    ],
  },
};
