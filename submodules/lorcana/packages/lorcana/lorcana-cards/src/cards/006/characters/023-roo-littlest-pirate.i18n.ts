import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rooLittlestPirateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Roo",
    version: "Littlest Pirate",
    text: [
      {
        title: "I'M",
        description:
          "A PIRATE TOO! When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Ruh",
    version: "Jüngster Pirat",
    text: [
      {
        title: "Ich bin auch ein Pirat!",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -2 {S} geben.",
      },
    ],
  },
  fr: {
    name: "Petit Gourou",
    version: "Le plus petit des pirates",
    text: [
      {
        title: "Moi aussi, j'suis un pirate!",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage qui subit -2 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Ro",
    version: "Piccolissimo Pirata",
    text: [
      {
        title: "Anche io Sono un Pirata!",
        description:
          "Quando giochi questo personaggio, puoi dare a un personaggio a tua scelta -2 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
