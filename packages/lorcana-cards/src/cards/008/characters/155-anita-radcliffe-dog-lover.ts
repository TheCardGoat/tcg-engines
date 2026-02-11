import type { CharacterCard } from "@tcg/lorcana-types";

export const anitaRadcliffeDogLover: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "id4-1",
      name: "I'LL TAKE CARE OF YOU",
      text: "I'LL TAKE CARE OF YOU When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 155,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "4230300eaeb78b87c38720c57b3d4dbe9b489baa",
  },
  franchise: "101 Dalmatians",
  fullName: "Anita Radcliffe - Dog Lover",
  id: "id4",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Anita Radcliffe",
  set: "008",
  strength: 3,
  text: "I'LL TAKE CARE OF YOU When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  version: "Dog Lover",
  willpower: 3,
};
