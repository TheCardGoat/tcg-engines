import type { ActionCard } from "@tcg/lorcana-types";
import { foodFightI18n } from "./199-food-fight.i18n";

export const foodFight: ActionCard = {
  id: "jt8",
  canonicalId: "ci_jt8",
  reprints: ["set5-199"],
  cardType: "action",
  name: "Food Fight!",
  inkType: ["steel"],
  set: "005",
  cardNumber: 199,
  rarity: "uncommon",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_301228de8de94aa382a1cface63a3422",
    tcgPlayer: 561494,
  },
  text: 'Your characters gain "{E}, 1 {I} — Deal 1 damage to chosen character" this turn.',
  abilities: [
    {
      id: "1ww-1",
      type: "action",
      text: "Your characters gain “{E}, 1 {I} — Deal 1 damage to chosen character” this turn.",
      effect: {
        type: "grant-ability",
        duration: "this-turn",
        target: "YOUR_CHARACTERS",
        ability: {
          id: "food-fight-damage",
          type: "activated",
          text: "{E}, 1 {I} — Deal 1 damage to chosen character.",
          cost: {
            exert: true,
            ink: 1,
          },
          effect: {
            type: "deal-damage",
            amount: 1,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      },
    },
  ],
  i18n: foodFightI18n,
};
