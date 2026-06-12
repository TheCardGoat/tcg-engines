import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseAmberChampionI18n } from "./023-mickey-mouse-amber-champion.i18n";

export const mickeyMouseAmberChampion: CharacterCard = {
  id: "qnB",
  canonicalId: "ci_qnB",
  reprints: ["set10-023"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Amber Champion",
  inkType: ["amber"],
  set: "010",
  cardNumber: 23,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_46402c967ba24a1ca2ea62cb69f3b243",
    tcgPlayer: 659628,
  },
  text: [
    {
      title: "LEADING THE WAY",
      description: "Your other Amber characters get +2 {W}.",
    },
    {
      title: "FRIENDLY CHORUS",
      description:
        "While you have 2 or more other Amber characters in play, this character gains Singer 8. (They count as cost 8 to sing songs.)",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "willpower",
        target: "YOUR_OTHER_AMBER_CHARACTERS",
        type: "modify-stat",
      },
      id: "qnB-1",
      name: "LEADING THE WAY",
      text: "LEADING THE WAY Your other Amber characters get +2 {W}.",
      type: "static",
    },
    {
      condition: {
        comparison: { operator: "gte", value: 2 },
        query: {
          cardTypes: ["character"],
          count: "all",
          excludeSelf: true,
          filters: [{ inkType: "amber", type: "ink-type" }],
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "target-query",
      },
      effect: {
        keyword: "Singer",
        target: "SELF",
        type: "gain-keyword",
        value: 8,
      },
      id: "qnB-2",
      name: "FRIENDLY CHORUS",
      text: "FRIENDLY CHORUS While you have 2 or more other Amber characters in play, this character gains Singer 8.",
      type: "static",
    },
  ],
  i18n: mickeyMouseAmberChampionI18n,
};
