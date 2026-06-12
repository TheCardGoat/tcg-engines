import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinGoatI18n } from "./051-merlin-goat.i18n";

export const merlinGoat: CharacterCard = {
  id: "nZn",
  canonicalId: "ci_nZn",
  reprints: ["set2-051"],
  cardType: "character",
  name: "Merlin",
  version: "Goat",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 51,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_760a3c258ef143de8f8e85176c0bfd1d",
    tcgPlayer: 522719,
  },
  text: [
    {
      title: "HERE I COME!",
      description: "When you play this character and when he leaves play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "nZn-1",
      name: "HERE I COME!",
      text: "HERE I COME! When you play this character and when he leaves play, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "nZn-2",
      name: "HERE I COME!",
      text: "HERE I COME! When you play this character and when he leaves play, gain 1 lore.",
      trigger: {
        event: "leave-play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: merlinGoatI18n,
};
