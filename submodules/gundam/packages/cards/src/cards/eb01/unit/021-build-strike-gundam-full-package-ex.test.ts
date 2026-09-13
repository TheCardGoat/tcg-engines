import { describe, expect, it } from "vite-plus/test";
import {
  createMockPilot,
  createMockResource,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { expectBreachAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { eb01BuildStrikeGundamFullPackageEx021 } from "./021-build-strike-gundam-full-package-ex.ts";

describe("Build Strike Gundam (Full Package) (EX) (EB01-021)", () => {
  it("<Breach 4> deals exactly 4 damage after destroying a Unit in battle", () => {
    expectBreachAbility(eb01BuildStrikeGundamFullPackageEx021, 4);
  });

  it("places one rested Resource only when paired with a (G Generation) Pilot and two (G Generation) Units are in trash", () => {
    const pilot = createMockPilot({ name: "Reiji", traits: ["g generation"], level: 0, cost: 0 });
    const qualifyingTrash = [
      createMockUnit({ traits: ["g generation"] }),
      createMockUnit({ traits: ["g generation"] }),
    ];
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [eb01BuildStrikeGundamFullPackageEx021],
      trash: qualifyingTrash,
      resourceDeck: [createMockResource()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, sourceId));
    const resourceId = p1.getCardsInZone("resourceArea")[0]!;
    expect(p1.isExhausted(resourceId)).toBe(true);

    const noTrashPilot = createMockPilot({
      name: "Reiji",
      traits: ["g generation"],
      level: 0,
      cost: 0,
    });
    const noTrashEngine = GundamTestEngine.create({
      hand: [noTrashPilot],
      play: [eb01BuildStrikeGundamFullPackageEx021],
      trash: [createMockUnit({ traits: ["g generation"] })],
      resourceDeck: [createMockResource()],
    });
    const noTrashP1 = noTrashEngine.asPlayer(PLAYER_ONE);
    expectSuccess(noTrashP1.assignPilot(noTrashPilot, noTrashP1.getCardsInZone("battleArea")[0]!));
    expect(noTrashP1.getCardsInZone("resourceArea")).toHaveLength(0);
  });
});
