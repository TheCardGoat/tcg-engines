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
        description: "{E}, Banish this item — Banish chosen Dragon character.",
      },
    ],
  },
  de: {
    name: "Armbrust aus Zahn",
    text: [
      {
        title: "Sorgfältig Zielen",
        description: "2 {I}, {E} — Gib einem Charakter deiner Wahl in diesem Zug -2 {S}.",
      },
      {
        title: "Zurück mit euch!",
        description: "{E}, Verbanne diesen Gegenstand — Verbanne einen Drachen deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Arbalète de Croc du Dragon",
    text: [
      {
        title: "Visée précise",
        description:
          "{E}, 2 {I} — Choisissez un personnage, il subit -2 {S} pour le reste de ce tour.",
      },
      {
        title: "N'approchez pas!",
        description: "{E}, bannissez cet objet — Choisissez un personnage Dragon et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Fang Crossbow",
    text: [
      {
        title: "Careful Aim",
        description: "{E}, 2 {I} — Chosen character gets -2 {S} this turn.",
      },
      {
        title: "Stay Back!",
        description: "{E}, Banish this item — Banish chosen Dragon character.",
      },
    ],
  },
};
