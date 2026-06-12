import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jafarKeeperOfSecretsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jafar",
    version: "Keeper of Secrets",
    text: [
      {
        title: "HIDDEN WONDERS",
        description: "This character gets +1 {S} for each card in your hand.",
      },
    ],
  },
  de: {
    name: "Dschafar",
    version: "Hüter der Geheimnisse",
    text: [
      {
        title: "VERSTECKTE WUNDER",
        description: "Dieser Charakter erhält +1 für jede Karte auf deiner Hand.",
      },
    ],
  },
  fr: {
    name: "JAFAR",
    version: "Gardien des Secrets",
    text: [
      {
        title: "MERVEILLES CACHÉES",
        description: "La de ce personnage augmente de 1 par carte dans votre main.",
      },
    ],
  },
  it: {
    name: "Jafar",
    version: "Custode dei Segreti",
    text: [
      {
        title: "MERAVIGLIE NASCOSTE",
        description: "Questo personaggio riceve +1 per ogni carta nella tua mano.",
      },
    ],
  },
};
