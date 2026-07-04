import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const maleficentFormidableQueenI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maleficent",
    version: "Formidable Queen",
    text: [
      {
        title: "Shift 6",
      },
      {
        title: "LISTEN WELL, ALL OF YOU",
        description:
          "When you play this character, for each of your characters named Maleficent in play, return a chosen opposing character, item, or location with cost 3 or less to their player's hand.",
      },
    ],
  },
  de: {
    name: "Malefiz",
    version: "Furchtbare Königin",
    text: [
      {
        title:
          "<Gestaltwandel> 6 (Du kannst 6 {I} zahlen, um diesen Charakter auf einen deiner Malefiz-Charaktere auszuspielen.)",
      },
      {
        title: "Alle, die ihr hier seid, hört mich an.",
        description:
          "Wenn du diesen Charakter ausspielst, schicke, für jeden deiner Malefiz-Charaktere im Spiel, je einen gegnerischen Charakter, Gegenstand oder Ort deiner Wahl, der 3 oder weniger kostet, auf die zugehörige Hand zurück.",
      },
    ],
  },
  fr: {
    name: "Maléfique",
    version: "Redoutable reine",
    text: [
      {
        title:
          "<Alter> 6 (Vous pouvez payer 6 {I} pour jouer ce personnage sur l'un de vos personnages Maléfique.)",
      },
      {
        title: "Ouvrez bien vos oreilles",
        description:
          "Lorsque vous jouez ce personnage, pour chacun de vos personnages Maléfique en jeu, choisissez un personnage, objet ou lieu adverse avec un coût de 3 ou moins et renvoyez-le dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Malefica",
    version: "Regina Temibile",
    text: [
      {
        title:
          "<Trasformazione> 6 (Puoi pagare 6 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Malefica.)",
      },
      {
        title: "Ascoltate tutti quanti",
        description:
          "Quando giochi questo personaggio, per ogni tuo personaggio in gioco chiamato Malefica, fai riprendere in mano al suo giocatore un personaggio, un oggetto o un luogo avversario a tua scelta con costo 3 o inferiore.",
      },
    ],
  },
};
