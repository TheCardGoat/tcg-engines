import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/toe-the-line.generated.ts";

export const toeTheLine = definePitchFamily(fabPitchFamilies["toe-the-line"], {
  abilities: () => ({
    nextTimeWouldBeDealtDamageTurnPrevent2: {
      kind: "resolution",
      // CR 6.4.10h: "If you prevent damage this way, create …" is an
      // additionalModification of the prevention, applied at damage time only
      // when the prevented amount is greater than 0 — never a resolution-time
      // sequence conditional (the prevention itself waits for the next damage
      // event per CR 6.4.10/6.4.10a). Authoring shape: HVY140 / HVY160 / HVY180.
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
          token: "flurry",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: toeTheLineRed } = toeTheLine.cards;
