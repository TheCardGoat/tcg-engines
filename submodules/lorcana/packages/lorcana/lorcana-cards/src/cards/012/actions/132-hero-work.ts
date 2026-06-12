import type { ActionCard } from "@tcg/lorcana-types";
import { heroWorkI18n } from "./132-hero-work.i18n";

export const heroWork: ActionCard = {
  id: "5Mc",
  canonicalId: "ci_5Mc",
  reprints: ["set12-132"],
  cardType: "action",
  name: "Hero Work",
  inkType: ["ruby"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 132,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0e38efe0ee78447b8966de3f57656c86",
  },
  text: 'Your characters get +1 {S} this turn. Your Hero characters gain "Whenever this character challenges another character, each opponent loses 1 lore and you gain 1 lore" this turn.',
  abilities: [
    {
      type: "action",
      text: 'Your characters get +1 {S} this turn. Your Hero characters gain "Whenever this character challenges another character, each opponent loses 1 lore and you gain 1 lore" this turn.',
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 1,
            duration: "this-turn",
            target: "YOUR_CHARACTERS",
          },
          {
            type: "grant-ability",
            duration: "this-turn",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "has-classification",
                  classification: "Hero",
                },
              ],
            },
            ability: {
              id: "hero-work-challenge-lore-swing",
              type: "triggered",
              text: "Whenever this character challenges another character, each opponent loses 1 lore and you gain 1 lore.",
              trigger: {
                event: "challenge",
                timing: "whenever",
                on: "SELF",
              },
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "lose-lore",
                    amount: 1,
                    target: "EACH_OPPONENT",
                  },
                  {
                    type: "gain-lore",
                    amount: 1,
                    target: "CONTROLLER",
                  },
                ],
              },
            },
          },
        ],
      },
    },
  ],
  i18n: heroWorkI18n,
};
