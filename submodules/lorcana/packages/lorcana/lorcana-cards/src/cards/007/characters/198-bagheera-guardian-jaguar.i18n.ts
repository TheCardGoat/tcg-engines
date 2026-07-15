import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bagheeraGuardianJaguarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bagheera",
    version: "Guardian Jaguar",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "YOU MUST BE BRAVE",
        description:
          "When this character is banished during an opponent's turn, deal 2 damage to each opposing character.",
      },
    ],
  },
  de: {
    name: "Baghira",
    version: "Wächter-Jaguar",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Du musst jetzt tapfer sein",
        description:
          "Wenn dieser Charakter im Zug einer gegnerischen Person verbannt wird, füge jedem gegnerischen Charakter 2 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Bagheera",
    version: "Gardien félin",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Il faut que tu sois brave",
        description:
          "Lorsque ce personnage est banni durant le tour d'un adversaire, infligez 2 dommages à chaque personnage adverse.",
      },
    ],
  },
  it: {
    name: "Bagheera",
    version: "Giaguaro Protettore",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Devi Essere Coraggioso",
        description:
          "Durante il turno di un avversario, quando questo personaggio viene esiliato, infliggi 2 danni a ogni personaggio avversario.",
      },
    ],
  },
};
