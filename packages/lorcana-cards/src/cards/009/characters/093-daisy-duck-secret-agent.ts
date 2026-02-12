import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckSecretAgent: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "1wn-1",
      name: "THWART",
      text: "THWART Whenever this character quests, each opponent chooses and discards a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 93,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "f7619092cc3f72796ad99666c3375f2c35ba256f",
  },
  fullName: "Daisy Duck - Secret Agent",
  id: "1wn",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Daisy Duck",
  set: "009",
  strength: 2,
  text: "THWART Whenever this character quests, each opponent chooses and discards a card.",
  version: "Secret Agent",
  willpower: 3,
};
