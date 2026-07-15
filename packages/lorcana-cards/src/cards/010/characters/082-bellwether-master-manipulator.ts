import type { CharacterCard } from "@tcg/lorcana-types";

export const bellwetherMasterManipulator: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
        type: "put-damage",
      },
      id: "x28-1",
      name: "VENDETTA",
      text: "VENDETTA When this character is challenged and banished, put 1 damage counter on each opposing character.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 82,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "77285cc484c8b9f8fc9016f4c1af15826c639181",
  },
  franchise: "Zootropolis",
  fullName: "Bellwether - Master Manipulator",
  id: "x28",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Bellwether",
  set: "010",
  strength: 3,
  text: "VENDETTA When this character is challenged and banished, put 1 damage counter on each opposing character.",
  version: "Master Manipulator",
  willpower: 3,
};
