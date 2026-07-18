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
        title: "Geschenk der Unverwüstlichkeit",
        description:
          "Solange einer deiner Ritter an einem Ort ist, erhält jener Charakter <Robust> +2. (Reduziere jeglichen Schaden, der ihm zugefügt wird, um 2.)",
      },
      {
        title: "Geschwindigkeitsschub",
        description:
          "In deinem Zug erhält dieser Charakter <Wendig>. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Grincheux",
    version: "Chevalier sceptique",
    text: [
      {
        title: "Résilience",
        description: "Vos personnages Chevalier sur un lieu gagnent <Résistance> +2.",
      },
      {
        title: "Accélération",
        description:
          "Durant votre tour, ce personnage gagne <Insaisissable>. (Il peut défier les personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Brontolo",
    version: "Cavaliere Scettico",
    text: [
      {
        title: "Dono di Resilienza",
        description:
          "Mentre uno dei tuoi personaggi Cavaliere si trova in un luogo, quel personaggio ottiene <Resistere> +2.",
      },
      {
        title: "Scatto Veloce",
        description:
          "Durante il tuo turno, questo personaggio ottiene <Sfuggente>. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
  es: {
    name: "Gruñón",
    version: "Caballero escéptico",
    text: [
      {
        title: "BENEFICIO DE LA RESILIENCIA",
        description:
          "Mientras uno de tus personajes Caballero esté en una ubicación, ese personaje gana Resistencia +2.",
      },
      {
        title: "ARRANCADA",
        description:
          "Durante tu turno, este personaje gana Evasivo. (Pueden desafiar a los personajes con Evasivo).",
      },
    ],
  },
};
