import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jumboPopI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jumbo Pop",
    text: [
      {
        title: "HERE YOU GO",
        description:
          "Banish this item — Remove up to 2 damage from each of your characters. Draw a card.",
      },
    ],
  },
  de: {
    name: "Riesenpfote am Stiel",
    text: [
      {
        title: "BITTE SEHR",
        description:
          "Verbanne diesen Gegenstand — Entferne bis zu 2 Schaden von jedem deiner Charaktere. Ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Jumbo Pop",
    text: [
      {
        title: "C'EST POUR TOI",
        description:
          "Bannissez cet objet — Retirez jusqu'à 2 dommages de chacun de vos personnages. Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Ghiacciolo Jumbo",
    text: [
      {
        title: "ECCO QUA",
        description:
          "Esilia questo oggetto — Rimuovi fino a 2 danni da ogni tuo personaggio. Pesca una carta.",
      },
    ],
  },
};
