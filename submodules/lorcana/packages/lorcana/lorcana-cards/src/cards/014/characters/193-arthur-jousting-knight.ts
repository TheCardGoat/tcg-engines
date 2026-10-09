import type { CharacterCard } from "@tcg/lorcana-types";
import { shift, challenger } from "../../../helpers/abilities";
import { arthurJoustingKnightI18n } from "./193-arthur-jousting-knight.i18n";

export const arthurJoustingKnight: CharacterCard = {
  id: "GHQ",
  canonicalId: "ci_GHQ",
  slug: "lorcana-ci_GHQ",
  printings: [
    {
      id: "set14-193",
      artId: "set14-193",
      setCode: "set14",
      collectorNumber: "193",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-193"],
  cardType: "character",
  name: "Arthur",
  version: "Jousting Knight",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 193,
  rarity: "super_rare",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_494b7de7c7f64b67bb14ac3b4050514b",
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "Challenger +2",
    },
    {
      title: "VICTORY PURSE",
      description:
        "During your turn, whenever this character banishes another character in a challenge, draw a card and get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Knight"],
  abilities: [
    shift(4),
    challenger(2),
    {
      id: "jousting-knight-1",
      name: "VICTORY PURSE",
      type: "triggered",
      text: "VICTORY PURSE During your turn, whenever this character banishes another character in a challenge, draw a card and get 1 ink drop.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "gain-ink-drop",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: arthurJoustingKnightI18n,
};
