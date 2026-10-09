import type { CharacterCard } from "@tcg/lorcana-types";
import { booInDisguiseEpicI18n } from "./209-boo-in-disguise-epic.i18n";

export const booInDisguiseEpic: CharacterCard = {
  id: "0JR",
  canonicalId: "ci_vlw",
  slug: "lorcana-ci_vlw",
  printings: [
    {
      id: "set13-209-epic",
      artId: "ci_vlw-epic",
      setCode: "set13",
      collectorNumber: "209",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set13-019"],
  cardType: "character",
  name: "Boo",
  version: "In Disguise",
  inkType: ["amber"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 209,
  rarity: "epic",
  specialRarity: "epic",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e6e95b8abb1a479eb56d044ffaadb281",
    tcgPlayer: "704553",
  },
  text: [
    {
      title: "YOU'RE SAFE NOW",
      description:
        "While you have an exerted character named Sulley in play, this character can't be challenged.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Monster"],
  abilities: [
    {
      type: "static",
      id: "vlw-1",
      name: "You're Safe Now",
      text: "You're Safe Now While you have an exerted character named Sulley in play, this character can't be challenged.",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "has-name",
              name: "Sulley",
            },
            {
              type: "exerted",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
    },
  ],
  i18n: booInDisguiseEpicI18n,
};
