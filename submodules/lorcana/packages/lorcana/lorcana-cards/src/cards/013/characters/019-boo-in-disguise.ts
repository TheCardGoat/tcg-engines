import type { CharacterCard } from "@tcg/lorcana-types";
import { booInDisguiseI18n } from "./019-boo-in-disguise.i18n";

export const booInDisguise: CharacterCard = {
  id: "vlw",
  canonicalId: "ci_vlw",
  slug: "lorcana-ci_vlw",
  printings: [
    {
      id: "set13-019",
      artId: "set13-019",
      setCode: "set13",
      collectorNumber: "19",
      rarity: "uncommon",
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
  cardNumber: 19,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "You're Safe Now",
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
  i18n: booInDisguiseI18n,
};
