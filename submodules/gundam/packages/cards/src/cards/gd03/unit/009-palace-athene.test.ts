import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03PalaceAthene009 } from "./009-palace-athene.ts";

describe("Palace Athene (GD03-009)", () => {
  it("【Deploy】 exiles 2 (Titans) cards from trash and rests a chosen Lv.4 or lower enemy Unit", () => {
    const titans1 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const titans2 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const lowLv = createMockUnit({ ap: 2, hp: 5, level: 3 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd03PalaceAthene009],
        trash: [titans1, titans2],
        resourceArea: activeResources(5),
      },
      { play: [lowLv] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [titans1Id, titans2Id] = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(
      p1.deployUnit(gd03PalaceAthene009, {
        targets: [titans1Id!, titans2Id!, enemyId],
      }),
    );
    while (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    }

    // Both Titans cards left the trash via exile.
    expect(engine.getState().ctx.zones.private.cardIndex[titans1Id!]?.zoneKey).not.toBe(
      `trash:${PLAYER_ONE}`,
    );
    expect(engine.getState().ctx.zones.private.cardIndex[titans2Id!]?.zoneKey).not.toBe(
      `trash:${PLAYER_ONE}`,
    );
    // The Lv.3 enemy was rested via the dependent directive.
    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });
});
