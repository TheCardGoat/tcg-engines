import type { CharacterCard } from "@tcg/lorcana-types";
import { princeEricExpertHelmsmanI18n } from "./121-prince-eric-expert-helmsman.i18n";

export const princeEricExpertHelmsman: CharacterCard = {
  id: "03G",
  canonicalId: "ci_03G",
  reprints: ["set3-121"],
  cardType: "character",
  name: "Prince Eric",
  version: "Expert Helmsman",
  inkType: ["ruby"],
  franchise: "Little Mermaid",
  set: "003",
  cardNumber: 121,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_4d0b6d09ae6c423ea874fbb6c659355e",
    tcgPlayer: 536265,
  },
  text: [
    {
      title: "SURPRISE MANEUVER",
      description: "When this character is banished, you may banish chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "1fb-1",
      name: "SURPRISE MANEUVER",
      text: "SURPRISE MANEUVER When this character is banished, you may banish chosen character.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: princeEricExpertHelmsmanI18n,
};
