import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const droppedBand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "K5qIbjeqQd",
  slug: "dropped-band",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "K5qIbjeqQd:face:default",
      catalogId: "K5qIbjeqQd",
      name: "Dropped Band",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Dropped Band: You may reveal three Chessman cards from your hand and/or memory. If you do, summon a Pawn Piece token.",
      abilities: [
        {
          id: "K5qIbjeqQd-a1",
          kind: "activated",
          text: "Banish Dropped Band: You may reveal three Chessman cards from your hand and/or memory. If you do, summon a Pawn Piece token.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
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
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "summon",
                    object: "Pawn Piece",
                    controller: "controller",
                    bindResultAs: "summoned-token",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default droppedBand;
