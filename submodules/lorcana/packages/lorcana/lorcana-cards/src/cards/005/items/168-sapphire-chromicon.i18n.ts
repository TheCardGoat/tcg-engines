import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sapphireChromiconI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sapphire Chromicon",
    text: [
      {
        title: "POWERING UP",
        description: "This item enters play exerted.",
      },
      {
        title: "SAPPHIRE LIGHT",
        description: "{E}, 2 {I}, Banish one of your items — Gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Saphir Chromikon",
    text: [
      {
        title: "Ladevorgang",
        description: "Dieser Gegenstand kommt erschöpft ins Spiel.",
      },
      {
        title: "Saphirfarbenes Licht",
        description: "{E}, 2 {I}, Verbanne einen deiner Gegenstände — Sammle 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Chromicône de Saphir",
    text: [
      {
        title: "En charge",
        description: "Cet objet arrive en jeu épuisé.",
      },
      {
        title: "Lueur de saphir",
        description: "{E}, 2 {I}, bannissez l'un de vos objets — Gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Cromicon di Zaffiro",
    text: [
      {
        title: "Accensione",
        description: "Questo oggetto entra in gioco impegnato.",
      },
      {
        title: "Luce di Zaffiro",
        description: "{E}, 2 {I}, esilia uno dei tuoi oggetti — Ottieni 2 leggenda.",
      },
    ],
  },
};
