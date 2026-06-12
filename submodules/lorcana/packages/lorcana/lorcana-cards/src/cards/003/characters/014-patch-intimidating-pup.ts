import type { CharacterCard } from "@tcg/lorcana-types";
import { patchIntimidatingPupI18n } from "./014-patch-intimidating-pup.i18n";

export const patchIntimidatingPup: CharacterCard = {
  id: "530",
  canonicalId: "ci_530",
  reprints: ["set3-014"],
  cardType: "character",
  name: "Patch",
  version: "Intimidating Pup",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "003",
  cardNumber: 14,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d087e066b0484bf9aed46a182f60f0ff",
    tcgPlayer: 539066,
  },
  text: [
    {
      title: "BARK",
      description: "{E} — Chosen character gets -2 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "until-start-of-next-turn",
        modifier: -2,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1p9-1",
      name: "BARK",
      text: "BARK {E} — Chosen character gets -2 {S} until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: patchIntimidatingPupI18n,
};
