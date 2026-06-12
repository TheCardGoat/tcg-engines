import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chipQuickThinkerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chip",
    version: "Quick Thinker",
    text: [
      {
        title: "I'LL HANDLE THIS",
        description: "When you play this character, chosen opponent chooses and discards a card.",
      },
    ],
  },
  de: {
    name: "Chip",
    version: "Schnelldenker",
    text: [
      {
        title: "ICH KÜMMERE MICH DARUM",
        description:
          "Wenn du diesen Charakter ausspielst, wählt eine gegnerische Person deiner Wahl 1 Karte aus ihrer Hand und wirft sie ab.",
      },
    ],
  },
  fr: {
    name: "Tic",
    version: "Vif d'esprit",
    text: [
      {
        title: "JE M'EN OCCUPE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un adversaire qui défausse une carte.",
      },
    ],
  },
  it: {
    name: "Cip",
    version: "Pronto all'Azione",
    text: [
      {
        title: "CI PENSO IO",
        description:
          "Quando giochi questo personaggio, un avversario a tua scelta sceglie e scarta una carta.",
      },
    ],
  },
};
