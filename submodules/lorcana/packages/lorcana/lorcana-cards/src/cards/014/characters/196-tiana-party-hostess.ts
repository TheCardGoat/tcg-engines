import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../../helpers/abilities";
import { tianaPartyHostessI18n } from "./196-tiana-party-hostess.i18n";

export const tianaPartyHostess: CharacterCard = {
  id: "j6f",
  canonicalId: "ci_j6f",
  slug: "lorcana-ci_j6f",
  printings: [
    {
      id: "set14-196",
      artId: "set14-196",
      setCode: "set14",
      collectorNumber: "196",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set14-196"],
  cardType: "character",
  name: "Tiana",
  version: "Party Hostess",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "014",
  cardNumber: 196,
  rarity: "legendary",
  cost: 7,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_181b597fbbc3457384a3b4d545807df3",
  },
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "IDEAL VENUE",
      description:
        "When you play this character, you may draw 2 cards, then choose and discard a card. If you discarded a location card this way, you may play it from your discard for free.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    shift(5),
    {
      id: "tiana-1",
      name: "IDEAL VENUE",
      type: "triggered",
      text: "IDEAL VENUE When you play this character, you may draw 2 cards, then choose and discard a card. If you discarded a location card this way, you may play it from your discard for free.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              amount: 2,
              target: "CONTROLLER",
            },
            {
              type: "discard",
              amount: 1,
              target: "CONTROLLER",
              from: "hand",
              chosen: true,
            },
            {
              type: "conditional",
              condition: {
                type: "discarded-card-is-card-type",
                cardType: "location",
              },
              then: {
                type: "optional",
                chooser: "CONTROLLER",
                effect: {
                  type: "play-card",
                  from: "discard",
                  cost: "free",
                  cardType: "location",
                  filter: { inEventSnapshotDiscardedCards: true },
                },
              },
            },
          ],
        },
      },
    },
  ],
  i18n: tianaPartyHostessI18n,
};
