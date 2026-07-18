import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const broadwaySturdyAndStrongI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Broadway",
    version: "Sturdy and Strong",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "STONE BY DAY",
        description: "If you have 3 or more cards in your hand, this character can't ready.",
      },
    ],
  },
  de: {
    name: "Broadway",
    version: "Robust und stark",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Am Tage aus Stein",
        description:
          "Solange du 3 oder mehr Karten auf der Hand hast, kann dieser Charakter nicht bereit gemacht werden.",
      },
    ],
  },
  fr: {
    name: "Broadway",
    version: "Fort et robuste",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Statue le jour",
        description:
          "Ce personnage ne peut pas se redresser si vous avez 3 cartes ou plus en main.",
      },
    ],
  },
  it: {
    name: "Broadway",
    version: "Robusto e Forte",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Statue di Giorno",
        description: "Se hai 3 o più carte in mano, questo personaggio non si può preparare.",
      },
    ],
  },
  es: {
    name: "Broadway",
    version: "Robusto y fuerte",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "PIEDRA DE DÍA",
        description: "Si tienes 3 o más cartas en tu mano, este personaje no puede prepararse.",
      },
    ],
  },
};
