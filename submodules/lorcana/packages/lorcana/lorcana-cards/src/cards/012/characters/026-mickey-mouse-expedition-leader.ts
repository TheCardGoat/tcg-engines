import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseExpeditionLeaderI18n } from "./026-mickey-mouse-expedition-leader.i18n";

export const mickeyMouseExpeditionLeader: CharacterCard = {
  id: "APc",
  canonicalId: "ci_APc",
  reprints: ["set12-026"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Expedition Leader",
  inkType: ["amber"],
  set: "012",
  cardNumber: 26,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c1295a70475b44d392fa06adbbc74b6b",
  },
  text: [
    {
      title: "LONG JOURNEY",
      description: "This character may enter play exerted.",
    },
    {
      title: "SECRET PATH",
      description:
        "While this character is exerted, whenever one of your other characters quests, chosen opposing character gets -2 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "APc-1",
      name: "LONG JOURNEY",
      type: "static",
      text: "LONG JOURNEY This character may enter play exerted.",
      effect: {
        type: "restriction",
        restriction: "may-enter-play-exerted",
        target: "SELF",
      },
    },
    {
      id: "APc-2",
      name: "SECRET PATH",
      type: "triggered",
      text: "SECRET PATH While this character is exerted, whenever one of your other characters quests, chosen opposing character gets -2 {S} until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "until-start-of-next-turn",
      },
    },
  ],
  i18n: mickeyMouseExpeditionLeaderI18n,
};
