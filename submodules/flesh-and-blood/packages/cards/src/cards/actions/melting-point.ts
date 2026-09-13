import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/melting-point.generated.ts";

export const meltingPoint = definePitchFamily(fabPitchFamilies["melting-point"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGains4Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Arrow"],
            },
          },
        },
      },
    },
    aimCounterGainsHitsDestroy1HWeapon1BasePower: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "hitsDestroy1HWeapon1BasePower",
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
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["weapon", "permanent"],
                  filter: {
                    typeBox: {
                      types: ["Weapon"],
                      subtypes: ["1H"],
                    },
                    power: {
                      op: "eq",
                      value: 1,
                    },
                  },
                  count: 1,
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
              subtypes: ["Arrow"],
            },
            hasCounter: "aim",
          },
        },
      },
    },
  }),
});

export const { red: meltingPointRed } = meltingPoint.cards;
