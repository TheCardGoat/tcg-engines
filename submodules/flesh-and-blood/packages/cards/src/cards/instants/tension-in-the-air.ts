import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { suspense } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/tension-in-the-air.generated.ts";

export const tensionInTheAir = definePitchFamily(fabPitchFamilies["tension-in-the-air"], {
  parameters: pitchMap({
    red: { amount: 4 },
    yellow: { amount: 3 },
    blue: { amount: 2 },
  }),
  keywords: [suspense],
  abilities: ({ amount }) => ({
    empowerNextAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: { kind: "any" },
          observes: { kind: "source", selector: "moved-object" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: { selector: "this-attack" },
          duration: "this-turn",
          appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } },
        },
      },
    },
  }),
});

export const {
  red: tensionInTheAirRed,
  yellow: tensionInTheAirYellow,
  blue: tensionInTheAirBlue,
} = tensionInTheAir.cards;
