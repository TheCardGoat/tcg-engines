import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lenaSabrewingPureEnergyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lena Sabrewing",
    version: "Pure Energy",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "SUPERNATURAL VENGEANCE",
        description: "{E} — Deal 1 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Lena Degenflügel",
    version: "Reine Energie",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "ÜBERNATÜRLICHE RACHE",
        description: "— Füge einem Charakter deiner Wahl 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Lena de Sortilège",
    version: "Énergie pure",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "VENGEANCE DE",
        description: "L'AU-DELÀ — Choisissez un personnage et infligez-lui 1 dommage.",
      },
    ],
  },
  it: {
    name: "Lena Sabrewing",
    version: "Pura Energia",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "VENDETTA SOPRANNATURALE",
        description: "— Infliggi 1 danno a un personaggio a tua scelta.",
      },
    ],
  },
};
