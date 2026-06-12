import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const familyFishingPoleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Family Fishing Pole",
    text: [
      {
        title: "WATCH CLOSELY",
        description: "This item enters play exerted.",
      },
      {
        title: "THE PERFECT CAST",
        description:
          "{E}, 1 {I}, Banish this item — Return chosen exerted character of yours to your hand to gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Angelrute der Familie",
    text: [
      {
        title: "PASS GUT AUF",
        description: "Dieser Gegenstand kommt erschöpft ins Spiel.",
      },
      {
        title: "DER PERFEKTE WURF, 1,",
        description:
          "Verbanne diesen Gegenstand — Wähle einen deiner erschöpften Charaktere und nimm ihn zurück auf deine Hand, um 2 Legenden zu sammeln.",
      },
    ],
  },
  fr: {
    name: "Canne à pêche familiale",
    text: [
      {
        title: "OBSERVE ATTENTIVEMENT",
        description: "Cet objet arrive en jeu épuisé.",
      },
      {
        title: "LE PARFAIT LANCER, 1,",
        description:
          "bannissez cet objet — Choisissez l'un de vos personnages épuisés et renvoyez-le dans votre main pour gagner 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Canna da Pesca di Famiglia",
    text: [
      {
        title: "OSSERVA ATTENTAMENTE",
        description: "Questo oggetto entra in gioco impegnato.",
      },
      {
        title: "LA TECNICA DEL GRANDE LANCIO, 1,",
        description:
          "esilia questo oggetto — Riprendi in mano un tuo personaggio impegnato a tua scelta per ottenere 2 leggenda.",
      },
    ],
  },
};
