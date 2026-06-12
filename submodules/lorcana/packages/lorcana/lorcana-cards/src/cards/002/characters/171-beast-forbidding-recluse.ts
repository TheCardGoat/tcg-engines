import type { CharacterCard } from "@tcg/lorcana-types";
import { beastForbiddingRecluseI18n } from "./171-beast-forbidding-recluse.i18n";

export const beastForbiddingRecluse: CharacterCard = {
  id: "LxQ",
  canonicalId: "ci_LxQ",
  reprints: ["set2-171"],
  cardType: "character",
  name: "Beast",
  version: "Forbidding Recluse",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 171,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_eb28d5bab74d4784a6a59b2c5cfae6bc",
    tcgPlayer: 527533,
  },
  text: [
    {
      title: "YOU'RE NOT WELCOME HERE",
      description: "When you play this character, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "682-1",
      name: "YOU'RE NOT WELCOME HERE",
      text: "YOU'RE NOT WELCOME HERE When you play this character, you may deal 1 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: beastForbiddingRecluseI18n,
};
