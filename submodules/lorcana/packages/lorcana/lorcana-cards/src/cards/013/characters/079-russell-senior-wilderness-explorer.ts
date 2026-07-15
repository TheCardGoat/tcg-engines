import type { CharacterCard } from "@tcg/lorcana-types";
import { russellSeniorWildernessExplorerI18n } from "./079-russell-senior-wilderness-explorer.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const russellSeniorWildernessExplorer: CharacterCard = {
  id: "Xan",
  canonicalId: "ci_Xan",
  slug: "lorcana-ci_Xan",
  printings: [
    {
      id: "set13-079",
      artId: "set13-079",
      setCode: "set13",
      collectorNumber: "79",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-079"],
  cardType: "character",
  name: "Russell",
  version: "Senior Wilderness Explorer",
  inkType: ["emerald"],
  franchise: "Up",
  set: "013",
  cardNumber: 79,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_13e8c5a70412446ab5b3af9e39bfd691",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "BASE CAMP",
      description: "Your characters at locations get +1{S}.",
    },
    {
      title: "GOOD LEADERSHIP",
      description: "Whenever one of your characters with 4{S} or more quests, gain 1 lore.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(3),
    {
      type: "static",
      name: "BASE CAMP",
      text: "BASE CAMP Your characters at locations get +1 {S}.",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "at-location" }],
        },
      },
    },
    {
      type: "triggered",
      name: "GOOD LEADERSHIP",
      text: "GOOD LEADERSHIP Whenever one of your characters with 4 {S} or more quests, gain 1 lore.",
      trigger: {
        event: "quest",
        on: {
          controller: "you",
          cardType: "character",
          filters: [{ type: "strength-comparison", comparison: "greater-or-equal", value: 4 }],
        },
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: russellSeniorWildernessExplorerI18n,
};
