import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { fusion } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rites-of-replenishment.generated.ts";

export const ritesOfReplenishment = definePitchFamily(fabPitchFamilies["rites-of-replenishment"], {
  keywords: [fusion("Earth")],
  abilities: () => ({
    triggeredAttackRitesOfReplenishmentDamageDealtOptionalMoveCard: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Rites Of Replenishment",
            },
          },
        },
        state: {
          type: "damage-dealt",
          damageType: "arcane",
          player: "controller",
          per: "turn",
          comparison: {
            op: "gte",
            value: 1,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
        },
      },
    },
    triggeredAttackRitesOfReplenishmentHasStatusFusedOptionalMoveCard: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Rites Of Replenishment",
            },
          },
        },
        state: {
          type: "has-status",
          status: "fused",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: attackActionFilter(),
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
        },
      },
    },
  }),
});

export const {
  red: ritesOfReplenishmentRed,
  yellow: ritesOfReplenishmentYellow,
  blue: ritesOfReplenishmentBlue,
} = ritesOfReplenishment.cards;
