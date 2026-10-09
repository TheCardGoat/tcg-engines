import type { LocationCard } from "@tcg/lorcana-types";
import { khanStadiumStateOfTheArtI18n } from "./136-khan-stadium-state-of-the-art.i18n";

export const khanStadiumStateOfTheArt: LocationCard = {
  id: "mjT",
  canonicalId: "ci_mjT",
  slug: "lorcana-ci_mjT",
  printings: [
    {
      id: "set14-136",
      artId: "set14-136",
      setCode: "set14",
      collectorNumber: "136",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-136"],
  cardType: "location",
  name: "Khan Stadium",
  version: "State of the Art",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "014",
  cardNumber: 136,
  rarity: "common",
  cost: 1,
  willpower: 4,
  moveCost: 1,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Big Show",
      description: "Characters get +2 {S} while here.",
    },
  ],
  abilities: [
    {
      id: "mjT-1",
      name: "Big Show",
      text: "Big Show Characters get +2 {S} while here.",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
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
  i18n: khanStadiumStateOfTheArtI18n,
};
