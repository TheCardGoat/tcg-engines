import type { CharacterCard } from "@tcg/lorcana-types";
import { jaqConnoisseurOfClimbingI18n } from "./077-jaq-connoisseur-of-climbing.i18n";

export const jaqConnoisseurOfClimbing: CharacterCard = {
  id: "Ck0",
  canonicalId: "ci_Ck0",
  reprints: ["set4-077"],
  cardType: "character",
  name: "Jaq",
  version: "Connoisseur of Climbing",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "004",
  cardNumber: 77,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b0d75ae5da0646e797f1563c8811e629",
    tcgPlayer: 547781,
  },
  text: [
    {
      title: "SNEAKY IDEA",
      description:
        "When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        keyword: "Reckless",
        duration: "their-next-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "gain-keyword",
      },
      id: "1u5-1",
      name: "SNEAKY IDEA",
      text: "SNEAKY IDEA When you play this character, chosen opposing character gains Reckless during their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: jaqConnoisseurOfClimbingI18n,
};
