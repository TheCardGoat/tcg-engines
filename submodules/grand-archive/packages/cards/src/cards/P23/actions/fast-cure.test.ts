import { describe } from "vitest";
import { fastCure } from "./fast-cure.ts";
import { proveInfluenceConditionalAction } from "../../../testing/influence-conditional-action.ts";
/** @covers 3oda2ha4dk-a1 */
describe("Fast Cure — influence recovery", () => proveInfluenceConditionalAction(fastCure, true));

import { proveSelectedOpponentInfluence } from "../../../testing/influence-conditional-action.ts";
/** @covers 3oda2ha4dk-a1 */
describe("Fast Cure — selected opponent", () => proveSelectedOpponentInfluence(fastCure, true));
