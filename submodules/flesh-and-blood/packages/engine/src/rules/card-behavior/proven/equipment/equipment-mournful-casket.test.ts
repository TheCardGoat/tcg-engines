import { typeBoxTokens } from "@tcg/flesh-and-blood-types";
/**
 * PEN153 Mournful Casket — Necromancer Chest d1 Temper.
 *
 * Printed:
 *   If an ally has been put into your graveyard this turn, this gets +1{d}.
 *   Temper
 *
 * Reasoning (case-by-case; no batch script):
 * 1. Continuous while-condition: "has been put into your GY this turn" is an
 *    event window, not current GY occupancy. Model uses zone-count + per:turn
 *    (history.moves into graveyard this turn with Ally LKI).
 * 2. Ally is a subtype (FAB_SUBTYPES) — filter must use subtypes:["Ally"], not
 *    types:["Ally"] (types vocab is Action/Equipment/Token/…).
 * 3. Prior duration this-turn was wrong for a continuous static (would drop
 *    EOT while the this-turn history fact still holds mid-turn logic / would
 *    not re-layer cleanly) — fixed to permanent re-eval like lignum / raw-meat.
 * 4. Pre-seeded Ally in GY (empty history this turn) must NOT give +1{d}.
 * 5. Kill a non-token Ally this turn (Limpit, Hop-a-Long in arena) → +1{d}.
 *    Token allies cease to exist (do not enter GY) and cannot prove the gate.
 * 6. Temper: base d1 defend → destroy; with +1{d} (d2) → −1 counter, survives.
 *
 * Status: ✅ ally-GY this turn +1{d}; pre-seeded GY no buff; Temper; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { mournfulCasket } from "../../../../../../cards/src/cards/equipment/mournful-casket.ts";
import { limpitHopALongYellow } from "../../../../../../cards/src/cards/actions/limpit-hop-a-long.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const SNATCH = 4;
const LIFE = 20;

function chestDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.chest.find(
    (id) => state.objects[id]?.canonicalId === mournfulCasket.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("mournful-casket (PEN153)", () => {
  it("proven: seats at base d1 with no ally-to-GY this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [mournfulCasket],
        life: LIFE,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("chest")).toContain(mournfulCasket.canonicalId);
    expect(mournfulCasket.base.numeric.defense).toBe(1);
    expect(chestDefense(game, Bravo.id)).toBe(1);
  });

  it("core mechanic: Ally put into GY this turn → +1{d} (d2)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: LIFE,
        chest: [mournfulCasket],
        // Non-token Action Ally (health 1) so destroy puts it into GY.
        arena: [limpitHopALongYellow],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(bravo);
    expect(chestDefense(game, Defender.id)).toBe(1);

    // Attack the Ally (health 1); Snatch 4 destroys it → GY this turn.
    const allyId = Defender.findCardInZone("arena", limpitHopALongYellow);
    game.as(dash).play(snatchRed, { target: allyId });
    game.helpers.resolveRestOfCombat();

    expect(Defender.zone("arena")).not.toContain(limpitHopALongYellow.canonicalId);
    expect(Defender.zone("graveyard")).toContain(limpitHopALongYellow.canonicalId);
    expect(chestDefense(game, Defender.id)).toBe(2);
  });

  it("core mechanic: same-turn Ally-GY then defend d2; Temper keeps seat at −1{d}", () => {
    // Two attacks same turn: kill ally (no defend), then attack hero and
    // defend with casket. Second attack needs AP after first combat.
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 8,
      },
      {
        hero: bravo,
        life: LIFE,
        chest: [mournfulCasket],
        arena: [limpitHopALongYellow],
        deck: 8,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(bravo);
    const casketId = Defender.findCardInZone("chest", mournfulCasket);
    const allyId = Defender.findCardInZone("arena", limpitHopALongYellow);

    game.as(dash).play(snatchRed, { target: allyId });
    game.helpers.resolveRestOfCombat();
    expect(Defender.zone("graveyard")).toContain(limpitHopALongYellow.canonicalId);
    expect(chestDefense(game, Defender.id)).toBe(2);

    // Second attack this turn at hero; defend with casket for d2.
    game.as(dash).attackWith(snatchRed);
    Defender.defendWith(mournfulCasket);
    // Continuous must still apply while defending on the combat chain.
    const defendingId = game
      .getState()
      .containers.zonesByPlayerId[Defender.id]!.combatChain.find(
        (id) => game.getState().objects[id]?.canonicalId === mournfulCasket.canonicalId,
      );
    expect(defendingId).toBeDefined();
    const defRec = game.getState().objects[defendingId!]!;
    expect(
      buildFabRulesView(game.getState()).object({
        instanceId: defRec.instanceId,
        incarnation: defRec.incarnation,
      })?.current.numeric.defense,
    ).toBe(2);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − d2 = 2 damage; Temper on d2 → −1 counter, stays (defense was >1).
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("chest")).toContain(mournfulCasket.canonicalId);
    expect(game.objectState(casketId)?.defenseCounterTotal).toBe(-1);
  });

  it("boundaries: pre-seeded Ally in GY does not count; non-Ally GY no buff; bare Temper destroy", () => {
    // Ally already in GY at start (no this-turn move history) → base d1.
    const preSeeded = FabTestEngine.start(
      {
        hero: bravo,
        chest: [mournfulCasket],
        graveyard: [limpitHopALongYellow],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(preSeeded.as(bravo).zone("graveyard")).toContain(limpitHopALongYellow.canonicalId);
    expect(chestDefense(preSeeded, preSeeded.as(bravo).id)).toBe(1);

    // Non-Ally put into GY this turn (Snatch resolves to GY after attack) does not buff.
    const nonAlly = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: LIFE,
        chest: [mournfulCasket],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    gameAttackAndPass(nonAlly);
    // Attacker's snatch ends in their GY, not defender's — defender still d1.
    expect(chestDefense(nonAlly, nonAlly.as(bravo).id)).toBe(1);

    // Bare d1 Temper: defend → destroy.
    const temperBare = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [mournfulCasket],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = temperBare.as(bravo);
    temperBare.as(dash).attackWith(snatchRed);
    Defender.defendWith(mournfulCasket);
    temperBare.helpers.resolveRestOfCombat();
    // Snatch 4 − d1 = 3; Temper d1 → destroy.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
    expect(Defender.zone("chest")).not.toContain(mournfulCasket.canonicalId);
    expect(Defender.zone("graveyard")).toContain(mournfulCasket.canonicalId);
  });

  it("model guard: continuous zone-count Ally GY per-turn → +1{d} permanent; Temper d1", () => {
    const a1 = mournfulCasket.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.staticKind).toBe("continuous");
    expect(a1.condition).toMatchObject({
      type: "zone-count",
      zone: "graveyard",
      player: "controller",
      filter: { typeBox: { subtypes: ["Ally"] } },
      comparison: { op: "gte", value: 1 },
      per: "turn",
    });
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount: 1,
      target: { selector: "self" },
      duration: "permanent",
    });
    expect(mournfulCasket.base.keywords?.some((k) => k.name === "temper")).toBe(true);
    expect(mournfulCasket.base.numeric.defense).toBe(1);
    expect(typeBoxTokens(mournfulCasket.base.typeBox)).toEqual(
      expect.arrayContaining(["Necromancer", "Equipment", "Chest"]),
    );
  });
});

function gameAttackAndPass(game: ReturnType<typeof FabTestEngine.start>): void {
  game.as(dash).attackWith(snatchRed);
  game.helpers.resolveRestOfCombat();
}
