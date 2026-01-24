import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipSwordsmanOfTheRealm: CharacterCard = {
  id: "1ov",
  cardType: "character",
  name: "Prince Phillip",
  version: "Swordsman of the Realm",
  fullName: "Prince Phillip - Swordsman of the Realm",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "005",
  text: "SLAYER OF DRAGONS When you play this character, banish chosen opposing Dragon character.\nPRESSING THE ADVANTAGE Whenever he challenges a damaged character, ready this character after the challenge.",
  cost: 7,
  strength: 3,
  willpower: 9,
  lore: 3,
  cardNumber: 83,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "db66d5e6886edfaf68c3a28ff44e4adb2989692d",
  },
  abilities: [
    {
      id: "1ov-1",
      type: "triggered",
      name: "SLAYER OF DRAGONS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "SLAYER OF DRAGONS When you play this character, banish chosen opposing Dragon character.",
    },
    {
      id: "1ov-2",
      type: "triggered",
      name: "PRESSING THE ADVANTAGE",
      effect: {
        type: "ready",
        target: {
          selector: "self",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "PRESSING THE ADVANTAGE Whenever he challenges a damaged character, ready this character after the challenge.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
