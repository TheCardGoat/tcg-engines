import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/eradicate.generated.ts";

export const eradicate = definePitchFamily(fabPitchFamilies["eradicate"], {
  abilities: () => ({
    areContractedBanishOpponentsYellow: {
      kind: "resolution",
      effect: {
        type: "contract-task",
        task: "banish opponents' yellow cards",
        completeOn: "banish",
        filter: { color: ["yellow"] },
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
    whenHitsHeroBanishTopXTheirDeckWhere: {
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
            count: {
              type: "count",
              what: "damage-dealt",
              filter: {
                name: "Eradicate",
              },
            },
          },
        },
      },
    },
  }),
});
export const { yellow: eradicateYellow } = eradicate.cards;
