import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinVigilantGuard: CharacterCard = {
  id: "fh8",
  cardType: "character",
  name: "Aladdin",
  version: "Vigilant Guard",
  fullName: "Aladdin - Vigilant Guard",
  inkType: ["sapphire", "steel"],
  franchise: "Aladdin",
  set: "008",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSAFE PASSAGE Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
  cost: 6,
  strength: 1,
  willpower: 9,
  lore: 1,
  cardNumber: 170,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "37c91d4c1e7468929e01ddc735e84693e87bfe36",
  },
  abilities: [
    {
      id: "fh8-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "fh8-2",
      type: "triggered",
      name: "SAFE PASSAGE",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          upTo: true,
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "SAFE PASSAGE Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
};
