import type { CharacterCard } from "@tcg/lorcana-types";
import { mrsIncredibleDeterminedRescuerEnchantedI18n } from "./239-mrs-incredible-determined-rescuer-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const mrsIncredibleDeterminedRescuerEnchanted: CharacterCard = {
  id: "u20",
  canonicalId: "ci_2J3",
  slug: "lorcana-ci_2J3",
  printings: [
    {
      id: "set12-239-enchanted",
      artId: "ci_2J3-enchanted",
      setCode: "set12",
      collectorNumber: "239",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set12-195"],
  cardType: "character",
  name: "Mrs. Incredible",
  version: "Determined Rescuer",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 239,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 7,
  strength: 5,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_fcfb9ad84f3a4c2db462a9ec4d3a63d1",
    tcgPlayer: "692229",
  },
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "PULL BACK",
      description: "Your characters gain Resist +1.",
    },
    {
      title: "REGROUP",
      description:
        "During your turn, whenever another character is banished in a challenge, you may ready chosen Super character. If you do, they can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    shift(5),
    {
      id: "2J3-2",
      name: "PULL BACK",
      type: "static",
      text: "PULL BACK Your characters gain Resist +1.",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        target: "YOUR_CHARACTERS",
      },
    },
    {
      id: "2J3-3",
      name: "REGROUP",
      type: "triggered",
      text: "REGROUP During your turn, whenever another character is banished in a challenge, you may ready chosen Super character. If you do, they can't quest for the rest of this turn.",
      trigger: {
        event: "banish-in-challenge",
        on: "OTHER_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "ready",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [
                  {
                    type: "has-classification",
                    classification: "Super",
                  },
                ],
              },
            },
            {
              type: "restriction",
              restriction: "cant-quest",
              duration: "this-turn",
              target: {
                ref: "previous-target",
              },
            },
          ],
        },
      },
    },
  ],
  i18n: mrsIncredibleDeterminedRescuerEnchantedI18n,
};
