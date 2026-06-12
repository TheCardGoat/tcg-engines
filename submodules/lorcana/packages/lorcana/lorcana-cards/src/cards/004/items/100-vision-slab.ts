import type { ItemCard } from "@tcg/lorcana-types";
import { visionSlabI18n } from "./100-vision-slab.i18n";

export const visionSlab: ItemCard = {
  id: "Kxi",
  canonicalId: "ci_Kxi",
  reprints: ["set4-100"],
  cardType: "item",
  name: "Vision Slab",
  inkType: ["emerald"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 100,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_58f8144b0f884b70a2a6b946ba8377cd",
    tcgPlayer: 548196,
  },
  text: [
    {
      title: "DANGER REVEALED",
      description: "At the start of your turn, if an opposing character has damage, gain 1 lore.",
    },
    {
      title: "TRAPPED!",
      description: "Damage counters can't be removed.",
    },
  ],
  abilities: [
    {
      id: "Kxi-1",
      name: "DANGER REVEALED",
      text: "DANGER REVEALED At the start of your turn, if an opposing character has damage, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "opponent-has-damaged-character",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
    {
      id: "Kxi-2",
      name: "TRAPPED!",
      text: "TRAPPED! Damage counters can't be removed.",
      type: "replacement",
      replaces: "remove-damage",
      replacement: {
        type: "prevent-remove-damage",
        appliesTo: "all",
      },
    },
  ],
  i18n: visionSlabI18n,
};
