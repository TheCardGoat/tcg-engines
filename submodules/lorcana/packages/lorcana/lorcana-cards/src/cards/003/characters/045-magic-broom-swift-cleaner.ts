import type { CharacterCard } from "@tcg/lorcana-types";
import { magicBroomSwiftCleanerI18n } from "./045-magic-broom-swift-cleaner.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const magicBroomSwiftCleaner: CharacterCard = {
  id: "sUV",
  canonicalId: "ci_sUV",
  reprints: ["set3-045"],
  cardType: "character",
  name: "Magic Broom",
  version: "Swift Cleaner",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  cardNumber: 45,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_9b1e3b67709f41c58130599854495ff5",
    tcgPlayer: 539070,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "CLEAN THIS, CLEAN THAT",
      description:
        "When you play this character, you may shuffle all Broom cards from your discard into your deck.",
    },
  ],
  classifications: ["Dreamborn", "Broom"],
  abilities: [
    rush,
    {
      id: "114-2",
      name: "CLEAN THIS, CLEAN THAT",
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
          intoDeck: "owner",
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["discard"],
            filter: [
              {
                type: "has-classification",
                classification: "Broom",
              },
            ],
          },
        },
      },
      text: "CLEAN THIS, CLEAN THAT When you play this character, you may shuffle all Broom cards from your discard into your deck.",
    },
  ],
  i18n: magicBroomSwiftCleanerI18n,
};
