import type { CharacterCard } from "@tcg/lorcana-types";
import { liloBundledUpI18n } from "./195-lilo-bundled-up.i18n";

export const liloBundledUp: CharacterCard = {
  id: "Vf6",
  canonicalId: "ci_Vf6",
  reprints: ["set11-195"],
  cardType: "character",
  name: "Lilo",
  version: "Bundled Up",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 195,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_f86297c4c6f940cc8135cd806d96105a",
    tcgPlayer: 676247,
  },
  text: [
    {
      title: "EXTRA LAYERS",
      description:
        "During each opponent's turn, the first time this character would take damage, she takes no damage instead.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "Vf6-1",
      name: "EXTRA LAYERS",
      replaces: "damage-to-self",
      replacement: {
        appliesTo: "self",
        during: "opponents-turn",
        firstTimeEachTurn: "opponent-turn",
        type: "prevent-damage",
      },
      text: "EXTRA LAYERS During each opponent's turn, the first time this character would take damage, she takes no damage instead.",
      type: "replacement",
    },
  ],
  i18n: liloBundledUpI18n,
};
