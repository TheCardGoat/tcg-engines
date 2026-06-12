import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aliceTeaAlchemistI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Alice",
    version: "Tea Alchemist",
    text: [
      {
        title: "CURIOUSER AND CURIOUSER",
        description:
          "{E} — Exert chosen opposing character and all other opposing characters with the same name.",
      },
    ],
  },
  de: {
    name: "Alice",
    version: "Tee Alchemistin",
    text: [
      {
        title: "DAS WIRD JA IMMER ULKIGER",
        description:
          "— Erschöpfe einen gegnerischen Charakter deiner Wahl und alle gegnerischen Charaktere mit dem gleichen Namen.",
      },
    ],
  },
  fr: {
    name: "Alice",
    version: "Alchimiste théinée",
    text: [
      {
        title: "TRÈS TRÈS CURIEUX",
        description:
          "— Choisissez un personnage adverse et épuisez-le, ainsi que tous les personnages adverses du même nom.",
      },
    ],
  },
  it: {
    name: "Alice",
    version: "Alchimista del Tè",
    text: [
      {
        title: "È SEMPRE PIÙ CURIOSO",
        description:
          "— Impegna un personaggio avversario a tua scelta e tutti gli altri personaggi avversari con lo stesso nome.",
      },
    ],
  },
};
