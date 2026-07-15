import type { CharacterCard } from "@tcg/lorcana-types";
import { arielSonicWarriorI18n } from "./195-ariel-sonic-warrior.i18n";

export const arielSonicWarrior: CharacterCard = {
  id: "5mA",
  canonicalId: "ci_8ZB",
  slug: "lorcana-ci_8ZB",
  printings: [
    {
      id: "set9-195",
      artId: "set9-195",
      setCode: "set9",
      collectorNumber: "195",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set4-175", "set9-195"],
  cardType: "character",
  name: "Ariel",
  version: "Sonic Warrior",
  inkType: ["steel"],
  franchise: "Little Mermaid",
  set: "009",
  cardNumber: 195,
  rarity: "rare",
  cost: 6,
  strength: 3,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8744600f576e484fa2e93cec672eba2f",
    tcgPlayer: "650128",
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "AMPLIFIED VOICE",
      description:
        "Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "tfb-1",
      keyword: "Shift",
      text: "Shift 4 {I}",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 2,
          },
          effect: {
            amount: 3,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "deal-damage",
          },
        },
        type: "optional",
      },
      id: "tfb-2",
      name: "AMPLIFIED VOICE",
      text: "AMPLIFIED VOICE Whenever you play a song, you may pay 2 {I} to deal 3 damage to chosen character.",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: arielSonicWarriorI18n,
};
