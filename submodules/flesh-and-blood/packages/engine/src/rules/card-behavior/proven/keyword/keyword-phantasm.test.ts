/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:phantasm
 * Representative card: packages/cards/src/cards/actions/dunebreaker-cenipai.ts
 * Canonical id: RFF6Bj8MJNDJLQG9kkpq8
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, phantasmaclasmRed, regurgitatingSlogRed } from "../../../fixtures.ts";
import { regurgitatingSlogYellow } from "../../../../../../cards/src/cards/actions/regurgitating-slog.ts";
import { hitTrainer } from "../../../test-trainers.ts";

// Trainer analogue of Blinding Beam's -power effect (CR §5 example card).
// The real Blinding Beam (MON084) has a separate unsupported cost-reduction
// condition (`has-status: targets-shadow-card`) that blocks playing it in
// tests, so this trainer isolates the -power-on-defender mechanic that
// exercises phantasm's intervening-if re-check. Targets any defending attack
// action card on the combat chain at resolution.
const beamTrainer = (slug: string, amount: number) => ({
  canonicalId: `trainer-${slug}`,
  types: ["Generic", "Instant"],
  cost: 0,
  abilities: [
    {
      id: `trainer-${slug}-a1`,
      kind: "resolution",
      text: `Target defending attack action card gets -${amount} power.`,
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "subtract",
        amount,
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["combat-chain"],
          filter: { typeBox: { types: ["Action"], subtypes: ["Attack"] }, defending: true },
          count: 1,
        },
        duration: "this-turn",
      },
    },
  ],
});
const beamRed = beamTrainer("phantasm-beam-red", 3);

