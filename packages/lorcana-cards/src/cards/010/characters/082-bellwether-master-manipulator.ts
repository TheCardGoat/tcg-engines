import type { CharacterCard } from "@tcg/lorcana-types";

export const bellwetherMasterManipulator: CharacterCard = {
  id: "x28",
  cardType: "character",
  name: "Bellwether",
  version: "Master Manipulator",
  fullName: "Bellwether - Master Manipulator",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "010",
  text: "VENDETTA When this character is challenged and banished, put 1 damage counter on each opposing character.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 82,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "77285cc484c8b9f8fc9016f4c1af15826c639181",
  },
  abilities: [
    {
      id: "x28-1",
      type: "triggered",
      name: "VENDETTA",
      trigger: {
        event: "challenged",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "put-damage",
        amount: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "VENDETTA When this character is challenged and banished, put 1 damage counter on each opposing character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
