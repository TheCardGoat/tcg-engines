import type { CharacterCard } from "@tcg/lorcana-types";
import { jockAttentiveUncleI18n } from "./112-jock-attentive-uncle.i18n";

export const jockAttentiveUncle: CharacterCard = {
  id: "uXU",
  canonicalId: "ci_uXU",
  reprints: ["set8-112"],
  cardType: "character",
  name: "Jock",
  version: "Attentive Uncle",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "008",
  cardNumber: 112,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_69f2afcfdc244d3c9fd71c4dcfd39c25",
    tcgPlayer: 631422,
  },
  text: [
    {
      title: "VOICE OF EXPERIENCE",
      description:
        "When you play this character, if you have 3 or more other characters in play, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          excludeSelf: true,
        },
        comparison: {
          operator: "gte",
          value: 3,
        },
      },
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "17d-1",
      name: "VOICE OF EXPERIENCE",
      text: "VOICE OF EXPERIENCE When you play this character, if you have 3 or more other characters in play, gain 2 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: jockAttentiveUncleI18n,
};
