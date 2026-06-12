import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const stitchCovertAgentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stitch",
    version: "Covert Agent",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "HIDE",
        description: "While this character is at a location, he gains Ward.",
      },
    ],
  },
  de: {
    name: "Stitch",
    version: "Verdeckter Ermittler",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "VERSTECKEN",
        description: "Solange dieser Charakter an einem Ort ist, erhält er Behütet.",
      },
    ],
  },
  fr: {
    name: "Stitch",
    version: "Agent sous couverture",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "CACHÉ",
        description: "Tant que ce personnage se trouve sur un lieu, il gagne Hors d'atteinte",
      },
    ],
  },
  it: {
    name: "Stitch",
    version: "Agente in Incognito",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "NASCONDERSI",
        description:
          "Mentre questo personaggio si trova in un luogo, ottiene Protetto. (Gli avversari non possono sceglierlo se non per sfidarlo.)",
      },
    ],
  },
};
