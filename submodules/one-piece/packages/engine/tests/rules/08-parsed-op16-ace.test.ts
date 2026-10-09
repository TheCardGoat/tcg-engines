import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/index.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

test("generated Ace excludes Luffy below 8000 and grants Rush at 8000 after a saved choice", () => {
  const card = getCard("OP16-001"),
    original = card.effects;
  const effects = buildCardEffects(card.effect ?? "");
  if (!effects) throw new Error("Expected parsed Ace effects");
  card.effects = effects;
  try {
    let e = OnePieceTestEngine.create(
      {
        leaderCardId: card.id,
        character: [
          { cardId: "OP02-062", playedOnTurn: 3 },
          { cardId: "OP02-062", playedOnTurn: 3 },
          "OP02-018",
        ],
        activeDon: 1,
        hand: [],
      },
      {},
      { turnNumber: 3 },
    );
    const luffy = e.findCardInZone("south", "character", "OP02-062");
    e.asSouth().attachDon(luffy, 1);
    e.asSouth().activateMain(e.leader("south"));
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected Rush target");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([luffy]);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectTargetSelection", { selectedIds: [luffy] }, "south");
    const life = e.getView("south").players.north.lifeCount;
    e.asSouth().attack(luffy, e.leader("north"));
    expect(e.getView("south").players.north.lifeCount).toBe(life - 1);
  } finally {
    card.effects = original;
  }
});
