import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyMarleysClumsySpiritI18n } from "./120-goofy-marleys-clumsy-spirit.i18n";

export const goofyMarleysClumsySpirit: CharacterCard = {
  id: "z3A",
  canonicalId: "ci_z3A",
  reprints: ["set11-120"],
  cardType: "character",
  name: "Goofy",
  version: "Marley's Clumsy Spirit",
  inkType: ["ruby"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 120,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_aeb75ac2ab524eb690b3b96aeddc80cc",
    tcgPlayer: 673759,
  },
  text: [
    {
      title: "PREPARE YOURSELF",
      description:
        "When you play this character, you may ready chosen character. If you do, they can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Ghost"],
  abilities: [
    {
      id: "dju-1",
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              target: {
                cardTypes: ["character"],
                count: 1,
                owner: "any",
                selector: "chosen",
                zones: ["play"],
              },
              type: "ready",
            },
            type: "optional",
          },
          {
            restriction: "cant-quest",
            target: {
              ref: "previous-target",
            },
            type: "restriction",
            duration: "this-turn",
          },
        ],
        type: "sequence",
      },
      name: "PREPARE YOURSELF",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "PREPARE YOURSELF When you play this character, you may ready chosen character. If you do, they can't quest for the rest of this turn.",
    },
  ],
  i18n: goofyMarleysClumsySpiritI18n,
};
