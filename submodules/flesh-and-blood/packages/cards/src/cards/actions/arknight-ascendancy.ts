import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/arknight-ascendancy.generated.ts";

import { dominate } from "../shared/keywords.ts";

export const arknightAscendancy = definePitchFamily(fabPitchFamilies["arknight-ascendancy"], {
  keywords: [
    {
      name: "specialization",
      hero: "Viserai",
    },
    dominate,
  ],
  abilities: () => ({
    costsLessPlayEachRunechantControl: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: {
            name: "Runechant",
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
    whenHitsCreateRunechantTokensEqualDamageDealtWay: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
          count: {
            type: "count",
            what: "damage-dealt",
          },
        },
      },
    },
  }),
});
export const { red: arknightAscendancyRed } = arknightAscendancy.cards;
