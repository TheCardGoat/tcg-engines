import type { CharacterCard } from "@tcg/lorcana-types";
import { calhounHardnosedLeaderI18n } from "./032-calhoun-hard-nosed-leader.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const calhounHardnosedLeader: CharacterCard = {
  id: "g8l",
  canonicalId: "ci_g8l",
  reprints: ["set8-032"],
  cardType: "character",
  name: "Calhoun",
  version: "Hard-Nosed Leader",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "008",
  cardNumber: 32,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6fe60149cee34a1e8c979d598251e279",
    tcgPlayer: 631372,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "LOOT DROP",
      description: "When this character is banished, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    bodyguard,
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "eco-2",
      name: "LOOT DROP",
      text: "LOOT DROP When this character is banished, gain 1 lore.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: calhounHardnosedLeaderI18n,
};
