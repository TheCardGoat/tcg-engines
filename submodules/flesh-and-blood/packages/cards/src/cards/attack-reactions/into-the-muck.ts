import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/into-the-muck.generated.ts";

export const intoTheMuck = definePitchFamily(fabPitchFamilies["into-the-muck"], {
  abilities: () => ({
    wagered: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "wagers-this-chain-link", player: "controller" },
        comparison: { op: "gte", value: 1 },
      },
      playEffect: { role: "condition" },
    },
    banish: {
      type: "banish",
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: { typeBox: { excludeTypes: ["Equipment"] }, defending: true },
        count: 1,
      },
    },
  }),
});
export const { red: intoTheMuckRed } = intoTheMuck.cards;
