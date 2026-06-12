import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pepaMadrigalWeatherMakerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pepa Madrigal",
    version: "Weather Maker",
    text: [
      {
        title: "IT LOOKS LIKE RAIN",
        description:
          "When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless they're at a location.",
      },
    ],
  },
  de: {
    name: "Pepa Madrigal",
    version: "Wettermacherin",
    text: [
      {
        title: "BRUNO KÜNDIGT REGEN AN",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen gegnerischen Charakter deiner Wahl erschöpfen. Wenn er nicht an einem Ort ist, wird er zu Beginn seines nächsten Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Pepa Madrigal",
    version: "Fait la pluie et le beau temps",
    text: [
      {
        title: "PRÉDIT UNE TEMPÊTE",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage adverse et l'épuiser. Il ne peut pas être redressé au début de son prochain tour, sauf s'il se trouve sur un lieu.",
      },
    ],
  },
  it: {
    name: "Pepa Madrigal",
    version: "Signora degli Elementi",
    text: [
      {
        title: "SEMBRA PIOVERE",
        description:
          "Quando giochi questo personaggio, puoi impegnare un personaggio avversario a tua scelta. Quel personaggio non si può preparare all'inizio del suo prossimo turno a meno che non si trovi in un luogo.",
      },
    ],
  },
};
