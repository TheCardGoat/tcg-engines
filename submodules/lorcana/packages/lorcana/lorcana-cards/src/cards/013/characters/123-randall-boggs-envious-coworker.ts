import type { CharacterCard } from "@tcg/lorcana-types";
import { randallBoggsEnviousCoworkerI18n } from "./123-randall-boggs-envious-coworker.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const randallBoggsEnviousCoworker: CharacterCard = {
  id: "sQP",
  canonicalId: "ci_sQP",
  slug: "lorcana-ci_sQP",
  printings: [
    {
      id: "set13-123",
      artId: "set13-123",
      setCode: "set13",
      collectorNumber: "123",
      rarity: "rare",
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
  cardNumber: 123,
  rarity: "rare",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 0,
  inkable: true,
  text: [
    {
      title: "<Evasive>",
    },
    {
      title: "After-Hours Project",
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
  i18n: randallBoggsEnviousCoworkerI18n,
};
