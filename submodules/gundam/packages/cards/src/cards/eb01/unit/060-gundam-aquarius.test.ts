import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import {
  acceptDevelopment,
  expectDevelopmentExiled,
} from "../../../test-helpers/development-behavior-test-helpers.ts";
import { eb01GundamAquarius060 } from "./060-gundam-aquarius.ts";

describe("Gundam Aquarius (EB01-060)", () => {
  it("【When Paired・Development 3】 returns only a chosen enemy Unit at Lv.4 or lower", () => {
    const pilot = createMockPilot();
    const development = Array.from({ length: 3 }, () =>
      createMockUnit({ traits: ["g generation"] }),
    );
    const eligible = createMockUnit({ level: 4 });
    const ineligible = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [eb01GundamAquarius060],
        trash: development,
        resourceArea: activeResources(1),
      },
      { play: [eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const developmentIds = p1.getCardsInZone("trash");
    const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, sourceId));
    acceptDevelopment(p1, developmentIds);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expectDevelopmentExiled(p1, developmentIds);
    expect(p2.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(ineligibleId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("does not return an enemy Unit when Development is declined", () => {
    const pilot = createMockPilot();
    const development = Array.from({ length: 3 }, () =>
      createMockUnit({ traits: ["g generation"] }),
    );
    const enemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [eb01GundamAquarius060],
        trash: development,
        resourceArea: activeResources(1),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, sourceId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection")
      throw new Error("Expected the optional Development choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: false } }));

    expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
