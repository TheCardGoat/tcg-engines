import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { silvieSlimeSovereign } from "./silvie-slime-sovereign.ts";

/** @covers mdwbkuhtjm-a1 */
describe("Silvie, Slime Sovereign — Lineage restriction", () => {
  proveChampionLineage({
    card: silvieSlimeSovereign,
    lineageName: "Silvie",
    level: 3,
    memoryCost: 3,
  });
});

import { proveSubtypeElementPermission } from "../../../testing/subtype-element-permission.ts";
import { vampiricSlime } from "../../MRC/allies/vampiric-slime.ts";
import { twilightSlime } from "../../MRC/allies/twilight-slime.ts";
import { convokingSlime } from "../../MRC/allies/convoking-slime.ts";
import { redSlime } from "../../FTC/allies/red-slime.ts";
import { blueSlime } from "../../DOA/allies/blue-slime.ts";
import { greenSlime } from "../../FTC/allies/green-slime.ts";
import { spirelleSchwartzQueen } from "../../DTR/allies/spirelle-schwartz-queen.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers mdwbkuhtjm-a3 */
describe("Silvie advanced Slime elements", () => {
  proveSubtypeElementPermission(
    silvieSlimeSovereign,
    [
      [vampiricSlime, true],
      [twilightSlime, true],
      [convokingSlime, true],
      [redSlime, false],
      [blueSlime, false],
      [greenSlime, false],
      [spirelleSchwartzQueen, false],
      [woodlandSquirrels, false],
    ],
    false,
  );
});
