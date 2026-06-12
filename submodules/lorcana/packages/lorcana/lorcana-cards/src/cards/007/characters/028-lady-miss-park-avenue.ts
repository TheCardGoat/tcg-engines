import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyMissParkAvenueI18n } from "./028-lady-miss-park-avenue.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const ladyMissParkAvenue: CharacterCard = {
  id: "Yv7",
  canonicalId: "ci_Yv7",
  reprints: ["set7-028"],
  cardType: "character",
  name: "Lady",
  version: "Miss Park Avenue",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  cardNumber: 28,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_50725381dc53418bbb9acdb5df2d16c2",
    tcgPlayer: 618265,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "SOMETHING WONDERFUL",
      description:
        "When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(3),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: {
              upTo: 2,
            },
            owner: "you",
            zones: ["discard"],
            cardTypes: ["character"],
            filter: [
              {
                type: "cost-comparison",
                comparison: "less-or-equal",
                value: 2,
              },
            ],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "188-2",
      name: "SOMETHING WONDERFUL",
      text: "SOMETHING WONDERFUL When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: ladyMissParkAvenueI18n,
};
