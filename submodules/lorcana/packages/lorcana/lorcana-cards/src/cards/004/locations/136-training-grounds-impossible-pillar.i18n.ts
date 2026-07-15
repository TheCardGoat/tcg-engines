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
        title: "Stärke des Willens",
        description: "1 {I} — Wähle einen Charakter an diesem Ort. Er erhält in diesem Zug +1{S}.",
      },
    ],
  },
  fr: {
    name: "Terrains d'Entraînement",
    version: "Mât insurmontable",
    text: [
      {
        title: "Force mentale",
        description:
          "1 {I} — Choisissez un personnage sur ce lieu qui gagne +1 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Campo di Addestramento",
    version: "Pilastro Impossibile",
    text: [
      {
        title: "Forza della Mente",
        description:
          "1 {I} — Un personaggio a tua scelta in questo luogo riceve +1 {S} per questo turno.",
      },
    ],
  },
};
