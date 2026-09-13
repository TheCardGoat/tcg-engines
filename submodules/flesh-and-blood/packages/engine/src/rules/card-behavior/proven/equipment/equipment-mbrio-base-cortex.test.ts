/**
 * PEN059 mBrio Base Cortex — Mechanologist Base Chest d0 Guardwell.
 *
 * Printed:
 *   If you control a Hyper Driver, this gets +2{d}.
 *   Guardwell
 *
 * Reasoning (case-by-case):
 * 1. Continuous control-object gate on Hyper Driver — was supertypes residue
 *    "Hyper driver" (never matches). Remodeled to name: "Hyper Driver".
 * 2. Duration was this-turn (would drop EOT while HD still controlled). Fixed
 *    permanent re-eval (raw-meat / myrkhellir / tremor family).
 * 3. Fixture uses non-token Hyper Driver Item (ARC036). Bare Token Hyper
 *    Drivers with 0 steam are destroyed by their own "when this has no steam"
 *    trigger when continuous reconcile runs (cortex continuous forces that
 *    poll) — not a cortex bug.
 * 4. With Hyper Driver: d0 + 2 → d2; defend blocks 2 of snatch 4; Guardwell
 *    places −2 defense counters, stays equipped.
 * 5. Without Hyper Driver: base d0 → full snatch damage.
 * 6. Opp-controlled Hyper Driver does not arm the static.
 *
 * Status: ✅ Hyper Driver +2{d}; bare d0; Guardwell −2; remodel name+permanent.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { mbrioBaseCortex } from "../../../../../../cards/src/cards/equipment/mbrio-base-cortex.ts";
import { hyperDriverRed } from "../../../../../../cards/src/cards/actions/hyper-driver.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const SNATCH = 4;
const LIFE = 20;

function chestDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.chest.find(
    (id) => state.objects[id]?.canonicalId === mbrioBaseCortex.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("mbrio-base-cortex (PEN059)", () => {
  it("core mechanic: control Hyper Driver → +2{d}; defend d2 + Guardwell", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [mbrioBaseCortex],
        // Non-token Hyper Driver Item — printed name "Hyper Driver" via slug.
        arena: [hyperDriverRed],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(dash);
    const plateId = Defender.findCardInZone("chest", mbrioBaseCortex);

    expect(Defender.zone("arena")).toContain(hyperDriverRed.canonicalId);
    expect(chestDefense(game, Defender.id)).toBe(2);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(mbrioBaseCortex);
    game.helpers.resolveRestOfCombat();

    // snatch 4 − d2 = 2 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    // Guardwell: −2 defense counters, stays equipped.
    expect(Defender.zone("chest")).toContain(mbrioBaseCortex.canonicalId);
    expect(game.objectState(plateId)?.defenseCounterTotal).toBe(-2);
  });

  it("boundaries: no Hyper Driver d0; opp HD no buff; model name + permanent", () => {
    // Bare: base d0 → full snatch.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [mbrioBaseCortex],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    expect(chestDefense(bare, bare.as(dash).id)).toBe(0);
    bare.as(bravo).attackWith(snatchRed);
    bare.as(dash).defendWith(mbrioBaseCortex);
    bare.helpers.resolveRestOfCombat();
    expect(bare.as(dash).life()).toBe(LIFE - SNATCH);

    // Opponent Hyper Driver does not arm controller static.
    const oppHd = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        arena: [hyperDriverRed],
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [mbrioBaseCortex],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    expect(chestDefense(oppHd, oppHd.as(dash).id)).toBe(0);

    const a1 = mbrioBaseCortex.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.staticKind).toBe("continuous");
    expect(a1.condition).toMatchObject({
      type: "control-object",
      filter: { name: "Hyper Driver" },
    });
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount: 2,
      duration: "permanent",
    });
    expect(mbrioBaseCortex.base.keywords?.some((k) => k.name === "guardwell")).toBe(true);
    expect(mbrioBaseCortex.base.numeric.defense).toBe(0);
  });
});
