import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockResource,
  createMockUnit,
  expectFailure,
  expectSuccess,
  hasGrantAttackTargetOption,
} from "@tcg/gundam-engine";
import { gd04IndiscriminateViolence106 } from "./106-indiscriminate-violence.ts";

describe("Indiscriminate Violence (GD04-106)", () => {
  it("【Main】grants a friendly Academy Unit an active enemy AP<=5 attack target option", () => {
    const academy = createMockUnit({ traits: ["academy"] });
    const engine = GundamTestEngine.create({
      hand: [gd04IndiscriminateViolence106],
      play: [academy],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const academyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd04IndiscriminateViolence106, { targets: [academyId] }));

    expect(hasGrantAttackTargetOption(engine, academyId)).toBe(true);
  });

  it("if an EX Resource was used to play this card, grants the option to 1 to 2 Academy Units", () => {
    const academyOne = createMockUnit({ traits: ["academy"] });
    const academyTwo = createMockUnit({ traits: ["academy"] });
    const resources = [
      ...activeResources(4).map((entry) => ({ ...entry, exhausted: true })),
      { card: createMockResource({ name: "EX Resource" }), exhausted: false },
    ];
    const engine = GundamTestEngine.create({
      hand: [gd04IndiscriminateViolence106],
      play: [academyOne, academyTwo],
      resourceArea: resources,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [academyOneId, academyTwoId] = p1.getCardsInZone("battleArea");
    const exResourceId = p1.getCardsInZone("resourceArea").at(-1)!;
    engine.markAsToken(exResourceId);

    expectSuccess(
      p1.playCommand(gd04IndiscriminateViolence106, {
        targets: [academyOneId!, academyTwoId!],
      }),
    );

    expect(hasGrantAttackTargetOption(engine, academyOneId!)).toBe(true);
    expect(hasGrantAttackTargetOption(engine, academyTwoId!)).toBe(true);
  });

  it("without EX payment, cannot choose two Academy Units", () => {
    const academyOne = createMockUnit({ traits: ["academy"] });
    const academyTwo = createMockUnit({ traits: ["academy"] });
    const engine = GundamTestEngine.create({
      hand: [gd04IndiscriminateViolence106],
      play: [academyOne, academyTwo],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [academyOneId, academyTwoId] = p1.getCardsInZone("battleArea");

    expectFailure(
      p1.playCommand(gd04IndiscriminateViolence106, {
        targets: [academyOneId!, academyTwoId!],
      }),
      "INVALID_TARGET",
    );
  });
});
