import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb02Sabo002,
  prb02MonkeyDLuffySt13014PirateFoil014,
  prb02PortgasDAcePrb02018018,
  prb02PortgasDAceSt13010PirateFoil010,
  prb02SaboSt13007PirateFoil007,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB02-018 Portgas.D.Ace", () => {
  test("with face-up Life, offers each named cost-2 Character from hand or trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [
        prb02PortgasDAcePrb02018018,
        prb02SaboSt13007PirateFoil007,
        prb02MonkeyDLuffySt13014PirateFoil014,
        eb02Sabo002,
        eb01Doma005,
      ],
      trash: [prb02PortgasDAceSt13010PirateFoil010],
      life: [{ card: eb01Doma005, faceUp: true, publicKnowledge: true }],
      activeDon: prb02PortgasDAcePrb02018018.cost,
    });
    const saboId = engine.findCardInZone("south", "hand", prb02SaboSt13007PirateFoil007);
    const luffyId = engine.findCardInZone("south", "hand", prb02MonkeyDLuffySt13014PirateFoil014);
    const aceId = engine.findCardInZone("south", "trash", prb02PortgasDAceSt13010PirateFoil010);
    const wrongCostId = engine.findCardInZone("south", "hand", eb02Sabo002);
    const wrongNameId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(prb02PortgasDAcePrb02018018, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Ace's play selection.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([saboId, aceId, luffyId]),
    );
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongCostId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongNameId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [aceId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(aceId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(aceId);
    expect(view.prompts).toHaveLength(0);
  });
});
