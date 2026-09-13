import { onHit } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vexing-gloomblade.generated.ts";
import { bloodDebt, usurp } from "../shared/keywords.ts";

export const vexingGloomblade = definePitchFamily(fabPitchFamilies["vexing-gloomblade"], {
  keywords: [usurp, bloodDebt],
  abilities: () => ({
    banishedPermission: {
      kind: "static",
      staticKind: "play",
      playEffect: { role: "permission", fromZones: ["banished"] },
    },
    arcaneOnHit: onHit({
      type: "deal-damage",
      damageType: "arcane",
      amount: 2,
      target: {
        selector: "object",
        declared: "on-stack",
        player: "any",
        zones: ["hero", "permanent"],
        count: 1,
      },
    }),
  }),
});

export const {
  red: vexingGloombladeRed,
  yellow: vexingGloombladeYellow,
  blue: vexingGloombladeBlue,
} = vexingGloomblade.cards;
