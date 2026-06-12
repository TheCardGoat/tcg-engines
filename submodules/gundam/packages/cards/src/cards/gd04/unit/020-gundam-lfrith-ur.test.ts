import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockResource,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04IndiscriminateViolence106 } from "../command/106-indiscriminate-violence.ts";
import { gd04GundamLfrithUr020 } from "./020-gundam-lfrith-ur.ts";

describe("Gundam Lfrith Ur (GD04-020)", () => {
  it("draws once when you activate a Dawn of Fold Command using an EX Resource", () => {
    const resources = [
      ...activeResources(4).map((entry) => ({ ...entry, exhausted: true })),
      { card: createMockResource({ name: "EX Resource" }), exhausted: false },
    ];
    const engine = GundamTestEngine.create({
      hand: [gd04IndiscriminateViolence106],
      play: [gd04GundamLfrithUr020],
      resourceArea: resources,
      deck: [createMockUnit({ name: "Drawn Card" })],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const lfrithId = p1.getCardsInZone("battleArea")[0]!;
    const exResourceId = p1.getCardsInZone("resourceArea").at(-1)!;
    engine.markAsToken(exResourceId);

    expectSuccess(p1.playCommand(gd04IndiscriminateViolence106, { targets: [lfrithId] }));

    expect(p1.getHand()).toHaveLength(1);
  });

  it("does not draw when the Dawn of Fold Command was not paid with an EX Resource", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04IndiscriminateViolence106],
      play: [gd04GundamLfrithUr020],
      resourceArea: activeResources(5),
      deck: [createMockUnit({ name: "Undrawn Card" })],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const lfrithId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd04IndiscriminateViolence106, { targets: [lfrithId] }));

    expect(p1.getHand()).toHaveLength(0);
  });
});
