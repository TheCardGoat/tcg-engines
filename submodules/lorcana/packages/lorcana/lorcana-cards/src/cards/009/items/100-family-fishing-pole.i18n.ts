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
        title: "Pass gut auf",
        description: "Dieser Gegenstand kommt erschöpft ins Spiel.",
      },
      {
        title: "Der perfekte Wurf",
        description:
          "{E}, 1 {I}, Verbanne diesen Gegenstand — Wähle einen deiner erschöpften Charaktere und nimm ihn zurück auf deine Hand, um 2 Legenden zu sammeln.",
      },
    ],
  },
  fr: {
    name: "Canne à pêche familiale",
    text: [
      {
        title: "Observe attentivement",
        description: "Cet objet arrive en jeu épuisé.",
      },
      {
        title: "Le parfait lancer",
        description:
          "{E}, 1 {I}, bannissez cet objet — Choisissez l'un de vos personnages épuisés et renvoyez-le dans votre main pour gagner 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Canna da Pesca di Famiglia",
    text: [
      {
        title: "Osserva Attentamente",
        description: "Questo oggetto entra in gioco impegnato.",
      },
      {
        title: "La Tecnica del Grande Lancio",
        description:
          "{E}, 1 {I}, esilia questo oggetto — Riprendi in mano un tuo personaggio impegnato a tua scelta per ottenere 2 leggenda.",
      },
    ],
  },
};
