import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellTinyTacticianI18n } from "./194-tinker-bell-tiny-tactician.i18n";

export const tinkerBellTinyTactician: CharacterCard = {
  id: "cY7",
  canonicalId: "ci_Itn",
  reprints: ["set1-194", "set9-189"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Tiny Tactician",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "001",
  cardNumber: 194,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_24d837a8adab46e8ac2ffa7859489926",
    tcgPlayer: 650122,
  },
  text: [
    {
      title: "BATTLE PLANS",
      description: "{E} — Draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Fairy"],
  abilities: [
    {
      cost: {
        exert: true,
      },
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
      id: "n9y-1",
      name: "BATTLE PLANS",
      text: "BATTLE PLANS {E} — Draw a card, then choose and discard a card.",
      type: "activated",
    },
  ],
  i18n: tinkerBellTinyTacticianI18n,
};
