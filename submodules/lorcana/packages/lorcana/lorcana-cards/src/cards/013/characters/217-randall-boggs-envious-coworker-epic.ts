import type { CharacterCard } from "@tcg/lorcana-types";
import { randallBoggsEnviousCoworkerEpicI18n } from "./217-randall-boggs-envious-coworker-epic.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const randallBoggsEnviousCoworkerEpic: CharacterCard = {
  id: "JL2",
  canonicalId: "ci_sQP",
  slug: "lorcana-ci_sQP",
  printings: [
    {
      id: "set13-217-epic",
      artId: "ci_sQP-epic",
      setCode: "set13",
      collectorNumber: "217",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set13-123"],
  cardType: "character",
  name: "Randall Boggs",
  version: "Envious Coworker",
  inkType: ["ruby"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 217,
  rarity: "epic",
  specialRarity: "epic",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_77e63110b6c6421a872ea5ef6f2aeca2",
    tcgPlayer: "702668",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "AFTER-HOURS PROJECT",
      description: "While all cards in your inkwell are exerted, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Monster"],
  abilities: [
    evasive,
    {
      id: "sQP-1",
      name: "AFTER-HOURS PROJECT",
      type: "static",
      text: "AFTER-HOURS PROJECT While all cards in your inkwell are exerted, this character gets +2 {L}.",
      condition: {
        type: "resource-count",
        what: "ready-cards-in-inkwell",
        controller: "you",
        comparison: "equal",
        value: 0,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  i18n: randallBoggsEnviousCoworkerEpicI18n,
};
