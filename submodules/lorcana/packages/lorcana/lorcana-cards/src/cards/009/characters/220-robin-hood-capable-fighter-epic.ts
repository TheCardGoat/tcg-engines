import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodCapableFighterEpicI18n } from "./220-robin-hood-capable-fighter-epic.i18n";

export const robinHoodCapableFighterEpic: CharacterCard = {
  id: "JQ0",
  canonicalId: "ci_Puv",
  slug: "lorcana-ci_Puv",
  printings: [
    {
      id: "set9-220-epic",
      artId: "ci_Puv-epic",
      setCode: "set9",
      collectorNumber: "220",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set2-193", "set9-184"],
  cardType: "character",
  name: "Robin Hood",
  version: "Capable Fighter",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "009",
  cardNumber: 220,
  rarity: "common",
  specialRarity: "epic",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_888f26474eba4f569f94c99251eddf06",
    tcgPlayer: "650155",
  },
  text: [
    {
      title: "SKIRMISH",
      description: "{E} — Deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "qi2-1",
      name: "SKIRMISH",
      text: "SKIRMISH {E} — Deal 1 damage to chosen character.",
      type: "activated",
    },
  ],
  i18n: robinHoodCapableFighterEpicI18n,
};
