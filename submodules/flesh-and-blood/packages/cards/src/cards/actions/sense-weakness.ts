import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sense-weakness.generated.ts";
import { dominate, goAgain } from "../shared/keywords.ts";

export const senseWeakness = definePitchFamily(fabPitchFamilies["sense-weakness"], {
  keywords: [goAgain],
  abilities: () => ({
    nextGuardianAttackTurnGetsNumber1PowerDominateWhenHitsHeroDeal: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Guardian"],
                },
              },
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: dominate,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Guardian"],
                },
              },
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenHitsHeroDealDamageAllAlliesTheyControlEqualDamageDealt",
                text: "",
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
                    type: "deal-damage",
                    damageType: "generic",
                    amount: {
                      type: "count",
                      what: "damage-dealt",
                      per: "chain-link",
                    },
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["permanent"],
                      filter: {
                        typeBox: {
                          subtypes: ["Ally"],
                        },
                      },
                      count: {
                        type: "all",
                      },
                    },
                  },
                },
              },
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Guardian"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { blue: senseWeaknessBlue } = senseWeakness.cards;
