import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sonata-fantasmia.generated.ts";

export const sonataFantasmia = definePitchFamily(fabPitchFamilies["sonata-fantasmia"], {
  keywords: [
    {
      name: "specialization",
      hero: "Viserai",
    },
  ],
  abilities: () => ({
    createXRunechantTokens: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "runechant",
        controller: "controller",
        count: {
          type: "x",
        },
      },
    },
    xNumber6GreaterHeroDiscardsNumber3Random: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: { type: "x" },
        comparison: { op: "gte", value: 6 },
      },
      effect: {
        type: "discard",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["hand"],
          count: 3,
          random: true,
        },
      },
    },
  }),
});

export const { blue: sonataFantasmiaBlue } = sonataFantasmia.cards;
