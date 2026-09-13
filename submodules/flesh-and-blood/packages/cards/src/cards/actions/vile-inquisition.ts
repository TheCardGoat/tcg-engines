import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vile-inquisition.generated.ts";

export const vileInquisition = definePitchFamily(fabPitchFamilies["vile-inquisition"], {
  parameters: pitchMap({
    red: { color: "red" },
    yellow: { color: "yellow" },
    blue: { color: "blue" },
  }),
  keywords: [bloodDebt],
  abilities: ({ color }) => ({
    playStaticEffect: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
        optional: true,
        then: {
          type: "modify-numeric",
          property: "cost",
          op: "subtract",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "while-condition",
        },
      },
    },
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "any",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                color: [color],
              },
            },
            then: {
              type: "lose-life",
              amount: 1,
              target: {
                selector: "attack-target",
              },
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: vileInquisitionRed,
  yellow: vileInquisitionYellow,
  blue: vileInquisitionBlue,
} = vileInquisition.cards;
