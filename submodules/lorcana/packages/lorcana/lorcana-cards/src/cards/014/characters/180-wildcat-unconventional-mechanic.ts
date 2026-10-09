import type { CharacterCard } from "@tcg/lorcana-types";
import { wildcatUnconventionalMechanicI18n } from "./180-wildcat-unconventional-mechanic.i18n";

export const wildcatUnconventionalMechanic: CharacterCard = {
  id: "nR2",
  canonicalId: "ci_nR2",
  slug: "lorcana-ci_nR2",
  printings: [
    {
      id: "set14-180",
      artId: "set14-180",
      setCode: "set14",
      collectorNumber: "180",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-180"],
  cardType: "character",
  name: "Wildcat",
  version: "Unconventional Mechanic",
  inkType: ["steel"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 180,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Well, That's Broken",
      description: "When you play this character, you may banish chosen item.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "nR2-1",
      name: "Well, That's Broken",
      type: "triggered",
      text: "Well, That's Broken When you play this character, you may banish chosen item.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
      },
    },
  ],
  i18n: wildcatUnconventionalMechanicI18n,
};
