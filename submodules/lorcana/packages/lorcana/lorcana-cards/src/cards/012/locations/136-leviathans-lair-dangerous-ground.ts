import type { LocationCard } from "@tcg/lorcana-types";
import { leviathansLairDangerousGroundI18n } from "./136-leviathans-lair-dangerous-ground.i18n";

export const leviathansLairDangerousGround: LocationCard = {
  id: "MTW",
  canonicalId: "ci_MTW",
  reprints: ["set12-136"],
  cardType: "location",
  name: "Leviathan's Lair",
  version: "Dangerous Ground",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 136,
  rarity: "rare",
  cost: 4,
  willpower: 4,
  moveCost: 1,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_6390182da0394996b7ea68dee5b0de54",
  },
  text: [
    {
      title: "LOST TO THE DUNES",
      description:
        "When this location is banished, each opponent chooses and banishes one of their characters.",
    },
  ],
  abilities: [
    {
      id: "MTW-1",
      name: "LOST TO THE DUNES",
      text: "LOST TO THE DUNES When this location is banished, each opponent chooses and banishes one of their characters.",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "for-each-opponent",
        effect: {
          type: "banish",
          chosenBy: "opponent",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
  i18n: leviathansLairDangerousGroundI18n,
};
