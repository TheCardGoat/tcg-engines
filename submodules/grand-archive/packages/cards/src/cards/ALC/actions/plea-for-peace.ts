import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pleaForPeace: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ir99sx6q3p",
  slug: "plea-for-peace",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ir99sx6q3p:face:default",
      catalogId: "ir99sx6q3p",
      name: "Plea for Peace",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Until the beginning of your next turn, players can't declare attacks unless they pay (1) for each attack declaration.",
      abilities: [
        {
          id: "ir99sx6q3p-a1",
          kind: "card-resolution",
          text: "Until the beginning of your next turn, players can't declare attacks unless they pay (1) for each attack declaration.",
          effect: {
            kind: "rule-modification",
            mode: "add-cost",
            action: "attack",
            subject: {
              kind: "player",
              player: "each-player",
            },
            cost: {
              kind: "pay-reserve",
              amount: 1,
            },
            duration: {
              kind: "until-start-of-turn",
              whose: "controller",
            },
          },
        },
      ],
    },
  },
};

export default pleaForPeace;
