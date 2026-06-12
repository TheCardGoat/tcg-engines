import type { CharacterCard } from "@tcg/lorcana-types";
import { panicHighstrungImpI18n } from "./075-panic-high-strung-imp.i18n";

export const panicHighstrungImp: CharacterCard = {
  id: "0bl",
  canonicalId: "ci_0bl",
  reprints: ["set7-075"],
  cardType: "character",
  name: "Panic",
  version: "High-Strung Imp",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "007",
  cardNumber: 75,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_4c46bfa161ae4e4d886ddabef7ad8d57",
    tcgPlayer: 618699,
  },
  text: [
    {
      title: "STARTLED SHRIEK",
      description:
        "When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "0bl-1",
      name: "STARTLED SHRIEK",
      text: "STARTLED SHRIEK When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-damage",
          amount: { type: "up-to", value: 2 },
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
  i18n: panicHighstrungImpI18n,
};
