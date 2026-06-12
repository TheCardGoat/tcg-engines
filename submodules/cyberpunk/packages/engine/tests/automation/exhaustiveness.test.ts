import { describe, expect, test } from "vite-plus/test";
import { defaultChoiceResolvers } from "../../src/automation/index.ts";
import { MOVE_IDS, allMoves } from "../../src/moves/index.ts";

/**
 * Belt-and-braces runtime checks for the type-level safety net the AI harness
 * relies on. The mapped types in `automation/types.ts` already make missing
 * variants a compile error; these tests catch the case where someone widens a
 * type back to `string` to silence the compiler.
 */
describe("exhaustiveness", () => {
  test("defaultChoiceResolvers has an entry for every PendingChoiceType", () => {
    // The typed list is the source of truth — derived from the `PendingChoice`
    // discriminator. Any new variant added in the engine must be reflected
    // both at compile time (via `ChoiceResolverMap`) and here.
    const expected = [
      "chooseCardToMove",
      "chooseCardToPlay",
      "chooseEffect",
      "chooseGigsToSteal",
      "chooseTarget",
      "chooseTrigger",
      "gainGig",
      "searchDeck",
    ].sort();
    expect(Object.keys(defaultChoiceResolvers).sort()).toEqual(expected);
  });

  test("MOVE_IDS matches the registered move list", () => {
    expect([...MOVE_IDS].sort()).toEqual(Object.keys(allMoves).sort());
  });
});
