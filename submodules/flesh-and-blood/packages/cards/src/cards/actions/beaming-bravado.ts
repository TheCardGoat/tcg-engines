import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/beaming-bravado.generated.ts";

const abilities = {
  additionalCostStatic: {
    kind: "static",
    staticKind: "play",
    playEffect: {
      role: "additional-cost",
      cost: {
        class: "effect",
        type: "charge",
      },
      optional: true,
    },
    label: {
      name: "charge",
    },
  },
  modifyNumericPower: {
    kind: "resolution",
    condition: {
      type: "binding-matches",
      binding: "chargedCard",
      filter: {
        color: ["yellow"],
      },
    },
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 1,
      target: {
        selector: "self",
      },
      duration: "this-turn",
    },
    label: {
      name: "charge",
    },
  },
} as const;

export const beamingBravado = definePitchFamily(fabPitchFamilies["beaming-bravado"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: beamingBravadoRed,
  yellow: beamingBravadoYellow,
  blue: beamingBravadoBlue,
} = beamingBravado.cards;
