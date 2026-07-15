import type { CharacterCard } from "@tcg/lorcana-types";
import { woodyTownSheriffI18n } from "./013-woody-town-sheriff.i18n";

export const woodyTownSheriff: CharacterCard = {
  id: "30e",
  canonicalId: "ci_30e",
  slug: "lorcana-ci_30e",
  printings: [
    {
      id: "set13-013",
      artId: "set13-013",
      setCode: "set13",
      collectorNumber: "13",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-013"],
  cardType: "character",
  name: "Woody",
  version: "Town Sheriff",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "013",
  cardNumber: 13,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d36d4186954f47a99733811e692d8fea",
  },
  text: [
    {
      title: "MOVE ALONG",
      description:
        "When you play this character, until the start of your next turn, chosen opposing character can't challenge and must quest if able.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Toy"],
  abilities: [
    {
      type: "triggered",
      name: "Move Along",
      text: "Move Along When you play this character, until the start of your next turn, chosen opposing character can't challenge and must quest if able.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "restriction",
            restriction: "cant-challenge",
            target: "CHOSEN_OPPOSING_CHARACTER",
            duration: "until-start-of-next-turn",
          },
          {
            type: "restriction",
            restriction: "must-quest",
            target: {
              ref: "previous-target",
            },
            duration: "until-start-of-next-turn",
          },
        ],
      },
    },
  ],
  i18n: woodyTownSheriffI18n,
};
