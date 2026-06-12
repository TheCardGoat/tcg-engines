import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const iagoReappearingParrotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Iago",
    version: "Reappearing Parrot",
    text: [
      {
        title: "GUESS WHO",
        description:
          "When this character is banished in a challenge, return this card to your hand.",
      },
    ],
  },
  de: {
    name: "Jago",
    version: "Wiederauftauchender Papagei",
    text: [
      {
        title: "RATE MAL",
        description:
          "Wenn dieser Charakter durch eine Herausforderung verbannt wird, nimm ihn zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Iago",
    version: "Perroquet tenace",
    text: [
      {
        title: "DEVINE QUI C'EST",
        description: "Lorsque ce personnage est banni via un défi, renvoyez-le dans votre main.",
      },
    ],
  },
  it: {
    name: "Iago",
    version: "Pappagallo Ricomparso",
    text: [
      {
        title: "INDOVINA CHI C'È",
        description:
          "Quando questo personaggio viene esiliato in una sfida, riprendi in mano questa carta.",
      },
    ],
  },
};
