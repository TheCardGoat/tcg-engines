import { defineGameDeckInterchangeAdapter } from "@tcg/shared/game-adapter";

export const cyberpunkDeckInterchangeAdapter = defineGameDeckInterchangeAdapter({
  game: "cyberpunk",
  defaultFormatId: "alpha",
  formats: {
    alpha: {
      id: "alpha",
      label: "Alpha",
      sections: [
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
      ],
    },
  },
});
