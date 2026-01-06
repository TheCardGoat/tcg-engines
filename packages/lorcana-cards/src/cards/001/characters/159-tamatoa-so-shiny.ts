import type { CharacterCard } from "@tcg/lorcana-types";

export const tamatoaSoShiny: CharacterCard = {
  id: "sj3",
  cardType: "character",
  name: "Tamatoa",
  version: "So Shiny!",
  fullName: "Tamatoa - So Shiny!",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "001",
  text: "WHAT HAVE WE HERE? When you play this character and whenever he quests, you may return an item card from your discard to your hand.\nGLAM This character gets +1 {L} for each item you have in play.",
  cost: 8,
  strength: 5,
  willpower: 8,
  lore: 1,
  cardNumber: 159,
  inkable: true,
  externalIds: {
    ravensburger: "66d3b6106914373f1b4612e524cff18f5144a3a1",
  },
  abilities: [
    {
      id: "sj3-1",
      text: "WHAT HAVE WE HERE? When you play this character and whenever he quests, you may return an item card from your discard to your hand.",
      name: "WHAT HAVE WE HERE?",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          cardType: "item",
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
    {
      id: "sj3-2",
      text: "GLAM This character gets +1 {L} for each item you have in play.",
      name: "GLAM",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: { type: "items-in-play", controller: "you" },
        target: "SELF",
      },
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
