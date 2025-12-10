import type { CharacterCard } from "@tcg/lorcana";

export const ladyTremaineWickedStepmother: CharacterCard = {
  id: "qdk",
  cardType: "character",
  name: "Lady Tremaine",
  version: "Wicked Stepmother",
  fullName: "Lady Tremaine - Wicked Stepmother",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "001",
  text: "DO IT AGAIN! When you play this character, you may return an action card from your discard to your hand.",
  cost: 6,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 85,
  inkable: false,
  externalIds: {
    ravensburger: "5f10313dc8b4bca05c0fcd2a13d6b70db3cee3a8",
  },
  abilities: [
    {
      id: "qdk-1",
      text: "DO IT AGAIN! When you play this character, you may return an action card from your discard to your hand.",
      name: "DO IT AGAIN!",
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
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Dreamborn", "Villain"],
};
