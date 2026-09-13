import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/slay-the-scholars.generated.ts";

export const slayTheScholars = definePitchFamily(fabPitchFamilies["slay-the-scholars"], {
  abilities: () => ({
    contractBanishNonAttackActions: {
      kind: "resolution",
      effect: {
        type: "contract-task",
        task: "banish opponents' 'non-attack' action cards",
        completeOn: "banish",
        filter: {
          typeBox: {
            types: ["Action"],
            excludeSubtypes: ["Attack"],
          },
        },
      },
      label: {
        name: "contract",
      },
    },
    gainSilverWhenContractCompleted: {
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
    banishTopCardOnHit: {
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
  red: slayTheScholarsRed,
  yellow: slayTheScholarsYellow,
  blue: slayTheScholarsBlue,
} = slayTheScholars.cards;
