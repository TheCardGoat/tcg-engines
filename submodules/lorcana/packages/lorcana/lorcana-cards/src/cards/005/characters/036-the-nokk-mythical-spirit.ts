import type { CharacterCard } from "@tcg/lorcana-types";
import { theNokkMythicalSpiritI18n } from "./036-the-nokk-mythical-spirit.i18n";

export const theNokkMythicalSpirit: CharacterCard = {
  id: "0UL",
  canonicalId: "ci_0UL",
  reprints: ["set5-036"],
  cardType: "character",
  name: "The Nokk",
  version: "Mythical Spirit",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 36,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fdc463d617dd4b938a2991c4f1e1f542",
    tcgPlayer: 561486,
  },
  text: [
    {
      title: "TURNING TIDES",
      description:
        "When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "0UL-1",
      name: "TURNING TIDES",
      text: "TURNING TIDES When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
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
  i18n: theNokkMythicalSpiritI18n,
};
