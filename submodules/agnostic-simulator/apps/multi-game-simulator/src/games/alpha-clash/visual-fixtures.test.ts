import { expect, test } from "vite-plus/test";
import { projectState } from "@tcg/alpha-clash-engine";
import { createAlphaClashVisualFixture, alphaClashVisualFixtures } from "./visual-fixtures";

for (const fixture of alphaClashVisualFixtures) {
  test(`${fixture.id} creates an actionable, viewer-safe TestEngine state`, () => {
    const engine = createAlphaClashVisualFixture(fixture.id);
    const actor = engine.getActivePlayerId();
    expect(actor).toBeTruthy();
    expect(engine.getInteractionView(actor!).actions.length).toBeGreaterThan(0);
    const projection = projectState(engine.state, "player-one");
    const hiddenHand = projection.cards.filter(
      (card) => card.controller === "player-two" && card.zone === "hand",
    );
    expect(hiddenHand.length).toBeGreaterThan(0);
    expect(hiddenHand.every((card) => card.definitionId === null && card.name === null)).toBe(true);
    expect(projection.cards.filter((card) => card.zone === "contender")).toHaveLength(2);
  });
}
test("clash fixture is produced by an accepted attack command", () => {
  const engine = createAlphaClashVisualFixture("arena-clash");
  expect(engine.state.clash).not.toBeNull();
  expect(engine.getActivePlayerId()).toBe("bot");
});
test("fixture engines reset independently", () => {
  const first = createAlphaClashVisualFixture("arena");
  const second = createAlphaClashVisualFixture("arena");
  first.state.players["player-one"].health = 1;
  expect(second.state.players["player-one"].health).toBe(26);
});
