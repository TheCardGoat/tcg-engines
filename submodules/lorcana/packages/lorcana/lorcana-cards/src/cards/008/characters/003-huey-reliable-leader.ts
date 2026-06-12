import type { CharacterCard } from "@tcg/lorcana-types";
import { hueyReliableLeaderI18n } from "./003-huey-reliable-leader.i18n";

export const hueyReliableLeader: CharacterCard = {
  id: "h09",
  canonicalId: "ci_h09",
  reprints: ["set8-003"],
  cardType: "character",
  name: "Huey",
  version: "Reliable Leader",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "008",
  cardNumber: 3,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_8e39d0718ce5499c92ac736ff111f7e3",
    tcgPlayer: 633429,
  },
  text: [
    {
      title: "I KNOW THE WAY",
      description:
        "Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: 1,
        cardType: "character",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "1g4-1",
      name: "I KNOW THE WAY",
      text: "I KNOW THE WAY Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: hueyReliableLeaderI18n,
};
