import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellGiantFairyI18n } from "./193-tinker-bell-giant-fairy.i18n";
import { shift } from "../../../helpers/abilities";

export const tinkerBellGiantFairy: CharacterCard = {
  id: "gVL",
  canonicalId: "ci_6gQ",
  reprints: ["set1-193", "set9-188"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Giant Fairy",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "001",
  cardNumber: 193,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a77ba07844374c399becfa3d49262642",
    tcgPlayer: 650121,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "ROCK THE BOAT",
      description: "When you play this character, deal 1 damage to each opposing character.",
    },
    {
      title: "PUNY PIRATE!",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Fairy"],
  abilities: [
    shift(4),
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "pf8-2",
      name: "ROCK THE BOAT",
      text: "ROCK THE BOAT When you play this character, deal 1 damage to each opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "pf8-3",
      name: "PUNY PIRATE!",
      text: "PUNY PIRATE! During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [{ type: "during-turn", whose: "your" }],
      },
      type: "triggered",
    },
  ],
  i18n: tinkerBellGiantFairyI18n,
};
