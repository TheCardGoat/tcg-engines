import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bashfulAdoringKnightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bashful",
    version: "Adoring Knight",
    text: [
      {
        title: "IMPRESS THE PRINCESS",
        description:
          "While you have a character named Snow White in play, this character gains Bodyguard. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      },
    ],
  },
  de: {
    name: "Pimpel",
    version: "Ritter der Bewunderung",
    text: [
      {
        title: "DIE PRINZESSIN BEEINDRUCKEN",
        description:
          "Solange du mindestens einen Schneewittchen-Charakter im Spiel hast, erhält dieser Charakter Beschützen. (Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Timide",
    version: "Chevalier servant",
    text: [
      {
        title: "IMPRESSIONNER LA PRINCESSE",
        description:
          "Tant que vous avez un personnage Blanche-Neige en jeu, ce personnage-ci gagne Rempart. (Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Mammolo",
    version: "Cavaliere Adorante",
    text: [
      {
        title: "FARE COLPO SULLA PRINCIPESSA",
        description:
          "Mentre hai in gioco un personaggio chiamato Biancaneve, questo personaggio ottiene Guardiano. (Un personaggio avversario che sfida uno dei tuoi personaggi deve sceglierne uno con Guardiano, se possibile.)",
      },
    ],
  },
};
