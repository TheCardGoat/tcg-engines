import type { CharacterCard } from "@tcg/lorcana-types";
import { trampObservantGuardianI18n } from "./087-tramp-observant-guardian.i18n";

export const trampObservantGuardian: CharacterCard = {
  id: "I98",
  canonicalId: "ci_I98",
  reprints: ["set8-087"],
  cardType: "character",
  name: "Tramp",
  version: "Observant Guardian",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "008",
  cardNumber: 87,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_adb73493071d4f3a909f089ae63cc0c8",
    tcgPlayer: 631408,
  },
  text: [
    {
      title: "HOW DO I GET IN?",
      description:
        "When you play this character, chosen character gains Ward until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Ward",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "fnz-1",
      name: "HOW DO I GET IN?",
      text: "HOW DO I GET IN? When you play this character, chosen character gains Ward until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: trampObservantGuardianI18n,
};