describe("keyword: phantasm", () => {
  it("AAA — a 6+ non-Illusionist attack defender triggers destruction and closes the chain", () => {
    const phantasmAtk = hitTrainer({
      slug: "phantasm-atk",
      keywords: [{ name: "phantasm" }],
      power: 6,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [phantasmAtk], deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [regurgitatingSlogRed],
        deck: 6,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(phantasmAtk, { target: game.as(dash).id });
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.step).toBe("defend");
    game.as(dash).blockWith(regurgitatingSlogRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.passBoth();
    game.helpers.resolveUntilIdle();
    expect(game.as(dash).life()).toBe(20);
    expect(game.as(bravo).zone("graveyard")).toContain(phantasmAtk.canonicalId);
    expect(game.combat()).toBeNull();
  });

  it("AAA — boundary: a power-5 defender does not trigger phantasm", () => {
    const phantasmAtk = hitTrainer({
      slug: "phantasm-safe",
      keywords: [{ name: "phantasm" }],
      power: 6,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [phantasmAtk], deck: 6 },
      { hero: dash, life: 20, hand: [regurgitatingSlogYellow], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(phantasmAtk, { target: game.as(dash).id });
    game.passBoth();
    game.passBoth();
    game.as(dash).blockWith(regurgitatingSlogYellow);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();
    // 6 power − 2 defense = 4 damage.
    expect(game.as(dash).life()).toBe(16);
  });

  it("AAA — a counter-boosted 6{p} defender (6{p} at declaration AND resolution) still triggers phantasm", () => {
    // CR 5.3.2a distinction: phantasm has TWO checks. The defend event fires
    // the triggered-layer when the defender is 6+ {p} at declaration; the layer
    // then re-checks the state at resolution. Here a +1{p} counter keeps the
    // defending regurgitating-slog-yellow at 6{p} at BOTH points, so phantasm
    // resolves and destroys (the paired cr-5-3-2a test covers the power-drop
    // case where the resolution re-check fails). The counter is genuinely
    // present at resolution — not a declaration-snapshot lock.
    const phantasmAtk = hitTrainer({
      slug: "phantasm-vs-modified-five",
      keywords: [{ name: "phantasm" }],
      power: 6,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [phantasmAtk], deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [{ card: regurgitatingSlogYellow, state: { powerCounterTotal: 1 } }],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(phantasmAtk, { target: game.as(dash).id });
    game.passBoth();
    game.passBoth();
    game.as(dash).blockWith(regurgitatingSlogYellow);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expect(game.as(dash).life()).toBe(20);
    expect(
      game
        .committedEvents()
        .some(
          (event) =>
            event.name === "destroy" && event.data.object.canonicalId === phantasmAtk.canonicalId,
        ),
    ).toBe(true);
  });

  it("AAA — any qualifying card in a multi-defender declaration triggers exactly once", () => {
    const phantasmAtk = hitTrainer({
      slug: "phantasm-multi-defender",
      keywords: [{ name: "phantasm" }],
      power: 10,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [phantasmAtk], deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [regurgitatingSlogYellow, regurgitatingSlogRed],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(phantasmAtk, { target: game.as(dash).id });
    game.passBoth();
    game.passBoth();
    game.as(dash).blockWith([regurgitatingSlogYellow, regurgitatingSlogRed]);
    expect(
      game
        .getState()
        .rulesStack.filter(
          (layer) => "abilityId" in layer && layer.abilityId === "keyword:phantasm",
        ),
    ).toHaveLength(1);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expect(
      game
        .committedEvents()
        .filter(
          (event) =>
            event.name === "destroy" && event.data.object.canonicalId === phantasmAtk.canonicalId,
        ),
    ).toHaveLength(1);
  });

  it("AAA — boundary: an Illusionist attack defender with power 6+ does not trigger", () => {
    const phantasmAtk = hitTrainer({
      slug: "phantasm-vs-illusionist",
      keywords: [{ name: "phantasm" }],
      power: 6,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [phantasmAtk], deck: 6 },
      { hero: dash, life: 20, hand: [phantasmaclasmRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(phantasmAtk, { target: game.as(dash).id });
    game.passBoth();
    game.passBoth();
    game.as(dash).blockWith(phantasmaclasmRed);
    game.helpers.resolveRestOfCombat();

    expect(game.as(bravo).zone("graveyard")).toContain(phantasmAtk.canonicalId);
    expect(game.as(dash).life()).toBe(17);
    expect(
      game
        .committedEvents()
        .filter(
          (event) =>
            event.name === "destroy" && event.data.object.canonicalId === phantasmAtk.canonicalId,
        ),
    ).toEqual([]);
  });

  // ── CR 8.3.13a intervening-if re-check ─────────────────────────────────────
  //
  // CR §5 example: an attack with phantasm is defended by a 6-power attack
  // action card; before the phantasm triggered-layer resolves, the attacking
  // hero gives the defending card -power; when the layer resolves the condition
  // is no longer true, so phantasm fails to resolve and does not destroy.

  it("AAA — CR 8.3.13a re-check: reducing the defender's power below 6 before resolution stops phantasm", () => {
    const phantasmAtk = hitTrainer({
      slug: "phantasm-recheck",
      keywords: [{ name: "phantasm" }],
      power: 6,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [phantasmAtk, beamRed], resourcePoints: 3, deck: 6 },
      { hero: dash, life: 20, hand: [regurgitatingSlogRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(phantasmAtk, { target: game.as(dash).id });
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.step).toBe("defend");
    // Dash defends with Regurgitating Slog (power 6) → phantasm trigger fires.
    game.as(dash).blockWith(regurgitatingSlogRed);

    // CR §5: before the phantasm triggered-layer resolves, give the defending
    // card -3 power → now 3 (< 6).
    game.as(bravo).play(beamRed);
    game.helpers.resolveRestOfCombat();

    // CR 8.3.13a: the event-condition is no longer met → phantasm fails to
    // resolve → the attack is NOT destroyed, so combat resolves with damage.
    // 6 power − 2 defense = 4 damage → Dash at 16 (not the 20 of a destroy).
    expect(game.as(dash).life()).toBe(16);
    expect(
      game
        .committedEvents()
        .filter(
          (event) =>
            event.name === "destroy" && event.data.object.canonicalId === phantasmAtk.canonicalId,
        ),
    ).toEqual([]);
  });

  it("AAA — CR 8.3.13a re-check boundary: a defender still at 6+ power after reduction IS destroyed", () => {
    // A 9-power non-Illusionist attack action defender, reduced by -3 → 6,
    // still meets the >= 6 condition → phantasm destroys.
    const phantasmAtk = hitTrainer({
      slug: "phantasm-recheck-boundary",
      keywords: [{ name: "phantasm" }],
      power: 6,
    });
    const heavyDefender = hitTrainer({ slug: "heavy-defender-9", power: 9 });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [phantasmAtk, beamRed], resourcePoints: 3, deck: 6 },
      { hero: dash, life: 20, hand: [heavyDefender], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(phantasmAtk, { target: game.as(dash).id });
    game.passBoth();
    game.passBoth();
    game.as(dash).blockWith(heavyDefender);
    // Reduce the 9-power defender to 6 → still qualifies → phantasm destroys.
    game.as(bravo).play(beamRed);
    game.helpers.resolveRestOfCombat();

    // Re-check still met (6 >= 6) → attack destroyed before damage → life 20.
    expect(game.as(dash).life()).toBe(20);
    expect(game.as(bravo).zone("graveyard")).toContain(phantasmAtk.canonicalId);
  });
});
