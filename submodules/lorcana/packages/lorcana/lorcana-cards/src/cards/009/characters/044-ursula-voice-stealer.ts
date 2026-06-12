import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaVoiceStealerI18n } from "./044-ursula-voice-stealer.i18n";

export const ursulaVoiceStealer: CharacterCard = {
  id: "JPS",
  canonicalId: "ci_JPS",
  reprints: ["set9-044"],
  cardType: "character",
  name: "Ursula",
  version: "Voice Stealer",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "009",
  cardNumber: 44,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1c44a2b730a54018a567031f38363a17",
    tcgPlayer: 649991,
  },
  text: [
    {
      title: "SING FOR ME",
      description:
        "When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "19w-1",
      name: "SING FOR ME",
      text: "SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "ready",
                },
              ],
            },
          },
          {
            type: "optional",
            effect: {
              type: "play-card",
              from: "hand",
              cardType: "song",
              cost: "free",
              filter: {
                maxCost: "chosen-card-cost",
              },
            },
          },
        ],
      },
    },
  ],
  i18n: ursulaVoiceStealerI18n,
};
