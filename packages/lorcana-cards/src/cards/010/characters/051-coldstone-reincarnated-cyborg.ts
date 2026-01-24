import type { CharacterCard } from "@tcg/lorcana-types";

export const coldstoneReincarnatedCyborg: CharacterCard = {
  id: "1uk",
  cardType: "character",
  name: "Coldstone",
  version: "Reincarnated Cyborg",
  fullName: "Coldstone - Reincarnated Cyborg",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "010",
  text: "THE CANTRIPS HAVE BEEN SPOKEN When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 51,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "efe9bd3b196659d235f5f564d9d2c23aaa674bdb",
  },
  abilities: [
    {
      id: "1uk-1",
      type: "triggered",
      name: "THE CANTRIPS HAVE BEEN SPOKEN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression:
            "you have 2 or more Gargoyle character cards in your discard",
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
      },
      text: "THE CANTRIPS HAVE BEEN SPOKEN When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
};
