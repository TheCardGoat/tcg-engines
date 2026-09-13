import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tinderflarePivot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s3bqtjayfn",
  slug: "tinderflare-pivot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s3bqtjayfn:face:default",
      catalogId: "s3bqtjayfn",
      name: "Tinderflare Pivot",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Kindle 2 (You may banish up to two fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card's cost.)\n\nTarget Ranger unit becomes distant and gains ranged 1 until end of turn. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "s3bqtjayfn-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 2 (You may banish up to two fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card's cost.)",
          keyword: {
            name: "kindle",
            value: 2,
          },
        },
        {
          id: "s3bqtjayfn-a2",
          kind: "card-resolution",
          text: "Target Ranger unit becomes distant and gains ranged 1 until end of turn. (Units stay distant until the end of their controller's turn.)",
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
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "object-state",
                      state: "distant",
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
                name: "ranged",
                value: 1,
              },
            },
          },
        },
      ],
    },
  },
};

export default tinderflarePivot;
