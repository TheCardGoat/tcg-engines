import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/herald-of-victoria.generated.ts";

import { phantasm } from "../shared/keywords.ts";

export const heraldOfVictoria = definePitchFamily(fabPitchFamilies["herald-of-victoria"], {
  keywords: [phantasm],
  abilities: () => ({
    instantDiscardEndTurnAttackActionOpponentsGet1PowerAttackingDefending: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: -1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["stack", "permanent"],
          filter: {
            and: [
              attackActionFilter(),
              {
                hasStatus: "attacking-or-defending",
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
  }),
});

export const { yellow: heraldOfVictoriaYellow } = heraldOfVictoria.cards;
