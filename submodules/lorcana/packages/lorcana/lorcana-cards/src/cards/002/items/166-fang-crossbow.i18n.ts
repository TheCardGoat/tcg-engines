import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fangCrossbowI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fang Crossbow",
    text: [
      {
        title: "CAREFUL AIM",
        description: "{E}, 2 {I} — Chosen character gets -2 {S} this turn.",
      },
      {
        title: "STAY BACK!",
      },
      {
        title: "{E},",
        description: "Banish this item — Banish chosen Dragon character.",
      },
    ],
  },
  de: {
    name: "Armbrust aus Zahn",
    text: [
      {
        title: "SORGFÄLTIG ZIELEN",
        description: "2, — Gib einem Charakter deiner Wahl in diesem Zug -2.",
      },
      {
        title: "ZURÜCK MIT EUCH!,",
        description: "Verbanne diesen Gegenstand — Verbanne einen Drachen deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Arbalète de Croc du Dragon",
    text: [
      {
        title: "VISÉE PRÉCISE,",
        description: "2 — Choisissez un personnage, il subit -2 pour le reste de ce tour.",
      },
      {
        title: "N'APPROCHEZ PAS!,",
        description: "bannissez cet objet — Choisissez un personnage Dragon et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Fang Crossbow",
    text: [
      {
        title: "CAREFUL AIM, 2",
        description: "— Chosen character gets -2 this turn.",
      },
      {
        title: "STAY BACK!,",
        description: "Banish this item — Banish chosen Dragon character.",
      },
    ],
  },
};
