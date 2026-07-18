import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckMusketeerSoldierI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Musketeer Soldier",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "WAIT FOR ME!",
        description: "When you play this character, chosen character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Musketier-Soldat",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Wartet auf mich",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Mousquetaire soldat",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Attendez-moi!",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Soldato Moschettiere",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Eccomi, Arrivo!",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta riceve +1 {L} per questo turno.",
      },
    ],
  },
  es: {
    name: "Pato donald",
    version: "Soldado mosquetero",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "¡ESPERAME!",
        description:
          "Cuando juegas con este personaje, el personaje elegido obtiene +1 {L} este turno.",
      },
    ],
  },
};
