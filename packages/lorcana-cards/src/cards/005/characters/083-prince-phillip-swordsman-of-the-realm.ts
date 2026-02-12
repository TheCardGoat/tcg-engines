import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipSwordsmanOfTheRealm: CharacterCard = {
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      id: "1ov-1",
      name: "SLAYER OF DRAGONS",
      text: "SLAYER OF DRAGONS When you play this character, banish chosen opposing Dragon character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "self",
          zones: ["play"],
        },
        type: "ready",
      },
      id: "1ov-2",
      name: "PRESSING THE ADVANTAGE",
      text: "PRESSING THE ADVANTAGE Whenever he challenges a damaged character, ready this character after the challenge.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 83,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 7,
  externalIds: {
    ravensburger: "db66d5e6886edfaf68c3a28ff44e4adb2989692d",
  },
  franchise: "Sleeping Beauty",
  fullName: "Prince Phillip - Swordsman of the Realm",
  id: "1ov",
  inkType: ["emerald"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Prince Phillip",
  set: "005",
  strength: 3,
  text: "SLAYER OF DRAGONS When you play this character, banish chosen opposing Dragon character.\nPRESSING THE ADVANTAGE Whenever he challenges a damaged character, ready this character after the challenge.",
  version: "Swordsman of the Realm",
  willpower: 9,
};
