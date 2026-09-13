import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/glaring-impact.generated.ts";
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
  grantProperty: {
    kind: "resolution",
    condition: {
      type: "binding-matches",
      binding: "chargedCard",
      filter: {
        color: ["yellow"],
      },
    },
    effect: {
      type: "grant-property",
      property: {
        kind: "keyword",
        keyword: {
          name: "overpower",
        },
      },
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
export const glaringImpact = definePitchFamily(fabPitchFamilies["glaring-impact"], {
  abilities: () => ({ ...abilities }),
});
export const {
  red: glaringImpactRed,
  yellow: glaringImpactYellow,
  blue: glaringImpactBlue,
} = glaringImpact.cards;
