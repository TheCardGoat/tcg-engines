import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import {
  acceptDevelopment,
  expectDevelopmentExiled,
} from "../../../test-helpers/development-behavior-test-helpers.ts";
import { eb01Tallgeese027 } from "./027-tallgeese.ts";

describe("Tallgeese (EB01-027)", () => {
  it("【Deploy・Development 2】 grants Breach 1 only to a chosen G Generation Unit", () => {
    const development = Array.from({ length: 2 }, () =>
      createMockUnit({ traits: ["g generation"] }),
    );
    const eligible = createMockUnit({ traits: ["g generation"] });
    const ineligible = createMockUnit({ traits: ["preventer"] });
    const engine = GundamTestEngine.create({
      hand: [eb01Tallgeese027],
      play: [eligible, ineligible],
      trash: development,
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [eligibleId, ineligibleId] = p1.getCardsInZone("battleArea");
    const developmentIds = p1.getCardsInZone("trash");

    expectSuccess(p1.deployUnit(eb01Tallgeese027));
    acceptDevelopment(p1, developmentIds);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([eligibleId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expectDevelopmentExiled(p1, developmentIds);
    expect(p1.getVisibleCard(eligibleId!)?.keywords).toContain("Breach");
    expect(p1.getVisibleCard(ineligibleId!)?.keywords).not.toContain("Breach");
  });

  it("does not grant Breach when fewer than two (G Generation) cards can be exiled", () => {
    const eligible = createMockUnit({ traits: ["g generation"] });
    const engine = GundamTestEngine.create({
      hand: [eb01Tallgeese027],
      play: [eligible],
      trash: [createMockUnit({ traits: ["g generation"] })],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const eligibleId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(eb01Tallgeese027));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getVisibleCard(eligibleId)?.keywords).not.toContain("Breach");
  });
});
