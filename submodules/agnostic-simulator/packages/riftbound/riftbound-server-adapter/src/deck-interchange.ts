import { defineGameDeckInterchangeAdapter } from "@tcg/shared/game-adapter";

export const riftboundDeckInterchangeAdapter = defineGameDeckInterchangeAdapter({
  game: "riftbound",
  defaultFormatId: "standard",
  formats: {
    standard: {
      id: "standard",
      label: "Standard",
      declarationFields: [
        {
          id: "chosenChampionId",
          label: "Chosen Champion",
          kind: "card-reference",
          required: true,
          sourceSectionId: "main",
        },
      ],
      sections: [
        {
          id: "legend",
          label: "Legend",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 1,
        },
        {
          id: "main",
          label: "Main Deck",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 40,
        },
        {
          id: "battlefield",
          label: "Battlefields",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 3,
        },
        {
          id: "rune",
          label: "Runes",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 12,
        },
        {
          id: "side",
          label: "Sideboard",
          roles: ["validation", "runtime"],
          required: false,
          maximumCards: 8,
          allowedCardCounts: [0, 8],
        },
      ],
    },
  },
});
