import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellInsistentFairyI18n } from "./136-tinker-bell-insistent-fairy.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const tinkerBellInsistentFairy: CharacterCard = {
  id: "01E",
  canonicalId: "ci_01E",
  slug: "lorcana-ci_01E",
  printings: [
    {
      id: "set8-136",
      artId: "set8-136",
      setCode: "set8",
      collectorNumber: "136",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set8-136"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Insistent Fairy",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "008",
  cardNumber: 136,
  rarity: "legendary",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f49776538d7247e998024421be5f5a18",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "PAY ATTENTION",
      description:
        "Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [
    evasive,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          effects: [
            {
              target: {
                ref: "trigger-subject",
              },
              type: "exert",
            },
            {
              amount: 2,
              type: "gain-lore",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "ay2-2",
      name: "PAY ATTENTION",
      text: "PAY ATTENTION Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
          filters: [
            {
              type: "strength-comparison",
              comparison: "greater-or-equal",
              value: 5,
            },
          ],
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: tinkerBellInsistentFairyI18n,
};
