import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesStrongArmI18n } from "./125-hades-strong-arm.i18n";

export const hadesStrongArm: CharacterCard = {
  id: "XQk",
  canonicalId: "ci_XQk",
  reprints: ["set6-125"],
  cardType: "character",
  name: "Hades",
  version: "Strong Arm",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "006",
  cardNumber: 125,
  rarity: "legendary",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_aace3808bd9f445195dceec7b4fe87e9",
    tcgPlayer: 588070,
  },
  text: [
    {
      title: "WHAT ARE YOU GONNA DO?",
      description: "{E}, 3 {I}, Banish one of your characters — Banish chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
  abilities: [
    {
      id: "XQk-1",
      name: "WHAT ARE YOU GONNA DO?",
      text: "WHAT ARE YOU GONNA DO? {E}, 3 {I}, Banish one of your characters — Banish chosen character.",
      type: "activated",
      cost: {
        exert: true,
        ink: 3,
        banishCharacter: true,
      },
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: hadesStrongArmI18n,
};
