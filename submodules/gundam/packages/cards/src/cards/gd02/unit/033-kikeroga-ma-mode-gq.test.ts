import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02KikerogaMaModeGq033 } from "./033-kikeroga-ma-mode-gq.ts";
import { gd02ChalliaBullGq090 } from "../pilot/090-challia-bull-gq.ts";

describe("Kikeroga (MA Mode) (GQ) (GD02-033)", () => {
  describe("Printed Lv.5 and cost 4", () => {
    it("cannot deploy with only 4 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02KikerogaMaModeGq033],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 3 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02KikerogaMaModeGq033],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(3);
    });
  });

  it("gains Breach 5 while another friendly Zeon Link Unit is in play", () => {
    const linkPilot = createMockPilot({ name: "Link Pilot", cost: 1, level: 1 });
    const zeonHost = createMockUnit({ traits: ["zeon"], linkCondition: "[Link Pilot]" });
    const engine = GundamTestEngine.create({
      hand: [gd02KikerogaMaModeGq033, linkPilot],
      play: [zeonHost],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const kikerogaId = p1.getHand()[0]!;
    const zeonHostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(kikerogaId));
    expectSuccess(p1.assignPilot(linkPilot, zeonHostId));

    expect(p1.getVisibleCard(kikerogaId)?.keywords).toContain("Breach");
  });

  it("does not gain Breach from an unlinked Zeon Unit", () => {
    const zeonAlly = createMockUnit({ traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      hand: [gd02KikerogaMaModeGq033],
      play: [zeonAlly],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const kikerogaId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(kikerogaId));

    expect(p1.getVisibleCard(kikerogaId)?.keywords).not.toContain("Breach");
  });

  it("does not gain Breach from a linked Unit without the Zeon trait", () => {
    const linkPilot = createMockPilot({ name: "Link Pilot", cost: 1, level: 1 });
    const nonZeonHost = createMockUnit({
      traits: ["earth federation"],
      linkCondition: "[Link Pilot]",
    });
    const engine = GundamTestEngine.create({
      hand: [gd02KikerogaMaModeGq033, linkPilot],
      play: [nonZeonHost],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const kikerogaId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(kikerogaId));
    expectSuccess(p1.assignPilot(linkPilot, hostId));

    expect(p1.getVisibleCard(kikerogaId)?.keywords).not.toContain("Breach");
  });

  it("can attack on its deployment turn after pairing Challia Bull", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd02KikerogaMaModeGq033, gd02ChalliaBullGq090],
        resourceArea: activeResources(6),
      },
      { shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02KikerogaMaModeGq033));
    const kikerogaId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(gd02ChalliaBullGq090, kikerogaId));

    expectSuccess(p1.enterBattle(kikerogaId, "direct"));
  });
});
