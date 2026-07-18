import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  eb03Camie015,
  op06HodyJones020,
  op13NicoRobin032,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../src/index.ts";

const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;

function blockerChoice(engine: OnePieceTestEngine, seat: "south" | "north") {
  const step = engine.pendingDecision("battleBlocker", seat).steps[0];
  expect(step?.kind).toBe("selectEntity");
  if (step?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
  return step;
}

describe("Official Blocker FAQ", () => {
  test("Q28 and Q31: offers any active Blocker once, with an explicit option to decline", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [eb01TonyTonyChopper006, eb01TonyTonyChopper006] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const blockers = engine
      .getView("north")
      .players.north.characters.filter((card) => card?.cardId === eb01TonyTonyChopper006.id)
      .map((card) => card!.instanceId)
      .filter((instanceId): instanceId is string => Boolean(instanceId));

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const choice = blockerChoice(engine, "north");

    expect(choice.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", ...blockers]);
    engine.expectFailure({
      type: "resolvePrompt",
      seat: "north",
      promptId: choice.id,
      selectedIds: blockers,
    });
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "north");
    expect(engine.getView("north").decisions).toHaveLength(0);
  });

  test("Q29: does not offer the attacked Blocker as its own replacement target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [{ card: eb01TonyTonyChopper006, rested: true }, eb01TonyTonyChopper006],
      },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const attackedBlockerId = engine
      .getView("north")
      .players.north.characters.find(
        (card) => card?.cardId === eb01TonyTonyChopper006.id && card.rested,
      )?.instanceId;
    if (!attackedBlockerId) throw new Error("Expected a rested Blocker target.");

    engine.declareAttack(attackerId, attackedBlockerId, "south");
    const choice = blockerChoice(engine, "north");

    expect(choice.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackedBlockerId);
    expect(choice.candidates).toHaveLength(2);
  });

  test("Q30: permits hand Counters after a Blocker changes the attack target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [eb01TonyTonyChopper006],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const blockerId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);
    const counterIds = engine
      .getView("north")
      .players.north.hand.map((card) => card.instanceId)
      .filter((instanceId): instanceId is string => Boolean(instanceId));

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "north");
    const counter = engine.pendingDecision("battleCounter", "north").steps[0];
    expect(counter?.kind).toBe("selectEntity");
    if (counter?.kind !== "selectEntity") throw new Error("Expected a Counter decision.");
    expect(counter.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining(counterIds),
    );
    engine.resolveDecision("battleCounter", { selectedIds: counterIds }, "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === blockerId),
    ).toBe(true);
  });

  test("Q32: excludes rested Blockers from the Block Step", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: eb01TonyTonyChopper006, rested: true }] },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    expect(engine.getView("north").decisions).toHaveLength(0);
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore - 1);
  });

  test("Q855 and Q857: a Character that cannot be rested cannot attack or activate Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13NicoRobin032],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 7,
      },
      { character: [eb01TonyTonyChopper006] },
      SOUTH_ATTACKS,
    );
    const protectedId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);

    engine.playCard(op13NicoRobin032, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "south");
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    const southAttackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    engine.declareAttack(southAttackerId, engine.leader("north"), "south");
    expect(engine.getView("north").decisions).toHaveLength(0);
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore - 1);

    engine.endTurn("south");

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: protectedId,
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    engine.endTurn("north");
  });

  test("Q856: an [Activate: Main] effect that must rest its source cannot be activated", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13NicoRobin032], activeDon: 7 },
      { character: [eb03Camie015] },
      SOUTH_ATTACKS,
    );
    const camieId = engine.findCardInZone("north", "character", eb03Camie015);

    engine.playCard(op13NicoRobin032, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [camieId] }, "south");
    engine.endTurn("south");

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "north",
        sourceInstanceId: camieId,
        trigger: "activateMain",
      }).reason,
    ).toBe("The activation costs cannot be paid.");
  });

  test("Q858: effects cannot rest a Character protected by cannot-be-rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        hand: [op13NicoRobin032],
        character: [eb03Camie015],
        activeDon: 7,
        restedDon: 1,
      },
      { character: [eb01TonyTonyChopper006] },
      SOUTH_ATTACKS,
    );
    const protectedId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);
    const camieId = engine.findCardInZone("south", "character", eb03Camie015);

    engine.playCard(op13NicoRobin032, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "south");
    engine.endTurn("south");
    engine.endTurn("north");
    engine.activateEffect(camieId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === camieId)
        ?.rested,
    ).toBe(true);
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === protectedId)?.rested,
    ).toBe(false);
  });
});
