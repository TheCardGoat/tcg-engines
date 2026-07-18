import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const akelaForestRunnerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Akela",
    version: "Forest Runner",
    text: [
      {
        title: "AHEAD OF THE PACK 1",
        description: "{I} — This character gets +1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Akela",
    version: "Waldläufer",
    text: [
      {
        title: "Dem Rudel voraus",
        description: "1 {I} — Dieser Charakter erhält in diesem Zug +1 {S}.",
      },
    ],
  },
  fr: {
    name: "Akela",
    version: "Court dans la forêt",
    text: [
      {
        title: "À l'avant de la meute",
        description: "1 {I} — Ce personnage gagne +1 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Akela",
    version: "Corridore Silvano",
    text: [
      {
        title: "Davanti al Branco",
        description: "1 {I} — Questo personaggio riceve +1 {S} per questo turno.",
      },
    ],
  },
  es: {
    name: "Akela",
    version: "Corredor del bosque",
    text: [
      {
        title: "DELANTE DEL PAQUETE 1",
        description: "{I}: este personaje obtiene +1 {S} este turno.",
      },
    ],
  },
};
