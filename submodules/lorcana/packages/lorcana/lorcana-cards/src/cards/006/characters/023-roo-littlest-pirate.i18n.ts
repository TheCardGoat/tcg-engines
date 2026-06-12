import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rooLittlestPirateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Roo",
    version: "Littlest Pirate",
    text: [
      {
        title: "I'M A PIRATE TOO!",
        description:
          "When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Ruh",
    version: "Jüngster Pirat",
    text: [
      {
        title: "ICH BIN AUCH EIN PIRAT!",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -2 geben.",
      },
    ],
  },
  fr: {
    name: "Petit Gourou",
    version: "Le plus petit des pirates",
    text: [
      {
        title: "MOI AUSSI, J'SUIS UN PIRATE!",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage qui subit -2 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Ro",
    version: "Piccolissimo Pirata",
    text: [
      {
        title: "ANCHE IO SONO UN PIRATA!",
        description:
          "Quando giochi questo personaggio, puoi dare a un personaggio a tua scelta -2 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
