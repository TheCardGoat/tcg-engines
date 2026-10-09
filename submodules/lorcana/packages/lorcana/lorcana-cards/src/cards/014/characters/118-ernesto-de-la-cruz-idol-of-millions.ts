import type { CharacterCard } from "@tcg/lorcana-types";
import { ernestoDeLaCruzIdolOfMillionsI18n } from "./118-ernesto-de-la-cruz-idol-of-millions.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const ernestoDeLaCruzIdolOfMillions: CharacterCard = {
  id: "RzE",
  canonicalId: "ci_RzE",
  slug: "lorcana-ci_RzE",
  printings: [
    {
      id: "set14-118",
      artId: "set14-118",
      setCode: "set14",
      collectorNumber: "118",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-118"],
  cardType: "character",
  name: "Ernesto de la Cruz",
  version: "Idol of Millions",
  inkType: ["ruby"],
  franchise: "Coco",
  set: "014",
  cardNumber: 118,
  rarity: "common",
  cost: 3,
  strength: 5,
  willpower: 3,
  lore: 1,
  inkable: false,
  text: [
    {
      title: "Singer 5",
    },
    {
      title: "Top the Charts",
      description:
        "While an opponent has a song card in their discard, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    singer(5),
    {
      id: "RzE-1",
      name: "Top the Charts",
      type: "static",
      text: "Top the Charts While an opponent has a song card in their discard, this character gets +1 {L}.",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "opponent",
          zones: ["discard"],
          cardType: "action",
          filters: [
            {
              type: "is-song",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    },
  ],
  i18n: ernestoDeLaCruzIdolOfMillionsI18n,
};
