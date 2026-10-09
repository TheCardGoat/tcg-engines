import type { ItemCard } from "@tcg/lorcana-types";
import { speakerStackI18n } from "./032-speaker-stack.i18n";

export const speakerStack: ItemCard = {
  id: "UTF",
  canonicalId: "ci_UTF",
  slug: "lorcana-ci_UTF",
  printings: [
    {
      id: "set14-032",
      artId: "set14-032",
      setCode: "set14",
      collectorNumber: "32",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-032"],
  cardType: "item",
  name: "Speaker Stack",
  inkType: ["amber"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 32,
  rarity: "common",
  cost: 2,
  inkable: true,
  abilities: [
    {
      id: "UTF-1",
      name: "PUMP IT UP",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-keyword",
              keyword: "Singer",
            },
          ],
        },
      },
      text: "PUMP IT UP Your characters with Singer get +1 {S} and +1 {W}.",
    },
    {
      id: "UTF-2",
      name: "PUMP IT UP",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-keyword",
              keyword: "Singer",
            },
          ],
        },
      },
      text: "PUMP IT UP Your characters with Singer get +1 {S} and +1 {W}.",
    },
  ],
  externalIds: {
    lorcast: "crd_296aac16a9a841b897c6f41728d82010",
  },
  text: [
    {
      title: "PUMP IT UP",
      description: "Your characters with Singer get +1 {S} and +1 {W}.",
    },
  ],
  i18n: speakerStackI18n,
};
