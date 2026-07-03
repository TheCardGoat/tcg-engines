import type { CharacterCard } from "@tcg/lorcana-types";
import { kevinFlightlessBirdI18n } from "./088-kevin-flightless-bird.i18n";

export const kevinFlightlessBird: CharacterCard = {
  id: "kl5",
  canonicalId: "ci_kl5",
  slug: "lorcana-ci_kl5",
  printings: [
    {
      id: "set13-088",
      artId: "set13-088",
      setCode: "set13",
      collectorNumber: "88",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-088"],
  cardType: "character",
  name: "Kevin",
  version: "Flightless Bird",
  inkType: ["emerald"],
  franchise: "Up",
  set: "013",
  cardNumber: 88,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_68cc92f879004461b4d059ae003c6112",
  },
  text: [
    {
      title: "BACK TO THE NEST",
      description: "Whenever this character quests, put this card on the top of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "kl5-1",
      name: "Back to the Nest",
      text: "Back to the Nest Whenever this character quests, put this card on the top of your deck.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "put-on-top",
        target: "SELF",
      },
    },
  ],
  i18n: kevinFlightlessBirdI18n,
};
