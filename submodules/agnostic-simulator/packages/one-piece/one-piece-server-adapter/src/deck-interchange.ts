import { defineGameDeckInterchangeAdapter } from "@tcg/shared/game-adapter";

export const onePieceDeckInterchangeAdapter = defineGameDeckInterchangeAdapter({
  game: "one-piece",
  defaultFormatId: "standard",
  formats: {
    standard: {
      id: "standard",
      label: "Standard",
      sections: [
        {
          id: "leader",
          label: "Leader",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 1,
        },
        {
          id: "main",
          label: "Main Deck",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 50,
        },
        {
          id: "don",
          label: "DON!! Deck",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 10,
        },
      ],
    },
  },
});
