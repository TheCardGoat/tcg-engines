/**
 * DTD004 Empyrean Rapture — Light Illusionist Chest.
 *
 * Printed:
 *   If a card with Herald in its name has been put into your hero's soul
 *   during your turn, the first hero ability you activate that turn costs
 *   {r}{r} less to activate.
 *   Once per Turn Instant - {r}: This gets ward 1 until end of turn.
 *
 * Reasoning (hand-authored):
 * 1. Continuous cost on hero activations needs types:["Hero"] appliesTo
 *    (prior hasStatus "hero-ability" was unwired residue).
 * 2. Herald→soul is a turn fact: stamp history.turn.heraldPutIntoSoulThisTurn
 *    on soul entry while turn player + name moniker Herald.
 * 3. Prospective quote must honor atom.condition or the −2{r} fires without
 *    a Herald ever entering soul.
 * 4. Future-applicability must observe activate (not only announce/attack) so
 *    "first hero ability" consumes the per-turn quota.
 * 5. Prism Instant is {r}{r} + banish soul → Spectral Shield; after Herald
 *    soul entry + rapture, activates for 0{r}.
 * 6. OPT Instant ward 1 is independent equipment path.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { listLegalCommands } from "../../../../automation/legal-commands.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";
import { bravo, snatchRed } from "../../../fixtures.ts";
import { empyreanRapture } from "../../../../../../cards/src/cards/equipment/empyrean-rapture.ts";
import { prism } from "../../../../../../cards/src/cards/heroes/prism.ts";
import { heraldOfProtectionRed } from "../../../../../../cards/src/cards/actions/herald-of-protection.ts";

const opponentHero = bravo;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 56; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision?.kind === "payment") {
      const candidate = decision.candidates[0];
      if (!candidate) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [candidate.instanceId] },
        },
      });
      continue;
    }
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

/**
 * Activate Prism's Spectral Shield Instant: pay resources + banish soul cost.
 */
function resolvePrismSoulShield(
  game: ReturnType<typeof FabTestEngine.start>,
  abilityId = "NGkHQHjzkFqfmGLKmRCpj:oncePerTurnInstantResourceResourceBanishPrismsSoulCreateSpectralShieldToken",
): void {
  const player = game.as(prism);
  const activate = listLegalCommands(game.getRuntime(), player.id).find(
    (cmd) => cmd.move === "activate" && cmd.payload.ability === abilityId,
  );
  expect(activate).toBeDefined();
  game.exec({ move: "activate", actorId: player.id, payload: activate!.payload });
  drain(game);
}

describe("empyrean-rapture (DTD004)", () => {
  it("core mechanic: Herald→soul → first hero ability costs {r}{r} less", () => {
    // Arrange — play Herald of Protection (cost 2, p7); undefended hit puts it
    // into soul and stamps the rapture turn fact. Seed 0 RP for the hero
    // Instant so only the −2{r} discount makes it legal (printed 2{r}).
    const game = FabTestEngine.start(
      {
        hero: prism,
        chest: [empyreanRapture],
        hand: [heraldOfProtectionRed, snatchRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Prism = game.as(prism);

    Prism.attackWith(heraldOfProtectionRed, { pitch: [snatchRed, snatchRed] });
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(Prism.zone("soul")).toContain(heraldOfProtectionRed.canonicalId);
    expect(game.getState().players[Prism.id]!.history.turn.heraldPutIntoSoulThisTurn).toBe(true);

    // Hero Instant is free (2 − 2); soul-banish cost still required (Herald).
    expect(Prism.resourcePoints()).toBe(0);

    resolvePrismSoulShield(game);

    expect(Prism.zone("arena")).toContain("token:spectral-shield");
    expect(Prism.zone("soul")).not.toContain(heraldOfProtectionRed.canonicalId);
    expect(Prism.resourcePoints()).toBe(0);
  });

  it("boundaries: no Herald → hero ability still needs 2{r}; OPT ward 1; model", () => {
    // No Herald soul entry: Prism Instant illegal at 0{r} even with rapture.
    const noHerald = FabTestEngine.start(
      {
        hero: prism,
        chest: [empyreanRapture],
        soul: [snatchRed],
        resourcePoints: 0,
        hand: [],
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(
      noHerald.getState().players[noHerald.as(prism).id]!.history.turn.heraldPutIntoSoulThisTurn,
    ).toBe(false);
    expect(
      listLegalCommands(noHerald.getRuntime(), noHerald.as(prism).id).find(
        (cmd) =>
          cmd.move === "activate" &&
          cmd.payload.ability ===
            "NGkHQHjzkFqfmGLKmRCpj:oncePerTurnInstantResourceResourceBanishPrismsSoulCreateSpectralShieldToken",
      ),
    ).toBeUndefined();

    // With soul + full RP and no Herald fact: pays full 2{r}.
    const fullCost = FabTestEngine.start(
      {
        hero: prism,
        chest: [empyreanRapture],
        soul: [snatchRed],
        resourcePoints: 2,
        hand: [],
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    resolvePrismSoulShield(fullCost);
    expect(fullCost.as(prism).resourcePoints()).toBe(0);
    expect(fullCost.as(prism).zone("arena")).toContain("token:spectral-shield");

    // OPT Instant ward 1 on the chest piece (continuous keyword grant).
    const wardGame = FabTestEngine.start(
      {
        hero: prism,
        chest: [empyreanRapture],
        resourcePoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const W = wardGame.as(prism);
    const plateId = W.findCardInZone("chest", empyreanRapture);
    W.activate(empyreanRapture);
    drain(wardGame);
    const plateRecord = wardGame.getState().objects[plateId]!;
    const plateView = buildFabRulesView(wardGame.getState()).object({
      instanceId: plateId,
      incarnation: plateRecord.incarnation,
    });
    expect(
      plateView?.current.keywords.some(
        (k) => k.name === "ward" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
    // OPT: second activate illegal.
    expect(() => W.activate(empyreanRapture)).toThrow();
    expect(W.resourcePoints()).toBe(0);

    const a1 = empyreanRapture.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.condition).toMatchObject({
      type: "performed-this-turn",
      event: "herald-into-soul",
      player: "controller",
    });
    expect(a1.effect).toMatchObject({
      type: "modify-activation-cost",
      op: "subtract",
      amount: 2,
      appliesTo: {
        next: { typeBox: { types: ["Hero"] } },
        count: 1,
        perTurn: true,
      },
    });
  });
});
