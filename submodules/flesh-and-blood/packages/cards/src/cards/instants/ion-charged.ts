import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/ion-charged.generated.ts";

export const ionCharged = definePitchFamily(fabPitchFamilies["ion-charged"], {
  abilities: () => ({
    untilEndTurnLightningElementalAttacksGet1While: {
      kind: "resolution",
      effect: {
        type: "conditional",
        condition: {
          type: "has-keyword",
          keyword: "go-again",
        },
        then: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            zones: ["combat-chain", "stack"],
            filter: {
              typeBox: {
                subtypes: ["Attack"],
              },
              or: [
                {
                  typeBox: {
                    supertypes: ["Lightning"],
                  },
                },
                {
                  typeBox: {
                    supertypes: ["Elemental"],
                  },
                },
              ],
            },
            count: {
              type: "all",
            },
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { yellow: ionChargedYellow } = ionCharged.cards;
