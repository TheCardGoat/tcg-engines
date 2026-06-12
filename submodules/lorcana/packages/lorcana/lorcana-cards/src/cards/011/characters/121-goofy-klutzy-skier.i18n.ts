import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofyKlutzySkierI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goofy",
    version: "Klutzy Skier",
    text: [
      {
        title: "YAAAAAAA-HOO-HOO-HOO-HOOEY",
        description: "{E}, Banish this character — Banish chosen character.",
      },
    ],
  },
  de: {
    name: "Goofy",
    version: "Tollpatschiger Skifahrer",
    text: [
      {
        title: "JAAAAAAA-HUU-HUU-HUU-HUIII,",
        description: "Verbanne diesen Charakter — Verbanne einen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Dingo",
    version: "Skieur gauche",
    text: [
      {
        title: "YAAAAAAA-HOO-HOO-HOO-HOOEY,",
        description: "Bannissez ce personnage — Choisissez un personnage et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Sciatore Imbranato",
    text: [
      {
        title: "YAAAAAAA-HOO-HOO-HOO-HOOEY,",
        description: "esilia questo personaggio — Esilia un personaggio a tua scelta.",
      },
    ],
  },
};
