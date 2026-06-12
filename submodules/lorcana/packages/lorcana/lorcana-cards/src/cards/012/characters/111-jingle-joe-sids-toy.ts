import type { CharacterCard } from "@tcg/lorcana-types";
import { jingleJoeSidsToyI18n } from "./111-jingle-joe-sids-toy.i18n";

export const jingleJoeSidsToy: CharacterCard = {
  id: "NoE",
  canonicalId: "ci_NoE",
  reprints: ["set12-111"],
  cardType: "character",
  name: "Jingle Joe",
  version: "Sid's Toy",
  inkType: ["ruby"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 111,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b55a67a84a954c57933ff1d7218f1093",
  },
  text: [
    {
      title: "Turn Out the Light",
      description:
        "During your turn, whenever one of your other Toy characters is banished, chosen character of yours gains <Evasive> until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Toy"],
  abilities: [
    {
      id: "NoE-1",
      name: "Turn Out the Light",
      type: "triggered",
      text: "Turn Out the Light During your turn, whenever one of your other Toy characters is banished, chosen character of yours gains Evasive until the start of your next turn.",
      trigger: {
        event: "banish",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Toy",
          excludeSelf: true,
        },
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        duration: "until-start-of-next-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          cardTypes: ["character"],
          zones: ["play"],
        },
      },
    },
  ],
  i18n: jingleJoeSidsToyI18n,
};
