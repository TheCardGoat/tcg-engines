/**
 * CR Chapter 7 — comprehensive public combat specification.
 *
 * Battle-tests the complete happy path plus priority, declaration, reaction,
 * damage, trigger, continuation, decision, and restore edge cases through
 * public player commands and real catalog cards.
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { FabMatchRuntime } from "../../../runtime.ts";
import {
  bravo,
  creepRed,
  dawnblade,
  dash,
  nimblismBlue,
  regurgitatingSlogRed,
  scarForAScarRed,
  shimmersOfSilverBlue,
  sigilOfSolaceRed,
  sinkBelow,
  snatchRed,
  tigerEyeReflexBlue,
  unmovableRed,
} from "../../fixtures.ts";
import { lungingPressBlue } from "../../../../../cards/src/cards/attack-reactions/lunging-press.ts";
import { browbeatBlue } from "../../../../../cards/src/cards/actions/browbeat.ts";
import { dodgeBlue } from "../../../../../cards/src/cards/defense-reactions/dodge.ts";
import { woundingBlowRed } from "../../../../../cards/src/cards/actions/wounding-blow.ts";
import { headJabBlue } from "../../../../../cards/src/cards/actions/head-jab.ts";
import { bastionOfUnity } from "../../../../../cards/src/cards/equipment/bastion-of-unity.ts";
import { kabutoOfImperialAuthority } from "../../../../../cards/src/cards/equipment/kabuto-of-imperial-authority.ts";
import { quickdodgeFlexors } from "../../../../../cards/src/cards/equipment/quickdodge-flexors.ts";
import { isolateRed } from "../../../../../cards/src/cards/actions/isolate.ts";
import { glaringImpactRed } from "../../../../../cards/src/cards/actions/glaring-impact.ts";
import { uzuri } from "../../../../../cards/src/cards/heroes/uzuri.ts";
import { overTheTopRed } from "../../../../../cards/src/cards/actions/over-the-top.ts";
import { theSuspenseIsKillingMeBlue } from "../../../../../cards/src/cards/instants/the-suspense-is-killing-me.ts";
import { feignDeathYellow } from "../../../../../cards/src/cards/instants/feign-death.ts";
import { flitteringChargeRed } from "../../../../../cards/src/cards/actions/flittering-charge.ts";
import { dreadTriptychBlue } from "../../../../../cards/src/cards/actions/dread-triptych.ts";
import { volticBoltYellow } from "../../../../../cards/src/cards/actions/voltic-bolt.ts";
import { doubleStrikeRed } from "../../../../../cards/src/cards/actions/double-strike.ts";
import { stampAuthorityBlue } from "../../../../../cards/src/cards/actions/stamp-authority.ts";
import { attackTriggerTrainer } from "../../test-trainers.ts";
import { amuletOfHavencallBlue } from "../../../../../cards/src/cards/actions/amulet-of-havencall.ts";
import { rallyTheRearguardBlue } from "../../../../../cards/src/cards/actions/rally-the-rearguard.ts";
import { exudeConfidenceRed } from "../../../../../cards/src/cards/actions/exude-confidence.ts";
import { surgingMilitiaRed } from "../../../../../cards/src/cards/actions/surging-militia.ts";
import { inertiaTrapRed } from "../../../../../cards/src/cards/defense-reactions/inertia-trap.ts";
import { flicFlakBlue } from "../../../../../cards/src/cards/defense-reactions/flic-flak.ts";
import { whelmingGustwaveBlue } from "../../../../../cards/src/cards/actions/whelming-gustwave.ts";
import { prism } from "../../../../../cards/src/cards/heroes/prism.ts";
import { luminaris } from "../../../../../cards/src/cards/weapons/luminaris.ts";
import { spectralShield } from "../../../../../cards/src/cards/tokens/spectral-shield.ts";
import { flashBoltRed } from "../../../../../cards/src/cards/instants/flash-bolt.ts";
import { boneBasher } from "../../../../../cards/src/cards/weapons/bone-basher.ts";
import { dispatchTestCommand } from "../../../testing/test-command.ts";

const manualPriority = {
  autoPassPriority: false,
  autoPitch: false,
  pitchStack: "manual",
} as const;

function resolveUzuriExampleDecisions(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let index = 0; index < 32; index += 1) {
    const decision = game.getState().decision;
    if (!decision) {
      if (game.getState().rulesStack.length === 0) return;
      game.passBoth();
      continue;
    }
    if (decision.kind === "entity-target") {
      const candidate =
        decision.candidates.find((entry) => /snatch/i.test(entry.label)) ?? decision.candidates[0];
      if (!candidate) return;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [candidate.instanceId] },
        },
      });
      continue;
    }
    if (!game.answerForcedDecision()) return;
  }
}

describe("CR 1.11 / CR 7 — comprehensive combat", () => {
  it("7.0–7.7: traverses the complete combat chain in priority order", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [woundingBlowRed], deck: 6 },
      { hero: dash, life: 20, hand: [browbeatBlue], deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Layer — CR 7.1.2–7.1.3.
    Bravo.play(woundingBlowRed, { target: Dash.id });
    expect(game.combat()?.step).toBe("layer");
    expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
    expect(game.priority().id).toBe(Bravo.id);
    Bravo.pass();
    expect(game.priority().id).toBe(Dash.id);
    Dash.pass();

    // Attack — CR 7.2.4–7.2.5.
    expect(game.combat()?.step).toBe("attack");
    expect(game.priority().id).toBe(Bravo.id);
    Bravo.pass();
    expect(game.priority().id).toBe(Dash.id);
    Dash.pass();

    // Defend declaration is a no-priority game process. The following Defend
    // window starts with the turn-player — CR 7.3.2–7.3.4.
    expect(game.combat()?.step).toBe("defend");
    expect(game.getState().priority).toBeNull();
    expect(game.combat()?.defenseDeclarationPending).toBe(true);
    Dash.defendWith(browbeatBlue);
    expect(game.combat()?.defenseDeclarationPending).toBe(false);
    expect(game.priority().id).toBe(Bravo.id);
    Bravo.pass();
    expect(game.priority().id).toBe(Dash.id);
    Dash.pass();

    // Reaction — CR 7.4.2–7.4.3.
    expect(game.combat()?.step).toBe("reaction");
    expect(game.priority().id).toBe(Bravo.id);
    Bravo.pass();
    expect(game.priority().id).toBe(Dash.id);
    Dash.pass();

    // Damage is applied before Damage-step priority — CR 7.5.2–7.5.4.
    expect(game.combat()?.step).toBe("damage");
    expect(Dash.life()).toBe(19);
    expect(game.priority().id).toBe(Bravo.id);
    Bravo.pass();
    expect(game.priority().id).toBe(Dash.id);
    Dash.pass();

    // Resolution grants priority; Close does not — CR 7.6.2–7.7.7.
    expect(game.combat()?.step).toBe("resolution");
    expect(game.priority().id).toBe(Bravo.id);
    Bravo.pass();
    expect(game.priority().id).toBe(Dash.id);
    Dash.pass();
    expect(game.combat()).toBeNull();
    expect(game.getState().priority).toMatchObject({
      holderPlayerId: Bravo.id,
      kind: "action",
      combatStep: null,
    });
    expect(Bravo.zone("graveyard")).toContain(woundingBlowRed.canonicalId);
    expect(Dash.zone("graveyard")).toContain(browbeatBlue.canonicalId);
  });

  it("1.11.5 / 7.0.1a: a non-turn-player Instant interrupts combat and resets priority", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [woundingBlowRed], deck: 6 },
      { hero: dash, life: 17, hand: [sigilOfSolaceRed], deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(woundingBlowRed, { target: Dash.id });
    game.advanceCombatTo("attack");
    Bravo.pass();
    expect(Dash.hasPriority()).toBe(true);

    Dash.play(sigilOfSolaceRed);
    expect(Dash.hasPriority()).toBe(true);
    expect(Dash.zone("stack")).toContain(sigilOfSolaceRed.canonicalId);

    game.passBoth();
    expect(Dash.life()).toBe(20);
    expect(Dash.zone("graveyard")).toContain(sigilOfSolaceRed.canonicalId);
    expect(game.combat()?.step).toBe("attack");
    expect(Bravo.hasPriority()).toBe(true);
  });

  it("7.3.2–7.3.4: declaration has no priority and pass means no defenders", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [woundingBlowRed], deck: 6 },
      { hero: dash, hand: [sigilOfSolaceRed], deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(woundingBlowRed);

    expect(game.getState().priority).toBeNull();
    expect(game.combat()).toMatchObject({
      step: "defend",
      defenseDeclarationPending: true,
    });
    expect(Bravo.expectFailure({ move: "pass", payload: {} }).errorCode).toBe(
      "not_priority_player",
    );
    const sigilId = Dash.findCardInZone("hand", sigilOfSolaceRed);
    expect(
      Dash.expectFailure({ move: "begin-play", payload: { instanceId: sigilId } }).errorCode,
    ).toBe("not_priority_player");

    Dash.pass();
    expect(
      Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat(),
    ).toEqual([]);
    expect(game.combat()?.defenseDeclarationPending).toBe(false);
    expect(Bravo.hasPriority()).toBe(true);
    expect(Dash.expectFailure({ move: "defend", payload: { instanceIds: [] } }).errorCode).toBe(
      "defense_already_declared",
    );
  });

  it("7.3.2: pass and an explicit empty declaration produce the same combat state", () => {
    const startAttack = () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed], deck: 6 },
        { hero: dash, deck: 6 },
        manualPriority,
      );
      game.as(bravo).attackWith(woundingBlowRed);
      return game;
    };
    const explicit = startAttack();
    const passed = startAttack();

    const explicitResult = explicit.as(dash).defendWith([]);
    const passedResult = passed.as(dash).pass();

    expect(passed.combat()).toEqual(explicit.combat());
    expect(passed.getState().priority).toEqual(explicit.getState().priority);
    expect(passedResult.playerLogs).toEqual(explicitResult.playerLogs);
    expect(passed.as(bravo).hasPriority()).toBe(true);
  });

  it("7.3: defender may declare multiple defending cards from hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    const Dash = game.as(dash);
    const stackBeforeDefend = Dash.zone("stack");
    Dash.blockWith([nimblismBlue, snatchRed]);
    expect(
      Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat(),
    ).toHaveLength(2);
    expect(Dash.zone("combatChain")).toEqual(
      expect.arrayContaining([nimblismBlue.canonicalId, snatchRed.canonicalId]),
    );
    expect(Dash.zone("stack")).toEqual(stackBeforeDefend);
    game.helpers.resolveRestOfCombat();
    // 4 − (2+2) = 0
    expect(Dash.life()).toBe(20);
  });

  it("7.3: a structured ambush card may be declared from Arsenal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, arsenal: [tigerEyeReflexBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const ambushId = Dash.findCardInZone("arsenal", tigerEyeReflexBlue);

    game.as(bravo).attackWith(snatchRed);
    Dash.exec({ move: "defend", payload: { instanceIds: [ambushId] } });

    expect(Dash.zone("combatChain")).toContain(tigerEyeReflexBlue.canonicalId);
    expect(game.combat()?.activeLink?.defendingOrigins[ambushId]).toEqual({ kind: "arsenal" });
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "triggered",
      abilityId: "6tj9kHRWLHbCbF6mG6tDh:createCrouchingTigerOnDefend",
    });
  });

  it("7.4 / 7.5: attack and defense reactions resolve for their controllers before damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [woundingBlowRed, lungingPressBlue], deck: 6 },
      { hero: dash, life: 20, hand: [dodgeBlue], deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(woundingBlowRed);

    // Defense Reactions are played during Reaction; they are not ordinary
    // hand defenders in the Defend Step — CR 7.3.2a / 7.4.2b.
    const rejectedBlock = Dash.expectBlockRejected(dodgeBlue);
    expect(rejectedBlock.accepted).toBe(false);
    expect(Dash.zone("hand")).toContain(dodgeBlue.canonicalId);
    Dash.defendWith([]);
    game.passBoth();
    expect(game.combat()?.step).toBe("reaction");

    // Only the active player may act — CR 1.11.2.
    const dodgeId = Dash.findCardInZone("hand", dodgeBlue);
    expect(
      Dash.expectFailure({ move: "begin-play", payload: { instanceId: dodgeId } }).errorCode,
    ).toBe("not_priority_player");

    // The attack controller plays the Attack Reaction and regains priority.
    const attackId = Bravo.findCardInZone("combatChain", woundingBlowRed);
    Bravo.play(lungingPressBlue, { targetInstanceId: attackId });
    expect(Bravo.hasPriority()).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    expect(Bravo.hasPriority()).toBe(true);

    // The defending hero then receives priority and resolves Dodge as a
    // defending card on the active chain link — CR 7.4.2d.
    Bravo.pass();
    Dash.play(dodgeBlue);
    expect(Dash.hasPriority()).toBe(true);
    game.passBoth();
    expect(
      Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat(),
    ).toEqual([dodgeId]);
    expect(Dash.zone("combatChain")).toContain(dodgeBlue.canonicalId);

    // CR 7.5.2 applies 5 - 2 = 3 damage before CR 7.5.3 priority.
    expect(Bravo.hasPriority()).toBe(true);
    game.passBoth();
    expect(game.combat()?.step).toBe("damage");
    expect(Dash.life()).toBe(17);
    expect(Bravo.hasPriority()).toBe(true);

    game.helpers.resolveRestOfCombat();
    expect(Bravo.zone("graveyard")).toContain(woundingBlowRed.canonicalId);
    expect(Dash.zone("graveyard")).toContain(dodgeBlue.canonicalId);
  });

  it("7.4 / 7.5: defense reaction may be played in the reaction step (pay cost with pitch)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        life: 20,
        // Unmovable cost 3: pitch three blues (3 each would over-pay; need total pitch ≥ 3).
        // Use three red pitch-1 cards? Unmovable is red pitch 1. Use three nimblism blue → RP 9.
        hand: [unmovableRed, nimblismBlue],
        deck: 6,
        // Cost-insufficiency path: opt out of the floating-resource default.
        resourcePoints: 0,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    // No hand block; advance to reaction.
    game.as(dash).defendWith([]);
    game.passBoth();
    expect(game.combat()?.step).toBe("reaction");

    // Reaction step priority starts with the turn player (CR 7.4.2).
    expect(game.as(bravo).hasPriority()).toBe(true);
    game.as(bravo).pass();
    expect(game.as(dash).hasPriority()).toBe(true);
    // Pay 3 for Unmovable (def 7) by pitching Nimblism Blue (pitch 3).
    game.as(dash).play(unmovableRed, { pitch: [nimblismBlue] });
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "card",
      role: "defense-reaction",
    });
    game.passBoth();
    expect(
      Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat().length,
    ).toBe(1);
    expect(game.as(dash).zone("pitch")).toContain(nimblismBlue.canonicalId);
    game.helpers.resolveRestOfCombat();
    // 4 − 7 = 0 damage
    expect(game.as(dash).life()).toBe(20);
  });

  it("WTR215 Sink Below lets its defender decline the optional cycle before becoming a defender", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, hand: [sinkBelow, nimblismBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(snatchRed);
    Dash.defendWith([]);
    game.passBoth();
    Bravo.pass(); // reaction priority passes from attacker to defending hero

    const sinkId = game.findCardInZone(Dash.id, "hand", sinkBelow);
    Dash.exec({ move: "begin-play", payload: { instanceId: sinkId } });
    expect(game.getState().rulesStack).toMatchObject([{ kind: "card", role: "defense-reaction" }]);
    game.passBoth();
    expect(game.getState().decision).toMatchObject({
      kind: "boolean",
      actorId: Dash.id,
      continuation: { kind: "optional-effect" },
    });
    expect(
      Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat(),
    ).toEqual([]);
    expect(Dash.zone("stack")).toContain(sinkBelow.canonicalId);

    const decision = game.getState().decision!;
    Dash.exec({
      move: "answer-decision",
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "boolean", value: false },
      },
    });
    expect(game.getState().decision).toBeNull();
    expect(
      Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat(),
    ).toEqual([sinkId]);
    expect(Dash.zone("hand")).not.toContain(sinkBelow.canonicalId);
    expect(Dash.zone("combatChain")).toContain(sinkBelow.canonicalId);
  });

  it("WTR215 Sink Below skips an impossible optional cycle when no other hand card exists", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, hand: [sinkBelow], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(snatchRed);
    Dash.defendWith([]);
    game.passBoth();
    Bravo.pass();

    const sinkId = game.findCardInZone(Dash.id, "hand", sinkBelow);
    Dash.exec({ move: "begin-play", payload: { instanceId: sinkId } });
    game.passBoth();

    expect(game.getState().decision).toBeNull();
    expect(
      Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat(),
    ).toEqual([sinkId]);
    expect(Dash.zone("combatChain")).toContain(sinkBelow.canonicalId);
  });

  it("WTR215 Sink Below cycles only the selected remaining hand card to deck bottom, then draws one", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [sinkBelow, nimblismBlue, unmovableRed],
        // drawCards pops the top, so this is the expected replacement card.
        deck: [nimblismBlue, snatchRed],
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(snatchRed);
    Dash.defendWith([]);
    game.passBoth();
    Bravo.pass();

    const sinkId = game.findCardInZone(Dash.id, "hand", sinkBelow);
    const selectedId = game.findCardInZone(Dash.id, "hand", unmovableRed);
    Dash.exec({ move: "begin-play", payload: { instanceId: sinkId } });
    game.passBoth();
    const optionalDecision = game.getState().decision!;
    Dash.exec({
      move: "answer-decision",
      payload: {
        decisionId: optionalDecision.decisionId,
        stateVersion: optionalDecision.stateVersion,
        answer: { kind: "boolean", value: true },
      },
    });
    expect(game.getState().decision).toMatchObject({
      kind: "entity-target",
      continuation: { kind: "effect-resolution" },
    });
    const currentTargetDecision = game.getState().decision;
    if (currentTargetDecision?.kind !== "entity-target")
      throw new Error("Expected card selection.");
    expect(currentTargetDecision.candidates.map((candidate) => candidate.instanceId)).toContain(
      selectedId,
    );
    expect(currentTargetDecision.candidates.map((candidate) => candidate.instanceId)).not.toContain(
      sinkId,
    );
    expect(Dash.zone("hand")).toContain(unmovableRed.canonicalId);
    const targetDecision = structuredClone(currentTargetDecision);
    const restored = structuredClone(game.getState());
    Dash.exec({
      move: "answer-decision",
      payload: {
        decisionId: targetDecision.decisionId,
        stateVersion: targetDecision.stateVersion,
        answer: { kind: "entity-target", instanceIds: [selectedId] },
      },
    });
    expect(Dash.zone("deck")[0]).toBe(unmovableRed.canonicalId);
    expect(Dash.zone("hand")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("hand")).not.toContain(unmovableRed.canonicalId);
    expect(Dash.zone("hand")).not.toContain(sinkBelow.canonicalId);
    expect(
      Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat(),
    ).toEqual([sinkId]);
    expect(Dash.zone("combatChain")).toContain(sinkBelow.canonicalId);

    const restoredRuntime = new FabMatchRuntime(restored);
    expect(
      dispatchTestCommand(restoredRuntime, "answer-decision", Dash.id, {
        decisionId: targetDecision.decisionId,
        stateVersion: targetDecision.stateVersion,
        answer: { kind: "entity-target", instanceIds: [selectedId] },
      }).accepted,
    ).toBe(true);
    expect(restoredRuntime.getState()).toEqual(game.getState());
  });

  it("7.5.2a / 7.5.5: a hit creates its triggered layer before combat reaches Resolution", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 8 },
      { hero: dash, life: 20, deck: 8 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    Dash.defendWith([]);
    game.passBoth();
    game.passBoth();

    expect(game.combat()?.step).toBe("damage");
    expect(Dash.life()).toBe(16);
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "triggered",
      abilityId: "PHktCwKzLmBMwmCBwb7Cw:drawOnHit",
    });

    const handBeforeTrigger = Bravo.handCount();
    game.passBoth();
    expect(Bravo.handCount()).toBe(handBeforeTrigger + 1);
    expect(game.combat()?.step).toBe("damage");

    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();
  });

  it("7.6.2 / 7.6.3a: go again opens the next attack layer without closing the combat chain", () => {
    const game = FabTestEngine.start(
      { hero: bravo, life: 10, hand: [scarForAScarRed, woundingBlowRed], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(scarForAScarRed);
    game.advanceCombatTo("resolution");
    expect(game.combat()).toMatchObject({
      open: true,
      step: "resolution",
      chainLinkNumber: 1,
    });
    expect(Bravo.hasPriority()).toBe(true);

    Bravo.play(woundingBlowRed, { target: Dash.id });
    expect(game.combat()).toMatchObject({
      open: true,
      step: "layer",
      chainLinkNumber: 1,
    });
    expect(Bravo.hasPriority()).toBe(true);
    expect(Bravo.zone("combatChain")).toContain(scarForAScarRed.canonicalId);
    expect(Bravo.zone("stack")).toContain(woundingBlowRed.canonicalId);

    game.advanceCombatTo("attack");
    expect(game.combat()).toMatchObject({
      open: true,
      step: "attack",
      chainLinkNumber: 2,
    });
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();
    expect(Dash.life()).toBe(12);
  });

  it("7.5.2: damage equals power minus total defense", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).blockWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(18);
  });
});

describe("CR 7 — examples from the Comprehensive Rules", () => {
  it("7.0.1b example — Double Strike leaves a Ninja chain link after the attack card is banished", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [doubleStrikeRed], deck: 6 },
      { hero: dash, deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    Bravo.attackWith(doubleStrikeRed);
    const attackId = game.combat()!.activeLink!.activeAttack.sourceObjectId;
    game.advanceCombatTo("resolution");
    for (let index = 0; index < 12 && game.getState().decision?.kind !== "boolean"; index += 1) {
      if (game.getState().decision?.continuation.kind === "turn-arsenal") break;
      if (!game.answerForcedDecision()) game.passBoth();
    }

    expect(Bravo.zone("banished")).toContain(doubleStrikeRed.canonicalId);
    const resolvedLink = game
      .committedEvents()
      .filter((event) => event.name === "chain-link-resolve")
      .find((event) => event.data.attack.instanceId === attackId);
    expect(resolvedLink?.data.attack.current.typeBox.supertypes).toContain("Ninja");
  });

  it("7.0.1c example — Flittering Charge counts an instant played from Attack through Damage on its own chain link", () => {
    const withInstant = FabTestEngine.start(
      { hero: bravo, life: 17, hand: [flitteringChargeRed, sigilOfSolaceRed], deck: 6 },
      { hero: dash, deck: 6 },
      manualPriority,
    );
    const Bravo = withInstant.as(bravo);
    Bravo.play(flitteringChargeRed, { target: withInstant.as(dash).id });
    withInstant.passBoth();
    expect(withInstant.combat()!.step).toBe("attack");
    Bravo.play(sigilOfSolaceRed);
    withInstant.passBoth();
    withInstant.advanceCombatTo("resolution");
    expect(Bravo.actionPoints()).toBe(1);

    const withoutInstant = FabTestEngine.start(
      { hero: bravo, hand: [flitteringChargeRed], deck: 6 },
      { hero: dash, deck: 6 },
      manualPriority,
    );
    withoutInstant.as(bravo).attackWith(flitteringChargeRed);
    withoutInstant.helpers.resolveRestOfCombat();
    expect(withoutInstant.as(bravo).actionPoints()).toBe(0);
  });

  it("7.1.3a example — Uzuri replaces the active attack but preserves its attack-target", () => {
    const game = FabTestEngine.start(
      { hero: uzuri, hand: [creepRed, snatchRed], deck: 6, actionPoints: 1 },
      { hero: dash, deck: 6 },
      manualPriority,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);
    const heroId = game.getState().players[Uzuri.id]!.heroCardId!;

    Uzuri.attackWith(creepRed);
    const targetBeforeSwap = game.combat()!.activeLink!.attackTargetRef;
    Dash.defendWith([]);
    game.passBoth();
    Uzuri.exec({
      move: "activate",
      payload: {
        instanceId: heroId,
        ability:
          "QmqN6fJJMnLDjLHKF7g97:oncePerTurnAttackReactionBanishHandFaceDownTurnBanishedWayFaceUpAttackActionCost2LessPutTargetAttackingStealthActiveChainLinkBottomOwnersDeckThenPutBanishedOntoActiveChainLinkAttacking",
      },
    });
    resolveUzuriExampleDecisions(game);

    const link = game.combat()!.activeLink!;
    expect(game.getState().objects[link.activeAttack.sourceObjectId]?.canonicalId).toBe(
      snatchRed.canonicalId,
    );
    expect(link.attackTargetRef).toEqual(targetBeforeSwap);
    expect(Uzuri.zone("deck")[0]).toBe(creepRed.canonicalId);
  });

  it("7.2.3a example — Surging Militia gains power before Inertia Trap's defend event condition is checked", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [surgingMilitiaRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [inertiaTrapRed], deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(surgingMilitiaRed);
    Dash.defendWith([]);
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Dash);
    Dash.play(inertiaTrapRed);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("arena")).toContain("token:inertia");
  });

  it("7.2.3b example — Amulet of Havencall leaves Rally the Rearguard in the deck when it cannot defend", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [theSuspenseIsKillingMeBlue, overTheTopRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        arena: [amuletOfHavencallBlue],
        hand: [nimblismBlue],
        deck: [rallyTheRearguardBlue],
      },
      manualPriority,
    );
    const Dash = game.as(dash);
    // The Suspense Is Killing Me makes the next attack 7{p} — greater than
    // Over the Top's base 6{p} — so its printed conditional overpower holds.
    game.as(bravo).play(theSuspenseIsKillingMeBlue);
    game.helpers.resolveUntilIdle();
    game.as(bravo).attackWith(overTheTopRed);
    Dash.defendWith(nimblismBlue);
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Dash);
    Dash.activate(amuletOfHavencallBlue);
    for (let index = 0; index < 12 && game.getState().rulesStack.length > 0; index += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "entity-target" && decision.candidates[0]) {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "entity-target", instanceIds: [decision.candidates[0].instanceId] },
          },
        });
        continue;
      }
      if (!game.answerForcedDecision()) game.passBoth();
    }

    expect(Dash.zone("deck")).toContain(rallyTheRearguardBlue.canonicalId);
    expect(
      Object.values(game.combat()!.activeLink!.defendingInstanceIdsByTarget).flat(),
    ).toHaveLength(1);
  });

  it("7.2.3b example — already-defending Quickdodge stays one defender at base defense 2", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, legs: [quickdodgeFlexors], resourcePoints: 1, deck: 6 },
      manualPriority,
    );
    const Dash = game.as(dash);
    const quickdodgeId = Dash.findCardInZone("legs", quickdodgeFlexors);
    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(quickdodgeFlexors);
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Dash);
    Dash.activate(quickdodgeFlexors);
    game.passBoth();
    expect(Object.values(game.combat()!.activeLink!.defendingInstanceIdsByTarget).flat()).toEqual([
      quickdodgeId,
    ]);
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(18);
  });

  it("7.2.3c example — two declared cards defend together while a later defense reaction defends alone", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [regurgitatingSlogRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [nimblismBlue, snatchRed, dodgeBlue], deck: 6 },
      manualPriority,
    );
    const Dash = game.as(dash);
    const [nimblismId, snatchId, dodgeId] = Dash.findCardsInZone("hand", [
      nimblismBlue,
      snatchRed,
      dodgeBlue,
    ]);
    game.as(bravo).attackWith(regurgitatingSlogRed);
    Dash.defendWith([nimblismBlue, snatchRed]);
    game.passBoth();
    game.as(bravo).pass();
    Dash.play(dodgeBlue);
    game.passBoth();

    const defendEvents = game
      .committedEvents()
      .filter((event) => event.name === "defend")
      .filter((event) => [nimblismId, snatchId, dodgeId].includes(event.data.object.instanceId));
    const declared = defendEvents.filter((event) =>
      [nimblismId, snatchId].includes(event.data.object.instanceId),
    );
    const reacted = defendEvents.find((event) => event.data.object.instanceId === dodgeId)!;
    expect(declared).toHaveLength(2);
    expect(new Set(declared.map((event) => event.processId)).size).toBe(1);
    expect(reacted.processId).not.toBe(declared[0]!.processId);
  });

  it("7.2.5a example — Head Jab becomes the active attack-card after its attack layer resolves", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [headJabBlue], deck: 6 },
      { hero: dash, deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);

    Bravo.play(headJabBlue, { target: game.as(dash).id });
    expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
    game.passBoth();

    const attackId = game.combat()!.activeLink!.activeAttack.sourceObjectId;
    expect(game.combat()!.step).toBe("attack");
    expect(game.getState().objects[attackId]?.canonicalId).toBe(headJabBlue.canonicalId);
    expect(Bravo.zone("combatChain")).toContain(headJabBlue.canonicalId);
  });

  it("7.2.5b example — Bone Basher's attack-proxy resolves with its weapon source as the active attack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon1: [boneBasher], resourcePoints: 2, deck: 6 },
      { hero: dash, deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const weaponId = Bravo.findCardInZone("weapon1", boneBasher);
    Bravo.activate(boneBasher);

    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "activated",
      role: "attack",
      attackKind: "proxy",
      source: { instanceId: weaponId },
    });
    expect(game.combat()!.step).toBe("layer");

    game.passBoth();
    expect(game.combat()!.activeLink).toMatchObject({
      activeAttack: { kind: "proxy", sourceObjectId: weaponId },
      attackingPlayerId: Bravo.id,
    });
    // The state keeps the physical equipment seated while the active-link
    // reference makes that source attacking; this is the engine's public
    // representation of the proxy/source pair on the chain link.
    expect(Bravo.zone("weapon1")).toContain(boneBasher.canonicalId);
    expect(game.combat()!.activeLink!.attackPower).toBe(4);
  });

  it("7.2.5c example — destroying the sole spectra target clears the attack and closes combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, arena: [shimmersOfSilverBlue], deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const spectraId = Dash.findCardInZone("arena", shimmersOfSilverBlue);

    Bravo.play(snatchRed, { target: spectraId });
    expect(Dash.zone("arena")).not.toContain(shimmersOfSilverBlue.canonicalId);
    expect(Dash.zone("graveyard")).toContain(shimmersOfSilverBlue.canonicalId);
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();
    expect(Dash.life()).toBe(20);
  });

  it("7.2.5c example — Kabuto stops the next opposing weapon attack from becoming attacking", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        weapon1: [dawnblade],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, head: [kabutoOfImperialAuthority], deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    Dash.defendWith(kabutoOfImperialAuthority);
    game.helpers.resolveRestOfCombat();

    const rejected = Bravo.expectFailure({
      move: "activate",
      payload: { instanceId: Bravo.card(dawnblade) },
    });
    expect(rejected.errorCode).toBe("restricted_by_rule");
    expect(game.combat()).toBeNull();
  });

  it("7.2.6a example — Dread Triptych creates separate triggered layers for its two satisfied attack triggers", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismBlue, volticBoltYellow, dreadTriptychBlue],
        actionPoints: 3,
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.play(nimblismBlue);
    game.passBoth();
    Bravo.play(volticBoltYellow, { target: Dash.id });
    game.passBoth();
    expect(Dash.life()).toBe(16);

    Bravo.play(dreadTriptychBlue, { target: Dash.id });
    game.passBoth();
    const attackTriggers =
      game
        .getState()
        .rulesProcess?.pendingTriggers.filter(
          (trigger) =>
            trigger.abilityId ===
              "HtQhWhjqqqtPNWbzNPjPf:whenAttackDreadTriptychIfVePlayedNonAttack" ||
            trigger.abilityId ===
              "HtQhWhjqqqtPNWbzNPjPf:whenAttackDreadTriptychIfVeDealtArcaneDamage",
        ) ?? [];
    expect(attackTriggers).toHaveLength(2);
    expect(new Set(attackTriggers.map((trigger) => trigger.pendingTriggerId)).size).toBe(2);
  });
  it("7.2.7 example — Exude Confidence continues to restrict its defending hero after another target is attacked", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [exudeConfidenceRed, snatchRed], actionPoints: 2, deck: 6 },
      {
        hero: dash,
        arena: [shimmersOfSilverBlue],
        hand: [sigilOfSolaceRed],
        deck: 6,
      },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(exudeConfidenceRed);
    game.advanceCombatTo("resolution");
    Bravo.play(snatchRed, { target: Dash.findCardInZone("arena", shimmersOfSilverBlue) });
    game.passBoth();
    game.helpers.passPriorityTo(Dash);

    const rejection = Dash.expectFailure({
      move: "begin-play",
      payload: { instanceId: Dash.findCardInZone("hand", sigilOfSolaceRed) },
    });
    expect(rejection.errorCode).toBe("restricted_by_rule");
  });
  it("7.3.3 example — overpower rejects a second declared action-card defender", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [theSuspenseIsKillingMeBlue, overTheTopRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], deck: 6 },
      manualPriority,
    );
    // The Suspense Is Killing Me makes the next attack 7{p} — greater than
    // Over the Top's base 6{p} — so its printed conditional overpower holds.
    game.as(bravo).play(theSuspenseIsKillingMeBlue);
    game.helpers.resolveUntilIdle();
    game.as(bravo).attackWith(overTheTopRed);
    const rejection = game.as(dash).expectFailure({
      move: "defend",
      payload: {
        instanceIds: game.as(dash).findCardsInZone("hand", [snatchRed, nimblismBlue]),
      },
    });
    expect(rejection.errorCode).toBe("overpower");
  });
  it("7.3.3a example — declaration order determines whether Flic Flak sees a combo defender next", () => {
    const run = (comboFirst: boolean) => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          hand: [snatchRed, regurgitatingSlogRed],
          actionPoints: 2,
          resourcePoints: 2,
          deck: 6,
        },
        {
          hero: dash,
          life: 20,
          hand: [flicFlakBlue, whelmingGustwaveBlue, snatchRed],
          deck: 6,
        },
        manualPriority,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      Bravo.attackWith(snatchRed);
      Dash.defendWith([]);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Dash);
      Dash.play(flicFlakBlue);
      game.helpers.resolveRestOfCombat();
      // CR 6.6.3a: "the next ... this turn" is both bounded to this turn and
      // consumed by the first matching defend event.
      expect(game.getState().delayedTriggers).toEqual([
        expect.objectContaining({
          policy: {
            kind: "windowed",
            matching: "first",
            expiresAt: { kind: "turn", turnNumber: game.getState().turnNumber },
          },
        }),
      ]);

      Bravo.attackWith(regurgitatingSlogRed);
      Dash.defendWith(
        comboFirst ? [whelmingGustwaveBlue, snatchRed] : [snatchRed, whelmingGustwaveBlue],
      );
      game.helpers.resolveRestOfCombat();
      return Dash.life();
    };

    expect(run(true)).toBe(18);
    expect(run(false)).toBe(17);
  });

  it("7.3.3c example — Bastion of Unity and a hand card share one defend multi-event", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, weapon2: [bastionOfUnity], hand: [nimblismBlue], deck: 6 },
      manualPriority,
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith([bastionOfUnity, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(20);
  });

  it("7.3.3d example boundary — 1v1 has no clockwise Protect declarers after the attacked hero's controller", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      manualPriority,
    );
    game.as(bravo).attackWith(snatchRed);
    expect(game.getState().playerIds).toEqual([game.as(bravo).id, game.as(dash).id]);
    expect(game.combat()!.activeLink!.defendingPlayerId).toBe(game.as(dash).id);
    game.as(dash).defendWith(nimblismBlue);
    expect(
      Object.values(game.combat()!.activeLink!.defendingInstanceIdsByTarget).flat(),
    ).toHaveLength(1);
  });
  it("7.3.3d example boundary — Apocalypse Automaton's multi-hero declaration order is outside the 1v1 engine", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      manualPriority,
    );
    game.as(bravo).attackWith(snatchRed);
    expect(game.getState().playerIds).toHaveLength(2);
    expect(game.combat()!.activeLink!.additionalAttackTargetRefs ?? []).toEqual([]);
  });
  it("7.4.3a example — dominate rejects a hand defense reaction after one hand defender", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [isolateRed], deck: 6 },
      { hero: dash, hand: [nimblismBlue, dodgeBlue], deck: 6 },
      manualPriority,
    );
    const Dash = game.as(dash);
    game.as(bravo).attackWith(isolateRed);
    Dash.defendWith(nimblismBlue);
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Dash);
    const rejection = Dash.expectFailure({
      move: "begin-play",
      payload: { instanceId: Dash.findCardInZone("hand", dodgeBlue) },
    });
    expect(rejection.errorCode).toBe("dominate");
    expect(Dash.zone("hand")).toContain(dodgeBlue.canonicalId);
  });
  it("7.4.5 example — under dominate the first defense reaction resolves and the second fails to resolve", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [isolateRed], deck: 6 },
      { hero: dash, hand: [sinkBelow, dodgeBlue], deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const sinkId = Dash.findCardInZone("hand", sinkBelow);
    const dodgeId = Dash.findCardInZone("hand", dodgeBlue);
    Bravo.attackWith(isolateRed);
    Dash.defendWith([]);
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Dash);
    Dash.play(sinkBelow);
    Dash.play(dodgeBlue);
    game.passBoth();
    game.passBoth();

    expect(Object.values(game.combat()!.activeLink!.defendingInstanceIdsByTarget).flat()).toEqual([
      dodgeId,
    ]);
    expect(Dash.zone("graveyard")).toContain(sinkBelow.canonicalId);
    expect(Dash.zone("combatChain")).not.toContain(sinkBelow.canonicalId);
    expect(sinkId).not.toBe(dodgeId);
  });

  it("7.5.2 example — six power into three plus two defense deals exactly one damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [regurgitatingSlogRed], resourcePoints: 2, deck: 6 },
      { hero: dash, life: 20, hand: [glaringImpactRed, snatchRed], deck: 6 },
      manualPriority,
    );
    game.as(bravo).attackWith(regurgitatingSlogRed);
    game.as(dash).defendWith([glaringImpactRed, snatchRed]);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(19);
  });

  it("7.5.3 example — Feign Death preventing all damage means the attack does not hit", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [scarForAScarRed, snatchRed], actionPoints: 2, deck: 6 },
      { hero: dash, life: 20, hand: [feignDeathYellow], resourcePoints: 1, deck: 6 },
      manualPriority,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(scarForAScarRed);
    Dash.defendWith([]);
    game.advanceCombatTo("damage");
    expect(Dash.life()).toBe(16);
    game.helpers.passPriorityTo(Dash);
    Dash.play(feignDeathYellow);
    game.passBoth();
    game.advanceCombatTo("resolution");

    Bravo.play(snatchRed, { target: Dash.id });
    game.advanceCombatTo("defend");
    Dash.defendWith([]);
    const handBeforeDamage = Bravo.handCount();
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(16);
    expect(Bravo.handCount()).toBe(handBeforeDamage);
    expect(game.getState().players[Bravo.id]!.history.combatChain.lastAttackDidHit).toBe(false);
  });
  it("7.5.3b example — Stamp Authority suppresses an attack-action trigger (CR 6.6.5f)", () => {
    // Stamp Authority (CRU028) is a blanket trigger-restriction: while it is in
    // the arena, attack-action effects don't trigger. Pre-fix the rule was
    // silently dropped in accepted mode (null-target, no latched subject) so it
    // never reached triggerIsPrevented. This firing-trigger probe (an
    // intimidate-on-attack ability) proves the rule is now active: with Stamp
    // Authority the trigger is suppressed, without it the trigger fires.
    const attack = attackTriggerTrainer({
      slug: "fx-stamp-authority-probe",
      effect: { type: "intimidate", target: "opponent" },
      power: 4,
    });

    // WITH Stamp Authority: the attack-action trigger is suppressed → Dash keeps
    // both hand cards, nothing is intimidated to banished.
    const suppressed = FabTestEngine.start(
      { hero: bravo, arena: [stampAuthorityBlue], hand: [attack], deck: 4 },
      { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 4 },
      manualPriority,
    );
    suppressed.as(bravo).attackWith(attack);
    suppressed.helpers.resolveRestOfCombat();
    expect(suppressed.as(dash).handCount()).toBe(2);
    expect(suppressed.as(dash).zone("banished").length).toBe(0);

    // WITHOUT Stamp Authority: the same attack intimidates one card (trigger fires).
    const fired = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 4 },
      { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 4 },
      manualPriority,
    );
    fired.as(bravo).attackWith(attack);
    fired.helpers.resolveRestOfCombat();
    expect(fired.as(dash).zone("banished").length).toBe(1);
  });
  it("7.7.4a example — destroying an attacking Spectral Shield before damage advances combat to Close", () => {
    const game = FabTestEngine.start(
      { hero: prism, weapon1: [luminaris], arena: [spectralShield], deck: 6 },
      {
        hero: dash,
        hand: [flashBoltRed],
        resourcePoints: 2,
        deck: 6,
      },
      manualPriority,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);
    Prism.activate(spectralShield);
    game.passBoth();
    expect(game.combat()!.step).toBe("attack");

    game.helpers.passPriorityTo(Dash);
    Dash.play(flashBoltRed, { target: Prism.id });
    game.passBoth();

    expect(Prism.zone("arena")).not.toContain(spectralShield.canonicalId);
    expect(game.combat()!.step).toBe("close");
    expect(game.getState().priority).toBeNull();
  });
});
