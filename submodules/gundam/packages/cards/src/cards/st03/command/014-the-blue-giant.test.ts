import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  createMockUnit,
  hasPreventDamage,
} from "@tcg/gundam-engine";
import { st03TheBlueGiant014 } from "./014-the-blue-giant.ts";

describe("The Blue Giant (ST03-014)", () => {
  it("【Action】: applies prevent-damage to the chosen friendly Unit only — non-chosen friendly Units untouched", () => {
    const chosen = createMockUnit({ ap: 3, hp: 3 });
    const otherFriendly = createMockUnit({ ap: 3, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [st03TheBlueGiant014],
      play: [chosen, otherFriendly],
      resourceArea: activeResources(4),
    });
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [chosenId, otherId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(st03TheBlueGiant014, { targets: [chosenId!] }));

    expect(hasPreventDamage(engine, chosenId!)).toBe(true);
    expect(hasPreventDamage(engine, otherId!)).toBe(false);
  });
});
