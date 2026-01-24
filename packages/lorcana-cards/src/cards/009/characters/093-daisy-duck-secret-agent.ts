import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckSecretAgent: CharacterCard = {
  id: "1wn",
  cardType: "character",
  name: "Daisy Duck",
  version: "Secret Agent",
  fullName: "Daisy Duck - Secret Agent",
  inkType: ["emerald"],
  set: "009",
  text: "THWART Whenever this character quests, each opponent chooses and discards a card.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 93,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f7619092cc3f72796ad99666c3375f2c35ba256f",
  },
  abilities: [
    {
      id: "1wn-1",
      type: "triggered",
      name: "THWART",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "discard",
        amount: 1,
        target: "EACH_OPPONENT",
        chosen: true,
      },
      text: "THWART Whenever this character quests, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
