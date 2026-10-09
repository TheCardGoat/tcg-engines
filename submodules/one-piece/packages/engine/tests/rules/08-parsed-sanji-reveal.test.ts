import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

test.each([
  { top: "EB01-018", eligible: true, play: false },
  { top: "EB01-018", eligible: true, play: true },
  { top: "OP06-119", eligible: false, play: false },
  { top: "OP06-017", eligible: false, play: false },
])("parsed Sanji publicly reveals $top (play=$play)", ({ top, eligible, play }) => {
  const sanji = getCard("OP06-119");
  const original = sanji.effects;
  try {
    sanji.effects = buildCardEffects(sanji.effect ?? "");
    let engine = OnePieceTestEngine.create({
      hand: [sanji],
      activeDon: 9,
      deck: [top, "EB01-005"],
    });
    const revealed = engine.findCardInZone("south", "deck", top);
    const other = engine.findCardInZone("south", "deck", "EB01-005");
    engine.playCard(sanji);
    for (const viewer of ["north", "spectator"] as const) {
      expect(
        engine
          .getView(viewer)
          .logs.some(
            (entry) => entry.message.includes(getCard(top).name) && /reveal/i.test(entry.message),
          ),
      ).toBe(true);
    }
    if (eligible) {
      engine.pendingDecision("effectPlaySelection", "south");
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.resolveDecision(
        "effectPlaySelection",
        { selectedIds: play ? [revealed] : [] },
        "south",
      );
    }
    expect(engine.getState().players.south.deck).toEqual(play ? [other] : [other, revealed]);
    expect(engine.getState().cards[revealed]?.zone).toBe(play ? "character" : "deck");
    expect(engine.getView("south").prompts).toHaveLength(0);
  } finally {
    sanji.effects = original;
  }
});
