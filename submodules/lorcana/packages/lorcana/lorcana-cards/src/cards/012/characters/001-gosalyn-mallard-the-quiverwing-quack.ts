import type { CharacterCard } from "@tcg/lorcana-types";
import { gosalynMallardTheQuiverwingQuackI18n } from "./001-gosalyn-mallard-the-quiverwing-quack.i18n";

export const gosalynMallardTheQuiverwingQuack: CharacterCard = {
  id: "oEU",
  canonicalId: "ci_oEU",
  reprints: ["set12-001"],
  cardType: "character",
  name: "Gosalyn Mallard",
  version: "The Quiverwing Quack",
  inkType: ["amber"],
  franchise: "Darkwing Duck",
  set: "012",
  cardNumber: 1,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_1755646d14394fc69c64fcae17bf5f44",
  },
  text: [
    {
      title: "HEROIC INTERVENTION",
      description:
        "When you play this character, you may ready chosen character with cost 2 or less. If you do, they can't quest or challenge for the rest of this turn.",
    },
  ],
  classifications: ["Dreamborn", "Super", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "ready",
              target: {
                cardTypes: ["character"],
                count: 1,
                owner: "any",
                selector: "chosen",
                zones: ["play"],
                filter: [
                  {
                    type: "cost-comparison",
                    comparison: "less-or-equal",
                    value: 2,
                  },
                ],
              },
            },
            {
              duration: "this-turn",
              restriction: "cant-quest-or-challenge",
              target: {
                ref: "previous-target",
              },
              type: "restriction",
            },
          ],
        },
        type: "optional",
      },
      id: "oEU-1",
      name: "Heroic Intervention",
      text: "Heroic Intervention When you play this character, you may ready chosen character with cost 2 or less. If you do, they can't quest or challenge for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: gosalynMallardTheQuiverwingQuackI18n,
};
