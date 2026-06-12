import type { CharacterCard } from "@tcg/lorcana-types";
import { monstroInfamousWhaleI18n } from "./064-monstro-infamous-whale.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const monstroInfamousWhale: CharacterCard = {
  id: "kcf",
  canonicalId: "ci_kcf",
  reprints: ["set8-064"],
  cardType: "character",
  name: "Monstro",
  version: "Infamous Whale",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "008",
  cardNumber: 64,
  rarity: "rare",
  cost: 8,
  strength: 6,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bb513d50f4fb44aab988cf4dca6c9fe5",
    tcgPlayer: 631393,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "FULL BREACH",
      description:
        "Choose and discard a card — Ready this character. He can't quest for the rest of this turn.",
    },
    {
      title: "FULL BREACH + COMBO",
      description: "Draw your entire deck, then discard that many cards from hand.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    rush,
    {
      id: "7w3-2",
      name: "FULL BREACH",
      text: "FULL BREACH Choose and discard a card – Ready this character. He can't quest for the rest of this turn.",
      type: "activated",
      cost: {
        discardCards: 1,
        discardChosen: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: "SELF",
            restriction: "cant-quest",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
      },
    },
    {
      id: "kcf-combo-full-breach",
      name: "FULL BREACH + COMBO",
      text: "SHORTCUT: Draw your entire deck, then discard that many cards from hand.",
      type: "activated",
      condition: {
        type: "or",
        conditions: [
          { type: "has-granted-ability", abilityId: "draw-a-card-when-exerted" },
          { type: "has-granted-ability", abilityId: "9qd-1a" },
        ],
      },
      cost: {},
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: {
              type: "filtered-count",
              filters: [],
              owner: "you",
              zones: ["deck"],
            },
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: "DRAWN_COUNT",
            target: "CONTROLLER",
            chosen: true,
          },
        ],
      },
    },
  ],
  i18n: monstroInfamousWhaleI18n,
};
