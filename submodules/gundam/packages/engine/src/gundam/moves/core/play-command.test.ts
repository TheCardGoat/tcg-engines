/**
 * play-command — move-level rules tests
 *
 * Covers the rules remediation items for rule 3-4 (Commands), 7-5-2
 * (playing cards from hand), and 10-1-8 (command effects):
 *
 *   - Rule 3-4-5: 【Main】 vs 【Action】 timing gating (strict)
 *   - Rule 10-1-8-1-1: reject play when required targets cannot be chosen
 *   - User-chosen targets honored by the executor
 *   - Rule 7-5-2-2-1: COMMAND_REVEALED event is emitted before cost payment
 *
 * Synthetic command/unit factories are used where a specific timing shape is
 * required; real cards (e.g. gd01-099) are exercised in their own test file.
 */

import { describe, it, expect } from "vite-plus/test";
import "../../testing/register-matchers.ts";
import type { CardEffect, CommandCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  createMockResource,
  createMockCommand,
} from "../../../index.ts";
import type { TestCardEntry } from "../../../index.ts";

/** Command that rests 1 enemy unit. Customizable timing. */
function makeRestCommand(opts: {
  timing: Array<"main" | "action">;
  cost?: number;
  level?: number;
}): CommandCard {
  const { timing, cost = 1, level = 1 } = opts;
  const effect: CardEffect = {
    type: "command",
    activation: { timing },
    directives: [
      {
        action: {
          action: "rest",
          target: {
            owner: "opponent",
            cardType: "unit",
            count: 1,
          },
        },
      },
    ],
    sourceText: `Rest 1 enemy Unit (${timing.join("/")})`,
  };
  return createMockCommand({
    name: "Test Rest Command",
    level,
    cost,
    effect: effect.sourceText,
    effects: [effect],
  });
}

/** Command that rests 1 to 2 enemy units with HP <= 3. */
function makeMultiRestCommand(opts: { timing: Array<"main" | "action"> }): CommandCard {
  const { timing } = opts;
  const effect: CardEffect = {
    type: "command",
    activation: { timing },
    directives: [
      {
        action: {
          action: "rest",
          target: {
            owner: "opponent",
            cardType: "unit",
            attributeFilters: [{ attribute: "hp", comparison: "lte", value: 3 }],
            count: { min: 1, max: 2 },
          },
        },
      },
    ],
    sourceText: `Rest 1-2 enemy Units with HP <= 3 (${timing.join("/")})`,
  };
  return createMockCommand({
    name: "Test Multi Rest Command",
    effect: effect.sourceText,
    effects: [effect],
  });
}

function active(card: ReturnType<typeof createMockResource>): TestCardEntry {
  return { card, exhausted: false };
}

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => active(createMockResource()));
}

// ── Rule 3-4-5: timing gating ──────────────────────────────────────────────────

describe("play-command — timing gating (rule 3-4-5)", () => {
  it("rejects an Action-only command during main-phase with WRONG_TIMING", () => {
    const cmd = makeRestCommand({ timing: ["action"] });
    const unit = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [cmd], resourceArea: resources(2) },
      { play: [unit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(cmd), "WRONG_TIMING");
  });

  it("rejects a Main-only command during action-step with WRONG_TIMING", () => {
    const cmd = makeRestCommand({ timing: ["main"] });
    const unit = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [cmd], resourceArea: resources(2) },
      { play: [unit] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(cmd), "WRONG_TIMING");
  });

  it("allows a Main-only command during main-phase", () => {
    const cmd = makeRestCommand({ timing: ["main"] });
    const unit = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [cmd], resourceArea: resources(2) },
      { play: [unit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(cmd, { targets: [unitId] }));
  });

  it("allows an Action-only command during action-step", () => {
    const cmd = makeRestCommand({ timing: ["action"] });
    const unit = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [cmd], resourceArea: resources(2) },
      { play: [unit] },
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(cmd, { targets: [unitId] }));
  });

  it("allows a dual-timing (main+action) command in both phases", () => {
    const cmd1 = makeRestCommand({ timing: ["main", "action"] });
    const cmd2 = makeRestCommand({ timing: ["main", "action"] });
    const unit = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [cmd1, cmd2], resourceArea: resources(4) },
      { play: [unit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(cmd1, { targets: [unitId] }));

    engine.setPhase("end-phase");
    engine.setStep("action-step");
    // reset the rested unit so we can target it again
    engine.getG().exhausted[unitId] = false;
    expectSuccess(p1.playCommand(cmd2, { targets: [unitId] }));
  });
});

