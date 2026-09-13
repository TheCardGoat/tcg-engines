import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rob-the-rich.generated.ts";

export const robTheRich = definePitchFamily(fabPitchFamilies["rob-the-rich"], {
  abilities: () => ({
    contractTaskContract: {
      kind: "resolution",
      effect: {
        type: "contract-task",
        task: "banish opponents' cards with cost 2 or greater",
        completeOn: "banish",
        filter: {
          cost: { op: "gte", value: 2 },
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
  red: robTheRichRed,
  yellow: robTheRichYellow,
  blue: robTheRichBlue,
} = robTheRich.cards;
