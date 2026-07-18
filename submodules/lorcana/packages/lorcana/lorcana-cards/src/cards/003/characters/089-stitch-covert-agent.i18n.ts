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
        title: "<Wendig>",
      },
      {
        title: "Verstecken",
        description: "Solange dieser Charakter an einem Ort ist, erhält er <Behütet>.",
      },
    ],
  },
  fr: {
    name: "Stitch",
    version: "Agent sous couverture",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Caché",
        description: "Tant que ce personnage se trouve sur un lieu, il gagne <Hors d'atteinte>",
      },
    ],
  },
  it: {
    name: "Stitch",
    version: "Agente in Incognito",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "Nascondersi",
        description:
          "Mentre questo personaggio si trova in un luogo, ottiene <Protetto>. (Gli avversari non possono sceglierlo se non per sfidarlo.)",
      },
    ],
  },
  es: {
    name: "Puntada",
    version: "Agente encubierto",
    text: [
      {
        title: "Evasivo",
      },
      {
        title: "ESCONDER",
        description: "Mientras este personaje esté en un lugar, gana Protección.",
      },
    ],
  },
};
