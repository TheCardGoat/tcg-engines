import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseStandardBearerI18n } from "./188-mickey-mouse-standard-bearer.i18n";

export const mickeyMouseStandardBearer: CharacterCard = {
  id: "IJ9",
  canonicalId: "ci_7BU",
  reprints: ["set4-188", "set9-185"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Standard Bearer",
  inkType: ["steel"],
  set: "004",
  cardNumber: 188,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a78a6d864bae48dca06ed1dc25e75e3f",
    tcgPlayer: 650156,
  },
  text: [
    {
      title: "STAND STRONG",
      description:
        "When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "k4b-1",
      name: "STAND STRONG",
      text: "STAND STRONG When you play this character, chosen character gains Challenger +2 this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: mickeyMouseStandardBearerI18n,
};
