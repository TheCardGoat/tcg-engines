import type { CharacterCard } from "@tcg/lorcana-types";
import { gastonSuperiorArcherI18n } from "./015-gaston-superior-archer.i18n";

export const gastonSuperiorArcher: CharacterCard = {
  id: "n0Q",
  canonicalId: "ci_n0Q",
  slug: "lorcana-ci_n0Q",
  printings: [
    {
      id: "set13-015",
      artId: "set13-015",
      setCode: "set13",
      collectorNumber: "15",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-015"],
  cardType: "character",
  name: "Gaston",
  version: "Superior Archer",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "013",
  cardNumber: 15,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Watch This!",
      description:
        "When you play this character, you may banish chosen character with 5 {S} or more.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      type: "triggered",
      id: "n0Q-1",
      name: "Watch This!",
      text: "Watch This! When you play this character, you may banish chosen character with 5 {S} or more.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "strength-comparison",
                comparison: "greater-or-equal",
                value: 5,
              },
            ],
          },
        },
      },
    },
  ],
  i18n: gastonSuperiorArcherI18n,
};
