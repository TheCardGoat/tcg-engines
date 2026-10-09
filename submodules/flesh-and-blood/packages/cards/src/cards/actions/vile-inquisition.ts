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
              declared: "at-resolution",
              // Printed "Target hero banishes the top card of their deck":
              // only the hero is targeted (CR 1.8.5); the deck top is
              // determined at resolution from that hero's deck alone.
              playerTarget: { selector: "any-hero" },
              playerTargetBinding: "inquisition-target-hero",
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
              // Printed "they lose 1{h}" is the declared target hero.
              target: {
                selector: "hero",
                who: { binding: "inquisition-target-hero" },
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
