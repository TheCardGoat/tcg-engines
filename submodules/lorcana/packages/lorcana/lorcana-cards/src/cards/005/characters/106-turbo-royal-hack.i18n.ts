import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const turboRoyalHackI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Turbo",
    version: "Royal Hack",
    text: [
      {
        title: "Rush",
      },
      {
        title: "GAME JUMP",
        description: "This character also counts as being named King Candy for Shift.",
      },
    ],
  },
  de: {
    name: "Turbo",
    version: "Königlicher Hack",
    text: [
      {
        title: "Rasant",
      },
      {
        title: "SPRUNG INS SPIEL",
        description:
          "Du kannst einen King-Candy-Charakter mit der Gestaltwandel-Fähigkeit auf diesen Charakter ausspielen.",
      },
    ],
  },
  fr: {
    name: "Turbo le Pilote",
    version: "Hack royal",
    text: [
      {
        title: "Charge",
      },
      {
        title: "SAUT DE JEU",
        description:
          "Lorsque vous utilisez une capacité Alter, ce personnage peut aussi être considéré comme un personnage nommé Sa Sucrerie.",
      },
    ],
  },
  it: {
    name: "Turbo",
    version: "Impostore Regale",
    text: [
      {
        title: "Lesto",
      },
      {
        title: "SCAMBIOGIOCHISTA",
        description:
          "Questo personaggio conta come se si chiamasse anche Re Candito per Trasformazione.",
      },
    ],
  },
};
