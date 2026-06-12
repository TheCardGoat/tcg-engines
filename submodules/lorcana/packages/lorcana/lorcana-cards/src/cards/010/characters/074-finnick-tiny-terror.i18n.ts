import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const finnickTinyTerrorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Finnick",
    version: "Tiny Terror",
    text: [
      {
        title: "YOU BETTER RUN",
        description:
          "When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.",
      },
    ],
  },
  de: {
    name: "Finnick",
    version: "Kleiner Schrecken",
    text: [
      {
        title: "LAUF LIEBER WEG",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 2 bezahlen, um einen gegnerischen Charakter deiner Wahl, mit 2 oder weniger, zurück auf die zugehörige Hand zu schicken.",
      },
    ],
  },
  fr: {
    name: "Finnick",
    version: "Petite terreur",
    text: [
      {
        title: "TU FERAIS MIEUX DE DÉGUERPIR",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez payer 2 pour choisir un personnage adverse ayant 2 ou moins et le renvoyer dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Finnick",
    version: "Minuscolo Terrore",
    text: [
      {
        title: "MEGLIO SE SCAPPI",
        description:
          "Quando giochi questo personaggio, puoi pagare 2 per far riprendere in mano al suo giocatore un personaggio avversario a tua scelta con 2 o inferiore.",
      },
    ],
  },
};
