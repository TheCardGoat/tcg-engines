import type { LocationCard } from "@tcg/lorcana-types";
import { hundredAcreWoodHunnyCampsiteEpicI18n } from "./222-hundred-acre-wood-hunny-campsite-epic.i18n";

export const hundredAcreWoodHunnyCampsiteEpic: LocationCard = {
  id: "qR2",
  canonicalId: "ci_gIc",
  slug: "lorcana-ci_gIc",
  printings: [
    {
      id: "set13-222-epic",
      artId: "ci_gIc-epic",
      setCode: "set13",
      collectorNumber: "222",
      rarity: "epic",
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
  cardNumber: 222,
  rarity: "epic",
  specialRarity: "epic",
  cost: 3,
  willpower: 6,
  moveCost: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_d0021c77de1045cd933d1fe9a08efc81",
    tcgPlayer: "704671",
  },
  text: [
    {
      title: "HOME AWAY FROM HOME",
      description: "Characters get +1 {W} while here.",
    },
    {
      title: "HUNNY QUEST",
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
  i18n: hundredAcreWoodHunnyCampsiteEpicI18n,
};
