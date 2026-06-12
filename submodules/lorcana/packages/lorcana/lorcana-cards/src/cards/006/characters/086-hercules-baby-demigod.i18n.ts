import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const herculesBabyDemigodI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hercules",
    version: "Baby Demigod",
    text: [
      {
        title: "Ward",
      },
      {
        title: "STRONG LIKE HIS DAD 3",
        description: "{I} — Deal 1 damage to chosen damaged character.",
      },
    ],
  },
  de: {
    name: "Hercules",
    version: "Baby-Halbgott",
    text: [
      {
        title: "Behütet",
      },
      {
        title: "STARK, WIE SEIN VATER 3",
        description: "— Füge einem beschädigten Charakter deiner Wahl 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Hercule",
    version: "Bébé demi-dieu",
    text: [
      {
        title: "Hors d'atteinte",
      },
      {
        title: "FORT COMME SON",
        description: "PÈRE 3 — Infligez 1 dommage à un personnage ayant au moins 1 dommage.",
      },
    ],
  },
  it: {
    name: "Ercole",
    version: "Semidio Bambino",
    text: [
      {
        title: "Protetto",
      },
      {
        title: "FORTE, COME IL SUO",
        description: "PAPÀ 3 — Infliggi 1 danno a un personaggio danneggiato a tua scelta.",
      },
    ],
  },
};
