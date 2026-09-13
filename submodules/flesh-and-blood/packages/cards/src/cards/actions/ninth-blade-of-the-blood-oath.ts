import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ninth-blade-of-the-blood-oath.generated.ts";

export const ninthBladeOfTheBloodOath = definePitchFamily(
  fabPitchFamilies["ninth-blade-of-the-blood-oath"],
  {
    abilities: () => ({
      costsResourceLessPlayRunechant: {
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
    }),
  },
);

export const { yellow: ninthBladeOfTheBloodOathYellow } = ninthBladeOfTheBloodOath.cards;
