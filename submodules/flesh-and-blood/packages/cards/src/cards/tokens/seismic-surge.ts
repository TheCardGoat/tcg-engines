import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/seismic-surge.generated.ts";

export const seismicSurge = defineCard(fabCardIdentitiesByCanonicalId.Rf8CHpzmhJNppCtDDKWDm, {
  abilities: {
    reduceGuardianAttackCostAtActionPhase: {
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
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "modify-numeric",
              property: "cost",
              op: "subtract",
              amount: 1,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  and: [
                    {
                      typeBox: {
                        supertypes: ["Guardian"],
                      },
                    },
                    {
                      typeBox: {
                        subtypes: ["Attack"],
                      },
                    },
                    {
                      typeBox: {
                        types: ["Action"],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
});
