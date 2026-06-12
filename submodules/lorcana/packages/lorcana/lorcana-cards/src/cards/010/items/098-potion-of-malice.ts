import type { ItemCard } from "@tcg/lorcana-types";
import { potionOfMaliceI18n } from "./098-potion-of-malice.i18n";

export const potionOfMalice: ItemCard = {
  id: "l7A",
  canonicalId: "ci_l7A",
  reprints: ["set10-098"],
  cardType: "item",
  name: "Potion of Malice",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "010",
  cardNumber: 98,
  rarity: "common",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_9df06512bc4c4b928c62b8d263e2bf51",
    tcgPlayer: 658785,
  },
  text: [
    {
      title: "SUPPRESSED ANGER",
      description: "{E}, 1 {I} — Put 1 damage counter on chosen character.",
    },
    {
      title: "MINDLESS RAGE",
      description:
        "{E}, Banish this item — Each opposing damaged character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "put-damage",
      },
      id: "ifu-1",
      name: "SUPPRESSED ANGER",
      text: "SUPPRESSED ANGER {E}, 1 {I} — Put 1 damage counter on chosen character.",
      type: "activated",
    },
    {
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Reckless",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "damaged",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "ifu-2",
      name: "MINDLESS RAGE",
      text: "MINDLESS RAGE {E}, Banish this item — Each opposing damaged character gains Reckless until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: potionOfMaliceI18n,
};
