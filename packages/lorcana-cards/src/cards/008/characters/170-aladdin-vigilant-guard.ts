import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinVigilantGuard: CharacterCard = {
  abilities: [
    {
      id: "fh8-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "self",
            zones: ["play"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "fh8-2",
      name: "SAFE PASSAGE",
      text: "SAFE PASSAGE Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 170,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Prince"],
  cost: 6,
  externalIds: {
    ravensburger: "37c91d4c1e7468929e01ddc735e84693e87bfe36",
  },
  franchise: "Aladdin",
  fullName: "Aladdin - Vigilant Guard",
  id: "fh8",
  inkType: ["sapphire", "steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Aladdin",
  set: "008",
  strength: 1,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSAFE PASSAGE Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
  version: "Vigilant Guard",
  willpower: 9,
};
