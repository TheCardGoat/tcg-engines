import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const svenReindeerSteedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sven",
    version: "Reindeer Steed",
    text: [
      {
        title: "REINDEER GAMES",
        description:
          "When you play this character, you may ready chosen character. They can't quest or challenge for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Sven",
    version: "Rentier",
    text: [
      {
        title: "RENTIER SPIELE",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Charakter deiner Wahl bereit machen. Er kann in diesem Zug nicht mehr erkunden oder herausfordern.",
      },
    ],
  },
  fr: {
    name: "Sven",
    version: "Destrier renne",
    text: [
      {
        title: "JEUX DE RENNES",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage et le redresser. Il ne peut ni partir à l'aventure ni défier pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Sven",
    version: "Renna Destriero",
    text: [
      {
        title: "GIOCHI DA RENNE",
        description:
          "Quando giochi questo personaggio, puoi preparare un personaggio a tua scelta. Non può andare all'avventura o sfidare per il resto di questo turno.",
      },
    ],
  },
};
