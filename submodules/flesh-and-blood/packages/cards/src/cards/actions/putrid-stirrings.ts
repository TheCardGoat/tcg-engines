import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/putrid-stirrings.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const putridStirrings = definePitchFamily(fabPitchFamilies["putrid-stirrings"], {
  parameters: { red: 5, yellow: 4, blue: 3 },
  keywords: [bloodDebt, goAgain],
  abilities: (amount) => ({
    play: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    modifyNumericPowerThisTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch({ hasStatus: "rune-gated" }),
      },
    },
  }),
});

export const {
  red: putridStirringsRed,
  yellow: putridStirringsYellow,
  blue: putridStirringsBlue,
} = putridStirrings.cards;
