import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/point-of-escalation.generated.ts";

export const pointOfEscalation = definePitchFamily(fabPitchFamilies["point-of-escalation"], {
  abilities: () => ({
    boostSwordForPriorAttacks: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: {
        type: "count",
        what: "attacks-with-subject-this-turn",
        player: "controller",
        multiplier: 2,
      },
      target: {
        selector: "object",
        declared: "on-stack",
        player: "controller",
        zones: ["combat-chain"],
        filter: { typeBox: { subtypes: ["Sword"] } },
        count: 1,
      },
      duration: "this-chain-link",
    },
  }),
});

export const { yellow: pointOfEscalationYellow } = pointOfEscalation.cards;
