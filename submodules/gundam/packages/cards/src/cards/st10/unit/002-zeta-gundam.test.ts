import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st10ZetaGundam002 } from "./002-zeta-gundam.ts";

const developmentCard = (name: string) =>
  createMockUnit({ name, traits: ["g generation"], level: 1, cost: 1 });

function acceptDevelopment(
  p1: ReturnType<GundamTestEngine["asPlayer"]>,
  targets = p1.getCardsInZone("trash").slice(0, 2),
): void {
  const choice = p1.getBoardView().pendingChoice;
  if (choice?.kind !== "targetSelection" || choice.optionalDirectiveIndex === undefined) {
    throw new Error("Expected Development targets with a visible Skip choice");
  }
  expectSuccess(
    p1.resolveEffect({
      optionalAnswers: { [choice.optionalDirectiveIndex]: true },
      targets,
    }),
  );
}

describe("Zeta Gundam (ST10-002)", () => {
  describe("【Deploy・Development 2】You may exile two (G Generation) cards from trash. If you do, rest one enemy Unit with 4 or less HP.", () => {
    it("exiles exactly two qualifying cards, rests the chosen enemy, and deploys Zeta", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st10ZetaGundam002],
          trash: [developmentCard("First"), developmentCard("Second")],
          resourceArea: activeResources(5),
        },
        { play: [createMockUnit({ hp: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zetaId = p1.getHand()[0]!;
      const trashIds = p1.getCardsInZone("trash");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(zetaId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        optionalDirectiveIndex: 0,
        legalTargetIds: trashIds,
        minTargets: 2,
        maxTargets: 2,
      });
      acceptDevelopment(p1, trashIds);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(trashIds.every((id) => p1.getCardZone(id) === "removalArea")).toBe(true);
      expect(p2.isExhausted(enemyId)).toBe(true);
      expect(p1.getCardZone(zetaId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("leaves trash and the enemy unchanged when Development is declined", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st10ZetaGundam002],
          trash: [developmentCard("First"), developmentCard("Second")],
          resourceArea: activeResources(5),
        },
        { play: [createMockUnit({ hp: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const trashIds = p1.getCardsInZone("trash");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.deployUnit(st10ZetaGundam002));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection" || choice.optionalDirectiveIndex === undefined) {
        throw new Error("Expected Development targets with a visible Skip choice");
      }
      expectSuccess(
        p1.resolveEffect({
          optionalAnswers: { [choice.optionalDirectiveIndex]: false },
        }),
      );

      expect(p1.getCardsInZone("trash")).toEqual(trashIds);
      expect(p2.isExhausted(enemyId)).toBe(false);
    });

    it("offers only G Generation cards as the exile cost", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st10ZetaGundam002],
          trash: [
            developmentCard("First"),
            developmentCard("Second"),
            createMockUnit({ traits: ["zeon"] }),
          ],
          resourceArea: activeResources(5),
        },
        { play: [createMockUnit({ hp: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstId, secondId, wrongId] = p1.getCardsInZone("trash");
      expectSuccess(p1.deployUnit(st10ZetaGundam002));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [firstId, secondId],
      });
      expect(p1.getBoardView().pendingChoice).not.toMatchObject({ legalTargetIds: [wrongId] });
    });

    it("does not offer Development without two qualifying trash cards", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st10ZetaGundam002],
          trash: [developmentCard("Only One")],
          resourceArea: activeResources(5),
        },
        { play: [createMockUnit({ hp: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st10ZetaGundam002));
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("offers only enemy Units with 4 or less HP after paying Development", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st10ZetaGundam002],
          trash: [developmentCard("First"), developmentCard("Second")],
          resourceArea: activeResources(5),
        },
        { play: [createMockUnit({ hp: 4 }), createMockUnit({ hp: 5 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [eligibleId, tooLargeId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
      expectSuccess(p1.deployUnit(st10ZetaGundam002));
      acceptDevelopment(p1);
      expect(p1.getBoardView().pendingChoice).toMatchObject({ legalTargetIds: [eligibleId] });
      expect(p1.getBoardView().pendingChoice).not.toMatchObject({ legalTargetIds: [tooLargeId] });
    });

    it("never offers a friendly Unit as the rest target", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st10ZetaGundam002],
          play: [createMockUnit({ hp: 4 })],
          trash: [developmentCard("First"), developmentCard("Second")],
          resourceArea: activeResources(5),
        },
        { play: [createMockUnit({ hp: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.deployUnit(st10ZetaGundam002));
      acceptDevelopment(p1);
      expect(p1.getBoardView().pendingChoice).toMatchObject({ legalTargetIds: [enemyId] });
      expect(p1.getBoardView().pendingChoice).not.toMatchObject({ legalTargetIds: [friendlyId] });
    });

    it("requires the printed Lv.5", () => {
      const engine = GundamTestEngine.create({
        hand: [st10ZetaGundam002],
        resourceArea: activeResources(4),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st10ZetaGundam002),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("requires four active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st10ZetaGundam002],
        resourceArea: restedResources(5),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st10ZetaGundam002),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });
});
