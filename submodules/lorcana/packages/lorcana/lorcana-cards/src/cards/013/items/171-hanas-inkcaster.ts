import type { ItemCard } from "@tcg/lorcana-types";
import { hanasInkcasterI18n } from "./171-hanas-inkcaster.i18n";

export const hanasInkcaster: ItemCard = {
  id: "3gV",
  canonicalId: "ci_3gV",
  slug: "lorcana-ci_3gV",
  printings: [
    {
      id: "set13-171",
      artId: "set13-171",
      setCode: "set13",
      collectorNumber: "171",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-171"],
  cardType: "item",
  name: "Hana's Inkcaster",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "013",
  cardNumber: 171,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  text: [
    {
      title: "Rejuvenating Flourish",
      description:
        "{E} — Remove up to 2 damage from chosen character. If there's a card under that character, they gain Resist +1 until the start of your next turn.",
    },
  ],
  abilities: [
    {
      type: "activated",
      name: "REJUVENATING FLOURISH",
      text: "REJUVENATING FLOURISH {E} — Remove up to 2 damage from chosen character. If there's a card under that character, they gain Resist +1 until the start of your next turn.",
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: 2,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "previous-target-has-card-under",
            },
            then: {
              type: "gain-keyword",
              keyword: "Resist",
              value: 1,
              duration: "until-start-of-next-turn",
              target: {
                ref: "previous-target",
              },
            },
          },
        ],
      },
    },
  ],
  i18n: hanasInkcasterI18n,
};
