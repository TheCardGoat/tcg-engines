import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const omnidroidUltimateIterationI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Omnidroid",
    version: "Ultimate Iteration",
    text: [
      {
        title: "<Shift> 6 {I}",
      },
      {
        title: "<Resist> +2",
      },
      {
        title: "Return on Investment",
        description:
          "When you shift this character, you may return all cards under it to your hand.",
      },
    ],
  },
  de: {
    name: "Omnidroid",
    version: "Ultimative Version",
    text: [
      {
        title:
          "<Gestaltwandel> 6 {I} (Du kannst 6 {I} zahlen, um diesen Charakter auf einen deiner Charaktere namens Omnidroid auszuspielen.)",
      },
      {
        title:
          "<Robust> +2 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
      {
        title: "Investitionsrendite",
        description:
          "Wenn du diesen Charakter gestaltwandelst, darfst du alle Karten unter ihm auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Omnidroïde",
    version: "Itération ultime",
    text: [
      {
        title:
          "<Alter> 6 {I} (Vous pouvez payer 6 {I} pour jouer ce personnage sur l'un de vos personnages nommé Omnidroïde.)",
      },
      {
        title: "<Résistance> +2",
      },
      {
        title: "Retour sur investissement",
        description:
          "Lorsque vous jouez ce personnage via sa capacité Alter, vous pouvez renvoyer dans votre main toutes les cartes sous lui.",
      },
    ],
  },
  it: {
    name: "Omnidroide",
    version: "Versione Definitiva",
    text: [
      {
        title:
          "<Trasformazione> 6 {I} (Puoi pagare 6 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Omnidroide.)",
      },
      {
        title: "<Resistere> +2",
      },
      {
        title: "Ritorno sull'Investimento",
        description:
          "Quando trasformi questo personaggio, puoi riprendere in mano tutte le carte sotto a esso.",
      },
    ],
  },
};
