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
        title: "Das wird ja immer ulkiger",
        description:
          "{E} — Erschöpfe einen gegnerischen Charakter deiner Wahl und alle gegnerischen Charaktere mit dem gleichen Namen.",
      },
    ],
  },
  fr: {
    name: "Alice",
    version: "Alchimiste théinée",
    text: [
      {
        title: "Très très curieux",
        description:
          "{E} — Choisissez un personnage adverse et épuisez-le, ainsi que tous les personnages adverses du même nom.",
      },
    ],
  },
  it: {
    name: "Alice",
    version: "Alchimista del Tè",
    text: [
      {
        title: "È Sempre Più Curioso",
        description:
          "{E} — Impegna un personaggio avversario a tua scelta e tutti gli altri personaggi avversari con lo stesso nome.",
      },
    ],
  },
  es: {
    name: "Alicia",
    version: "Alquimista del té",
    text: [
      {
        title: "MÁS CURIOSO Y MÁS CURIOSO",
        description:
          "{E}: ejerce el personaje contrario elegido y todos los demás personajes contrarios con el mismo nombre.",
      },
    ],
  },
};
