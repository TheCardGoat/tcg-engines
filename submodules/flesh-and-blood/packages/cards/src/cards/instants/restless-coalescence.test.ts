import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { sigilOfProtectionYellow } from "../actions/sigil-of-protection.ts";
import { restlessCoalescenceYellow } from "./restless-coalescence.ts";

/**
 * Restless Coalescence (MST133) — Illusionist Instant Aura, Ward 2.
 *
 * Printed: When this enters the arena, move any number of +1{p} counters
 * from auras you control onto this. Once per Turn Instant — Remove a +1{p}
 * counter from this: Create a Spectral Shield token.
 *
 * move-counter is CR 8.5.42: numeric +1{p} (not only named steam), one from
 * aura. Unique other aura auto-binds.
 */

describe("Restless Coalescence (MST133) AAA", () => {
  it("happy: entering moves a +1{p} from another aura you control onto this", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [restlessCoalescenceYellow],
        arena: [{ card: sigilOfProtectionYellow, state: { powerCounterTotal: 1 } }],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(restlessCoalescenceYellow);
    game.untilIdle({ entityTargets: "pause" });
    Enigma.choose("Counter 1");
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Enigma, sigilOfProtectionYellow).toHaveCounters(0);
    expectFabCard(Enigma, restlessCoalescenceYellow).toHaveCounters(1);
  });

  it("boundary: with no other aura this enters with 0 counters", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [restlessCoalescenceYellow],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(restlessCoalescenceYellow);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Enigma, restlessCoalescenceYellow).toBeIn("arena");
    expectFabCard(Enigma, restlessCoalescenceYellow).toHaveCounters(0);
  });

  it("boundary: the player may move only part of a donor's counters", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [restlessCoalescenceYellow],
        arena: [{ card: sigilOfProtectionYellow, state: { powerCounterTotal: 3 } }],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(restlessCoalescenceYellow);
    game.untilIdle({ entityTargets: "pause" });
    Enigma.choose("Counter 1");
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Enigma, sigilOfProtectionYellow).toHaveCounters(2);
    expectFabCard(Enigma, restlessCoalescenceYellow).toHaveCounters(1);
  });

  it("boundary: the player may choose to move zero counters", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [restlessCoalescenceYellow],
        arena: [{ card: sigilOfProtectionYellow, state: { powerCounterTotal: 2 } }],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(restlessCoalescenceYellow);
    game.untilIdle({ entityTargets: "pause" });
    Enigma.chooseOptions();
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Enigma, sigilOfProtectionYellow).toHaveCounters(2);
    expectFabCard(Enigma, restlessCoalescenceYellow).toHaveCounters(0);
  });

  it("timing: counters on an opposing aura are not moved", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [restlessCoalescenceYellow],
        deck: 6,
      },
      {
        hero: dash,
        arena: [{ card: sigilOfProtectionYellow, state: { powerCounterTotal: 1 } }],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);
    const Dash = game.as(dash);

    Enigma.play(restlessCoalescenceYellow);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Enigma, restlessCoalescenceYellow).toHaveCounters(0);
    expectFabCard(Dash, sigilOfProtectionYellow).toHaveCounters(1);
  });
});
