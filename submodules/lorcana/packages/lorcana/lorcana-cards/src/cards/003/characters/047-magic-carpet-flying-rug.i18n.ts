import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicCarpetFlyingRugI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Carpet",
    version: "Flying Rug",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "FIND THE WAY",
        description: "{E} — Move a character of yours to a location for free.",
      },
    ],
  },
  de: {
    name: "Fliegender Teppich",
    version: "Überflieger",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "FINDE DEN WEG",
        description: "— Wähle einen deiner Charaktere und bewege ihn kostenlos zu einem Ort.",
      },
    ],
  },
  fr: {
    name: "Tapis volant",
    version: "Carpette magique",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "TROUVE LE CHEMIN",
        description: "— Déplacez gratuitement l'un de vos personnages sur un lieu.",
      },
    ],
  },
  it: {
    name: "Tappeto Magico",
    version: "Scendiletto Volante",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "TROVARE LA VIA",
        description: "— Sposta gratuitamente un tuo personaggio in un luogo a tua scelta.",
      },
    ],
  },
};
