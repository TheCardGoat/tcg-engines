import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const spaghettiDinnerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Spaghetti Dinner",
    text: [
      {
        title: "FINE DINING",
        description: "{E}, 1 {I} — If you have 2 or more characters in play, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Spaghetti-Dinner",
    text: [
      {
        title: "GEHOBENE",
        description:
          "KÜCHE, 1 — Wenn du mindestens 2 Charaktere im Spiel hast, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Plat de spaghetti",
    text: [
      {
        title: "CUISINE",
        description:
          "RAFFINÉE, 1 — Si vous avez au moins 2 personnages en jeu, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Cena di Spaghetti",
    text: [
      {
        title: "CUCINA RAFFINATA, 1",
        description: "— Se hai in gioco 2 o più personaggi, ottieni 1 leggenda.",
      },
    ],
  },
};
