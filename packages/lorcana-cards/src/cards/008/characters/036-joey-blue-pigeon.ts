import type { CharacterCard } from "@tcg/lorcana-types";

export const joeyBluePigeon: CharacterCard = {
  id: "jla",
  cardType: "character",
  name: "Joey",
  version: "Blue Pigeon",
  fullName: "Joey - Blue Pigeon",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "008",
  text: "I'VE GOT JUST THE THING Whenever this character quests, you may remove up to 1 damage from each of your characters with Bodyguard.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 36,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "469bd055268daba9556ab80313749cc2a456877f",
  },
  abilities: [
    {
      id: "jla-1",
      type: "triggered",
      name: "I'VE GOT JUST THE THING",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 1,
          upTo: true,
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "I'VE GOT JUST THE THING Whenever this character quests, you may remove up to 1 damage from each of your characters with Bodyguard.",
    },
  ],
  classifications: ["Storyborn"],
};
