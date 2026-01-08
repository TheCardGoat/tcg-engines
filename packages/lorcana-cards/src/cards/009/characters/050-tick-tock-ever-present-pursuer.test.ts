import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { ticktockEverpresentPursuer } from "./050-tick-tock-ever-present-pursuer";

describe("Tick-Tock - Ever-Present Pursuer", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ticktockEverpresentPursuer],
    });

    const cardUnderTest = testEngine.getCardModel(ticktockEverpresentPursuer);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { ticktockEverpresentPursuer } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Tick-Tock - Ever-Present Pursuer", () => {
//   it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", async () => {
//     const testEngine = new TestEngine({
//       play: [ticktockEverpresentPursuer],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(ticktockEverpresentPursuer);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
