import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princeNaveenUkulelePlayerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince Naveen",
    version: "Ukulele Player",
    text: [
      {
        title: "Singer 6",
      },
      {
        title: "IT'S BEAUTIFUL, NO?",
        description:
          "When you play this character, you may play a song with cost 6 or less for free.",
      },
    ],
  },
  de: {
    name: "Prinz Naveen",
    version: "Ukulelespieler",
    text: [
      {
        title: "Singen 6",
      },
      {
        title: "SCHÖN, NICHT WAHR?",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du ein Lied, das 6 oder weniger kostet, kostenlos ausspielen.",
      },
    ],
  },
  fr: {
    name: "Prince Naveen",
    version: "Joueur de ukulélé",
    text: [
      {
        title: "Mélomane 6",
      },
      {
        title: "C'EST MERVEILLEUX, NON?",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez jouer gratuitement une carte Chanson coûtant 6 ou moins.",
      },
    ],
  },
  it: {
    name: "Principe Naveen",
    version: "Suonatore di Ukulele",
    text: [
      {
        title: "Melodioso 6",
      },
      {
        title:
          "È BELLISSIMA, NO? Quando giochi questo personaggio, puoi giocare una canzone con costo 6 o inferiore gratis.",
      },
    ],
  },
};
