import type { CharacterCard } from "@tcg/lorcana-types";
import { bromBonesBurlyBullyI18n } from "./127-brom-bones-burly-bully.i18n";

export const bromBonesBurlyBully: CharacterCard = {
  id: "sNh",
  canonicalId: "ci_sNh",
  reprints: ["set10-127"],
  cardType: "character",
  name: "Brom Bones",
  version: "Burly Bully",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  cardNumber: 127,
  rarity: "common",
  cost: 4,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8f73a6eed2b94aae85021a25eaa083fc",
    tcgPlayer: 660015,
  },
  text: [
    {
      title: "ROUGH AND TUMBLE",
      description:
        "Whenever this character challenges a character with 2 {S} or less, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "1ai-1",
      name: "ROUGH AND TUMBLE",
      text: "ROUGH AND TUMBLE Whenever this character challenges a character with 2 {S} or less, each opponent loses 1 lore.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: bromBonesBurlyBullyI18n,
};
