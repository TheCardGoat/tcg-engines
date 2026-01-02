import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookCaptainOfTheJollyRoger: CharacterCard = {
  id: "1d2",
  cardType: "character",
  name: "Captain Hook",
  version: "Captain of the Jolly Roger",
  fullName: "Captain Hook - Captain of the Jolly Roger",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "009",
  text: "DOUBLE THE POWDER! When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 190,
  inkable: false,
  externalIds: {
    ravensburger: "b22050b161c271c2f7a6545dbc530e05bcb045e0",
  },
  abilities: [
    {
      id: "1d2-1",
      text: "DOUBLE THE POWDER! When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
      name: "DOUBLE THE POWDER!",
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
          cardType: "action",
          cardName: "Fire the Cannons!",
          target: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
};
