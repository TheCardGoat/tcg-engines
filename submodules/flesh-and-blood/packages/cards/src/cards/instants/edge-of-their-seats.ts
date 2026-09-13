import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/edge-of-their-seats.generated.ts";
import { suspense } from "../shared/keywords.ts";

export const edgeOfTheirSeats = definePitchFamily(fabPitchFamilies["edge-of-their-seats"], {
  parameters: pitchMap({ red: 5, yellow: 4, blue: 3 }),
  keywords: [suspense],
  abilities: (amount) => ({
    armNextAttack: {
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
          appliesTo: {
            next: { typeBox: { subtypes: ["Attack"] } },
          },
        },
      },
    },
  }),
});

export const {
  red: edgeOfTheirSeatsRed,
  yellow: edgeOfTheirSeatsYellow,
  blue: edgeOfTheirSeatsBlue,
} = edgeOfTheirSeats.cards;
