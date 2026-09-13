import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sleightOfHand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ddkocwcm38",
  slug: "sleight-of-hand",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ddkocwcm38:face:default",
      catalogId: "ddkocwcm38",
      name: "Sleight of Hand",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SUITED", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target Suited ally you control gains stealth until end of turn. (Units with stealth can't be targeted by attacks unless permitted by true sight.) \n\n[Class Bonus] Draw a card into your memory. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "ddkocwcm38-a1",
          kind: "card-resolution",
          text: "Target Suited ally you control gains stealth until end of turn. (Units with stealth can't be targeted by attacks unless permitted by true sight.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SUITED"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
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
        {
          id: "ddkocwcm38-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Draw a card into your memory. (Apply this effect only if your champion's class matches this card's class.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default sleightOfHand;
