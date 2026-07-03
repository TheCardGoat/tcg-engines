import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const elsaFierceProtectorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Elsa",
    version: "Fierce Protector",
    text: [
      {
        title: "ICE OVER 1",
        description: "{I}, Choose and discard a card — Exert chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Elsa",
    version: "Stürmische Beschützerin",
    text: [
      {
        title: "Vereisen",
        description:
          "1 {I}, Wähle eine Karte aus deiner Hand und wirf sie ab — Erschöpfe einen gegnerischen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Elsa",
    version: "Protectrice farouche",
    text: [
      {
        title: "Glaciation",
        description: "1 {I}, défaussez une carte — Choisissez un personnage adverse et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Elsa",
    version: "Protettrice Impetuosa",
    text: [
      {
        title: "Ghiacciare",
        description:
          "1 {I}, scegli e scarta una carta — Impegna un personaggio avversario a tua scelta.",
      },
    ],
  },
};
