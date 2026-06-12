import { test, expect } from "../fixtures/test";

test.describe("Industrial Assembly", () => {
  test("chooses one friendly Gig target and leaves unchosen Gigs unchanged", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progIndustrialAssembly");

    const player = await simulator.getActivePlayerId();
    await simulator.expectGigCount(player, 1);
    await simulator.expectGigFaceValue(player, "d4", 3);

    await simulator.playerPrompt.verbButton("playCard").click();

    const industrialAssembly = simulator.playerBoard.handZone.getByRole("button", {
      name: "Industrial Assembly",
    });
    await expect(industrialAssembly).toHaveCount(1);

    await simulator.clearDispatchLog();
    await industrialAssembly.click();
    await simulator.expectLastDispatch({ type: "playCard", as: player });
    expect(await simulator.getPendingChoiceType(player)).toBe("chooseTarget");
    await simulator.playerPrompt.expectState("select-target");

    const d4 = (await simulator.getGigDice(player)).find((die) => die.dieType === "d4");
    expect(d4, "expected friendly d4 Gig").toBeDefined();

    await expect(simulator.playerBoard.gigDieByType("d4")).toHaveAttribute(
      "aria-label",
      "Select D4, showing 3",
    );

    await simulator.clearDispatchLog();
    // Selectable Gig targets pulse, so Playwright may never consider the die
    // geometrically stable even after the exact target state is visible.
    await simulator.playerBoard.gigDieByType("d4").click({ force: true });
    await simulator.expectLastDispatch({
      type: "resolveEffectTarget",
      targetIds: [d4!.id],
      as: player,
    });

    await simulator.expectGigFaceValue(player, "d4", 4);
    await simulator.expectEddies(player, 1);
    expect(await simulator.getPendingChoiceType(player)).toBeNull();
  });
});
