import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/leave-no-witnesses.generated.ts";

export const leaveNoWitnesses = definePitchFamily(fabPitchFamilies["leave-no-witnesses"], {
  abilities: () => ({
    contractedBanishOpponentsRed: {
      kind: "resolution",
      effect: {
        type: "contract-task",
        task: "banish opponents' red cards",
        completeOn: "banish",
        filter: { color: ["red"] },
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
    hitsBanishTopDeckUp1Arsenal: {
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
                zones: ["arsenal"],
                count: { type: "up-to", amount: 1 },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: leaveNoWitnessesRed } = leaveNoWitnesses.cards;
