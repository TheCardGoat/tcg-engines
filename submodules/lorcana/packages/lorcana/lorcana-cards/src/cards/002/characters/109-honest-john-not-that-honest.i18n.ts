import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const honestJohnNotThatHonestI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Honest John",
    version: "Not That Honest",
    text: [
      {
        title: "EASY STREET",
        description: "Whenever you play a Floodborn character, each opponent loses 1 lore.",
      },
    ],
  },
  de: {
    name: "Ehrenwerter John",
    version: "Nicht sehr ehrenwert",
    text: [
      {
        title: "Gemachte Leute",
        description:
          "Jedes Mal, wenn du eine Flutgestalt ausspielst, verlieren alle gegnerischen Mitspielenden je 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Grand Coquin",
    version: "Porte bien son nom",
    text: [
      {
        title: "La belle vie",
        description:
          "Chaque fois que vous jouez un personnage Floodborn, chaque adversaire perd 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Honest John",
    version: "Not That Honest",
    text: [
      {
        title: "Easy Street",
        description: "Whenever you play a Floodborn character, each opponent loses 1 lore.",
      },
    ],
  },
  es: {
    name: "Juan honesto",
    version: "No tan honesto",
    text: [
      {
        title: "CALLE FÁCIL",
        description:
          "Siempre que juegas con un personaje Floodborn, cada oponente pierde 1 conocimiento.",
      },
    ],
  },
};
