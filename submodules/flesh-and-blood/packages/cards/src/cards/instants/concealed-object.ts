import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/concealed-object.generated.ts";

export const concealedObject = definePitchFamily(fabPitchFamilies["concealed-object"], {
  abilities: () => ({
    whenEntersArenaCrowdBoos: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "crowd-boos",
          target: "controller",
        },
      },
      label: {
        name: "the-crowd-boos",
      },
    },
    instantTargetAttackGets1: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          // "Target attack" carries no zone restriction: the tap must reach
          // an attack both while it sits unresolved on the stack AND once it
          // is the active chain-link attack during the defend/reaction steps
          // (the common printed use). `declared: "on-stack"` fixes WHEN the
          // target is declared, not where the object lives — the CRU083 a1
          // idiom (on-stack declaration + combat-chain scan) proves the
          // pairing works.
          declared: "on-stack",
          zones: ["stack", "combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
      label: {
        name: "the-crowd-boos",
      },
    },
    atBeginningEndPhaseDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
      label: {
        name: "the-crowd-boos",
      },
    },
  }),
});

export const { blue: concealedObjectBlue } = concealedObject.cards;
