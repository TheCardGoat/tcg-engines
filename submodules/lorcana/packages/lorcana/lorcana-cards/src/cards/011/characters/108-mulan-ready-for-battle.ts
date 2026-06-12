import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanReadyForBattleI18n } from "./108-mulan-ready-for-battle.i18n";

export const mulanReadyForBattle: CharacterCard = {
  id: "rjK",
  canonicalId: "ci_rjK",
  reprints: ["set11-108"],
  cardType: "character",
  name: "Mulan",
  version: "Ready for Battle",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 108,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_96a789fd5e1943adbb12361ff791aec9",
    tcgPlayer: 675497,
  },
  text: [
    {
      title: "NOBLE SPIRIT",
      description:
        "If you have a character in play with damage, you pay 1 {I} less to play this character.",
    },
    {
      title: "FIGHTING SPIRIT",
      description:
        "If you have a character in play with 5 or more, you pay 1 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "zz5-1",
      name: "NOBLE SPIRIT",
      condition: {
        type: "resource-count",
        what: "damaged-characters",
        controller: "you",
        comparison: "greater-or-equal",
        value: 1,
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
      },
      sourceZones: ["hand"],
      text: "NOBLE SPIRIT If you have a character in play with damage, you pay 1 {I} less to play this character.",
      type: "static",
    },
    {
      id: "zz5-2",
      name: "FIGHTING SPIRIT",
      condition: {
        type: "has-character-with-strength",
        comparison: "greater-or-equal",
        value: 5,
        controller: "you",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
      },
      sourceZones: ["hand"],
      text: "FIGHTING SPIRIT If you have a character in play with 5 {S} or more, you pay 1 {I} less to play this character.",
      type: "static",
    },
  ],
  i18n: mulanReadyForBattleI18n,
};
