import type { CharacterCard } from "@tcg/lorcana-types";
import { trustyAlongForTheRideI18n } from "./069-trusty-along-for-the-ride.i18n";

export const trustyAlongForTheRide: CharacterCard = {
  id: "gha",
  canonicalId: "ci_gha",
  slug: "lorcana-ci_gha",
  printings: [
    {
      id: "set14-069",
      artId: "set14-069",
      setCode: "set14",
      collectorNumber: "69",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-069"],
  cardType: "character",
  name: "Trusty",
  version: "Along for the Ride",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "014",
  cardNumber: 69,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 7,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_35bfb0c5150a4ea590077426f99374a2",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: trustyAlongForTheRideI18n,
};
