import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/quicksilver-dance.generated.ts";

export const quicksilverDance = definePitchFamily(fabPitchFamilies["quicksilver-dance"], {
  abilities: () => ({
    removeCounterCreateBladeDanceAndDraw: {
      type: "if-you-do",
      effect: {
        type: "remove-counters",
        counter: { kind: "numeric", value: 1, property: "power" },
        count: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain", "weapon"],
          filter: { typeBox: { types: ["Weapon"] }, hasStatus: "attacking" },
          count: 1,
        },
      },
      then: {
        type: "sequence",
        steps: [
          { type: "create-token", token: "blade-dance", controller: "controller" },
          { type: "draw", count: 1, player: "controller" },
        ],
      },
    },
  }),
});

export const { blue: quicksilverDanceBlue } = quicksilverDance.cards;
