import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentVexedPartygoer: CharacterCard = {
  abilities: [
    {
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
      id: "1ib-1",
      name: "WHAT AN AWKWARD SITUATION",
      text: "WHAT AN AWKWARD SITUATION Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player's hand.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 51,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "c3436e71471bedffbf745dff08472a9567ae7c90",
  },
  franchise: "Sleeping Beauty",
  fullName: "Maleficent - Vexed Partygoer",
  id: "1ib",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Maleficent",
  set: "005",
  strength: 0,
  text: "WHAT AN AWKWARD SITUATION Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player's hand.",
  version: "Vexed Partygoer",
  willpower: 4,
};
