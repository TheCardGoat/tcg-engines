import type { LocationCard } from "@tcg/lorcana-types";
import { hundredAcreWoodHunnyCampsiteI18n } from "./175-hundred-acre-wood-hunny-campsite.i18n";

export const hundredAcreWoodHunnyCampsite: LocationCard = {
  id: "gIc",
  canonicalId: "ci_gIc",
  slug: "lorcana-ci_gIc",
  printings: [
    {
      id: "set13-175",
      artId: "set13-175",
      setCode: "set13",
      collectorNumber: "175",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-175"],
  cardType: "location",
  name: "Hundred Acre Wood",
  version: "Hunny Campsite",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 175,
  rarity: "uncommon",
  cost: 3,
  willpower: 6,
  moveCost: 1,
  lore: 1,
  inkable: false,
  text: [
    {
      title: "Home Away from Home",
      description: "Characters get +1 {W} while here.",
    },
    {
      title: "Hunny Quest",
      description: "Hunny characters get +1 {L} while here.",
    },
  ],
  classifications: ["Hunny"],
  abilities: [
    {
      type: "static",
      name: "HOME AWAY FROM HOME",
      text: "HOME AWAY FROM HOME Characters get +1 {W} while here.",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 1,
        target: "CHARACTERS_HERE",
      },
    },
    {
      type: "static",
      name: "HUNNY QUEST",
      text: "HUNNY QUEST Hunny characters get +1 {L} while here.",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Hunny",
            },
            {
              type: "same-location-as-source",
            },
          ],
        },
      },
    },
  ],
  i18n: hundredAcreWoodHunnyCampsiteI18n,
};
