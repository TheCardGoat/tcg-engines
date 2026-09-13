import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scrap-trader.generated.ts";
import { scrap } from "../shared/keywords.ts";

export const scrapTrader = definePitchFamily(fabPitchFamilies["scrap-trader"], {
  keywords: [scrap],
  abilities: () => ({
    gainResourceResourceForEachScrapped: {
      kind: "resolution",
      effect: {
        type: "gain-resources",
        amount: {
          type: "sum",
          operands: [
            {
              type: "count",
              what: "cards-scrapped-by-this",
            },
            {
              type: "count",
              what: "cards-scrapped-by-this",
            },
          ],
        },
      },
    },
  }),
});

export const { red: scrapTraderRed } = scrapTrader.cards;
