import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/steelblade-supremacy.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const steelbladeSupremacy = definePitchFamily(fabPitchFamilies["steelblade-supremacy"], {
  keywords: [
    {
      name: "specialization",
      hero: "Dorinthea",
    },
    goAgain,
  ],
  abilities: () => ({
    untilEndTurnWeaponGainsNumber2PowerWheneverWeaponHitsDraw: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "wheneverWeaponHitsDraw",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
                    actor: {
                      kind: "any",
                    },
                    observes: {
                      kind: "event-object",
                      selector: "attack",
                      relationship: {
                        kind: "any",
                      },
                      filter: {
                        typeBox: {
                          types: ["Weapon"],
                        },
                      },
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "draw",
                    count: 1,
                    player: "controller",
                  },
                },
              },
            },
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
        ],
        outputBinding: "it",
      },
    },
  }),
});

export const { red: steelbladeSupremacyRed } = steelbladeSupremacy.cards;
