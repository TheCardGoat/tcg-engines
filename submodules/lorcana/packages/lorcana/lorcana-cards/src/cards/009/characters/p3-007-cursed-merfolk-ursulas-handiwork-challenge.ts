import type { CharacterCard } from "@tcg/lorcana-types";
import { cursedMerfolkUrsulasHandiworkP3ChallengeI18n } from "./p3-007-cursed-merfolk-ursulas-handiwork-challenge.i18n";

export const cursedMerfolkUrsulasHandiworkP3Challenge: CharacterCard = {
  id: "ZoJ",
  canonicalId: "ci_8Dp",
  slug: "lorcana-ci_8Dp",
  printings: [
    {
      id: "set9-p3-007-challenge",
      artId: "ci_8Dp-challenge",
      setCode: "set9",
      collectorNumber: "7",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set3-070", "set9-071"],
  cardType: "character",
  name: "Cursed Merfolk",
  version: "Ursula's Handiwork",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "009",
  cardNumber: 7,
  rarity: "special",
  specialRarity: "challenge",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_c571350ccb314e4aac4f3e79d9a29c87",
    tcgPlayer: "650013",
  },
  text: [
    {
      title: "POOR SOULS",
      description:
        "Whenever this character is challenged, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "1pi-1",
      name: "POOR SOULS",
      text: "POOR SOULS Whenever this character is challenged, each opponent chooses and discards a card.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: cursedMerfolkUrsulasHandiworkP3ChallengeI18n,
};
