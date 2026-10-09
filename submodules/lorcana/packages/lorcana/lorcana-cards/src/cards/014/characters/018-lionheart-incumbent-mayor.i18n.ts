import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lionheartIncumbentMayorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lionheart",
    version: "Incumbent Mayor",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "APPROVAL RATING",
        description:
          "When you play this character, up to 2 chosen characters get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Lionheart",
    version: "Amtierender Bürgermeister",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Zustimmungsrate",
        description:
          "Wenn du diesen Charakter ausspielst, erhalten bis zu 2 Charaktere deiner Wahl in diesem Zug jeweils +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Lionheart",
    version: "Maire en exercice",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Cote de popularité",
        description:
          "Lorsque vous jouez ce personnage, choisissez jusqu'à 2 personnages qui gagnent +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Lionheart",
    version: "Sindaco in Carica",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Indice di Approvazione",
        description:
          "Quando giochi questo personaggio, fino a 2 personaggi a tua scelta ricevono +1 {L} per questo turno.",
      },
    ],
  },
  es: {
    name: "Lionheart",
    version: "Incumbent Mayor",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "APPROVAL RATING",
        description:
          "When you play this character, up to 2 chosen characters get +1 {L} this turn.",
      },
    ],
  },
};
