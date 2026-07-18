import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaStormChaserI18n } from "./042-elsa-storm-chaser.i18n";

export const elsaStormChaser: CharacterCard = {
  id: "pQC",
  canonicalId: "ci_pQC",
  slug: "lorcana-ci_pQC",
  printings: [
    {
      id: "set4-042",
      artId: "set4-042",
      setCode: "set4",
      collectorNumber: "42",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set4-042"],
  cardType: "character",
  name: "Elsa",
  version: "Storm Chaser",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "004",
  cardNumber: 42,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_178373b0fe2f483b90202bfeb6014e0a",
    tcgPlayer: "547847",
  },
  text: [
    {
      title: "TEMPEST",
      description:
        "{E} — Chosen character gains Challenger +2 and Rush this turn. (They get +2 {S} while challenging. They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            duration: "this-turn",
            keyword: "Challenger",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "gain-keyword",
            value: 2,
          },
          {
            duration: "this-turn",
            keyword: "Rush",
            target: { ref: "previous-target" },
            type: "gain-keyword",
          },
        ],
      },
      id: "ih5-1",
      name: "TEMPEST",
      text: "TEMPEST {E} — Chosen character gains Challenger +2 and Rush this turn.",
      type: "activated",
    },
  ],
  i18n: elsaStormChaserI18n,
};
