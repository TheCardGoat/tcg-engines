import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { st10GundamBarbatos4thForm007 } from "./007-gundam-barbatos-4th-form.ts";

describe("Gundam Barbatos 4th Form (ST10-007)", () => {
  it("【When Linked・Development 2】 exiles two G Generation cards before recovering a Lv.4 Command", () => {
    const pilot = createMockPilot({ traits: ["g generation"] });
    const developmentCards = [
      createMockUnit({ traits: ["g generation"] }),
      createMockUnit({ traits: ["g generation"] }),
    ];
    const eligibleCommand = createMockCommand({ level: 4 });
    const tooHighCommand = createMockCommand({ level: 5 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [st10GundamBarbatos4thForm007],
      trash: [...developmentCards, eligibleCommand, tooHighCommand],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [firstDevelopmentId, secondDevelopmentId, eligibleCommandId, tooHighCommandId] =
      p1.getCardsInZone("trash");

    expectSuccess(p1.assignPilot(pilot, sourceId));
    const developmentChoice = p1.getBoardView().pendingChoice;
    if (developmentChoice?.kind !== "targetSelection") {
      throw new Error("Expected the Development target selection");
    }
    expect(developmentChoice).toMatchObject({
      kind: "targetSelection",
      optionalDirectiveIndex: developmentChoice.directiveIndex,
      legalTargetIds: [firstDevelopmentId, secondDevelopmentId],
      minTargets: 2,
      maxTargets: 2,
    });
    expectSuccess(
      p1.resolveEffect({
        optionalAnswers: { [developmentChoice.directiveIndex]: true },
        targets: [firstDevelopmentId!, secondDevelopmentId!],
      }),
    );

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleCommandId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleCommandId!] }));

    expect(p1.getCardZone(firstDevelopmentId!)).toBe("removalArea");
    expect(p1.getCardZone(secondDevelopmentId!)).toBe("removalArea");
    expect(p1.getCardZone(eligibleCommandId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(tooHighCommandId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("leaves the trash unchanged when Development is declined", () => {
    const pilot = createMockPilot({ traits: ["g generation"] });
    const developmentCards = [
      createMockUnit({ traits: ["g generation"] }),
      createMockUnit({ traits: ["g generation"] }),
    ];
    const command = createMockCommand({ level: 4 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [st10GundamBarbatos4thForm007],
      trash: [...developmentCards, command],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const trashIds = p1.getCardsInZone("trash");

    expectSuccess(p1.assignPilot(pilot, sourceId));
    const developmentChoice = p1.getBoardView().pendingChoice;
    if (developmentChoice?.kind !== "targetSelection") {
      throw new Error("Expected the optional Development target selection");
    }
    expectSuccess(
      p1.resolveEffect({
        optionalAnswers: { [developmentChoice.directiveIndex]: false },
      }),
    );

    expect(p1.getCardsInZone("trash")).toEqual(trashIds);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("does not offer Development when paired with a Pilot that misses its Link Condition", () => {
    const nonLinkPilot = createMockPilot({ traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      hand: [nonLinkPilot],
      play: [st10GundamBarbatos4thForm007],
      trash: [
        createMockUnit({ traits: ["g generation"] }),
        createMockUnit({ traits: ["g generation"] }),
        createMockCommand({ level: 4 }),
      ],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(nonLinkPilot, sourceId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
