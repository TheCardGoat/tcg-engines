import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaVoiceStealer: CharacterCard = {
  id: "19w",
  cardType: "character",
  name: "Ursula",
  version: "Voice Stealer",
  fullName: "Ursula - Voice Stealer",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "009",
  text: "SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 44,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a56b1e5ceac728acb2ec90212fecc0118d4e568f",
  },
  abilities: [
    {
      id: "19w-1",
      type: "triggered",
      name: "SING FOR ME",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cardType: "action",
          cost: "free",
        },
        chooser: "CONTROLLER",
      },
      text: "SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
