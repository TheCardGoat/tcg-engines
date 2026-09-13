/**
 * AHA005 Reverent Rerebrace — Warrior Arms d2 Temper.
 *
 * Printed:
 *   If you would sharpen a Zenith Blade, instead you may pay {r} and destroy
 *   this. If you do, sharpen it an additional time.
 *   Temper
 *
 * Reasoning (hand-authored; case-by-case — structural flaws found):
 * 1. Prior model used continuous conditional + has-status
 *    "would-sharpen-zenith-blade" with instead:true. That status is never
 *    stamped by the engine, so the ability was dead. Continuous corpus also
 *    rejected the optional+then shape.
 * 2. CR "instead" language is a true replacement on the sharpen event, not a
 *    fake status gate. proposeSharpen now emits a replaceable `sharpen` event
 *    (count = total +1{p} counters); the reducer applies counters + status.
 * 3. Remodel: static continuous replacement replacing name "sharpen" on
 *    subject name "Zenith Blade" for the controller. Modification: optional
 *    pay 1{r} + destroy self; if taken, +1 additional sharpen (count +1).
 * 4. Parser artifact: keywords listed a bare "sharpen" entry — that is body
 *    glossary bolding, not a resolution Sharpen keyword on the equipment.
 * 5. Controller explicitly accepts or declines the optional replacement when
 *    they have ≥1{r} and the arms remain seated.
 * 6. Broke (0{r}): replacement does not apply → base 1 counter, arms stay.
 * 7. Non-Zenith sword: name filter fails → base 1 counter, arms stay.
 * 8. Temper d2: first defend → −1{d} counter, seat remains.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, dawnblade } from "../../../fixtures.ts";
import { reverentRerebrace } from "../../../../../../cards/src/cards/equipment/reverent-rerebrace.ts";
import { zenithBlade } from "../../../../../../cards/src/cards/weapons/zenith-blade.ts";
import { sharpInclineRed } from "../../../../../../cards/src/cards/actions/sharp-incline.ts";

const LIFE = 20;
const SNATCH = 4;
const ARMS_D = 2;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean } = {},
): void {
  const acceptOptional = opts.acceptOptional ?? true;
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: acceptOptional },
        },
      });
      continue;
    }
    if (decision?.kind === "option") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "option",
            optionIds: acceptOptional ? decision.options.map((option) => option.id) : [],
          },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      // Prefer Zenith Blade when sharpening / weapon targets.
      const zenith = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === zenithBlade.canonicalId,
      );
      const pick = zenith ?? decision.candidates[0];
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
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

function weaponId(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  card: { canonicalId: string },
): string {
  const state = game.getState();
  const _player = state.players[playerId]!;
  const id =
    state.containers.zonesByPlayerId[playerId]!.weapon1.find(
      (iid) => state.objects[iid]?.canonicalId === card.canonicalId,
    ) ??
    state.containers.zonesByPlayerId[playerId]!.weapon2.find(
      (iid) => state.objects[iid]?.canonicalId === card.canonicalId,
    );
  if (!id) throw new Error(`weapon ${card.canonicalId} not seated`);
  return id;
}

describe("reverent-rerebrace (AHA005)", () => {
  it("core mechanic: sharpen Zenith Blade with {r} → pay 1, destroy arms, +2{p} counters", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [zenithBlade],
        arms: [reverentRerebrace],
        hand: [sharpInclineRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const zenithId = weaponId(game, Bravo.id, zenithBlade);

    expect(Bravo.zone("arms")).toContain(reverentRerebrace.canonicalId);
    expect(game.objectState(zenithId)?.powerCounterTotal ?? 0).toBe(0);

    Bravo.play(sharpInclineRed);
    drain(game);

    // Pay 1{r}, destroy rerebrace, sharpen base + additional = 2 counters.
    expect(game.getState().players[Bravo.id]!.resourcePoints).toBe(1);
    expect(Bravo.zone("arms")).not.toContain(reverentRerebrace.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(reverentRerebrace.canonicalId);
    expect(game.objectState(zenithId)?.powerCounterTotal ?? 0).toBe(2);
    expect(game.objectState(zenithId)?.sharpenedThisTurn).toBe(true);
    expect(game.committedEvents().some((e) => e.name === "sharpen")).toBe(true);
  });

  it("boundaries: 0{r} keeps base sharpen; non-Zenith no extra; Temper d2; model", () => {
    // Broke: cannot pay → replacement does not apply → 1 counter, arms stay.
    const broke = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [zenithBlade],
        arms: [reverentRerebrace],
        hand: [sharpInclineRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const BrokeBravo = broke.as(bravo);
    const brokeZenith = weaponId(broke, BrokeBravo.id, zenithBlade);
    BrokeBravo.play(sharpInclineRed);
    drain(broke);
    expect(broke.objectState(brokeZenith)?.powerCounterTotal ?? 0).toBe(1);
    expect(BrokeBravo.zone("arms")).toContain(reverentRerebrace.canonicalId);
    expect(broke.getState().players[BrokeBravo.id]!.resourcePoints).toBe(0);

    // Non-Zenith sword (Dawnblade): name filter fails → 1 counter, arms stay.
    const other = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        arms: [reverentRerebrace],
        hand: [sharpInclineRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const OtherBravo = other.as(bravo);
    const dawnId = weaponId(other, OtherBravo.id, dawnblade);
    OtherBravo.play(sharpInclineRed);
    drain(other);
    expect(other.objectState(dawnId)?.powerCounterTotal ?? 0).toBe(1);
    expect(OtherBravo.zone("arms")).toContain(reverentRerebrace.canonicalId);
    expect(other.getState().players[OtherBravo.id]!.resourcePoints).toBe(3);

    // Temper: first defend d2 → −1 defense counter, remains equipped.
    const temper = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [reverentRerebrace],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = temper.as(dash);
    const armsId = temper
      .getState()
      .containers.zonesByPlayerId[Defender.id]!.arms.find(
        (id) => temper.getState().objects[id]?.canonicalId === reverentRerebrace.canonicalId,
      )!;
    temper.as(bravo).attackWith(snatchRed);
    Defender.defend(reverentRerebrace);
    drain(temper);
    temper.helpers.resolveRestOfCombat();
    expect(temper.objectState(armsId)?.defenseCounterTotal).toBe(-1);
    expect(Defender.zone("arms")).toContain(reverentRerebrace.canonicalId);
    // Snatch 4 − d2 = 2 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - ARMS_D));

    // Model surface: Temper only; continuous replacement not fake status.
    expect(reverentRerebrace.base.keywords?.some((k) => k.name === "temper")).toBe(true);
    expect(reverentRerebrace.base.keywords?.some((k) => k.name === "sharpen")).toBe(false);
    const ability = reverentRerebrace.base.abilities?.[0];
    expect(ability?.kind).toBe("static");
    if (ability?.kind === "static") {
      expect(ability.effect?.type).toBe("replacement");
      if (ability.effect?.type === "replacement") {
        expect(ability.effect.replaces.name).toBe("sharpen");
        expect(
          typeof ability.effect.replaces.subject === "object" &&
            ability.effect.replaces.subject !== null &&
            "name" in ability.effect.replaces.subject &&
            ability.effect.replaces.subject.name,
        ).toBe("Zenith Blade");
      }
    }
  });
});
