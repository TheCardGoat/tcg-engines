import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/restless-commander.generated.ts";
import { decay } from "../shared/keywords.ts";

export const restlessCommander = definePitchFamily(fabPitchFamilies["restless-commander"], {
  keywords: [decay],
  abilities: () => ({
    zombies: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: { typeBox: { subtypes: ["Zombie"] } },
          count: { type: "all" },
        },
        duration: "while-in-arena",
      },
    },
  }),
});
export const { red: restlessCommanderRed } = restlessCommander.cards;
