import type { ItemCard } from "@tcg/lorcana-types";
import { theTornCornerI18n } from "./133-the-torn-corner.i18n";

export const theTornCorner: ItemCard = {
  id: "6g2",
  canonicalId: "ci_6g2",
  slug: "lorcana-ci_6g2",
  printings: [
    {
      id: "set14-133",
      artId: "set14-133",
      setCode: "set14",
      collectorNumber: "133",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-133"],
  cardType: "item",
  name: "The Torn Corner",
  inkType: ["ruby"],
  franchise: "Coco",
  set: "014",
  cardNumber: 133,
  rarity: "rare",
  cost: 3,
  inkable: true,
  abilities: [
    {
      id: "6g2-1",
      name: "Fond Memories",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "resource-count",
          what: "cards-in-discard",
          controller: "you",
          comparison: "greater-or-equal",
          value: 10,
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "Fond Memories {E}, 1 {I} — If you have 10 or more cards in your discard, draw a card.",
    },
    {
      id: "6g2-2",
      name: "Mend the Photo",
      type: "triggered",
      trigger: {
        event: "discard",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "from-deck",
          },
        ],
      },
      condition: {
        type: "has-named-item",
        name: "Rivera Family Photo",
        controller: "you",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          cardType: "item",
          cost: "free",
          from: "discard",
          filter: {
            cardType: "item",
            sameInstanceAsSource: true,
          },
        },
      },
      sourceZones: ["discard"],
      text: "Mend the Photo When this card is put into your discard from your deck, if you have an item named Rivera Family Photo in play, you may play this card from your discard for free.",
    },
  ],
  text: [
    {
      title: "Fond Memories",
      description: "{E}, 1 {I} — If you have 10 or more cards in your discard, draw a card.",
    },
    {
      title: "Mend the Photo",
      description:
        "When this card is put into your discard from your deck, if you have an item named Rivera Family Photo in play, you may play this card from your discard for free.",
    },
  ],
  i18n: theTornCornerI18n,
};
