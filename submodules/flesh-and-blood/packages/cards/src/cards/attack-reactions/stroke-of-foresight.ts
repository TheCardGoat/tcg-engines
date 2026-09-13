import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/stroke-of-foresight.generated.ts";

const weaponAttack = {
  selector: "object",
  declared: "on-stack",
  zones: ["combat-chain"],
  filter: { typeBox: { types: ["Weapon"] } },
  count: 1,
} as const;

export const strokeOfForesight = definePitchFamily(fabPitchFamilies["stroke-of-foresight"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    weaponBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: weaponAttack,
      duration: "this-turn",
      outputBinding: "it",
    },
    reprise: {
      kind: "resolution",
      condition: { type: "defended-this-chain-link", from: "hand" },
      effect: {
        type: "sequence",
        steps: [
          { type: "draw", count: 1, player: "controller" },
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
            to: { zone: "deck", position: "top-or-bottom" },
          },
        ],
      },
      label: { name: "reprise" },
    },
  }),
});

export const {
  red: strokeOfForesightRed,
  yellow: strokeOfForesightYellow,
  blue: strokeOfForesightBlue,
} = strokeOfForesight.cards;
