import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseGiantMouseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Giant Mouse",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "THE BIGGEST STAR EVER",
        description: "When this character is banished, deal 5 damage to each opposing character.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Riesige Maus",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Der größte Star von allen",
        description:
          "Wenn dieser Charakter verbannt wird, füge jedem gegnerischen Charakter 5 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Souris géante",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "La plus grande star de tous les temps",
        description:
          "Lorsque ce personnage est banni, infligez 5 dommages à chaque personnage adverse.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Topo Gigante",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "La Più Grande Star di Sempre",
        description:
          "Quando questo personaggio viene esiliato, infliggi 5 danni a ogni personaggio avversario.",
      },
    ],
  },
};
