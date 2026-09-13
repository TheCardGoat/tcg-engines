import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/take-the-upper-hand.generated.ts";

const attack = {
  selector: "object",
  declared: "on-stack",
  zones: ["combat-chain"],
  filter: { or: [{ typeBox: { subtypes: ["Attack"] } }, { typeBox: { types: ["Weapon"] } }] },
  count: 1,
} as const;

export const takeTheUpperHand = definePitchFamily(fabPitchFamilies["take-the-upper-hand"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    wagered: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "wagers-this-chain-link", player: "controller" },
        comparison: { op: "gte", value: 1 },
      },
      playEffect: { role: "condition" },
    },
    attackBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: attack,
      duration: "this-turn",
      outputBinding: "it",
    },
  }),
});

export const {
  red: takeTheUpperHandRed,
  yellow: takeTheUpperHandYellow,
  blue: takeTheUpperHandBlue,
} = takeTheUpperHand.cards;
