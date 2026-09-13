import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/take-it-on-the-chin.generated.ts";

export const takeItOnTheChin = definePitchFamily(fabPitchFamilies["take-it-on-the-chin"], {
  supertypeSets: [["Brute"], ["Warrior"]],
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
          token: "agility",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: takeItOnTheChinRed } = takeItOnTheChin.cards;
