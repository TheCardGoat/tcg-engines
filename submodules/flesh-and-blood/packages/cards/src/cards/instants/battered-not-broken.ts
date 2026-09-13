import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/battered-not-broken.generated.ts";

export const batteredNotBroken = definePitchFamily(fabPitchFamilies["battered-not-broken"], {
  supertypeSets: [["Brute"], ["Guardian"]],
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
          token: "might",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: batteredNotBrokenRed } = batteredNotBroken.cards;
