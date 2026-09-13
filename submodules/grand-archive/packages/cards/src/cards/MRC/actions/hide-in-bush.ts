import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hideInBush: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hj1trn0yet",
  slug: "hide-in-bush",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hj1trn0yet:face:default",
      catalogId: "hj1trn0yet",
      name: "Hide in Bush",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Brew — Four Herbs (You may sacrifice the listed objects rather than pay this card’s reserve cost.)\n\nYour champion gains stealth until end of turn. (This champion can’t be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "hj1trn0yet-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — Four Herbs (You may sacrifice the listed objects rather than pay this card’s reserve cost.)",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Herb",
                count: 4,
              },
            ],
          },
        },
        {
          id: "hj1trn0yet-a2",
          kind: "card-resolution",
          text: "Your champion gains stealth until end of turn. (This champion can’t be targeted by attacks unless permitted by true sight.)",
          effect: {
            kind: "continuous",
            subjects: {
              kind: "champion",
              player: "controller",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "stealth",
              },
            },
          },
        },
      ],
    },
  },
};

export default hideInBush;
