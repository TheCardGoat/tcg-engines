import type { CharacterCard } from "@tcg/lorcana-types";
import { darlingDearBelovedWifeI18n } from "./016-darling-dear-beloved-wife.i18n";

export const darlingDearBelovedWife: CharacterCard = {
  id: "rnQ",
  canonicalId: "ci_rnQ",
  reprints: ["set8-016"],
  cardType: "character",
  name: "Darling Dear",
  version: "Beloved Wife",
  inkType: ["amber"],
  franchise: "Lady and the Tramp",
  set: "008",
  cardNumber: 16,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_135ceb6f79ed43aa90077b344b26ea10",
    tcgPlayer: 631360,
  },
  text: [
    {
      title: "HOW SWEET",
      description: "When you play this character, chosen character gets +2 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "lore",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1j2-1",
      name: "HOW SWEET",
      text: "HOW SWEET When you play this character, chosen character gets +2 {L} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: darlingDearBelovedWifeI18n,
};
