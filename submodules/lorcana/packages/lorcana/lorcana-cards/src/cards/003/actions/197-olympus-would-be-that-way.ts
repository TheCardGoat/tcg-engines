import type { ActionCard } from "@tcg/lorcana-types";
import { olympusWouldBeThatWayI18n } from "./197-olympus-would-be-that-way.i18n";

export const olympusWouldBeThatWay: ActionCard = {
  id: "N1o",
  canonicalId: "ci_N1o",
  reprints: ["set3-197"],
  cardType: "action",
  name: "Olympus Would Be That Way",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  cardNumber: 197,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_68b76d76c7b1460cbae204778e1da3f2",
    tcgPlayer: 539117,
  },
  text: "Your characters get +3 {S} while challenging a location this turn.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        duration: "this-turn",
        target: "YOUR_CHARACTERS",
        condition: {
          type: "in-challenge",
          role: "attacker",
          againstCardType: "location",
        },
      },
    },
  ],
  i18n: olympusWouldBeThatWayI18n,
};
