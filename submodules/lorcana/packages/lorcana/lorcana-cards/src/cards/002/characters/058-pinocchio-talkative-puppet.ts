import type { CharacterCard } from "@tcg/lorcana-types";
import { pinocchioTalkativePuppetI18n } from "./058-pinocchio-talkative-puppet.i18n";

export const pinocchioTalkativePuppet: CharacterCard = {
  id: "nsa",
  canonicalId: "ci_nsa",
  reprints: ["set2-058"],
  cardType: "character",
  name: "Pinocchio",
  version: "Talkative Puppet",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  cardNumber: 58,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_526769983dde47589d6ddf5cd4e74caa",
    tcgPlayer: 525086,
  },
  text: [
    {
      title: "TELLING LIES",
      description: "When you play this character, you may exert chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "exert",
        },
        type: "optional",
      },
      id: "njx-1",
      name: "TELLING LIES",
      text: "TELLING LIES When you play this character, you may exert chosen opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: pinocchioTalkativePuppetI18n,
};
