import type { CharacterCard } from "@tcg/lorcana-types";
import { priyaMangalImmovableFanI18n } from "./007-priya-mangal-immovable-fan.i18n";

export const priyaMangalImmovableFan: CharacterCard = {
  id: "5Wa",
  canonicalId: "ci_5Wa",
  slug: "lorcana-ci_5Wa",
  printings: [
    {
      id: "set14-007",
      artId: "set14-007",
      setCode: "set14",
      collectorNumber: "7",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-007"],
  cardType: "character",
  name: "Priya Mangal",
  version: "Immovable Fan",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "014",
  cardNumber: 7,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c368077143674c72b39a8f211a65d561",
  },
  text: [
    {
      title: "BACK OFF!",
      description:
        "When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "5Wa-1",
      name: "BACK OFF!",
      type: "triggered",
      text: "BACK OFF! When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: -2,
          duration: "until-start-of-next-turn",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
  i18n: priyaMangalImmovableFanI18n,
};
