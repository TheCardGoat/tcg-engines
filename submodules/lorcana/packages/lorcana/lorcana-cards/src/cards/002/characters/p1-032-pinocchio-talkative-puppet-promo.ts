import type { CharacterCard } from "@tcg/lorcana-types";
import { pinocchioTalkativePuppetP1PromoI18n } from "./p1-032-pinocchio-talkative-puppet-promo.i18n";

export const pinocchioTalkativePuppetP1Promo: CharacterCard = {
  id: "jcE",
  canonicalId: "ci_RgG",
  slug: "lorcana-ci_RgG",
  printings: [
    {
      id: "set2-p1-032-promo",
      artId: "ci_RgG-promo",
      setCode: "set2",
      collectorNumber: "32",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set2-058"],
  cardType: "character",
  name: "Pinocchio",
  version: "Talkative Puppet",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  cardNumber: 32,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_526769983dde47589d6ddf5cd4e74caa",
    tcgPlayer: "525086",
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
  i18n: pinocchioTalkativePuppetP1PromoI18n,
};
