import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const poisonedAppleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Poisoned Apple",
    text: [
      {
        title: "TAKE A BITE... 1",
        description:
          "{I}, Banish this item — Exert chosen character. If a Princess character is chosen, banish her instead.",
      },
    ],
  },
  de: {
    name: "Vergifteter Apfel",
    text: [
      {
        title: "BEISS MAL AB... 1,",
        description:
          "Verbanne diesen Gegenstand — erschöpfe einen Charakter deiner Wahl. Wenn du eine Prinzessin wählst, verbanne sie stattdessen.",
      },
    ],
  },
  fr: {
    name: "POMME EMPOISONNÉE",
    text: [
      {
        title: "CROQUE... 1,",
        description:
          "Bannissez cet objet — Choisissez un personnage et épuisez-le. Si c'est une Princesse, bannissez-la à la place.",
      },
    ],
  },
  it: {
    name: "Poisoned Apple",
    text: [
      {
        title: "TAKE A BITE... 1,",
        description:
          "Banish this item — Exert chosen character. If a Princess character is chosen, banish her instead.",
      },
    ],
  },
};
