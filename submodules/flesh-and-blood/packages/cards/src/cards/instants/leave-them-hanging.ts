import { suspense } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/leave-them-hanging.generated.ts";

export const leaveThemHanging = definePitchFamily(fabPitchFamilies["leave-them-hanging"], {
  keywords: [suspense],
  abilities: () => ({
    whenEntersLeavesArenaIntimidateTargetHero: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          kind: "any-of",
          patterns: [
            {
              name: "enter-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
            {
              name: "leave-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "intimidate",
          target: "any",
        },
      },
      label: {
        name: "intimidate",
      },
    },
    whenLeavesArenaNextAttackTurnGets4: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
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
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 4,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
          },
        },
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const { red: leaveThemHangingRed } = leaveThemHanging.cards;
