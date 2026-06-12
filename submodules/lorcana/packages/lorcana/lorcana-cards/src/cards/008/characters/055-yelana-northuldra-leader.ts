import type { CharacterCard } from "@tcg/lorcana-types";
import { yelanaNorthuldraLeaderI18n } from "./055-yelana-northuldra-leader.i18n";

export const yelanaNorthuldraLeader: CharacterCard = {
  id: "umw",
  canonicalId: "ci_umw",
  reprints: ["set8-055"],
  cardType: "character",
  name: "Yelana",
  version: "Northuldra Leader",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "008",
  cardNumber: 55,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f5703e0094dd406ba95d5bb9dc6e195c",
    tcgPlayer: 631388,
  },
  text: [
    {
      title: "WE ONLY TRUST NATURE",
      description:
        "When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
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
      id: "17l-1",
      name: "WE ONLY TRUST NATURE",
      text: "WE ONLY TRUST NATURE When you play this character, chosen character gains Challenger +2 this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: yelanaNorthuldraLeaderI18n,
};
