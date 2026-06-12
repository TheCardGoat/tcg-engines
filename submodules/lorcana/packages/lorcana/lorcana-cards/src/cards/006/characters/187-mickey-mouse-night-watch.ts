import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseNightWatchI18n } from "./187-mickey-mouse-night-watch.i18n";

export const mickeyMouseNightWatch: CharacterCard = {
  id: "3YP",
  canonicalId: "ci_3YP",
  reprints: ["set6-187"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Night Watch",
  inkType: ["steel"],
  set: "006",
  cardNumber: 187,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_59714153da7e4a6884f25a5c5edad2c1",
    tcgPlayer: 591144,
  },
  text: [
    {
      title: "SUPPORT",
      description: "Your Pluto characters get Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: {
          cardTypes: ["character"],
          count: "all",
          filter: [{ type: "has-name", name: "Pluto" }],
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "byr-1",
      name: "SUPPORT",
      text: "SUPPORT Your Pluto characters get Resist +1.",
      type: "static",
    },
  ],
  i18n: mickeyMouseNightWatchI18n,
};
