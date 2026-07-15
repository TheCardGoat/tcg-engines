import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseStandardBearerEpicI18n } from "./221-mickey-mouse-standard-bearer-epic.i18n";

export const mickeyMouseStandardBearerEpic: CharacterCard = {
  id: "Q7d",
  canonicalId: "ci_7BU",
  slug: "lorcana-ci_7BU",
  printings: [
    {
      id: "set9-221-epic",
      artId: "ci_7BU-epic",
      setCode: "set9",
      collectorNumber: "221",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set4-188", "set9-185"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Standard Bearer",
  inkType: ["steel"],
  set: "009",
  cardNumber: 221,
  rarity: "common",
  specialRarity: "epic",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a78a6d864bae48dca06ed1dc25e75e3f",
    tcgPlayer: "650156",
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
  i18n: mickeyMouseStandardBearerEpicI18n,
};
