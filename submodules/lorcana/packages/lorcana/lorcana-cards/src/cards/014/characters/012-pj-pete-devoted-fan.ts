import type { CharacterCard } from "@tcg/lorcana-types";
import { pjPeteDevotedFanI18n } from "./012-pj-pete-devoted-fan.i18n";

export const pjPeteDevotedFan: CharacterCard = {
  id: "KR4",
  canonicalId: "ci_KR4",
  slug: "lorcana-ci_KR4",
  printings: [
    {
      id: "set14-012",
      artId: "set14-012",
      setCode: "set14",
      collectorNumber: "12",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-012"],
  cardType: "character",
  name: "P.J. Pete",
  version: "Devoted Fan",
  inkType: ["amber"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 12,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Knows All the Words",
      description: "While you have a character with Singer in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "KR4-1",
      name: "Knows All the Words",
      type: "static",
      text: "Knows All the Words While you have a character with Singer in play, this character gets +1 {L}.",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [{ type: "has-keyword", keyword: "Singer" }],
        },
        comparison: { operator: "gte", value: 1 },
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    },
  ],
  i18n: pjPeteDevotedFanI18n,
};
