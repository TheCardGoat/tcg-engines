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
        title: "So ein saftiger Apfel",
        description: "{E} — Entferne bis zu 2 Schaden von einem Charakter deiner Wahl.",
      },
      {
        title: "Komm heraus",
        description: "Du zahlst 1 {I} weniger, um Gurgi-Charaktere auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Mâchouiller et crachouiller",
    text: [
      {
        title: "Bien juteuse en plus",
        description: "{E} — Choisissez un personnage et retirez-lui jusqu'à 2 dommages.",
      },
      {
        title: "Viens maintenant",
        description: "Jouer des personnages nommés Gurgi vous coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Mangiucchiare e Sgranocchiare",
    text: [
      {
        title: "Che Bella Mela Succosa",
        description: "{E} — Rimuovi fino a 2 danni da un personaggio a tua scelta.",
      },
      {
        title: "Vieni Fuori",
        description: "Paga 1 {I} in meno per giocare i personaggi chiamati Gurghi.",
      },
    ],
  },
};
