import type { CharacterCard } from "@tcg/lorcana-types";

export const joeyBluePigeon: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "jla-1",
      name: "I'VE GOT JUST THE THING",
      text: "I'VE GOT JUST THE THING Whenever this character quests, you may remove up to 1 damage from each of your characters with Bodyguard.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 36,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 3,
  externalIds: {
    ravensburger: "469bd055268daba9556ab80313749cc2a456877f",
  },
  franchise: "Bolt",
  fullName: "Joey - Blue Pigeon",
  id: "jla",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Joey",
  set: "008",
  strength: 3,
  text: "I'VE GOT JUST THE THING Whenever this character quests, you may remove up to 1 damage from each of your characters with Bodyguard.",
  version: "Blue Pigeon",
  willpower: 3,
};
