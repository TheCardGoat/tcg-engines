import type { CharacterCard } from "@tcg/lorcana-types";
import { scroogeMcduckShushAgentP3PromoI18n } from "./p3-036-scrooge-mcduck-shush-agent-promo.i18n";

export const scroogeMcduckShushAgentP3Promo: CharacterCard = {
  id: "lX3",
  canonicalId: "ci_8Wc",
  slug: "lorcana-ci_8Wc",
  printings: [
    {
      id: "set10-p3-036-promo",
      artId: "ci_8Wc-promo",
      setCode: "set10",
      collectorNumber: "36",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set10-089"],
  cardType: "character",
  name: "Scrooge McDuck",
  version: "S.H.U.S.H. Agent",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 36,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_4572c32844ee48398f43a1c7aa86826d",
    tcgPlayer: "659464",
  },
  text: [
    {
      title: "BACKUP PLAN",
      description: "When you play this character, draw a card, then choose and discard a card.",
    },
    {
      title: "ON THE MOVE",
      description:
        "When this character is challenged, return this card to your hand. (No damage is dealt in that challenge.)",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            amount: 1,
            chosen: true,
            target: "CONTROLLER",
            type: "discard",
          },
        ],
        type: "sequence",
      },
      id: "1l2-1",
      name: "BACKUP PLAN",
      text: "BACKUP PLAN When you play this character, draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        target: "SELF",
        type: "return-to-hand",
      },
      id: "1l2-2",
      name: "ON THE MOVE",
      text: "ON THE MOVE When this character is challenged, return this card to your hand.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: scroogeMcduckShushAgentP3PromoI18n,
};
