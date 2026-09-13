import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { st10DiffuseBeamCannon015 } from "./015-diffuse-beam-cannon.ts";

describe("Diffuse Beam Cannon (ST10-015)", () => {
  it("gives a battling enemy AP-3 while a friendly G Generation Unit is in play", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [st10DiffuseBeamCannon015],
        play: [createMockUnit({ traits: ["g generation"], hp: 6 })],
        resourceArea: activeResources(3),
        deck: 5,
      },
      {
        play: [createMockUnit({ ap: 5, hp: 6 })],
        shieldArea: [createMockUnit({ name: "Shield" })],
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [friendlyId]);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(enemyId, friendlyId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(st10DiffuseBeamCannon015));
    const result = p1.resolveEffect({ targets: [enemyId] });
    expectSuccess(result);
    if (!result.success) throw new Error("Expected Diffuse Beam Cannon to resolve");

    expect(p1.getVisibleCard(enemyId)).toMatchObject({ effectiveAp: 2 });
    expect(result.moveLogs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          outcomes: expect.objectContaining({
            statModifiers: expect.arrayContaining([
              {
                cardId: enemyId,
                stat: "ap",
                amount: -3,
                duration: "thisBattle",
              },
            ]),
          }),
        }),
      ]),
    );
    expect(result.animations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: {
            kind: "generic",
            name: "statModified",
            params: {
              cardId: enemyId,
              stat: "ap",
              amount: -3,
              duration: "thisBattle",
            },
          },
        }),
      ]),
    );
  });

  it("cannot be activated when no friendly G Generation Unit is in play", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [st10DiffuseBeamCannon015],
        play: [createMockUnit({ traits: ["zeon"], hp: 6 })],
        resourceArea: activeResources(3),
        deck: 5,
      },
      {
        play: [createMockUnit({ ap: 5, hp: 6 })],
        shieldArea: [createMockUnit({ name: "Shield" })],
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [friendlyId]);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(enemyId, friendlyId));
    expectSuccess(p1.passBlock());
    expectFailure(p1.playCommand(st10DiffuseBeamCannon015), "PRECONDITION_FAILED");

    expect(p1.getCardZone(st10DiffuseBeamCannon015)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(enemyId)).toMatchObject({ effectiveAp: 5 });
  });

  it("can be paired as Claire Heathrow and grants its printed AP bonus", () => {
    const host = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [st10DiffuseBeamCannon015],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
  });
});
