import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/flood-of-force.generated.ts";

import { combo, goAgain } from "../shared/keywords.ts";

// Re-encoded per plan §5 (FIX-5): the prior module (1) carried an unprinted
// card-level go again, (2) ran the reveal inside a delayed-trigger whose
// `outputBinding` never reached the sibling conditional (DTD051 family),
// (3) moved `self` instead of the revealed card, and (4) ran the +3{p}/go
// again sequence outside `conditional.then`. The shape below is the MST161
// combo-gated on-attack trigger (event-and-state last-attack check) with the
// MST075 reveal → binding-matches → conditional idiom; the go again is ONLY
// granted by the combo leg.
export const floodOfForce = definePitchFamily(fabPitchFamilies["flood-of-force"], {
  keywords: [combo],
  abilities: () => ({
    comboIfRushingRiverFloodForceWasLastAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "last-attack-this-combat-chain",
          names: ["Rushing River", "Flood Of Force"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  hasKeyword: "combo",
                },
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "move-card",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    to: {
                      zone: "hand",
                    },
                  },
                  {
                    type: "modify-numeric",
                    property: "power",
                    op: "add",
                    amount: 3,
                    target: {
                      selector: "self",
                    },
                    duration: "this-turn",
                  },
                  {
                    type: "grant-property",
                    property: {
                      kind: "keyword",
                      keyword: goAgain,
                    },
                    target: {
                      selector: "self",
                    },
                    duration: "this-turn",
                  },
                ],
              },
            },
          ],
        },
      },
      label: {
        name: "combo",
        params: {
          names: ["Rushing River", "Flood Of Force"],
        },
      },
    },
  }),
});
export const { yellow: floodOfForceYellow } = floodOfForce.cards;
