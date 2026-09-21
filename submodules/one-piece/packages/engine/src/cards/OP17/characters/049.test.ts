import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Charlotte Linlin (OP17-049) cost=5 power=7000 counter=0
describe("OP17-049 Charlotte Linlin", () => {
  test("[On Opponent's Attack] resolves its trigger during an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP17-049"], hand: ["EB01-005"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const cardId = engine.findCardInZone("south", "character", "OP17-049");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.acceptLeadingOptional("south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      cardId,
    );
  });
});
