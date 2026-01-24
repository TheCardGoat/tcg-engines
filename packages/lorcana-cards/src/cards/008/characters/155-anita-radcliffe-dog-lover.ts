import type { CharacterCard } from "@tcg/lorcana-types";

export const anitaRadcliffeDogLover: CharacterCard = {
  id: "id4",
  cardType: "character",
  name: "Anita Radcliffe",
  version: "Dog Lover",
  fullName: "Anita Radcliffe - Dog Lover",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "008",
  text: "I'LL TAKE CARE OF YOU When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 155,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4230300eaeb78b87c38720c57b3d4dbe9b489baa",
  },
  abilities: [
    {
      id: "id4-1",
      type: "triggered",
      name: "I'LL TAKE CARE OF YOU",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "I'LL TAKE CARE OF YOU When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
