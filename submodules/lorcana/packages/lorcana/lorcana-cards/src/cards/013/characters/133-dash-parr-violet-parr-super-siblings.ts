import type { CharacterCard } from "@tcg/lorcana-types";
import { evasive } from "../../../helpers/abilities/evasive";
import { resist } from "../../../helpers/abilities/resist";
import { comboShift } from "../../../helpers/abilities/shift";
import { dashParrVioletParrSuperSiblingsI18n } from "./133-dash-parr-violet-parr-super-siblings.i18n";

export const dashParrVioletParrSuperSiblings: CharacterCard = {
  id: "d3T",
  canonicalId: "ci_d3T",
  slug: "lorcana-ci_d3T",
  printings: [
    {
      id: "set13-133",
      artId: "set13-133",
      setCode: "set13",
      collectorNumber: "133",
      rarity: "legendary",
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
  cardNumber: 133,
  rarity: "legendary",
  cost: 8,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Combo Shift 6 {I}",
    },
    {
      title: "Evasive, Resist +1",
    },
    {
      title: "Incredible Tactics",
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
  i18n: dashParrVioletParrSuperSiblingsI18n,
};
