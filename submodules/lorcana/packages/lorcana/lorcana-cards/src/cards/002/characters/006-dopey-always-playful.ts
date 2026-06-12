import type { CharacterCard } from "@tcg/lorcana-types";
import { dopeyAlwaysPlayfulI18n } from "./006-dopey-always-playful.i18n";

export const dopeyAlwaysPlayful: CharacterCard = {
  id: "2Jv",
  canonicalId: "ci_2Jv",
  reprints: ["set2-006"],
  cardType: "character",
  name: "Dopey",
  version: "Always Playful",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 6,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_45bf84f2a90e48be812c82d9c9272438",
    tcgPlayer: 526384,
  },
  text: [
    {
      title: "ODD ONE OUT",
      description:
        "When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        modifier: 2,
        stat: "strength",
        target: "YOUR_OTHER_SEVEN_DWARFS_CHARACTERS",
        type: "modify-stat",
      },
      id: "7r7-1",
      name: "ODD ONE OUT",
      text: "ODD ONE OUT When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: dopeyAlwaysPlayfulI18n,
};
