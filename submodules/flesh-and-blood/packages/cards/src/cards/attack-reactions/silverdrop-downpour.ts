import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/silverdrop-downpour.generated.ts";

export const silverdropDownpour = definePitchFamily(fabPitchFamilies["silverdrop-downpour"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  abilities: (amount) => ({
    power: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: { typeBox: { types: ["Weapon"] } },
        count: 1,
      },
      duration: "this-turn",
    },
    reduction: {
      kind: "static",
      staticKind: "play",
      condition: { type: "has-status", status: "sharpened" },
      playEffect: {
        role: "cost-reduction",
        cost: { class: "asset", type: "resources", amount: 1 },
      },
    },
  }),
});

export const {
  red: silverdropDownpourRed,
  yellow: silverdropDownpourYellow,
  blue: silverdropDownpourBlue,
} = silverdropDownpour.cards;
