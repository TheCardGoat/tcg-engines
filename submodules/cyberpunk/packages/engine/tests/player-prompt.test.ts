import { describe, expect, it } from "vite-plus/test";
import {
  alphaRuthlessLowlife,
  alphaCorpoSecurity,
  alphaRebootOptics,
  alphaFloorIt,
  alphaSwordwiseHuscle,
  alphaArmoredMinotaur,
  alphaSecondhandBombus,
  alphaMantisBlades,
  spoilerCarnageAtTheColosseum,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailPanamPalmerNomadCavalry,
  welcomeToNightCityRetailDumDumMaelstromTriggerman,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";
import type { CardInstanceId, PlayerId } from "../src/types/branded.ts";
import { buildPlayerPrompt } from "../src/view/player-prompt.ts";

// ── Helpers ───────────────────────────────────────────────────────────

function getMoveIds(engine: CyberpunkTestEngine, playerId: typeof P1): string[] {
  return engine.getPrompt(playerId).availableMoves.map((m) => m.moveId);
}

function getInputSpec(engine: CyberpunkTestEngine, playerId: typeof P1, moveId: string) {
  return engine.getPrompt(playerId).availableMoves.find((m) => m.moveId === moveId)?.inputSpec;
}

function chooseCardToPlayPayload(
  cardIds: CardInstanceId[],
  sourceCardId: CardInstanceId,
  sourcePlayerId: PlayerId = P1,
  free?: boolean,
) {
  return {
    cardIds,
    free,
    boundTargets: {},
    sourceCardId,
    sourcePlayerId,
    abilityIndex: 0,
    ifEffects: [],
  };
}

function toAttackPhase(_engine: any) {
  // No-op: attacks happen in main phase.
}

// ── Tests ─────────────────────────────────────────────────────────────

describe("Player Prompt", () => {
  // ── Status tests ──────────────────────────────────────────────────

  describe("status", () => {
    it("returns idle when game is over", () => {
      const engine = CyberpunkTestEngine.createWithFixture({ hand: [alphaRuthlessLowlife] });
      engine.concede({ as: P1 });

      const prompt = engine.getPrompt(P1);

      expect(prompt.status).toBe("idle");
      expect(prompt.availableMoves).toHaveLength(0);
      expect(prompt.choice).toBeNull();
    });

    it("returns action for setup phase — both players can act", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [alphaRuthlessLowlife] },
        { hand: [alphaSwordwiseHuscle] },
        { skipSetup: false },
      );

      const p1Prompt = engine.getPrompt(P1);
      const p2Prompt = engine.getPrompt(P2);

      expect(p1Prompt.status).toBe("action");
      expect(p2Prompt.status).toBe("action");
      expect(getMoveIds(engine, P1)).toContain("mulligan");
      expect(getMoveIds(engine, P1)).toContain("concede");
      expect(getMoveIds(engine, P2)).toContain("mulligan");
    });

    it("returns action for active player in main phase", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife],
        eddies: 5,
      });

      const prompt = engine.getPrompt(P1);

      expect(prompt.status).toBe("action");
      expect(getMoveIds(engine, P1)).toContain("playCard");
      expect(getMoveIds(engine, P1)).toContain("passPhase");
      expect(getMoveIds(engine, P1)).toContain("concede");
    });

    it("returns waiting for non-active player in main phase with concede still available", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife],
        eddies: 5,
      });

      const prompt = engine.getPrompt(P2);

      // P2 is waiting (only always-available moves like concede)
      expect(prompt.status).toBe("waiting");
      expect(getMoveIds(engine, P2)).toContain("concede");
      // P2 should NOT have playCard, passPhase, etc.
      expect(getMoveIds(engine, P2)).not.toContain("playCard");
      expect(getMoveIds(engine, P2)).not.toContain("passPhase");
    });

    it("returns action for active player during an attack step", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );
      toAttackPhase(engine);

      const prompt = engine.getPrompt(P1);

      expect(prompt.status).toBe("action");
      expect(getMoveIds(engine, P1)).toContain("attackUnit");
      expect(getMoveIds(engine, P1)).toContain("attackRival");
      expect(getMoveIds(engine, P1)).toContain("passPhase");
      expect(getMoveIds(engine, P1)).toContain("concede");
    });

    it("returns action for defender in defensive step", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        {
          field: [{ card: alphaRuthlessLowlife, spent: true }, alphaCorpoSecurity],
          eddies: 5,
        },
      );
      toAttackPhase(engine);
      engine.attackUnit(alphaSwordwiseHuscle, alphaRuthlessLowlife, { as: P1 });
      engine.resolveAttack({ as: P1 }); // offensive → defensive

      const prompt = engine.getPrompt(P2);

      expect(prompt.status).toBe("action");
      expect(getMoveIds(engine, P2)).toContain("useBlocker");
      expect(getMoveIds(engine, P2)).toContain("resolveAttack");
      expect(getMoveIds(engine, P2)).toContain("callLegend");
      expect(getMoveIds(engine, P2)).toContain("concede");
    });

    it("returns waiting for non-active non-defending player", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle] },
        { field: [{ card: alphaRuthlessLowlife, spent: true }] },
      );
      toAttackPhase(engine);

      const prompt = engine.getPrompt(P2);

      // P2 is waiting — only concede available, no phase-gated moves
      expect(prompt.status).toBe("waiting");
      expect(getMoveIds(engine, P2)).toContain("concede");
      expect(getMoveIds(engine, P2)).not.toContain("playCard");
      expect(getMoveIds(engine, P2)).not.toContain("passPhase");
    });

    it("concede is always available when game is not ended", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife],
        eddies: 5,
      });

      // Both players can concede
      expect(getMoveIds(engine, P1)).toContain("concede");
      expect(getMoveIds(engine, P2)).toContain("concede");
    });
  });

  // ── Pending choice tests ──────────────────────────────────────────

  describe("pending choice", () => {
    it("returns choice status when pending choice belongs to this player", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife, alphaSwordwiseHuscle],
        eddies: 5,
      });

      // Judge correction: set a pending choice to test the prompt.
      engine.judgeSetPendingChoice({
        type: "chooseCardToPlay",
        chooserId: P1,
        effectId: "",
        payload: chooseCardToPlayPayload(
          engine.getState().G.players["p1"]!.zones.hand.slice(0, 2),
          engine.getState().G.players["p1"]!.zones.hand[0]!,
        ),
      });

      const prompt = engine.getPrompt(P1);

      expect(prompt.status).toBe("choice");
      expect(prompt.choice).not.toBeNull();
      expect(prompt.choice!.type).toBe("chooseCardToPlay");
      expect(prompt.choice!.chooserId).toBe("p1");
      expect(getMoveIds(engine, P1)).toContain("resolveCardToPlay");
      expect(getMoveIds(engine, P1)).toContain("concede");
      expect(getMoveIds(engine, P1)).not.toContain("playCard");
    });

    it("returns waiting when pending choice belongs to opponent but concede is still available", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife],
        eddies: 5,
      });

      engine.judgeSetPendingChoice({
        type: "chooseCardToPlay",
        chooserId: P2,
        effectId: "",
        payload: chooseCardToPlayPayload([], engine.getState().G.players["p1"]!.zones.hand[0]!, P2),
      });

      const prompt = engine.getPrompt(P1);

      expect(prompt.status).toBe("waiting");
      expect(prompt.choice).toBeNull();
      // concede is handlesPendingChoice: true, so it's still available
      expect(getMoveIds(engine, P1)).toContain("concede");
    });

    it("transforms pending choice payload to plain strings", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife, alphaSwordwiseHuscle],
        eddies: 5,
      });

      const handIds = engine.getState().G.players["p1"]!.zones.hand.slice(0, 2);

      engine.judgeSetPendingChoice({
        type: "chooseCardToPlay",
        chooserId: P1,
        effectId: "",
        payload: chooseCardToPlayPayload(handIds, handIds[0]!, P1, true),
      });

      const prompt = engine.getPrompt(P1);
      const choice = prompt.choice!;
      if (choice.type !== "chooseCardToPlay") {
        throw new Error(`Expected chooseCardToPlay, got ${choice.type}`);
      }

      expect(choice.payload.cardIds).toEqual(handIds.map((id) => id as string));
      expect(choice.payload.free).toBe(true);
    });
  });

  // ── inputSpec / candidate tests ───────────────────────────────────

  describe("inputSpec", () => {
    it("playCard candidates include only affordable cards", () => {
      // ruthlessLowlife costs 2, swordwiseHuscle costs 3
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife, alphaSwordwiseHuscle],
        eddies: 2,
      });
      engine.spendAllLegends();

      const spec = getInputSpec(engine, P1, "playCard");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("playCard");
      if (spec!.type === "playCard") {
        const ids = spec!.candidates.map((c) => c.cardId);
        const lowlifeId = engine.findCardId(alphaRuthlessLowlife, "hand", P1) as string;
        expect(ids).toContain(lowlifeId);
        const huscleId = engine.findCardId(alphaSwordwiseHuscle, "hand", P1) as string;
        expect(ids).not.toContain(huscleId);
      }
    });

    it("playCard candidates use effective cost modifiers", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [spoilerCarnageAtTheColosseum],
        eddies: 4,
        gigArea: [
          { dieType: "d10", faceValue: 10 },
          { dieType: "d12", faceValue: 8 },
        ],
      });

      const spec = getInputSpec(engine, P1, "playCard");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("playCard");
      if (spec!.type === "playCard") {
        const carnageId = engine.findCardId(spoilerCarnageAtTheColosseum, "hand", P1) as string;
        expect(spec!.candidates.map((c) => c.cardId)).toContain(carnageId);
      }
    });

    it("playCard surfaces gear with their valid attach targets", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [alphaRuthlessLowlife],
        hand: [alphaMantisBlades],
        eddies: 10,
      });

      const spec = getInputSpec(engine, P1, "playCard");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("playCard");
      if (spec!.type === "playCard") {
        const bladeId = engine.findCardId(alphaMantisBlades, "hand", P1) as string;
        const lowlifeId = engine.findCardId(alphaRuthlessLowlife, "field", P1) as string;
        const blade = spec!.candidates.find((c) => c.cardId === bladeId);
        expect(blade).toBeDefined();
        expect(blade!.attachTargets).toEqual([lowlifeId]);
      }
    });

    it("playCard omits gear when no friendly unit is on the field", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife, alphaMantisBlades],
        eddies: 10,
      });

      const spec = getInputSpec(engine, P1, "playCard");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("playCard");
      if (spec!.type === "playCard") {
        const ids = spec!.candidates.map((c) => c.cardId);
        const lowlifeId = engine.findCardId(alphaRuthlessLowlife, "hand", P1) as string;
        expect(ids).toContain(lowlifeId);
        const bladeId = engine.findCardId(alphaMantisBlades, "hand", P1) as string;
        expect(ids).not.toContain(bladeId);
      }
    });

    it("sellCard candidates include only cards with hasSellTag", () => {
      // alphaFloorIt has hasSellTag: true, alphaRuthlessLowlife does not
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaFloorIt, alphaRuthlessLowlife],
        eddies: 5,
      });

      const spec = getInputSpec(engine, P1, "sellCard");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("selectCard");
      if (spec!.type === "selectCard") {
        const floorItId = engine.findCardId(alphaFloorIt, "hand", P1) as string;
        expect(spec!.candidates).toContain(floorItId);
        const lowlifeId = engine.findCardId(alphaRuthlessLowlife, "hand", P1) as string;
        expect(spec!.candidates).not.toContain(lowlifeId);
      }
    });

    it("callLegend candidates include only face-down legends", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife],
        eddies: 5,
      });

      // All 3 legends start face-down in fixture
      const faceDownLegends = engine.getFaceDownLegends(P1);
      expect(faceDownLegends.length).toBeGreaterThan(0);

      const spec = getInputSpec(engine, P1, "callLegend");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("selectCard");
      if (spec!.type === "selectCard") {
        expect(spec!.candidates).toHaveLength(faceDownLegends.length);
        for (const legend of faceDownLegends) {
          expect(spec!.candidates).toContain(legend.instanceId as string);
        }
      }
    });

    it("attackUnit returns selectPair with ready attackers and spent defenders", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaSwordwiseHuscle, { card: alphaSecondhandBombus, spent: true }] },
        {
          field: [
            { card: alphaRuthlessLowlife, spent: true },
            alphaCorpoSecurity, // not spent
          ],
        },
      );
      toAttackPhase(engine);

      const spec = getInputSpec(engine, P1, "attackUnit");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("selectPair");
      if (spec!.type === "selectPair") {
        // Only swordwiseHuscle is ready (secondhandBombus is spent)
        const huscleId = engine.findCardId(alphaSwordwiseHuscle, "field", P1) as string;
        const bombusId = engine.findCardId(alphaSecondhandBombus, "field", P1) as string;
        expect(spec!.fromCandidates).toContain(huscleId);
        expect(spec!.fromCandidates).not.toContain(bombusId);

        // Only ruthlessLowlife is a valid defender (spent)
        const lowlifeId = engine.findCardId(alphaRuthlessLowlife, "field", P2) as string;
        const corpoId = engine.findCardId(alphaCorpoSecurity, "field", P2) as string;
        expect(spec!.toCandidates).toContain(lowlifeId);
        expect(spec!.toCandidates).not.toContain(corpoId);
      }
    });

    it("attackRival candidates are ready non-summoning-sick units", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            alphaSwordwiseHuscle,
            { card: alphaSecondhandBombus, spent: true },
            { card: alphaRuthlessLowlife, playedThisTurn: true },
          ],
        },
        { field: [{ card: alphaCorpoSecurity, spent: true }] },
      );
      toAttackPhase(engine);

      const spec = getInputSpec(engine, P1, "attackRival");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("selectCard");
      if (spec!.type === "selectCard") {
        // Only swordwiseHuscle is ready and not summoning-sick
        const huscleId = engine.findCardId(alphaSwordwiseHuscle, "field", P1) as string;
        expect(spec!.candidates).toContain(huscleId);
        expect(spec!.candidates).toHaveLength(1);
      }
    });

    it("attack candidates are narrowed to Units that must attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [welcomeToNightCityRetailMoxInciters],
          field: [{ card: alphaCorpoSecurity, spent: true }],
          eddies: 3,
        },
        {
          field: [
            { card: alphaRuthlessLowlife, spent: false, playedThisTurn: false },
            { card: alphaSwordwiseHuscle, spent: false, playedThisTurn: false },
          ],
        },
      );

      engine.playCard(welcomeToNightCityRetailMoxInciters, { as: P1 });
      engine.resolveEffectTarget(alphaRuthlessLowlife, { as: P1 });
      engine.skipToNextPlayerTurn(P1);

      const requiredId = engine.findCardId(alphaRuthlessLowlife, "field", P2) as string;
      const otherId = engine.findCardId(alphaSwordwiseHuscle, "field", P2) as string;
      const directSpec = getInputSpec(engine, P2, "attackRival");
      const unitSpec = getInputSpec(engine, P2, "attackUnit");

      expect(directSpec).toMatchObject({ type: "selectCard" });
      if (directSpec?.type === "selectCard") {
        expect(directSpec.candidates).toEqual([requiredId]);
        expect(directSpec.candidates).not.toContain(otherId);
      }
      expect(unitSpec).toMatchObject({ type: "selectPair" });
      if (unitSpec?.type === "selectPair") {
        expect(unitSpec.fromCandidates).toEqual([requiredId]);
        expect(unitSpec.fromCandidates).not.toContain(otherId);
      }
    });

    it("useBlocker candidates are ready units with blocker rule", () => {
      // ruthlessLowlife (spent, defender), corpoSecurity (blocker, ready), swordwiseHuscle (no blocker, ready)
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [alphaArmoredMinotaur] },
        {
          field: [
            { card: alphaRuthlessLowlife, spent: true },
            alphaCorpoSecurity, // has blocker, ready
            alphaSwordwiseHuscle, // no blocker, ready
          ],
          eddies: 5,
        },
      );
      toAttackPhase(engine);
      engine.attackUnit(alphaArmoredMinotaur, alphaRuthlessLowlife, { as: P1 });
      engine.resolveAttack({ as: P1 }); // offensive → defensive

      const spec = getInputSpec(engine, P2, "useBlocker");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("selectCard");
      if (spec!.type === "selectCard") {
        const corpoId = engine.findCardId(alphaCorpoSecurity, "field", P2) as string;
        expect(spec!.candidates).toContain(corpoId);
        // swordwiseHuscle does not have blocker
        const huscleId = engine.findCardId(alphaSwordwiseHuscle, "field", P2) as string;
        expect(spec!.candidates).not.toContain(huscleId);
      }
    });

    it("resolveCardToPlay candidates match pending choice cardIds", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife, alphaSwordwiseHuscle],
        eddies: 5,
      });

      const handIds = engine.getState().G.players["p1"]!.zones.hand.slice(0, 1);

      engine.judgeSetPendingChoice({
        type: "chooseCardToPlay",
        chooserId: P1,
        effectId: "",
        payload: chooseCardToPlayPayload(handIds, handIds[0]!),
      });

      const spec = getInputSpec(engine, P1, "resolveCardToPlay");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("selectCard");
      if (spec!.type === "selectCard") {
        expect(spec!.candidates).toEqual(handIds.map((id) => id as string));
      }
    });

    it("does not offer activated abilities for stale field members whose card zone is hand", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [welcomeToNightCityRetailOverwatchPanamSGift],
        eddies: 5,
      });
      const cardId = engine.findCardId(welcomeToNightCityRetailOverwatchPanamSGift, "field", P1);
      engine.getState().G.cardIndex[cardId as string]!.zone = "hand";

      expect(getMoveIds(engine, P1)).not.toContain("activateAbility");
      expect(
        engine.executeMove(
          "activateAbility",
          { args: { cardId: cardId as string, abilityIndex: 1 } },
          P1,
        ),
      ).toMatchObject({
        success: false,
        errorCode: "NOT_ON_FIELD",
      });
    });

    it("does not offer activated abilities for non-legends in the legend area", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [welcomeToNightCityRetailOverwatchPanamSGift],
        eddies: 5,
      });
      const cardId = engine.findCardId(welcomeToNightCityRetailOverwatchPanamSGift, "field", P1);
      const player = engine.getState().G.players[P1]!;
      player.zones.field = player.zones.field.filter((id) => id !== cardId);
      player.zones.legendArea = [cardId as never];
      engine.getState().G.cardIndex[cardId as string]!.zone = "legendArea";

      expect(getMoveIds(engine, P1)).not.toContain("activateAbility");
      expect(
        engine.executeMove(
          "activateAbility",
          { args: { cardId: cardId as string, abilityIndex: 1 } },
          P1,
        ),
      ).toMatchObject({
        success: false,
        errorCode: "NOT_ON_FIELD",
      });
    });

    it("offers activated abilities for gear attached to a legend in the legend area", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: welcomeToNightCityRetailPanamPalmerNomadCavalry, faceDown: false }],
          field: [welcomeToNightCityRetailOverwatchPanamSGift],
          hand: [alphaRebootOptics],
          eddies: 5,
        },
        {
          field: [{ card: alphaCorpoSecurity, spent: true }],
        },
      );
      const gearId = engine.findCardId(welcomeToNightCityRetailOverwatchPanamSGift, "field", P1);
      const legendId = engine.findCardId(
        welcomeToNightCityRetailPanamPalmerNomadCavalry,
        "legendArea",
        P1,
      );
      const player = engine.getState().G.players[P1]!;
      player.zones.field = player.zones.field.filter((id) => id !== gearId);
      player.zones.legendArea.push(gearId as never);
      const gear = engine.getState().G.cardIndex[gearId as string]!;
      const legend = engine.getState().G.cardIndex[legendId as string]!;
      gear.zone = "legendArea";
      gear.meta.attachedToId = legendId;
      legend.meta.attachedGearIds.push(gearId);

      const spec = getInputSpec(engine, P1, "activateAbility");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("selectAbility");
      if (spec!.type === "selectAbility") {
        expect(spec!.candidates).toContainEqual({ cardId: gearId as string, abilityIndex: 1 });
      }
      expect(
        engine.executeMove(
          "activateAbility",
          { args: { cardId: gearId as string, abilityIndex: 1 } },
          P1,
        ),
      ).toMatchObject({ success: true });
    });

    it("does not offer activated abilities whose required bindings have no targets", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: false }],
        eddies: 2,
      });

      expect(getMoveIds(engine, P1)).not.toContain("activateAbility");
    });

    it("offers activated abilities once required binding targets exist", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: false }],
        field: [alphaRuthlessLowlife],
        eddies: 2,
      });
      const dumDumId = engine.findCardId(
        welcomeToNightCityRetailDumDumMaelstromTriggerman,
        "legendArea",
        P1,
      ) as string;

      const spec = getInputSpec(engine, P1, "activateAbility");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("selectAbility");
      if (spec!.type === "selectAbility") {
        expect(spec!.candidates).toContainEqual({ cardId: dumDumId, abilityIndex: 2 });
      }
    });

    it("does not offer activated abilities when no binding selection can satisfy follow-up effects", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [welcomeToNightCityRetailOverwatchPanamSGift],
          hand: [alphaRuthlessLowlife],
          eddies: 5,
        },
        {
          field: [{ card: alphaArmoredMinotaur, spent: true }],
        },
      );
      const overwatchId = engine.findCardId(
        welcomeToNightCityRetailOverwatchPanamSGift,
        "field",
        P1,
      ) as string;

      const spec = getInputSpec(engine, P1, "activateAbility");

      if (spec?.type === "selectAbility") {
        expect(spec.candidates).not.toContainEqual({ cardId: overwatchId, abilityIndex: 1 });
      }
    });

    it("passPhase has inputSpec type none", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife],
        eddies: 5,
      });

      const spec = getInputSpec(engine, P1, "passPhase");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("none");
    });

    it("concede has inputSpec type none", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife],
        eddies: 5,
      });

      const spec = getInputSpec(engine, P1, "concede");

      expect(spec).toBeDefined();
      expect(spec!.type).toBe("none");
    });
  });

  // ── Integration tests ─────────────────────────────────────────────

  describe("integration", () => {
    it("getFilteredView includes prompt field", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife],
        eddies: 5,
      });

      const view = engine.getFilteredView(P1);

      expect(view.prompt).toBeDefined();
      expect(view.prompt.status).toBe("action");
      expect(view.prompt.availableMoves.length).toBeGreaterThan(0);
    });

    it("getFilteredView prompt matches standalone buildPlayerPrompt", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife],
        eddies: 5,
      });

      const viewPrompt = engine.getFilteredView(P1).prompt;
      const standalonePrompt = buildPlayerPrompt(engine.getState(), P1);

      expect(viewPrompt).toEqual(standalonePrompt);
    });
  });
});
