import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const enigmaticInkcasterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Enigmatic Inkcaster",
    text: [
      {
        title: "ITS OWN REWARD",
        description: "{E} — If you've played 2 or more cards this turn, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Rätselhafter Tintenformer",
    text: [
      {
        title: "Seine eigene Belohnung",
        description:
          "{E} — Falls du in diesem Zug mindestens 2 Karten ausgespielt hast, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Invocateur d’encre mystérieux",
    text: [
      {
        title: "Une récompense en soi",
        description: "{E} — Si vous avez joué 2 cartes ou plus ce tour-ci, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Inchiostratore Enigmatico",
    text: [
      {
        title: "Una Ricompensa di Per Sé",
        description: "{E} — Se hai giocato 2 o più carte in questo turno, ottieni 1 leggenda.",
      },
    ],
  },
  es: {
    name: "Enigmático lanzador de tinta",
    text: [
      {
        title: "SU PROPIA RECOMPENSA",
        description: "{E}: si has jugado 2 o más cartas este turno, obtienes 1 conocimiento.",
      },
    ],
  },
};
