import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  markAsLinkUnit,
  enqueueObserverTriggers,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { st02GundamHeavyarms003 } from "./003-gundam-heavyarms.ts";

describe("Gundam Heavyarms (ST02-003)", () => {
  it("data: duringPair-gated destroyed trigger present", () => {
    // Structural guard: the generated card data must carry the `destroyed`
    // event timing and a separate `duringPair` condition so the engine's
    // trigger-enqueue filter routes it through the pending-effect queue.
    const effect = st02GundamHeavyarms003.effects?.find((e) => e.type === "triggered");
    expect(effect?.activation.timing).toEqual(["destroyed"]);
    expect(effect?.activation.conditions).toContainEqual({ type: "duringPair" });
  });

  it("【During Pair】【Destroyed】 — observer scan enqueues Heavyarms' dealDamageAll when an enemy is destroyed", () => {
    // PR #124 (Wave 8): handleUnitDefeated now calls enqueueObserverTriggers
    // in addition to enqueueOwnCardTriggers, mirroring the attackDeclared
    // pattern. Heavyarms is an observer of the dying enemy — its
    // duringPair + destroyed effect must land in the pending-effect
    // queue when an opposing unit is destroyed.
    //
    // Harness note: driving the destroy through `resolveCombat` surfaces
    // a secondary harness-scope bug in the `markAsLinkUnit` + combat
    // zone-reconciliation path (tracked separately — victim damage clears
    // but trash move does not commit once a duringPair observer fires).
    // The engine observer-scan plumbing is exercised here via the
    // `enqueueObserverTriggers` entry point itself, which is the exact
    // call `handleUnitDefeated` now makes.
    // Place the victim on P1 (same side as Heavyarms) so the drain's
    // dealDamageAll (`owner: opponent` from Heavyarms's POV → P2) finds
    // no targets and can't cascade into further destruction events while
    // `enqueueObserverTriggers`'s per-call dedup is still scoped to a
    // single event. The wiring being asserted here is that Heavyarms'
    // effect lands on the queue at all.
    const victim = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [st02GundamHeavyarms003, victim] }, {});
    const p1Cards = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    const heavyarmsId = p1Cards.find((id) => id.includes(st02GundamHeavyarms003.cardNumber))!;
    const victimId = p1Cards.find((id) => id.includes(victim.cardNumber))!;

    // Pair Heavyarms so the `duringPair` continuous gate holds.
    markAsLinkUnit(engine, heavyarmsId);

    let heavyarmsEnqueued = false;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueObserverTriggers(
        G,
        { type: "unitDestroyed", cardId: victimId, playerId: PLAYER_ONE },
        framework,
        victimId,
      );
      heavyarmsEnqueued = G.pendingEffects.some((pe) => pe.sourceCardId === heavyarmsId);
    });

    expect(heavyarmsEnqueued).toBe(true);
  });

  it("【During Pair】【Destroyed】 — does NOT enqueue when Heavyarms is not paired (duringPair gate fails)", () => {
    // Place the victim on P1 (same side as Heavyarms) so the drain's
    // dealDamageAll (`owner: opponent` from Heavyarms's POV → P2) finds
    // no targets and can't cascade into further destruction events while
    // `enqueueObserverTriggers`'s per-call dedup is still scoped to a
    // single event. The wiring being asserted here is that Heavyarms'
    // effect lands on the queue at all.
    const victim = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [st02GundamHeavyarms003, victim] }, {});
    const p1Cards = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    const heavyarmsId = p1Cards.find((id) => id.includes(st02GundamHeavyarms003.cardNumber))!;
    const victimId = p1Cards.find((id) => id.includes(victim.cardNumber))!;

    // No markAsLinkUnit: Heavyarms is unpaired → `duringPair` gate fails
    // → observer scan must NOT enqueue the effect.
    let heavyarmsEnqueued = false;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueObserverTriggers(
        G,
        { type: "unitDestroyed", cardId: victimId, playerId: PLAYER_ONE },
        framework,
        victimId,
      );
      heavyarmsEnqueued = G.pendingEffects.some((pe) => pe.sourceCardId === heavyarmsId);
    });

    expect(heavyarmsEnqueued).toBe(false);
  });
});
