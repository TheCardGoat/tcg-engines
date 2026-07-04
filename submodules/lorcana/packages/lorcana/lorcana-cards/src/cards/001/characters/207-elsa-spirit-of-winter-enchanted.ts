import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaSpiritOfWinterEnchantedI18n } from "./207-elsa-spirit-of-winter-enchanted.i18n";

export const elsaSpiritOfWinterEnchanted: CharacterCard = {
  id: "8yF",
  canonicalId: "ci_4Pf",
  slug: "lorcana-ci_4Pf",
  printings: [
    {
      id: "set1-207-enchanted",
      artId: "ci_4Pf-enchanted",
      setCode: "set1",
      collectorNumber: "207",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set1-042", "set9-043"],
  cardType: "character",
  name: "Elsa",
  version: "Spirit of Winter",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 207,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 8,
  strength: 4,
  willpower: 6,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_096f0a6be34a4134aaa682c768cceeec",
    tcgPlayer: "649990",
  },
  text: [
    {
      title: "Shift 6",
    },
    {
      title: "DEEP FREEZE",
      description:
        "When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    {
      cost: {
        ink: 6,
      },
      id: "95w-1",
      keyword: "Shift",
      text: "Shift 6 {I}",
      type: "keyword",
    },
    {
      effect: {
        type: "sequence",
        effects: [
          {
            type: "exert",
            target: {
              selector: "chosen",
              count: {
                upTo: 2,
              },
              owner: "any",
              cardTypes: ["character"],
              zones: ["play"],
            },
          },
          {
            type: "restriction",
            restriction: "cant-ready",
            duration: "their-next-turn",
            target: {
              ref: "selected-all",
            },
          },
        ],
      },
      id: "95w-2",
      name: "DEEP FREEZE",
      text: "DEEP FREEZE When you play this character, exert up to 2 chosen characters. They can’t ready at the start of their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: elsaSpiritOfWinterEnchantedI18n,
};
