import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelSunshineI18n } from "./008-rapunzel-sunshine.i18n";

export const rapunzelSunshine: CharacterCard = {
  id: "qnF",
  canonicalId: "ci_Zyl",
  slug: "lorcana-ci_Zyl",
  printings: [
    {
      id: "set9-008",
      artId: "set9-008",
      setCode: "set9",
      collectorNumber: "8",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-020", "set9-008"],
  cardType: "character",
  name: "Rapunzel",
  version: "Sunshine",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "009",
  cardNumber: 8,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ecef763660c74bd49ddb8930fb0ff10b",
    tcgPlayer: "649957",
  },
  text: [
    {
      title: "MAGIC HAIR",
      description: "{E} — Remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: {
          type: "up-to",
          value: 2,
        },
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      id: "zai-1",
      name: "MAGIC HAIR",
      text: "MAGIC HAIR {E} — Remove up to 2 damage from chosen character.",
      type: "activated",
    },
  ],
  i18n: rapunzelSunshineI18n,
};
