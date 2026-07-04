import type { CharacterCard } from "@tcg/lorcana-types";
import { perditaDeterminedMotherEnchantedI18n } from "./207-perdita-determined-mother-enchanted.i18n";

import type { AllMatchingCharacterQuery } from "@tcg/lorcana-types";

import { shift } from "../../../helpers/abilities/shift";

export const perditaDeterminedMotherEnchanted: CharacterCard = {
  id: "jWx",
  canonicalId: "ci_Q1m",
  slug: "lorcana-ci_Q1m",
  printings: [
    {
      id: "set8-207-enchanted",
      artId: "ci_Q1m-enchanted",
      setCode: "set8",
      collectorNumber: "207",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set8-027"],
  cardType: "character",
  name: "Perdita",
  version: "Determined Mother",
  inkType: ["amber", "sapphire"],
  franchise: "101 Dalmatians",
  set: "008",
  cardNumber: 207,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_db4137ebc57046a3ba7736adbdb01d44",
    tcgPlayer: "632686",
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "QUICK, EVERYONE HIDE",
      description:
        "When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(4),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["discard"],
            cardTypes: ["character"],
            filter: [
              {
                type: "has-classification",
                classification: "Puppy",
              },
            ],
          } satisfies AllMatchingCharacterQuery,
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "169-2",
      name: "QUICK, EVERYONE HIDE",
      text: "QUICK, EVERYONE HIDE When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: perditaDeterminedMotherEnchantedI18n,
};
