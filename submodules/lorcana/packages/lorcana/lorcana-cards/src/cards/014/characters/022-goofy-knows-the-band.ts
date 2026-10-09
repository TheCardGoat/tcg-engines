import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyKnowsTheBandI18n } from "./022-goofy-knows-the-band.i18n";

export const goofyKnowsTheBand: CharacterCard = {
  id: "zex",
  canonicalId: "ci_zex",
  slug: "lorcana-ci_zex",
  printings: [
    {
      id: "set14-022",
      artId: "set14-022",
      setCode: "set14",
      collectorNumber: "22",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-022"],
  cardType: "character",
  name: "Goofy",
  version: "Knows the Band",
  inkType: ["amber"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 22,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "VIP Access",
      description:
        "When you play this character, if you have a character with Singer in play, draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "zex-1",
      name: "VIP Access",
      type: "triggered",
      text: "VIP Access When you play this character, if you have a character with Singer in play, draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
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
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: goofyKnowsTheBandI18n,
};
