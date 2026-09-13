import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/tome-of-firebrand.generated.ts";

export const tomeOfFirebrand = definePitchFamily(fabPitchFamilies["tome-of-firebrand"], {
  abilities: () => ({
    playTomeFirebrandOnlyIfControl4MoreDraconic: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: { typeBox: { supertypes: ["Draconic"] } },
        },
        comparison: { op: "gte", value: 4 },
      },
      playEffect: {
        role: "condition",
      },
    },
    draw2: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: 2,
        player: "controller",
      },
    },
  }),
});

export const { red: tomeOfFirebrandRed } = tomeOfFirebrand.cards;
