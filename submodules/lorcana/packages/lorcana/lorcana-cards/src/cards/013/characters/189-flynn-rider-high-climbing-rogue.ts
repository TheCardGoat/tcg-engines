import type { CharacterCard } from "@tcg/lorcana-types";
import { flynnRiderHighclimbingRogueI18n } from "./189-flynn-rider-high-climbing-rogue.i18n";

export const flynnRiderHighclimbingRogue: CharacterCard = {
  id: "F5v",
  canonicalId: "ci_F5v",
  slug: "lorcana-ci_F5v",
  printings: [
    {
      id: "set13-189",
      artId: "set13-189",
      setCode: "set13",
      collectorNumber: "189",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-189"],
  cardType: "character",
  name: "Flynn Rider",
  version: "High-Climbing Rogue",
  inkType: ["steel"],
  franchise: "Tangled",
  set: "013",
  cardNumber: 189,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_3346eb6f9f874bbbad8c1942445299d3",
  },
  text: [
    {
      title: "WE CAN WORK THIS OUT",
      description:
        "Whenever an opponent chooses this character for an action or ability, they choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      type: "triggered",
      name: "WE CAN WORK THIS OUT",
      text: "WE CAN WORK THIS OUT Whenever an opponent chooses this character for an action or ability, they choose and discard a card.",
      trigger: {
        event: "be-chosen",
        on: "SELF",
        timing: "whenever",
        sourceFilter: {
          sourceController: "opponent",
        },
      },
      effect: {
        type: "discard",
        amount: 1,
        chosen: true,
        from: "hand",
        target: "TRIGGER_SOURCE_OWNER",
      },
    },
  ],
  i18n: flynnRiderHighclimbingRogueI18n,
};
