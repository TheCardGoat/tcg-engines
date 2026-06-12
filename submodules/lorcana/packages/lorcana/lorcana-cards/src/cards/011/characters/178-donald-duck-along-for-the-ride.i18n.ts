import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckAlongForTheRideI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Along for the Ride",
    text: [
      {
        title: "COMIN' THROUGH!",
        description: "When you play this character, you may banish chosen item.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Mit auf der Reise",
    text: [
      {
        title: "ICH BRECHE DURCH!",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Gegenstand deiner Wahl verbannen.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Se laisse embarquer",
    text: [
      {
        title: "ATTENTION, J'ARRIVE!",
        description: "Lorsque vous jouez ce personnage, vous pouvez choisir un objet et le bannir.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Che Si Lascia Trasportare",
    text: [
      {
        title: "FATE LARGO!",
        description: "Quando giochi questo personaggio, puoi esiliare un oggetto a tua scelta.",
      },
    ],
  },
};
