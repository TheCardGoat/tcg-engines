import { defineGameDeckInterchangeAdapter } from "@tcg/shared/game-adapter";

export const narutoDeckInterchangeAdapter = defineGameDeckInterchangeAdapter({
  game: "naruto",
  defaultFormatId: "preview",
  formats: {
    preview: {
      id: "preview",
      label: "Preview",
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
          id: "chakra",
          label: "Chakra",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 5,
        },
        {
          id: "summon",
          label: "Summon",
          roles: ["validation", "runtime"],
          required: true,
          exactCards: 1,
        },
      ],
    },
  },
});
