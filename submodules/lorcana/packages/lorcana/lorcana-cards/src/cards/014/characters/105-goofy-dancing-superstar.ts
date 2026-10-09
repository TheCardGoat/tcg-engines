import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../../helpers/abilities/shift";
import { singer } from "../../../helpers/abilities/singer";
import { goofyDancingSuperstarI18n } from "./105-goofy-dancing-superstar.i18n";

export const goofyDancingSuperstar: CharacterCard = {
  id: "Yuz",
  canonicalId: "ci_Yuz",
  slug: "lorcana-ci_Yuz",
  printings: [
    {
      id: "set14-105",
      artId: "set14-105",
      setCode: "set14",
      collectorNumber: "105",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-105"],
  cardType: "character",
  name: "Goofy",
  version: "Dancing Superstar",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 105,
  rarity: "rare",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d635730df878416c8cb022ce851a4edc",
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "Singer 6",
    },
    {
      title: "IN THE GROOVE",
      description:
        "Whenever this character quests, your other characters with Singer get +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    shift(3),
    singer(6),
    {
      id: "ITG-1",
      name: "IN THE GROOVE",
      type: "triggered",
      text: "IN THE GROOVE Whenever this character quests, your other characters with Singer get +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        duration: "this-turn",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filters: [{ type: "has-keyword", keyword: "Singer" }],
        },
      },
    },
  ],
  i18n: goofyDancingSuperstarI18n,
};
