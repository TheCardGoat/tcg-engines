import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/olde-leather-helm.generated.ts";

export const oldeLeatherHelm = defineCard(fabCardIdentitiesByCanonicalId["b7fJPPc8CtNfr7TFqzqfH"], {
  keywords: [bladeBreak],
  abilities: {
    ifVeBeenAttacked2MoreTimesTurnGets: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "times-attacked-this-turn", player: "controller" },
        comparison: { op: "gte", value: 2 },
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 2,
        target: { selector: "self" },
        duration: "while-in-arena",
      },
    },
  },
});
