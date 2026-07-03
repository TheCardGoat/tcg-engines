import type { CharacterCard } from "@tcg/lorcana-types";
import { arielEtherealVoiceIconicI18n } from "./241-ariel-ethereal-voice-iconic.i18n";

import { boost } from "../../../helpers/abilities/boost";

export const arielEtherealVoiceIconic: CharacterCard = {
  id: "yQh",
  canonicalId: "ci_izM",
  slug: "lorcana-ci_izM",
  printings: [
    {
      id: "set10-241-iconic",
      artId: "ci_izM-iconic",
      setCode: "set10",
      collectorNumber: "241",
      rarity: "iconic",
      imageUrl: "",
    },
  ],
  reprints: ["set10-017"],
  cardType: "character",
  name: "Ariel",
  version: "Ethereal Voice",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "010",
  cardNumber: 241,
  rarity: "common",
  specialRarity: "iconic",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5b53a4c5b3854ab0ba71dd388aaa0d9f",
    tcgPlayer: "657885",
  },
  text: [
    {
      title: "Boost 1 {I}",
    },
    {
      title: "COMMAND PERFORMANCE",
      description:
        "Once during your turn, whenever you play a song, if there's a card under this character, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess", "Whisper"],
  abilities: [
    boost(1),
    {
      id: "1l1-2",
      condition: {
        type: "has-card-under",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "COMMAND PERFORMANCE Once",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
      text: "COMMAND PERFORMANCE Once during your turn, whenever you play a song, if there's a card under this character, you may draw a card.",
    },
  ],
  i18n: arielEtherealVoiceIconicI18n,
};
