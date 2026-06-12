import type { CharacterCard } from "@tcg/lorcana-types";
import { jamesRoleModelI18n } from "./150-james-role-model.i18n";

export const jamesRoleModel: CharacterCard = {
  id: "OCC",
  canonicalId: "ci_OCC",
  reprints: ["set2-150"],
  cardType: "character",
  name: "James",
  version: "Role Model",
  inkType: ["sapphire"],
  franchise: "Princess and the Frog",
  set: "002",
  cardNumber: 150,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_648eda5b1ace49e1abf842cce776399d",
    tcgPlayer: 527764,
  },
  text: [
    {
      title: "NEVER, EVER LOSE SIGHT",
      description:
        "When this character is banished, you may put this card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    {
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "this-card",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
      },
      id: "1l7-1",
      name: "NEVER, EVER LOSE SIGHT",
      text: "NEVER, EVER LOSE SIGHT When this character is banished, you may put this card into your inkwell facedown and exerted.",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
    },
  ],
  i18n: jamesRoleModelI18n,
};
