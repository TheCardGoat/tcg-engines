import type { CharacterCard } from "@tcg/lorcana-types";
import { dashParrVioletParrSuperSiblingsEnchantedI18n } from "./241-dash-parr-violet-parr-super-siblings-enchanted.i18n";

import { evasive } from "../../../helpers/abilities/evasive";
import { resist } from "../../../helpers/abilities/resist";
import { comboShift } from "../../../helpers/abilities/shift";

export const dashParrVioletParrSuperSiblingsEnchanted: CharacterCard = {
  id: "6a4",
  canonicalId: "ci_d3T",
  slug: "lorcana-ci_d3T",
  printings: [
    {
      id: "set13-241-enchanted",
      artId: "ci_d3T-enchanted",
      setCode: "set13",
      collectorNumber: "241",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set13-133"],
  cardType: "character",
  name: "Dash Parr & Violet Parr",
  version: "Super Siblings",
  inkType: ["ruby", "steel"],
  franchise: "Incredibles",
  set: "013",
  cardNumber: 241,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 8,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_265cccda001b4d478baab353b45b23b6",
    tcgPlayer: "704634",
  },
  text: [
    {
      title: "Combo Shift 6 {I}",
    },
    {
      title: "Evasive, Resist +1",
    },
    {
      title: "INCREDIBLE TACTICS",
      description:
        "Whenever this character quests or challenges, draw a card for each card under them.",
    },
  ],
  classifications: ["Storyborn", "Team", "Super", "Hero"],
  abilities: [
    comboShift(["Dash Parr", "Violet Parr"], 6),
    evasive,
    resist(1),
    {
      type: "triggered",
      name: "INCREDIBLE TACTICS",
      text: "INCREDIBLE TACTICS Whenever this character quests, draw a card for each card under them.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "draw",
        amount: {
          type: "cards-under-self",
        },
        target: "CONTROLLER",
      },
    },
    {
      type: "triggered",
      name: "INCREDIBLE TACTICS",
      text: "INCREDIBLE TACTICS Whenever this character challenges, draw a card for each card under them.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "draw",
        amount: {
          type: "cards-under-self",
        },
        target: "CONTROLLER",
      },
    },
  ],
  i18n: dashParrVioletParrSuperSiblingsEnchantedI18n,
};
