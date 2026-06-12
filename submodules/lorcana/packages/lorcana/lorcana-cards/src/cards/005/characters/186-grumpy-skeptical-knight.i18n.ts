import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const grumpySkepticalKnightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Grumpy",
    version: "Skeptical Knight",
    text: [
      {
        title: "BOON OF RESILIENCE",
        description:
          "While one of your Knight characters is at a location, that character gains Resist +2.",
      },
      {
        title: "BURST OF SPEED",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Brummbär",
    version: "Ritter des Misstrauens",
    text: [
      {
        title: "GESCHENK DER UNVERWÜSTLICHKEIT",
        description:
          "Solange einer deiner Ritter an einem Ort ist, erhält jener Charakter Robust +2. (Reduziere jeglichen Schaden, der ihm zugefügt wird, um 2.)",
      },
      {
        title: "GESCHWINDIGKEITSSCHUB",
        description:
          "In deinem Zug erhält dieser Charakter Wendig. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Grincheux",
    version: "Chevalier sceptique",
    text: [
      {
        title: "RÉSILIENCE",
        description: "Vos personnages Chevalier sur un lieu gagnent Résistance +2.",
      },
      {
        title: "ACCÉLÉRATION",
        description:
          "Durant votre tour, ce personnage gagne Insaisissable. (Il peut défier les personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Brontolo",
    version: "Cavaliere Scettico",
    text: [
      {
        title: "DONO DI RESILIENZA",
        description:
          "Mentre uno dei tuoi personaggi Cavaliere si trova in un luogo, quel personaggio ottiene Resistere +2.",
      },
      {
        title: "SCATTO VELOCE",
        description:
          "Durante il tuo turno, questo personaggio ottiene Sfuggente. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
};
