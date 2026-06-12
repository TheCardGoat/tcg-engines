import type { CharacterCard } from "@tcg/lorcana-types";
import { gaetanMoliereCleverBurrowerI18n } from "./080-gaetan-moliere-clever-burrower.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const gaetanMoliereCleverBurrower: CharacterCard = {
  id: "btJ",
  canonicalId: "ci_btJ",
  reprints: ["set12-080"],
  cardType: "character",
  name: "Gaetan Moliere",
  version: "Clever Burrower",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 80,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_29ffb2df930744e7ba00db79014e59be",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "UNEARTH",
      description:
        "Whenever this character quests, you may draw 2 cards, then choose and discard 2 cards.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    evasive,
    {
      id: "btJ-2",
      name: "UNEARTH",
      type: "triggered",
      text: "UNEARTH Whenever this character quests, you may draw 2 cards, then choose and discard 2 cards.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
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
              amount: 2,
              target: "CONTROLLER",
              chosen: true,
            },
          ],
        },
      },
    },
  ],
  i18n: gaetanMoliereCleverBurrowerI18n,
};
