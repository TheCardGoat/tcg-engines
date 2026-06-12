import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trainingGroundsImpossiblePillarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Training Grounds",
    version: "Impossible Pillar",
    text: [
      {
        title: "STRENGTH OF MIND 1",
        description: "{I} — Chosen character here gets +1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Trainingsgelände",
    version: "Unerreichbare Säule",
    text: [
      {
        title: "STÄRKE DES WILLENS",
        description: "1 — Wähle einen Charakter an diesem Ort. Er erhält in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Terrains d'Entraînement",
    version: "Mât insurmontable",
    text: [
      {
        title: "FORCE MENTALE 1",
        description:
          "— Choisissez un personnage sur ce lieu qui gagne +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Campo di Addestramento",
    version: "Pilastro Impossibile",
    text: [
      {
        title: "FORZA DELLA MENTE 1",
        description: "— Un personaggio a tua scelta in questo luogo riceve +1 per questo turno.",
      },
    ],
  },
};
