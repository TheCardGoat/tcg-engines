import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/exposed-to-the-elements.generated.ts";

export const exposedToTheElements = definePitchFamily(fabPitchFamilies["exposed-to-the-elements"], {
  keywords: [fusion(["Earth", "Ice"], "and-or")],
  abilities: () => ({
    ifExposedElementsWasFusedEarthPut1Counter: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused-with-earth-card",
      },
      effect: {
        type: "add-counter",
        counter: {
          kind: "numeric",
          value: -1,
          property: "defense",
        },
        count: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "any",
          zones: ["permanent"],
          filter: {
            typeBox: {
              types: ["Equipment"],
            },
          },
          count: 1,
        },
      },
    },
    ifExposedElementsWasFusedIceDestroyEquipment0: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused-with-ice-card",
      },
      effect: {
        type: "unless",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: { binding: "exposed-target-hero" },
            playerTarget: { selector: "any-hero" },
            playerTargetBinding: "exposed-target-hero",
            zones: ["permanent"],
            filter: {
              typeBox: {
                types: ["Equipment"],
              },
              defense: {
                op: "eq",
                value: 0,
              },
            },
            count: 1,
          },
        },
        escape: {
          type: "pay",
          cost: {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          payer: { binding: "exposed-target-hero" },
        },
      },
    },
  }),
});

export const { blue: exposedToTheElementsBlue } = exposedToTheElements.cards;
