import type { CharacterCard } from "@tcg/lorcana-types";
import { benjaGuardianOfTheDragonGemI18n } from "./174-benja-guardian-of-the-dragon-gem.i18n";

export const benjaGuardianOfTheDragonGem: CharacterCard = {
  id: "z98",
  canonicalId: "ci_pfZ",
  reprints: ["set2-174", "set9-180"],
  cardType: "character",
  name: "Benja",
  version: "Guardian of the Dragon Gem",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 174,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_66a2a59da61b4b54a92f25b54c375d93",
    tcgPlayer: 650113,
  },
  text: [
    {
      title: "WE HAVE A CHOICE",
      description: "When you play this character, you may banish chosen item.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "King"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "14h-1",
      name: "WE HAVE A CHOICE",
      text: "WE HAVE A CHOICE When you play this character, you may banish chosen item.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: benjaGuardianOfTheDragonGemI18n,
};
