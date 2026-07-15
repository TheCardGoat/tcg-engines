import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03ZedasR059 } from "./059-zedas-r.ts";

describe("Zedas R (GD03-059)", () => {
  it("【Attack】 exiles a Vagan from trash and grants a friendly Vagan AP+2 this turn", () => {
    const vaganTrashCard = createMockUnit({ ap: 1, hp: 1, traits: ["vagan"] });
    const friendlyVagan = createMockUnit({ ap: 2, hp: 3, traits: ["vagan"] });
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      {
        play: [gd03ZedasR059, friendlyVagan],
        trash: [vaganTrashCard],
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [zedasId, friendlyVaganId] = p1.getCardsInZone("battleArea");
    const [vaganTrashId] = p1.getCardsInZone("trash");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(zedasId!, defenderId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([vaganTrashId, zedasId, friendlyVaganId]),
      minTargets: 2,
      maxTargets: 2,
    });
    expectSuccess(p1.resolveEffect({ targets: [vaganTrashId!, friendlyVaganId!] }));

    expect(p1.getCardsInZone("trash")).not.toContain(vaganTrashId);
    expect(p1.getVisibleCard(friendlyVaganId!)?.effectiveAp).toBe(4);

    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(friendlyVaganId!)?.effectiveAp).toBe(2);
  });

  it("may decline to exile a card and does not grant AP", () => {
    const vaganTrashCard = createMockUnit({ traits: ["vagan"] });
    const friendlyVagan = createMockUnit({ ap: 2, hp: 3, traits: ["vagan"] });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd03ZedasR059, friendlyVagan], trash: [vaganTrashCard] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [zedasId, friendlyVaganId] = p1.getCardsInZone("battleArea");
    const trashId = p1.getCardsInZone("trash")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(zedasId!, defenderId));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p1.getCardsInZone("trash")).toContain(trashId);
    expect(p1.getVisibleCard(friendlyVaganId!)?.effectiveAp).toBe(2);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
