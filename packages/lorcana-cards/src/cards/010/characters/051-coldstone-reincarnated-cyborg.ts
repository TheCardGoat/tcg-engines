import type { CharacterCard } from "@tcg/lorcana-types";

export const coldstoneReincarnatedCyborg: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression:
            "you have 2 or more Gargoyle character cards in your discard",
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
        type: "conditional",
      },
      id: "1uk-1",
      name: "THE CANTRIPS HAVE BEEN SPOKEN",
      text: "THE CANTRIPS HAVE BEEN SPOKEN When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 51,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Gargoyle"],
  cost: 5,
  externalIds: {
    ravensburger: "efe9bd3b196659d235f5f564d9d2c23aaa674bdb",
  },
  franchise: "Gargoyles",
  fullName: "Coldstone - Reincarnated Cyborg",
  id: "1uk",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Coldstone",
  set: "010",
  strength: 5,
  text: "THE CANTRIPS HAVE BEEN SPOKEN When you play this character, if you have 2 or more Gargoyle character cards in your discard, gain 2 lore.",
  version: "Reincarnated Cyborg",
  willpower: 4,
};
