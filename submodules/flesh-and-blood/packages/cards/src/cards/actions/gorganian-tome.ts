import { goAgain, legendary } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/actions/gorganian-tome.generated.ts";

export const gorganianTome = defineCard(fabCardIdentitiesByCanonicalId["rbMGNnJJBHjnNMdRCWBhw"], {
  keywords: [legendary, goAgain],
  abilities: {
    drawXWhereXIs1PlusNumberGorganian: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: {
          type: "sum",
          operands: [
            1,
            {
              type: "count",
              what: "cards-in-zone",
              zone: "graveyard",
              player: "any",
              filter: {
                name: "Gorganian Tome",
              },
            },
          ],
        },
        player: "controller",
      },
    },
  },
});
