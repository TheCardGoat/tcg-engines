import type { CharacterCard } from "@tcg/lorcana-types";
import { vladimirCeramicUnicornFanI18n } from "./075-vladimir-ceramic-unicorn-fan.i18n";

export const vladimirCeramicUnicornFan: CharacterCard = {
  id: "yNl",
  canonicalId: "ci_yNl",
  reprints: ["set10-075"],
  cardType: "character",
  name: "Vladimir",
  version: "Ceramic Unicorn Fan",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  cardNumber: 75,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_86a728449c4a46b7862052f531d3cea4",
    tcgPlayer: 658879,
  },
  text: [
    {
      title: "HIGH STANDARDS",
      description: "Whenever this character quests, you may banish chosen item.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
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
      id: "j0l-1",
      name: "HIGH STANDARDS",
      text: "HIGH STANDARDS Whenever this character quests, you may banish chosen item.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: vladimirCeramicUnicornFanI18n,
};
