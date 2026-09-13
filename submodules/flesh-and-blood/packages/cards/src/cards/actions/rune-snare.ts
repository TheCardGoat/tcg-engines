import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rune-snare.generated.ts";

export const runeSnare = definePitchFamily(fabPitchFamilies["rune-snare"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGets3Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Arrow"],
            },
          },
        },
      },
    },
    defendsAttackingPlayedCreated2MoreAurasTurnDestroyAura: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "compare-amount",
          amount: {
            type: "count",
            what: "cards-played-this-turn",
            player: "attacking-hero",
            filter: { typeBox: { subtypes: ["Aura"] } },
          },
          comparison: { op: "gte", value: 2 },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const { red: runeSnareRed } = runeSnare.cards;
