import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseLeaderOfTheBandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Leader of the Band",
    text: [
      {
        title: "Support",
      },
      {
        title: "STRIKE UP THE MUSIC",
        description: "When you play this character, chosen character gains Support this turn.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Dirigent",
    text: [
      {
        title: "Unterstützen",
      },
      {
        title: "DIE MUSIK AUFDREHEN",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug Unterstützen.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Chef de la fanfare",
    text: [
      {
        title: "Soutien",
      },
      {
        title: "EN AVANT LA MUSIQUE!",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne Soutien pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Direttore della Banda",
    text: [
      {
        title: "Aiutante",
      },
      {
        title: "ATTACCARE IL PEZZO",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene Aiutante per questo turno.",
      },
    ],
  },
};
