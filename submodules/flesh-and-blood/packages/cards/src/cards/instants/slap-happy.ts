import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/slap-happy.generated.ts";

export const slapHappy = definePitchFamily(fabPitchFamilies["slap-happy"], {
  supertypeSets: [["Guardian"], ["Warrior"]],
  abilities: () => ({
    nextTimeWouldBeDealtDamageTurnPrevent2: {
      kind: "resolution",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 2,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
        additionalModification: {
          type: "create-token",
          token: "vigor",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: slapHappyRed } = slapHappy.cards;
