import type { CharacterCard } from "@tcg/lorcana-types";

export const mauriceworldFamousInventor: CharacterCard = {
  id: "v0e",
  cardType: "character",
  name: "Maurice",
  version: "World-Famous Inventor",
  fullName: "Maurice - World-Famous Inventor",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**GIVE IT A TRY** Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\n\n**IT WORKS!** Whenever you play an item, you may draw a card.",
  cost: 6,
  strength: 2,
  willpower: 7,
  lore: 2,
  cardNumber: 152,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**GIVE IT A TRY** Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\n\n**IT WORKS!** Whenever you play an item, you may draw a card.",
      id: "v0e-1",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Dreamborn", "Inventor", "Mentor"],
};
