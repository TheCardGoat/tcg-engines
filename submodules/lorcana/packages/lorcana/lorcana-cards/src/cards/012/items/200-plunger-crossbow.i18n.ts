import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const plungerCrossbowI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Plunger Crossbow",
    text: [
      {
        title: "SUCTION TECHNOLOGY",
        description: "{E}, 2 {I} — Draw a card, then choose and discard a card.",
      },
    ],
  },
  de: {
    name: "Pümpel-Armbrust",
    text: [
      {
        title: "Ansaugtechnik",
        description:
          "{E}, 2 {I} — Ziehe 1 Karte. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
      },
    ],
  },
  fr: {
    name: "Ventouse au harpon",
    text: [
      {
        title: "Technologie de succion",
        description: "{E}, 2 {I} — Piochez une carte puis défaussez une carte.",
      },
    ],
  },
  it: {
    name: "Balestra Sturalavandini",
    text: [
      {
        title: "Tecnologia a Ventosa",
        description: "{E}, 2 {I} — Pesca una carta, poi scegli e scarta una carta.",
      },
    ],
  },
};
