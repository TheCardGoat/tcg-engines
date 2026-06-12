import type { CharacterCard } from "@tcg/lorcana-types";
import { princePhillipSwordsmanOfTheRealmI18n } from "./083-prince-phillip-swordsman-of-the-realm.i18n";

export const princePhillipSwordsmanOfTheRealm: CharacterCard = {
  id: "kzz",
  canonicalId: "ci_kzz",
  reprints: ["set5-083"],
  cardType: "character",
  name: "Prince Phillip",
  version: "Swordsman of the Realm",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "005",
  cardNumber: 83,
  rarity: "common",
  cost: 7,
  strength: 3,
  willpower: 9,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_ab1aec84c58d45afb0773657b0990323",
    tcgPlayer: 561958,
  },
  text: [
    {
      title: "SLAYER OF DRAGONS",
      description: "When you play this character, banish chosen opposing Dragon character.",
    },
    {
      title: "PRESSING THE ADVANTAGE",
      description:
        "Whenever he challenges a damaged character, ready this character after the challenge.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
          filter: [{ type: "has-classification", classification: "Dragon" }],
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
        target: "SELF",
        type: "ready",
      },
      id: "1ov-2",
      name: "PRESSING THE ADVANTAGE",
      text: "PRESSING THE ADVANTAGE Whenever he challenges a damaged character, ready this character after the challenge.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
        defender: {
          filters: [{ type: "damaged" }],
        },
      },
      type: "triggered",
    },
  ],
  i18n: princePhillipSwordsmanOfTheRealmI18n,
};
