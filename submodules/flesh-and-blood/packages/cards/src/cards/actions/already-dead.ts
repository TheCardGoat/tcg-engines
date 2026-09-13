import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/already-dead.generated.ts";

export const alreadyDead = definePitchFamily(fabPitchFamilies["already-dead"], {
  abilities: () => ({
    areContractedBanishOpponentsNonAction: {
      kind: "resolution",
      effect: {
        type: "contract-task",
        task: "banish opponents' non-action cards",
        completeOn: "banish",
        filter: {
          typeBox: {
            excludeTypes: ["Action"],
          },
        },
      },
      label: {
        name: "contract",
      },
    },
    wheneverCompleteContractCreateSilverToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "complete-contract",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "silver",
          controller: "controller",
        },
      },
      label: {
        name: "contract",
      },
    },
    whenHitsHeroBanishTopTheirDeckDefending: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
            },
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["combat-chain"],
                filter: {
                  defending: true,
                },
                count: 1,
              },
            },
          ],
        },
      },
    },
  }),
});
export const { red: alreadyDeadRed } = alreadyDead.cards;
