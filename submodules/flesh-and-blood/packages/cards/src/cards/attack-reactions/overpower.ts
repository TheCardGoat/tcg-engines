import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/overpower.generated.ts";

const weaponAttack = {
  selector: "object",
  declared: "on-stack",
  zones: ["combat-chain"],
  filter: { typeBox: { types: ["Weapon"] } },
  count: 1,
} as const;

export const overpower = definePitchFamily(fabPitchFamilies.overpower, {
  parameters: pitchMap({
    red: { normal: 4, reprise: 6 },
    yellow: { normal: 3, reprise: 5 },
    blue: { normal: 2, reprise: 4 },
  }),
  abilities: ({ normal, reprise }) => ({
    reprise: {
      kind: "resolution",
      label: { name: "reprise" },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: normal,
            target: weaponAttack,
            duration: "this-turn",
            outputBinding: "it",
          },
          {
            type: "self-replacement",
            condition: { type: "defended-this-chain-link", from: "hand" },
            modification: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: reprise,
              target: weaponAttack,
              duration: "this-turn",
            },
          },
        ],
      },
    },
  }),
});

export const { red: overpowerRed, yellow: overpowerYellow, blue: overpowerBlue } = overpower.cards;
