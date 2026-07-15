import type { LocationCard } from "@tcg/lorcana-types";
import { rapunzelsTowerTakenByTheVineI18n } from "./037-rapunzels-tower-taken-by-the-vine.i18n";

export const rapunzelsTowerTakenByTheVine: LocationCard = {
  id: "gWy",
  canonicalId: "ci_gWy",
  slug: "lorcana-ci_gWy",
  printings: [
    {
      id: "set13-037",
      artId: "set13-037",
      setCode: "set13",
      collectorNumber: "37",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-037"],
  cardType: "location",
  name: "Rapunzel's Tower",
  version: "Taken by the Vine",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "013",
  cardNumber: 37,
  rarity: "uncommon",
  cost: 4,
  willpower: 8,
  moveCost: 1,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Embracing Change",
      description: "Your Floodborn characters get +2 {W}.",
    },
  ],
  abilities: [
    {
      type: "static",
      name: "EMBRACING CHANGE",
      text: "EMBRACING CHANGE Your Floodborn characters get +2 {W}.",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 2,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Floodborn",
            },
          ],
        },
      },
    },
  ],
  i18n: rapunzelsTowerTakenByTheVineI18n,
};
