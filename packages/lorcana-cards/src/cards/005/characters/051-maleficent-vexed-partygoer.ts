import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentVexedPartygoer: CharacterCard = {
  id: "1ib",
  cardType: "character",
  name: "Maleficent",
  version: "Vexed Partygoer",
  fullName: "Maleficent - Vexed Partygoer",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "005",
  text: "WHAT AN AWKWARD SITUATION Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player's hand.",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 2,
  cardNumber: 51,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c3436e71471bedffbf745dff08472a9567ae7c90",
  },
  abilities: [
    {
      id: "1ib-1",
      type: "triggered",
      name: "WHAT AN AWKWARD SITUATION",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "WHAT AN AWKWARD SITUATION Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
