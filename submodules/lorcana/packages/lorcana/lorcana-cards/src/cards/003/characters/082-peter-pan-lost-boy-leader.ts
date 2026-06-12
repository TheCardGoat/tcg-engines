import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanLostBoyLeaderI18n } from "./082-peter-pan-lost-boy-leader.i18n";

export const peterPanLostBoyLeader: CharacterCard = {
  id: "ous",
  canonicalId: "ci_ous",
  reprints: ["set3-082"],
  cardType: "character",
  name: "Peter Pan",
  version: "Lost Boy Leader",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 82,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d4d29339b89f4a0aaeeb42f533e6fbbc",
    tcgPlayer: 531823,
  },
  text: "I CAME TO LISTEN TO THE STORIES Once per turn, when this character moves to a location, gain lore equal to that location's {L}.",
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "ous-1",
      type: "triggered",
      name: "I CAME TO LISTEN TO THE STORIES",
      text: "I CAME TO LISTEN TO THE STORIES Once per turn, when this character moves to a location, gain lore equal to that location's {L}.",
      trigger: {
        event: "move",
        on: "SELF",
        timing: "whenever",
        restrictions: [{ type: "once-per-turn" }],
      },
      effect: {
        type: "gain-lore",
        target: "CONTROLLER",
        amount: {
          type: "source-attribute",
          attribute: "location-lore",
        },
      },
    },
  ],
  i18n: peterPanLostBoyLeaderI18n,
};
