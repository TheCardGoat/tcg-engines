import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseLeaderOfTheBandI18n } from "./015-mickey-mouse-leader-of-the-band.i18n";
import { support } from "../../../helpers/abilities/support";

export const mickeyMouseLeaderOfTheBand: CharacterCard = {
  id: "HGH",
  canonicalId: "ci_HGH",
  reprints: ["set4-015"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Leader of the Band",
  inkType: ["amber"],
  set: "004",
  cardNumber: 15,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_74dbff9983194285973b48e74a2c3f90",
    tcgPlayer: 549522,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "STRIKE UP THE MUSIC",
      description: "When you play this character, chosen character gains Support this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    support,
    {
      effect: {
        duration: "this-turn",
        keyword: "Support",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "1ow-2",
      name: "STRIKE UP THE MUSIC",
      text: "STRIKE UP THE MUSIC When you play this character, chosen character gains Support this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: mickeyMouseLeaderOfTheBandI18n,
};
