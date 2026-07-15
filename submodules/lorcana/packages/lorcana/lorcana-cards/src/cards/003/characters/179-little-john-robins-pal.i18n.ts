import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const littleJohnRobinsPalI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Little John",
    version: "Robin's Pal",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "DISGUISED",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Little John",
    version: "Robins Kumpel",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Verkleidet",
        description:
          "In deinem Zug erhält dieser Charakter <Wendig>. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Petit Jean",
    version: "Compagnon de Robin",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il vous défie, un personnage adverse doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Déguisé",
        description:
          "Durant votre tour, ce personnage gagne <Insaisissable>. (Il peut défier les personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Little John",
    version: "Compare di Robin",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Camuffato",
        description:
          "Durante il tuo turno, questo personaggio ottiene <Sfuggente>. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
};
