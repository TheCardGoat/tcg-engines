import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/nix-the-nimble.generated.ts";

export const nixTheNimble = definePitchFamily(fabPitchFamilies["nix-the-nimble"], {
  abilities: () => ({
    contractTaskContract: {
      kind: "resolution",
      effect: {
        type: "contract-task",
        task: "banish opponents' reaction cards",
        completeOn: "banish",
        filter: {
          or: [
            { typeBox: { types: ["Defense Reaction"] } },
            { typeBox: { types: ["Attack Reaction"] } },
          ],
        },
      },
      label: {
        name: "contract",
      },
    },
    triggeredCompleteContractCreateTokenSilverContract: {
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
    triggeredHitBanish: {
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
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "banished",
        },
      },
    },
  }),
});
export const {
  red: nixTheNimbleRed,
  yellow: nixTheNimbleYellow,
  blue: nixTheNimbleBlue,
} = nixTheNimble.cards;
