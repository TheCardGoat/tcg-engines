import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaVoiceStealer: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          from: "hand",
          cardType: "action",
          cost: "free",
        },
        type: "optional",
      },
      id: "19w-1",
      name: "SING FOR ME",
      text: "SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 44,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 5,
  externalIds: {
    ravensburger: "a56b1e5ceac728acb2ec90212fecc0118d4e568f",
  },
  franchise: "Little Mermaid",
  fullName: "Ursula - Voice Stealer",
  id: "19w",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Ursula",
  set: "009",
  strength: 3,
  text: "SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.",
  version: "Voice Stealer",
  willpower: 4,
};
