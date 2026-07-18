import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const maximusPalaceHorseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maximus",
    version: "Palace Horse",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "Support",
      },
    ],
  },
  de: {
    name: "Maximus",
    version: "Schloss-Pferd",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "MAXIMUS",
    version: "Cheval du palais",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il vous défie, un personnage adverse doit, si possible, choisir un de vos personnages avec Rempart.)",
      },
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Maximus",
    version: "Palace Horse",
    text: [
      {
        title:
          "<Bodyguard> (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      },
      {
        title:
          "<Support> (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
      },
    ],
  },
  es: {
    name: "Máximo",
    version: "Caballo de palacio",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "Apoyo",
      },
    ],
  },
};
