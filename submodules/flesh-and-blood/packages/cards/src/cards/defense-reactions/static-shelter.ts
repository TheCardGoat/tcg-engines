import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/static-shelter.generated.ts";

export const staticShelter = definePitchFamily(fabPitchFamilies["static-shelter"], {
  abilities: () => ({
    createLightningFlow: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            payer: "controller",
          },
          then: {
            type: "create-token",
            token: "lightning-flow",
            controller: "controller",
          },
        },
      },
    },
  }),
});

export const { yellow: staticShelterYellow } = staticShelter.cards;
