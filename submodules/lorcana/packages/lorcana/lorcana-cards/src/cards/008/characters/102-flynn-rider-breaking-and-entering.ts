import type { CharacterCard } from "@tcg/lorcana-types";
import { flynnRiderBreakingAndEnteringI18n } from "./102-flynn-rider-breaking-and-entering.i18n";

export const flynnRiderBreakingAndEntering: CharacterCard = {
  id: "gxV",
  canonicalId: "ci_gxV",
  reprints: ["set8-102"],
  cardType: "character",
  name: "Flynn Rider",
  version: "Breaking and Entering",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "008",
  cardNumber: 102,
  rarity: "common",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_b41f273d5c6b4abe99a596fd14435de1",
    tcgPlayer: 631415,
  },
  text: [
    {
      title: "THIS IS A VERY BIG DAY",
      description:
        "Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        type: "or",
        chooser: "OPPONENT",
        optionLabels: ["discard a card", "you gain 2 lore"],
        options: [
          {
            amount: 1,
            chosen: true,
            target: "OPPONENT",
            type: "discard",
          },
          {
            amount: 2,
            target: "CONTROLLER",
            type: "gain-lore",
          },
        ],
      },
      id: "o9w-1",
      name: "THIS IS A VERY BIG DAY",
      text: "THIS IS A VERY BIG DAY Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: flynnRiderBreakingAndEnteringI18n,
};
