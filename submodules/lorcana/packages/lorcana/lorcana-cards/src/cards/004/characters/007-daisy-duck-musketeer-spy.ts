import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckMusketeerSpyI18n } from "./007-daisy-duck-musketeer-spy.i18n";

export const daisyDuckMusketeerSpy: CharacterCard = {
  id: "de6",
  canonicalId: "ci_rUa",
  reprints: ["set4-007", "set9-011"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Musketeer Spy",
  inkType: ["amber"],
  set: "004",
  cardNumber: 7,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_df9fc4392077467ab80211e4c47b6b2c",
    tcgPlayer: 649960,
  },
  text: [
    {
      title: "INFILTRATION",
      description: "When you play this character, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "19a-1",
      name: "INFILTRATION",
      text: "INFILTRATION When you play this character, each opponent chooses and discards a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: daisyDuckMusketeerSpyI18n,
};
