import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const naveensUkuleleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Naveen's Ukulele",
    text: [
      {
        title: "MAKE IT SING 1",
        description:
          "{I}, Banish this item — Chosen character counts as having +3 cost to sing songs this turn.",
      },
    ],
  },
  de: {
    name: "Naveens Ukulele",
    text: [
      {
        title: "Lass sie Singen",
        description:
          "1 {I}, Verbanne diesen Gegenstand — Wähle einen Charakter. Die Kosten jenes Charakters gelten in diesem Zug als +3 für das Singen von Liedern.",
      },
    ],
  },
  fr: {
    name: "Ukulele de Naveen",
    text: [
      {
        title: "Tires-en une mélodie",
        description:
          "1 {I}, bannissez cet objet — Choisissez un personnage qui compte comme ayant un coût de +3 pour chanter des chansons pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Ukulele di Naveen",
    text: [
      {
        title: "Fallo Cantare",
        description:
          "1 {I}, esilia questo oggetto — Un personaggio a tua scelta conta come se avesse costo +3 per cantare le canzoni per questo turno.",
      },
    ],
  },
};
