import { describe } from "vitest";
import { gentleRespite } from "./gentle-respite.ts";
import { proveInfluenceConditionalAction } from "../../../testing/influence-conditional-action.ts";
/** @covers ddv1au7t9m-a1 */
describe("Gentle Respite — influence draw", () =>
  proveInfluenceConditionalAction(gentleRespite, false));

import { proveSelectedOpponentInfluence } from "../../../testing/influence-conditional-action.ts";
/** @covers ddv1au7t9m-a1 */
describe("Gentle Respite — selected opponent", () =>
  proveSelectedOpponentInfluence(gentleRespite, false));
