import type { CharacterCard } from "@tcg/lorcana-types";
import { alphaPackLeaderI18n } from "./151-alpha-pack-leader.i18n";

export const alphaPackLeader: CharacterCard = {
  id: "iIf",
  canonicalId: "ci_iIf",
  slug: "lorcana-ci_iIf",
  printings: [
    {
      id: "set13-151",
      artId: "set13-151",
      setCode: "set13",
      collectorNumber: "151",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-151"],
  cardType: "character",
  name: "Alpha",
  version: "Pack Leader",
  inkType: ["sapphire"],
  franchise: "Up",
  set: "013",
  cardNumber: 151,
  rarity: "rare",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Who Wants a Treat?",
      description:
        "Whenever you play an item, chosen character gets +1 {S} and gains Resist +1 this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "triggered",
      name: "WHO WANTS A TREAT?",
      text: "WHO WANTS A TREAT? Whenever you play an item, chosen character gets +1 {S} and gains Resist +1 this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "item",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 1,
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 1,
            duration: "this-turn",
            target: {
              ref: "previous-target",
            },
          },
        ],
      },
    },
  ],
  i18n: alphaPackLeaderI18n,
};
