import type { CharacterCard } from "@tcg/lorcana-types";

export const belleStrangeButSpecial: CharacterCard = {
  id: "uxx",
  cardType: "character",
  name: "Belle",
  version: "Strange but Special",
  fullName: "Belle - Strange but Special",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**READ A BOOK** During your turn, you may put an additional card from your hand into your inkwell facedown.\n\n**MY FAVOURITE PART!** While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 142,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**READ A BOOK** During your turn, you may put an additional card from your hand into your inkwell facedown.\n\n**MY FAVOURITE PART!** While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
      id: "uxx-1",
      effect: {
        type: "optional",
        effect: {
          type: "modify-stat",
          stat: "lore",
          modifier: 4,
          target: "SELF",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Storyborn", "Princess"],
};
