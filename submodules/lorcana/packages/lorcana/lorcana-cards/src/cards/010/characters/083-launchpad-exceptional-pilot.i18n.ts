import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const launchpadExceptionalPilotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Launchpad",
    version: "Exceptional Pilot",
    text: [
      {
        title: "OFF THE MAP",
        description: "When you play this character, you may banish chosen location.",
      },
    ],
  },
  de: {
    name: "Quack, der Bruchpilot",
    version: "Außergewöhnlicher Pilot",
    text: [
      {
        title: "NICHT AUF DER KARTE",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Ort deiner Wahl verbannen.",
      },
    ],
  },
  fr: {
    name: "Flagada Jones",
    version: "Pilote d'exception",
    text: [
      {
        title: "PAS SUR LA CARTE",
        description: "Lorsque vous jouez ce personnage, vous pouvez choisir un lieu et le bannir.",
      },
    ],
  },
  it: {
    name: "Jet",
    version: "Pilota Eccezionale",
    text: [
      {
        title: "OLTRE LA MAPPA",
        description: "Quando giochi questo personaggio, puoi esiliare un luogo a tua scelta.",
      },
    ],
  },
};
