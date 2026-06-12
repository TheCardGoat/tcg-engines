import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const morduSavageCursedPrinceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mor'du",
    version: "Savage Cursed Prince",
    text: [
      {
        title: "Ferocious Roar",
        description: "When you play this character, exert all your characters not named Mor'du.",
      },
      {
        title: "Rooted by Fear",
        description: "Your characters not named Mor'du can't ready at the start of your turn.",
      },
    ],
  },
  de: {
    name: "Mor'du",
    version: "Wilder verfluchter Prinz",
    text: [
      {
        title: "Wildes Brüllen",
        description:
          "Wenn du diesen Charakter ausspielst, erschöpfe alle deine Charaktere, die nicht Mor'du heißen.",
      },
      {
        title: "Von Angst geprägt",
        description:
          "Deine Charaktere, die nicht Mor'du heißen, werden zu Beginn deines Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Mor'du",
    version: "Prince maudit sauvage",
    text: [
      {
        title: "Rugissement féroce",
        description:
          "Lorsque vous jouez ce personnage, épuisez tous vos personnages qui ne sont pas nommés Mor'du.",
      },
      {
        title: "Enracinés de peur",
        description:
          "Vos personnages qui ne sont pas nommés Mor'du ne se redressent pas au début de votre tour.",
      },
    ],
  },
  it: {
    name: "Mor'du",
    version: "Selvaggio Principe Maledetto",
    text: [
      {
        title: "Ruggito Feroce",
        description:
          "Quando giochi questo personaggio, impegna tutti i tuoi personaggi non chiamati Mor'du.",
      },
      {
        title: "Paralizzati dalla Paura",
        description:
          "I tuoi personaggi non chiamati Mor'du non si possono preparare all'inizio del tuo turno.",
      },
    ],
  },
};
