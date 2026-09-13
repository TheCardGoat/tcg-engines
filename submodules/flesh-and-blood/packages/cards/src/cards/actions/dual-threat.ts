import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dual-threat.generated.ts";

import { attackActionFilter, nextAttackActionLatch } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const dualThreat = definePitchFamily(fabPitchFamilies["dual-threat"], {
  keywords: [goAgain],
  abilities: () => ({
    ifVeAttackedWeaponTurnNextAttackActionPlay: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "attack-with-weapon", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch(),
      },
    },
    ifVeAttackedAttackActionTurnNextWeaponAttack: {
      kind: "resolution",
      condition: {
        type: "played-this",
        per: "turn",
        filter: attackActionFilter(),
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Weapon"],
            },
          },
        },
      },
    },
  }),
});
export const { yellow: dualThreatYellow } = dualThreat.cards;
