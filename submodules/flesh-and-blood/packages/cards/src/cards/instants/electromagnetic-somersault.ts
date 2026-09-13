import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/electromagnetic-somersault.generated.ts";

export const electromagneticSomersault = definePitchFamily(
  fabPitchFamilies["electromagnetic-somersault"],
  {
    parameters: pitchMap({
      red: 0,
      yellow: 1,
      blue: 2,
    }),
    abilities: (minimumCost) => ({
      returnSelectedAttacks: {
        type: "sequence",
        steps: [
          {
            type: "choose-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              zones: ["combat-chain"],
              filter: attackActionFilter({
                cost: {
                  op: "gte",
                  value: minimumCost,
                },
              }),
              count: { type: "up-to", amount: 2 },
            },
            outputBinding: "them",
          },
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "chain-link-resolve",
                actor: { kind: "any" },
                observes: { kind: "none" },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-chain-link",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "them",
                },
                to: { zone: "hand" },
              },
            },
          },
        ],
      },
    }),
  },
);

export const {
  red: electromagneticSomersaultRed,
  yellow: electromagneticSomersaultYellow,
  blue: electromagneticSomersaultBlue,
} = electromagneticSomersault.cards;
