import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princeCharmingProtectorOfTheRealmI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince Charming",
    version: "Protector of the Realm",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "PROTECTIVE PRESENCE",
        description: "Each turn, only one character can challenge.",
      },
    ],
  },
  de: {
    name: "Prinz Charming",
    version: "Beschützer des Königreichs",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Beschützerische Präsenz",
        description: "In jedem Zug kann nur ein Charakter herausfordern.",
      },
    ],
  },
  fr: {
    name: "Prince charmant",
    version: "Protecteur du royaume",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Présence protectrice",
        description: "Un seul personnage peut défier chaque tour.",
      },
    ],
  },
  it: {
    name: "Principe Azzurro",
    version: "Protettore del Reame",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Presenza Protettiva",
        description: "Ogni turno, solo un personaggio può sfidare.",
      },
    ],
  },
  es: {
    name: "Príncipe azul",
    version: "Protector del reino",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "PRESENCIA PROTECTORA",
        description: "En cada turno, solo un personaje puede desafiar.",
      },
    ],
  },
};
