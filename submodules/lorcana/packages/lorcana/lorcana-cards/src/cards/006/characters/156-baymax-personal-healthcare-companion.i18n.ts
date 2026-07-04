import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const baymaxPersonalHealthcareCompanionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Baymax",
    version: "Personal Healthcare Companion",
    text: [
      {
        title: "FULLY CHARGED",
        description:
          "If you have an Inventor character in play, you pay 1 {I} less to play this character.",
      },
      {
        title: "YOU SAID",
        description: "'OW' 2 {I} — Remove up to 1 damage from another chosen character.",
      },
    ],
  },
  de: {
    name: "Baymax",
    version: "Persönlicher Gesundheitsbegleiter",
    text: [
      {
        title: "Voll Aufgeladen",
        description:
          "Wenn du einen Erfinder im Spiel hast, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: 'Du hast "Au" gesagt',
        description: "2 {I} — Entferne bis zu 1 Schaden von einem anderen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Baymax",
    version: "Assistant de santé personnel",
    text: [
      {
        title: "Charge terminée",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins si vous avez un personnage Inventeur en jeu.",
      },
      {
        title: "Vous avez dit 'Aïe'",
        description: "2 {I} — Choisissez un autre personnage et retirez-lui jusqu'à 1 dommage.",
      },
    ],
  },
  it: {
    name: "Baymax",
    version: "Operatore Sanitario Personale",
    text: [
      {
        title: "Completamente Ricaricato",
        description:
          "Se hai in gioco un personaggio Inventore, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: 'Hai Esclamato "Ahi"',
        description: "2 {I} — Rimuovi fino a 1 danno da un altro personaggio a tua scelta.",
      },
    ],
  },
};
