import type { LocationCard } from "@tcg/lorcana-types";
import { atlanticaConcertHallI18n } from "./034-atlantica-concert-hall.i18n";

export const atlanticaConcertHall: LocationCard = {
  id: "256",
  canonicalId: "ci_b67",
  slug: "lorcana-ci_b67",
  printings: [
    {
      id: "set9-034",
      artId: "set9-034",
      setCode: "set9",
      collectorNumber: "34",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set4-033", "set9-034"],
  cardType: "location",
  name: "Atlantica",
  version: "Concert Hall",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "009",
  cardNumber: 34,
  rarity: "common",
  cost: 1,
  willpower: 6,
  moveCost: 2,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_74c2fa84872c4c68ac1eb0e2a7a8affc",
    tcgPlayer: "649981",
  },
  text: [
    {
      title: "UNDERWATER ACOUSTICS",
      description: "Characters count as having +2 cost to sing songs while here.",
    },
  ],
  abilities: [
    {
      id: "6b5-1",
      name: "UNDERWATER ACOUSTICS",
      text: "UNDERWATER ACOUSTICS Characters count as having +2 cost to sing songs while here.",
      type: "static",
      effect: {
        type: "property-modification",
        property: "singer-threshold",
        operation: "add",
        value: "2",
        target: "CHARACTERS_HERE",
      },
    },
  ],
  i18n: atlanticaConcertHallI18n,
};
