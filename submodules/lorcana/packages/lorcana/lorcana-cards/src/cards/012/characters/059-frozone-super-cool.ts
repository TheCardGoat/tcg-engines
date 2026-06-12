import type { CharacterCard } from "@tcg/lorcana-types";
import { frozoneSuperCoolI18n } from "./059-frozone-super-cool.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const frozoneSuperCool: CharacterCard = {
  id: "Ea1",
  canonicalId: "ci_Ea1",
  reprints: ["set12-059"],
  cardType: "character",
  name: "Frozone",
  version: "Super Cool",
  inkType: ["amethyst"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 59,
  rarity: "rare",
  cost: 6,
  strength: 6,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_aa4a880f25814ec58358ea3ad771fbb3",
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "JUST CHILL",
      description:
        "When you play this character, if you have another Super character in play, you may exert chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    rush,
    {
      id: "Ea1-2",
      name: "JUST CHILL",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "has-character-count",
        controller: "you",
        classification: "Super",
        count: 2,
        comparison: "greater-or-equal",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "exert",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "JUST CHILL When you play this character, if you have another Super character in play, you may exert chosen opposing character.",
    },
  ],
  i18n: frozoneSuperCoolI18n,
};
