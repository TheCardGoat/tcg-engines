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
        title: "VOLL AUFGELADEN",
        description:
          "Wenn du einen Erfinder im Spiel hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "DU HAST",
        description:
          '"AU" GESAGT 2 — Entferne bis zu 1 Schaden von einem anderen Charakter deiner Wahl.',
      },
    ],
  },
  fr: {
    name: "Baymax",
    version: "Assistant de santé personnel",
    text: [
      {
        title: "CHARGE TERMINÉE",
        description:
          "Jouer ce personnage vous coûte 1 de moins si vous avez un personnage Inventeur en jeu.",
      },
      {
        title: "VOUS AVEZ DIT",
        description: "'AÏE' 2 — Choisissez un autre personnage et retirez-lui jusqu'à 1 dommage.",
      },
    ],
  },
  it: {
    name: "Baymax",
    version: "Operatore Sanitario Personale",
    text: [
      {
        title: "COMPLETAMENTE RICARICATO",
        description:
          "Se hai in gioco un personaggio Inventore, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "HAI ESCLAMATO",
        description: '"AHI" 2 — Rimuovi fino a 1 danno da un altro personaggio a tua scelta.',
      },
    ],
  },
};
