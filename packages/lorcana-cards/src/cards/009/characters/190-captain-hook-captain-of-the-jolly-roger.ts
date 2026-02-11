import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookCaptainOfTheJollyRoger: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          cardType: "action",
          cardName: "Fire the Cannons!",
          target: "CONTROLLER",
        },
      },
      id: "1d2-1",
      name: "DOUBLE THE POWDER!",
      text: "DOUBLE THE POWDER! When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 190,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
  cost: 4,
  externalIds: {
    ravensburger: "b22050b161c271c2f7a6545dbc530e05bcb045e0",
  },
  franchise: "Peter Pan",
  fullName: "Captain Hook - Captain of the Jolly Roger",
  id: "1d2",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  name: "Captain Hook",
  set: "009",
  strength: 3,
  text: "DOUBLE THE POWDER! When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
  version: "Captain of the Jolly Roger",
  willpower: 4,
};
