import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const clawhauserSafetyOfficerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Clawhauser",
    version: "Safety Officer",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "Everyone's Buddy",
        description: "You can't play this character unless you played another character this turn.",
      },
    ],
  },
  de: {
    name: "Clawhauser",
    version: "Sicherheitsbeauftragter",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Jedermanns Kumpel",
        description:
          "Du kannst diesen Charakter nicht ausspielen, außer du hast in diesem Zug bereits einen anderen Charakter ausgespielt.",
      },
    ],
  },
  fr: {
    name: "Clawhauser",
    version: "Officier de sécurité",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Copain de tout le monde",
        description:
          "Vous ne pouvez pas jouer ce personnage, sauf si vous avez déjà joué un autre personnage ce tour-ci.",
      },
    ],
  },
  it: {
    name: "Clawhauser",
    version: "Agente di Sicurezza",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Amico di Tutti",
        description:
          "Non puoi giocare questo personaggio a meno che tu non abbia giocato un altro personaggio in questo turno.",
      },
    ],
  },
  es: {
    name: "Clawhauser",
    version: "Safety Officer",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "Everyone's Buddy",
        description: "You can't play this character unless you played another character this turn.",
      },
    ],
  },
};
