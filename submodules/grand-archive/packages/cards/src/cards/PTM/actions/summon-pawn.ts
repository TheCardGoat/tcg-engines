import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const summonPawn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "SM2A2o5hru",
  slug: "summon-pawn",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "SM2A2o5hru:face:default",
      catalogId: "SM2A2o5hru",
      name: "Summon Pawn",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "CHESSMAN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "You may reveal three Chessman cards from your hand and/or memory. If you do, summon a Pawn Piece token.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "SM2A2o5hru-a1",
          kind: "card-resolution",
          text: "You may reveal three Chessman cards from your hand and/or memory. If you do, summon a Pawn Piece token.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "reveal",
                  player: "controller",
                  selection: {
                    id: "reveal-selection",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 3,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["hand"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "subtype",
                        oneOf: ["CHESSMAN"],
                      },
                    },
                  },
                },
                {
                  kind: "summon",
                  object: "Pawn Piece",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                },
              ],
            },
          },
        },
        {
          id: "SM2A2o5hru-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default summonPawn;
