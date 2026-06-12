import type { CharacterCard } from "@tcg/lorcana-types";
import { goliathClanLeaderI18n } from "./173-goliath-clan-leader.i18n";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const goliathClanLeader: CharacterCard = {
  id: "Y3G",
  canonicalId: "ci_KcO",
  reprints: ["set10-173"],
  cardType: "character",
  name: "Goliath",
  version: "Clan Leader",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 173,
  rarity: "legendary",
  cost: 6,
  strength: 6,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8941521977e54d6fa2baaae91d13fb6e",
    tcgPlayer: 660035,
  },
  text: [
    {
      title: "DUSK TO DAWN",
      description:
        "At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Gargoyle"],
  abilities: [
    // DUSK TO DAWN — fires at the end of Goliath controller's own turn
    {
      id: "KcO-1",
      name: "DUSK TO DAWN",
      text: "DUSK TO DAWN At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "CONTROLLER",
        timing: "at",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "resource-count",
          what: "cards-in-hand",
          controller: "you",
          comparison: "greater-than",
          value: 2,
        },
        then: {
          type: "discard",
          chosen: true,
          amount: {
            type: "difference",
            left: {
              type: "cards-in-hand",
              controller: "you",
            },
            right: 2,
          },
          target: "CONTROLLER",
        },
        else: {
          type: "conditional",
          condition: {
            type: "resource-count",
            what: "cards-in-hand",
            controller: "you",
            comparison: "less-than",
            value: 2,
          },
          then: {
            type: "draw-until-hand-size",
            size: 2,
            target: "CONTROLLER",
          },
        },
      },
    },
    // DUSK TO DAWN — fires at the end of the opponent's turn
    {
      id: "KcO-2",
      name: "DUSK TO DAWN",
      text: "DUSK TO DAWN At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "OPPONENT",
        timing: "at",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "resource-count",
          what: "cards-in-hand",
          controller: "opponent",
          comparison: "greater-than",
          value: 2,
        },
        then: {
          type: "discard",
          chosen: true,
          amount: {
            type: "difference",
            left: {
              type: "cards-in-hand",
              controller: "opponent",
            },
            right: 2,
          },
          target: "OPPONENT",
        },
        else: {
          type: "conditional",
          condition: {
            type: "resource-count",
            what: "cards-in-hand",
            controller: "opponent",
            comparison: "less-than",
            value: 2,
          },
          then: {
            type: "draw-until-hand-size",
            size: 2,
            target: "OPPONENT",
          },
        },
      },
    },
    stoneByDay,
  ],
  i18n: goliathClanLeaderI18n,
};
