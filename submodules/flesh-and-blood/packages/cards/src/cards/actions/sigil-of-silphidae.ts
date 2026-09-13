import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sigil-of-silphidae.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sigilOfSilphidae = definePitchFamily(fabPitchFamilies["sigil-of-silphidae"], {
  keywords: [goAgain],
  abilities: () => ({
    whenEntersLeavesArenaBanishAnotherAuraFromGraveyardDoDealNumber1: {
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
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              count: 1,
            },
            outputBinding: "banished",
          },
          then: {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "any-hero",
            },
          },
        },
      },
    },
    atBeginningActionPhaseDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
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
    },
  }),
});

export const { blue: sigilOfSilphidaeBlue } = sigilOfSilphidae.cards;
