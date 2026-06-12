import type { CharacterCard } from "@tcg/lorcana-types";
import { magicBroomBucketBrigadeI18n } from "./047-magic-broom-bucket-brigade.i18n";

export const magicBroomBucketBrigade: CharacterCard = {
  id: "Ors",
  canonicalId: "ci_Ors",
  reprints: ["set1-047"],
  cardType: "character",
  name: "Magic Broom",
  version: "Bucket Brigade",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "001",
  cardNumber: 47,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_95ecf1d59f004e4399a2c61e280dfd13",
    tcgPlayer: 493477,
  },
  text: [
    {
      title: "SWEEP",
      description:
        "When you play this character, you may shuffle a card from any discard into its player's deck.",
    },
  ],
  classifications: ["Dreamborn", "Broom"],
  abilities: [
    {
      id: "zyc-1",
      name: "SWEEP",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        effect: {
          type: "shuffle-into-deck",
          target: {
            cardTypes: ["card"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["discard"],
          },
          intoDeck: "owner",
        },
      },
      text: "**SWEEP** When you play this character, you may shuffle a card from any discard into its player's deck.",
    },
  ],
  i18n: magicBroomBucketBrigadeI18n,
};
