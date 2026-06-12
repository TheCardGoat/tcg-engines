import type { ItemCard } from "@tcg/lorcana-types";
import { potionOfMightI18n } from "./132-potion-of-might.i18n";

export const potionOfMight: ItemCard = {
  id: "k9I",
  canonicalId: "ci_k9I",
  reprints: ["set5-132"],
  cardType: "item",
  name: "Potion of Might",
  inkType: ["ruby"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 132,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_96709c5ceb00448ab2b8e4b039319183",
    tcgPlayer: 561965,
  },
  text: [
    {
      title: "VILE CONCOCTION 1",
      description:
        "{I}, Banish this item — Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.",
    },
  ],
  abilities: [
    {
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        condition: {
          type: "target-query",
          query: {
            selector: "all",
            reference: "selected-first",
            filters: [
              {
                type: "has-classification",
                classification: "Villain",
              },
            ],
          },
          comparison: {
            operator: "gte",
            value: 1,
          },
        },
        then: {
          duration: "this-turn",
          modifier: 4,
          stat: "strength",
          target: "CHOSEN_CHARACTER",
          type: "modify-stat",
        },
        else: {
          duration: "this-turn",
          modifier: 3,
          stat: "strength",
          target: "CHOSEN_CHARACTER",
          type: "modify-stat",
        },
        type: "conditional",
      },
      id: "6dr-1",
      name: "VILE CONCOCTION 1",
      text: "VILE CONCOCTION 1 {I}, Banish this item — Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.",
      type: "activated",
    },
  ],
  i18n: potionOfMightI18n,
};
