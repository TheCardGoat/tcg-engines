import type { CharacterCard } from "@tcg/lorcana-types";
import { lordDingwallBullheadedI18n } from "./186-lord-dingwall-bullheaded.i18n";

export const lordDingwallBullheaded: CharacterCard = {
  id: "NF5",
  canonicalId: "ci_NF5",
  reprints: ["set12-186"],
  cardType: "character",
  name: "Lord Dingwall",
  version: "Bullheaded",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 186,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9ef9a2258e3e4f7686f71bd39f88d777",
  },
  text: [
    {
      title: "FIGHTIN' TALK",
      description:
        "This character may enter play exerted to give chosen character Challenger +3 this turn. (They get +3 {S} while challenging.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "NF5-1",
      name: "FIGHTIN' TALK",
      type: "static",
      text: "FIGHTIN' TALK This character may enter play exerted to give chosen character Challenger +3 this turn.",
      effect: {
        type: "restriction",
        restriction: "may-enter-play-exerted",
        target: "SELF",
      },
    },
    {
      id: "NF5-2",
      name: "FIGHTIN' TALK",
      type: "triggered",
      text: "FIGHTIN' TALK This character may enter play exerted to give chosen character Challenger +3 this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 3,
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: lordDingwallBullheadedI18n,
};
