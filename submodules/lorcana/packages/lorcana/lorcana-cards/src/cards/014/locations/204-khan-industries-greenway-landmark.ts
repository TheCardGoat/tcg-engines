import type { LocationCard } from "@tcg/lorcana-types";
import { khanIndustriesGreenwayLandmarkI18n } from "./204-khan-industries-greenway-landmark.i18n";

export const khanIndustriesGreenwayLandmark: LocationCard = {
  id: "RAI",
  canonicalId: "ci_RAI",
  slug: "lorcana-ci_RAI",
  printings: [
    {
      id: "set14-204",
      artId: "set14-204",
      setCode: "set14",
      collectorNumber: "204",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-204"],
  cardType: "location",
  name: "Khan Industries",
  version: "Greenway Landmark",
  inkType: ["steel"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 204,
  rarity: "rare",
  cost: 5,
  willpower: 8,
  moveCost: 2,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "High Security",
      description: "Characters can't be challenged while here.",
    },
  ],
  abilities: [
    {
      id: "RAI-1",
      name: "High Security",
      text: "High Security Characters can't be challenged while here.",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "same-location-as-source",
            },
          ],
        },
      },
    },
  ],
  classifications: ["Hyperia City"],
  i18n: khanIndustriesGreenwayLandmarkI18n,
};
