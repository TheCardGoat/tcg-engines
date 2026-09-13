import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/viserai-usurper.generated.ts";
import { goAgain, traverse } from "../shared/keywords.ts";

export const viseraiUsurper = defineCard(fabCardIdentitiesByCanonicalId["QMGnHJqg6fhcKLfmpRQLz"], {
  keywords: [traverse],
  abilities: {
    firstAttackActionBloodDebtPlayTurnGetsGoAgain: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "this-attack",
        },
        duration: "while-in-arena",
        appliesTo: {
          // Printed "the first … each turn" — ordinal 1 re-arms every turn
          // (Enigma first Spectral Shield / Arakni first stealth pattern).
          ...nextAttackActionLatch({ hasKeyword: "blood-debt" }),
          ordinal: 1,
          perTurn: true,
        },
      },
    },
    beginningEndPhaseCreatedActivatedGateIArathaelTurnTraverse: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "end-phase",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "performed-this-turn",
          event: "create-or-activate-gate-to-iarathael",
          player: "controller",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "transform",
            target: {
              selector: "self",
            },
            into: "traverse",
          },
        },
      },
    },
  },
});
