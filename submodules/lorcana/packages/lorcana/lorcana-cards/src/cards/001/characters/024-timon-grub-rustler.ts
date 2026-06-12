import type { CharacterCard } from "@tcg/lorcana-types";
import { timonGrubRustlerI18n } from "./024-timon-grub-rustler.i18n";

export const timonGrubRustler: CharacterCard = {
  id: "2d9",
  canonicalId: "ci_2d9",
  reprints: ["set1-024"],
  cardType: "character",
  name: "Timon",
  version: "Grub Rustler",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 24,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a7a780b01376481388b871a1b533de08",
    tcgPlayer: 497197,
  },
  text: [
    {
      title: "TASTES LIKE CHICKEN",
      description:
        "When you play this character, you may remove up to 1 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 1 },
          target: "CHOSEN_CHARACTER",
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "1fm-1",
      name: "TASTES LIKE CHICKEN",
      text: "TASTES LIKE CHICKEN When you play this character, you may remove up to 1 damage from chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: timonGrubRustlerI18n,
};
