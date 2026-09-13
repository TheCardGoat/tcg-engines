/**
 * Reusable real-catalog recipients and heroes for "+N power to next attack"
 * AAA tests. Pick the recipient by the buff's printed filter + the hero's
 * class/talent; do not invent synthetic attacks.
 *
 *   brutalAssaultBlue  Generic cost 2 / power 4  (IRA010) — default Generic
 *   searingShotRed     Ranger Arrow cost 0 / power 4 (ARC069) — cost ≤ 0 / Ranger
 *   headShotYellow     Ranger Arrow cost 1 / power 3 (ARC058) — base power ≤ 3
 *   briar              ELE063 Elemental/Runeblade (Earth+Lightning) — talent lock
 */

export { brutalAssaultBlue } from "../actions/brutal-assault.ts";
export { searingShotRed } from "../actions/searing-shot.ts";
export { headShotYellow } from "../actions/head-shot.ts";
export { briar } from "../heroes/briar.ts";
export { deathDealer } from "../weapons/death-dealer.ts";
