import type { CharacterCard } from "@tcg/lorcana-types";
import { luisaMadrigalConfidentClimberI18n } from "./060-luisa-madrigal-confident-climber.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const luisaMadrigalConfidentClimber: CharacterCard = {
  id: "tct",
  canonicalId: "ci_tct",
  reprints: ["set12-060"],
  cardType: "character",
  name: "Luisa Madrigal",
  version: "Confident Climber",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 60,
  rarity: "legendary",
  cost: 5,
  strength: 6,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_46ca002a8945440398b20c8e4ad6b6eb",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "I CAN TAKE IT",
      description:
        "1 {I} — Move up to 1 damage from chosen character of yours to this character. Then, if this character has 3 or more damage, move all damage from this character to chosen opposing character.",
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
  i18n: luisaMadrigalConfidentClimberI18n,
};
