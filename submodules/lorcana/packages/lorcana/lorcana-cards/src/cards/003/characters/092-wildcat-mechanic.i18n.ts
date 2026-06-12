import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const wildcatMechanicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Wildcat",
    version: "Mechanic",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "DISASSEMBLE",
        description: "{E} — Banish chosen item.",
      },
    ],
  },
  de: {
    name: "Wildkatz",
    version: "Mechaniker",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "DEMONTIEREN",
        description: "— Verbanne einen Gegenstand deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Turbo",
    version: "Mécanicien",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "DÉSASSEMBLAGE",
        description: "— Choisissez un objet et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Valvola",
    version: "Meccanico",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "SMONTARE",
        description: "— Esilia un oggetto a tua scelta.",
      },
    ],
  },
};
