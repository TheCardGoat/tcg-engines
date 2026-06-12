import type { CharacterCard } from "@tcg/lorcana-types";
import { aliceWellreadWhisperI18n } from "./036-alice-well-read-whisper.i18n";
import { boost } from "../../../helpers/abilities/boost";

export const aliceWellreadWhisper: CharacterCard = {
  id: "Sgs",
  canonicalId: "ci_Sgs",
  reprints: ["set11-036"],
  cardType: "character",
  name: "Alice",
  version: "Well-Read Whisper",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "011",
  cardNumber: 36,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4328715a70224a1fae6ee75034f305fa",
    tcgPlayer: 674841,
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "MYSTICAL INSIGHT",
      description: "Whenever this character quests, put all cards from under her into your hand.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Whisper"],
  abilities: [
    boost(2),
    {
      id: "1k8-2",
      name: "MYSTICAL INSIGHT",
      text: "MYSTICAL INSIGHT Whenever this character quests, put all cards from under her into your hand.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          zones: ["limbo"],
          owner: "you",
          filter: [
            {
              type: "under-parent",
              owner: "you",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "move-cards-from-under",
        destination: "hand",
        target: "SELF",
      },
    },
  ],
  i18n: aliceWellreadWhisperI18n,
};
