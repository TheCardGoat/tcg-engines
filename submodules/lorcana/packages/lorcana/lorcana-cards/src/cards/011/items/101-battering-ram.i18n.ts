import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const batteringRamI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Battering Ram",
    text: [
      {
        title: "FULL FORCE",
        description: "{E} — Deal 1 damage to chosen damaged character.",
      },
      {
        title: "BREAK THROUGH",
        description: "{E}, Banish this item — Banish chosen location.",
      },
    ],
  },
  de: {
    name: "Rammbock",
    text: [
      {
        title: "VOLLE KRAFT",
        description: "— Füge einem beschädigten Charakter deiner Wahl 1 Schaden zu.",
      },
      {
        title: "DURCHBRUCH,",
        description: "Verbanne diesen Gegenstand — Verbanne einen Ort deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Bélier",
    text: [
      {
        title: "PLEINE PUISSANCE",
        description:
          "— Choisissez un personnage ayant au moins un dommage et infligez-lui 1 dommage.",
      },
      {
        title: "PERCÉE,",
        description: "Bannissez cet objet — Choisissez un lieu et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Ariete d'Assedio",
    text: [
      {
        title: "PIENA POTENZA",
        description: "— Infliggi 1 danno a un personaggio danneggiato a tua scelta.",
      },
      {
        title: "FARE BRECCIA,",
        description: "esilia questo oggetto — Esilia un luogo a tua scelta.",
      },
    ],
  },
};
