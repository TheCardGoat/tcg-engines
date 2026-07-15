import type { CharacterCard } from "@tcg/lorcana-types";
import { webbyVanderquackMysteryEnthusiastEpicI18n } from "./211-webby-vanderquack-mystery-enthusiast-epic.i18n";

export const webbyVanderquackMysteryEnthusiastEpic: CharacterCard = {
  id: "RjX",
  canonicalId: "ci_Y0c",
  slug: "lorcana-ci_Y0c",
  printings: [
    {
      id: "set10-211-epic",
      artId: "ci_Y0c-epic",
      setCode: "set10",
      collectorNumber: "211",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set10-073"],
  cardType: "character",
  name: "Webby Vanderquack",
  version: "Mystery Enthusiast",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 211,
  rarity: "common",
  specialRarity: "epic",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_63194dcb766c473093e3802f309030e0",
    tcgPlayer: "660190",
  },
  text: [
    {
      title: "CONTAGIOUS ENERGY",
      description: "When you play this character, chosen character gets +1 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
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
      id: "1kd-1",
      name: "CONTAGIOUS ENERGY",
      text: "CONTAGIOUS ENERGY When you play this character, chosen character gets +1 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: webbyVanderquackMysteryEnthusiastEpicI18n,
};
