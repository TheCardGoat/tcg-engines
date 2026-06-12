import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesLordOfTheUnderworldI18n } from "./006-hades-lord-of-the-underworld.i18n";

export const hadesLordOfTheUnderworld: CharacterCard = {
  id: "gvD",
  canonicalId: "ci_gvD",
  reprints: ["set1-006"],
  cardType: "character",
  name: "Hades",
  version: "Lord of the Underworld",
  inkType: ["amber"],
  franchise: "Hercules",
  set: "001",
  cardNumber: 6,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_4c9f441611314185a25b1fca893f6643",
    tcgPlayer: 493480,
  },
  text: [
    {
      title: "WELL OF SOULS",
      description:
        "When you play this character, return a character card from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
  abilities: [
    {
      effect: {
        cardType: "character",
        target: "CONTROLLER",
        type: "return-from-discard",
      },
      id: "1yp-1",
      name: "WELL OF SOULS",
      text: "WELL OF SOULS When you play this character, return a character card from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: hadesLordOfTheUnderworldI18n,
};
