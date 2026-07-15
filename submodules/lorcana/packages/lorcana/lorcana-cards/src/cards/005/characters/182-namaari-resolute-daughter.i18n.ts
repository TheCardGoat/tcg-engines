import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const namaariResoluteDaughterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Namaari",
    version: "Resolute Daughter",
    text: [
      {
        title:
          "I DON'T HAVE ANY OTHER CHOICE For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character.",
      },
      {
        title: "Resist +3",
      },
    ],
  },
  de: {
    name: "Namaari",
    version: "Entschlossene Tochter",
    text: [
      {
        title: "Ich habe keine andere Wahl",
        description:
          "Für jeden gegnerischen Charakter, der in diesem Zug durch eine Herausforderung verbannt wurde, zahlst du 2 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title:
          "<Robust> +3 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 3.)",
      },
    ],
  },
  fr: {
    name: "Namaari",
    version: "Fille déterminée",
    text: [
      {
        title: "Je n'ai vraiment pas le choix",
        description:
          "Jouer ce personnage vous coûte 2 {I} de moins pour chaque personnage adverse banni via un défi ce tour-ci.",
      },
      {
        title: "<Résistance> +3",
      },
    ],
  },
  it: {
    name: "Namaari",
    version: "Figlia Risoluta",
    text: [
      {
        title: "Non Ho Davvero Altra Scelta",
        description:
          "Per ogni personaggio avversario esiliato in una sfida in questo turno, paga 2 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "<Resistere> +3",
      },
    ],
  },
};
