import type { CharacterCard } from "@tcg/lorcana-types";
import { frecklesGoodBoyI18n } from "./168-freckles-good-boy.i18n";

export const frecklesGoodBoy: CharacterCard = {
  id: "64q",
  canonicalId: "ci_64q",
  reprints: ["set7-168"],
  cardType: "character",
  name: "Freckles",
  version: "Good Boy",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  cardNumber: 168,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_150d93e25ca744b69a232651dcd2caa3",
    tcgPlayer: 619502,
  },
  text: [
    {
      title: "JUST SO CUTE!",
      description: "When you play this character, chosen opposing character gets -1 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -1,
        stat: "strength",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "1v6-1",
      name: "JUST SO CUTE!",
      text: "JUST SO CUTE! When you play this character, chosen opposing character gets -1 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: frecklesGoodBoyI18n,
};
