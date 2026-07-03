import type { CharacterCard } from "@tcg/lorcana-types";
import { luisaMadrigalConfidentClimberEnchantedI18n } from "./227-luisa-madrigal-confident-climber-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const luisaMadrigalConfidentClimberEnchanted: CharacterCard = {
  id: "xPk",
  canonicalId: "ci_tct",
  slug: "lorcana-ci_tct",
  printings: [
    {
      id: "set12-227-enchanted",
      artId: "ci_tct-enchanted",
      setCode: "set12",
      collectorNumber: "227",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set12-060"],
  cardType: "character",
  name: "Luisa Madrigal",
  version: "Confident Climber",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 227,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 6,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ea1ebbf0332f4cb78f6b7a6a90d826a7",
    tcgPlayer: "692218",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "I CAN TAKE IT 1",
      description:
        "{I} — Move up to 1 damage from chosen character of yours to this character. Then, if this character has 3 or more damage, move all damage from this character to chosen opposing character.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Madrigal"],
  abilities: [
    shift(3),
    {
      id: "tct-2",
      name: "I CAN TAKE IT",
      type: "activated",
      text: "I CAN TAKE IT 1 {I} — Move up to 1 damage from chosen character of yours to this character. Then, if this character has 3 or more damage, move all damage from this character to chosen opposing character.",
      cost: {
        ink: 1,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-damage",
            amount: {
              type: "up-to",
              value: 1,
            },
            from: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              excludeSelf: true,
            },
            to: "SELF",
            deferLethalBanish: true,
          },
          {
            type: "conditional",
            condition: {
              type: "damage-comparison",
              comparison: "greater-or-equal",
              value: 3,
            },
            effect: {
              type: "move-damage",
              amount: "all",
              from: "SELF",
              to: "CHOSEN_OPPOSING_CHARACTER",
            },
          },
        ],
      },
    },
  ],
  i18n: luisaMadrigalConfidentClimberEnchantedI18n,
};
