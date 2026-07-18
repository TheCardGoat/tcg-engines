import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01Minochihuahua036,
  eb01MountainGod018,
  eb01PrinceBellett026,
  eb01Sanji014,
  eb01Yamato007,
  op01TrafalgarLaw002,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-002 Trafalgar Law", () => {
  test("returns one of exactly five Characters, then offers a different-color cost-5-or-less play", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01TrafalgarLaw002,
      hand: [eb01Doma005, eb01Yamato007],
      character: [
        eb01Sanji014,
        eb01MountainGod018,
        eb01Fourtricks025,
        eb01PrinceBellett026,
        eb01Minochihuahua036,
      ],
      activeDon: 2,
    });
    const returnedId = engine.findCardInZone("south", "character", eb01Sanji014);
    const playedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const otherDifferentColorId = engine.findCardInZone("south", "hand", eb01Yamato007);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnedId] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") {
      throw new Error("Expected the Leader controller to choose a different-color Character.");
    }
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([
      playedId,
      otherDifferentColorId,
    ]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(returnedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playedId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.hand.map((card) => card.instanceId)).toContain(returnedId);
    expect(view.characters.some((card) => card?.instanceId === playedId)).toBe(true);
    expect(view).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
