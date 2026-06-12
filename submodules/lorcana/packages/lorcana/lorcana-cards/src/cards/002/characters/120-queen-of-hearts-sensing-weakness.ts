import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsSensingWeaknessI18n } from "./120-queen-of-hearts-sensing-weakness.i18n";

export const queenOfHeartsSensingWeakness: CharacterCard = {
  id: "DCW",
  canonicalId: "ci_Il0",
  reprints: ["set2-120", "set9-120"],
  cardType: "character",
  name: "Queen of Hearts",
  version: "Sensing Weakness",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "002",
  cardNumber: 120,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_51f0f91029254f61ab6d7b91efb0873b",
    tcgPlayer: 647670,
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "LET THE GAME BEGIN",
      description:
        "Whenever one of your characters challenges another character, you may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen"],
  abilities: [
    {
      id: "1je-1",
      cost: {
        ink: 2,
      },
      keyword: "Shift",
      type: "keyword",
      text: "Shift 2 {I}",
    },
    {
      id: "1je-2",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "LET THE GAME BEGIN",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
        restrictions: [{ type: "defender-is-character" }],
      },
      type: "triggered",
      text: "LET THE GAME BEGIN Whenever one of your characters challenges another character, you may draw a card.",
    },
  ],
  i18n: queenOfHeartsSensingWeaknessI18n,
};
