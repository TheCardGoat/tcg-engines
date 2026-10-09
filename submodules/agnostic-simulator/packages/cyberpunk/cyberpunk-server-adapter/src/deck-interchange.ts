import { defineGameDeckInterchangeAdapter } from "@tcg/shared/game-adapter";

const constructedSections = [
  {
    id: "legend",
    label: "Legends",
    roles: ["validation", "runtime"],
    required: true,
    exactCards: 3,
  },
  {
    id: "main",
    label: "Main Deck",
    roles: ["validation", "runtime"],
    required: true,
    minimumCards: 40,
    maximumCards: 50,
  },
  {
    id: "side",
    label: "Sideboard",
    roles: ["validation"],
    required: false,
  },
] as const;

export const cyberpunkDeckInterchangeAdapter = defineGameDeckInterchangeAdapter({
  game: "cyberpunk",
  defaultFormatId: "constructed",
  formats: {
    constructed: {
      id: "constructed",
      label: "Constructed",
      sections: constructedSections,
    },
    "six-pack": {
      id: "six-pack",
      label: "6-Pack",
      visibility: "private",
      sections: [
        {
          id: "legend",
          label: "Legends",
          roles: ["validation", "runtime"],
          required: false,
          maximumCards: 3,
        },
        {
          id: "main",
          label: "Main Deck",
          roles: ["validation", "runtime"],
          required: true,
          minimumCards: 30,
        },
        {
          id: "side",
          label: "Sideboard",
          roles: ["validation"],
          required: false,
        },
      ],
      declarationFields: [
        {
          id: "colors",
          label: "Deck colors",
          kind: "json",
          required: true,
        },
      ],
    },
  },
});
