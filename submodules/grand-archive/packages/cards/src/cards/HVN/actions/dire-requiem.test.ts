import { describe } from "vitest";
import { direRequiem } from "./dire-requiem.ts";
import { direwolf } from "../../HVN/tokens/direwolf.ts";
import { proveSummonAction } from "../../../testing/summon-action.ts";
/** @covers ek6gdmh8zh-a1 */
describe("direRequiem", () => {
  proveSummonAction({ card: direRequiem, cost: 2, tokens: [{ card: direwolf, count: 1 }] });
});
