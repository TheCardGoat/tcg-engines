import type { ItemCard } from "@tcg/lorcana-types";
import { robinsBowI18n } from "./098-robins-bow.i18n";

export const robinsBow: ItemCard = {
  id: "Ezk",
  canonicalId: "ci_Ezk",
  reprints: ["set3-098"],
  cardType: "item",
  name: "Robin's Bow",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 98,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_1784510055ec43e49b13b2837192c1d1",
    tcgPlayer: 537827,
  },
  text: [
    {
      title: "FOREST'S GIFT",
      description: "{E} — Deal 1 damage to chosen damaged character or location.",
    },
    {
      title: "A BIT OF A LARK",
      description:
        "Whenever a character of yours named Robin Hood quests, you may ready this item.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character", "location"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
          filter: [
            {
              type: "status",
              status: "damaged",
            },
          ],
        },
        type: "deal-damage",
      },
      id: "1mp-1",
      name: "FOREST'S GIFT",
      text: "FOREST'S GIFT {E} — Deal 1 damage to chosen damaged character or location.",
      type: "activated",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "THIS_ITEM",
          type: "ready",
        },
        type: "optional",
      },
      id: "1mp-2",
      name: "A BIT OF A LARK",
      text: "A BIT OF A LARK Whenever a character of yours named Robin Hood quests, you may ready this item.",
      trigger: {
        event: "quest",
        on: {
          controller: "you",
          cardType: "character",
          name: "Robin Hood",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: robinsBowI18n,
};
