import type { ItemCard } from "@tcg/lorcana-types";
import { atlanteanCrystalI18n } from "./180-atlantean-crystal.i18n";

export const atlanteanCrystal: ItemCard = {
  id: "ReY",
  canonicalId: "ci_ReY",
  reprints: ["set8-180"],
  cardType: "item",
  name: "Atlantean Crystal",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "008",
  cardNumber: 180,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a6c7778d84d249c8be2863e3fb67678b",
    tcgPlayer: 631685,
  },
  text: [
    {
      title: "SHIELDING LIGHT",
      description:
        "{E}, 2 {I} — Chosen character gains Resist +2 and Support until the start of your next turn. (Damage dealt to them is reduced by 2. Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 2,
            duration: "until-start-of-next-turn",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
          },
          {
            type: "gain-keyword",
            keyword: "Support",
            duration: "until-start-of-next-turn",
            target: {
              ref: "previous-target",
            },
          },
        ],
      },
      id: "1y7-1",
      name: "SHIELDING LIGHT",
      text: "SHIELDING LIGHT {E}, 2 {I} — Chosen character gains Resist +2 and Support until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: atlanteanCrystalI18n,
};
