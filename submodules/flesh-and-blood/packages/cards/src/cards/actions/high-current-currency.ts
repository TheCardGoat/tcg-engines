import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/high-current-currency.generated.ts";

export const highCurrentCurrency = definePitchFamily(fabPitchFamilies["high-current-currency"], {
  abilities: () => ({
    removeAllEnergyCountersTargetNonPermanentOpponentControlsCreateManyGoldTokens: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-all-counters",
            counter: {
              kind: "named",
              name: "energy",
            },
            target: {
              selector: "object",
              declared: "on-stack",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  excludeTypes: ["Hero"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "create-token",
            token: "gold",
            controller: "controller",
            count: {
              type: "count",
              what: "counters-removed",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: highCurrentCurrencyBlue } = highCurrentCurrency.cards;