// ── Rule 10-1-8-1-1: target legality at play time ─────────────────────────────

describe("play-command — target legality (rule 10-1-8-1-1)", () => {
  it("rejects play with NO_LEGAL_TARGETS when no opponent unit matches", () => {
    const cmd = makeMultiRestCommand({ timing: ["main"] });
    // Opponent has only a HP-5 unit, but filter requires HP <= 3
    const bigUnit = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [cmd], resourceArea: resources(2) },
      { play: [bigUnit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(cmd), "NO_LEGAL_TARGETS");
  });

  it("does not consume the card or resources when play is rejected", () => {
    const cmd = makeMultiRestCommand({ timing: ["main"] });
    const bigUnit = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [cmd], resourceArea: resources(2) },
      { play: [bigUnit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;
    const cardId = p1.getHand()[0]!;

    p1.playCommand(cmd); // expected to fail

    expect(p1.getHand().length).toBe(handBefore);
    expect(p1.getHand()).toContain(cardId);
    // Neither resource was rested
    const resourceIds = p1.getCardsInZone("resourceArea");
    for (const rid of resourceIds) {
      expect(engine.getG().exhausted[rid] ?? false).toBe(false);
    }
  });
});

// ── User-chosen targets ────────────────────────────────────────────────────────

describe("play-command — user-chosen targets", () => {
  it("rests only the chosen enemy unit when targets = [u1]", () => {
    const cmd = makeMultiRestCommand({ timing: ["main"] });
    const u1 = createMockUnit({ hp: 3 });
    const u2 = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [cmd], resourceArea: resources(2) },
      { play: [u1, u2] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [u1Id, u2Id] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(cmd, { targets: [u1Id!] }));
    expect(engine.getG().exhausted[u1Id!]).toBe(true);
    expect(engine.getG().exhausted[u2Id!] ?? false).toBe(false);
  });

  it("rests both chosen enemy units when targets = [u1, u2]", () => {
    const cmd = makeMultiRestCommand({ timing: ["main"] });
    const u1 = createMockUnit({ hp: 3 });
    const u2 = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [cmd], resourceArea: resources(2) },
      { play: [u1, u2] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [u1Id, u2Id] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(cmd, { targets: [u1Id!, u2Id!] }));
    expect(engine.getG().exhausted[u1Id!]).toBe(true);
    expect(engine.getG().exhausted[u2Id!]).toBe(true);
  });

  it("rejects with INVALID_TARGET when a target fails the filter", () => {
    const cmd = makeMultiRestCommand({ timing: ["main"] });
    const u1 = createMockUnit({ hp: 3 });
    const u2 = createMockUnit({ hp: 5 }); // does NOT match HP <= 3
    const engine = GundamTestEngine.create(
      { hand: [cmd], resourceArea: resources(2) },
      { play: [u1, u2] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [u1Id, u2Id] = p2.getCardsInZone("battleArea");

    expectFailure(p1.playCommand(cmd, { targets: [u1Id!, u2Id!] }), "INVALID_TARGET");
  });

  it("rejects with INVALID_TARGET when too many targets are chosen", () => {
    const cmd = makeMultiRestCommand({ timing: ["main"] });
    const u1 = createMockUnit({ hp: 3 });
    const u2 = createMockUnit({ hp: 3 });
    const u3 = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [cmd], resourceArea: resources(2) },
      { play: [u1, u2, u3] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [u1Id, u2Id, u3Id] = p2.getCardsInZone("battleArea");

    expectFailure(p1.playCommand(cmd, { targets: [u1Id!, u2Id!, u3Id!] }), "INVALID_TARGET");
  });
});

// ── Rule 7-5-2-2-1: COMMAND_REVEALED event ─────────────────────────────────────

describe("play-command — COMMAND_REVEALED event (rule 7-5-2-2-1)", () => {
  it("emits COMMAND_REVEALED before COMMAND_PLAYED", () => {
    const cmd = makeRestCommand({ timing: ["main"] });
    const unit = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [cmd], resourceArea: resources(2) },
      { play: [unit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p2.getCardsInZone("battleArea")[0]!;

    const result = p1.playCommand(cmd, { targets: [unitId] });
    if (!result.success) throw new Error(`expected success: ${result.error}`);

    const kinds = result.gameEvents.map((e) => e.event.type);
    const revealIdx = kinds.indexOf("COMMAND_REVEALED");
    const playedIdx = kinds.indexOf("COMMAND_PLAYED");
    expect(revealIdx).toBeGreaterThanOrEqual(0);
    expect(playedIdx).toBeGreaterThan(revealIdx);
  });
});
