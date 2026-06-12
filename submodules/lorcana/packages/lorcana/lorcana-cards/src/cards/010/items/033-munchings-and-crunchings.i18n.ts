import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const munchingsAndCrunchingsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Munchings and Crunchings",
    text: [
      {
        title: "WHAT A JUICY APPLE",
        description: "{E} — Remove up to 2 damage from chosen character.",
      },
      {
        title: "COME ON OUT",
        description: "You pay 1 {I} less to play characters named Gurgi.",
      },
    ],
  },
  de: {
    name: "Ein Leckerschmeckerchen",
    text: [
      {
        title: "SO EIN SAFTIGER APFEL",
        description: "— Entferne bis zu 2 Schaden von einem Charakter deiner Wahl.",
      },
      {
        title: "KOMM HERAUS",
        description: "Du zahlst 1 weniger, um Gurgi-Charaktere auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Mâchouiller et crachouiller",
    text: [
      {
        title: "BIEN JUTEUSE EN PLUS",
        description: "— Choisissez un personnage et retirez-lui jusqu'à 2 dommages.",
      },
      {
        title: "VIENS MAINTENANT",
        description: "Jouer des personnages nommés Gurgi vous coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Mangiucchiare e Sgranocchiare",
    text: [
      {
        title: "CHE BELLA MELA SUCCOSA",
        description: "— Rimuovi fino a 2 danni da un personaggio a tua scelta.",
      },
      {
        title: "VIENI FUORI",
        description: "Paga 1 in meno per giocare i personaggi chiamati Gurghi.",
      },
    ],
  },
};
