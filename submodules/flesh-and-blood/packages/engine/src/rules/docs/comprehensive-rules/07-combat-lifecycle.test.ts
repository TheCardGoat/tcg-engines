/**
 * CR Chapter 7 — combat as a public state machine.
 *
 * Complements `07-combat.test.ts` (CR printed examples) with transition,
 * priority, stack, defending, reaction, damage, go again, proxy, and close
 * coverage. Multi-hero attack targets (MULTI-001/002) are 1v1 out of scope.
 */
import { describe, expect, it } from "vite-plus/test";
import { FAB_MANUAL_HARNESS } from "../../../testing/harness-config.ts";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FabTestEngine,
} from "../../../testing/index.ts";
import { bravo, dash, nimblismBlue, scarForAScarRed, snatchRed } from "../../fixtures.ts";
import {
  attackTriggerTrainer,
  equipmentTrainer,
  hitTrainer,
  trainerId,
} from "../../test-trainers.ts";
import type { FabCardDefinitionInput } from "../../../cards.ts";
import type { FabKeyword } from "@tcg/flesh-and-blood-types";
import { lungingPressBlue } from "../../../../../cards/src/cards/attack-reactions/lunging-press.ts";
import { browbeatBlue } from "../../../../../cards/src/cards/actions/browbeat.ts";
import { dodgeBlue } from "../../../../../cards/src/cards/defense-reactions/dodge.ts";
import { woundingBlowRed } from "../../../../../cards/src/cards/actions/wounding-blow.ts";
import { headJabBlue } from "../../../../../cards/src/cards/actions/head-jab.ts";
import { isolateRed } from "../../../../../cards/src/cards/actions/isolate.ts";
import { overTheTopRed } from "../../../../../cards/src/cards/actions/over-the-top.ts";
import { theSuspenseIsKillingMeBlue } from "../../../../../cards/src/cards/instants/the-suspense-is-killing-me.ts";
import { sigilOfSolaceRed } from "../../../../../cards/src/cards/instants/sigil-of-solace.ts";
import { sinkBelowRed } from "../../../../../cards/src/cards/defense-reactions/sink-below.ts";
import { crackedBaubleYellow } from "../../../../../cards/src/cards/resources/cracked-bauble.ts";
import { ironrotHelm } from "../../../../../cards/src/cards/equipment/ironrot-helm.ts";
import { snapdragonScalers } from "../../../../../cards/src/cards/equipment/snapdragon-scalers.ts";
import { rottenOldBuckler } from "../../../../../cards/src/cards/equipment/rotten-old-buckler.ts";
import { boneBasher } from "../../../../../cards/src/cards/weapons/bone-basher.ts";
import { shimmersOfSilverBlue } from "../../../../../cards/src/cards/actions/shimmers-of-silver.ts";
import { peaceOfMindRed } from "../../../../../cards/src/cards/instants/peace-of-mind.ts";
import { regurgitatingSlogRed } from "../../../../../cards/src/cards/actions/regurgitating-slog.ts";
import { prism } from "../../../../../cards/src/cards/heroes/prism.ts";
import { luminaris } from "../../../../../cards/src/cards/weapons/luminaris.ts";
import { spectralShield } from "../../../../../cards/src/cards/tokens/spectral-shield.ts";
import { flashBoltRed } from "../../../../../cards/src/cards/instants/flash-bolt.ts";
import { swingBigRed } from "../../../../../cards/src/cards/actions/swing-big.ts";
import { astralEtchingsBlue } from "../../../../../cards/src/cards/actions/astral-etchings.ts";
import { sigilOfProtectionYellow } from "../../../../../cards/src/cards/actions/sigil-of-protection.ts";
import { ironsongDeterminationYellow as ironsongDetermination } from "../../../../../cards/src/cards/actions/ironsong-determination.ts";
import { dominate, overpower } from "../../../../../cards/src/cards/shared/keywords.ts";

function defendingIds(game: ReturnType<typeof FabTestEngine.start>): string[] {
  return Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat();
}

function topStack(game: ReturnType<typeof FabTestEngine.start>) {
  return game.getState().rulesStack.at(-1);
}

function grantKeywordInstant(slug: string, keyword: FabKeyword): FabCardDefinitionInput {
  const canonicalId = trainerId(slug);
  return {
    canonicalId,
    types: ["Generic", "Instant"],
    cost: 0,
    abilities: [
      {
        id: `${canonicalId}-a1`,
        kind: "resolution",
        text: `Target attack gains ${keyword.name}.`,
        effect: {
          type: "grant-property",
          property: { kind: "keyword", keyword },
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: { typeBox: { subtypes: ["Attack"] } },
            count: 1,
          },
          duration: "this-turn",
        },
      },
    ],
  };
}

function reduceDefenderPowerInstant(slug: string, amount: number): FabCardDefinitionInput {
  const canonicalId = trainerId(slug);
  return {
    canonicalId,
    types: ["Generic", "Instant"],
    cost: 0,
    abilities: [
      {
        id: `${canonicalId}-a1`,
        kind: "resolution",
        text: `Target defending card gets -${amount}{p}.`,
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "subtract",
          amount,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: { defending: true },
            count: 1,
          },
          duration: "this-turn",
        },
      },
    ],
  };
}

function loseLifeInstant(slug: string): FabCardDefinitionInput {
  const canonicalId = trainerId(slug);
  return {
    canonicalId,
    types: ["Generic", "Instant"],
    cost: 0,
    abilities: [
      {
        id: `${canonicalId}-a1`,
        kind: "resolution",
        text: "Target hero loses 1{h}.",
        effect: {
          type: "lose-life",
          amount: 1,
          target: { selector: "any-hero" },
        },
      },
    ],
  };
}

function destroyWeaponInstant(slug: string): FabCardDefinitionInput {
  const canonicalId = trainerId(slug);
  return {
    canonicalId,
    types: ["Generic", "Instant"],
    cost: 0,
    abilities: [
      {
        id: `${canonicalId}-a1`,
        kind: "resolution",
        text: "Destroy target weapon.",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "any",
            zones: ["weapon"],
            filter: { typeBox: { types: ["Weapon"] } },
            count: 1,
          },
        },
      },
    ],
  };
}

describe("CR 7 combat lifecycle", () => {
  describe("core attack lifecycle", () => {
    it("ATK-001: undefended 4-power attack walks Layer → Close and deals 4", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed], deck: 6 },
        { hero: dash, life: 20, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);

      Bravo.play(woundingBlowRed, { target: Dash.id });
      expectCombat(game).toBeOpen().toBeAtStep("layer");
      expect(Bravo.hasPriority()).toBe(true);
      game.passBoth();

      expectCombat(game).toBeAtStep("attack");
      expect(game.combat()?.activeLink).toBeTruthy();
      game.passBoth();

      expectCombat(game).toBeAtStep("defend");
      expect(game.combat()?.defenseDeclarationPending).toBe(true);
      Dash.defendWith([]);
      game.passBoth();

      expectCombat(game).toBeAtStep("reaction");
      game.passBoth();

      expectCombat(game).toBeAtStep("damage");
      expectFabPlayer(Dash).toHaveLife(16);
      expect(Bravo.hasPriority()).toBe(true);
      game.passBoth();

      expectCombat(game).toBeAtStep("resolution");
      game.passBoth();
      expectCombat(game).toBeClosed();
      expectFabCard(Bravo, woundingBlowRed).toBeIn("graveyard");
    });

    it("ATK-002 / ATK-003 / ATK-004: play opens Layer with the attack on the stack, not yet attacking", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);

      Bravo.play(woundingBlowRed, { target: Dash.id });

      expectCombat(game).toBeOpen().toBeAtStep("layer");
      expect(topStack(game)).toMatchObject({ kind: "card", role: "attack" });
      expect((topStack(game) as { attackTarget?: { kind: string } }).attackTarget).toMatchObject({
        kind: "hero",
      });
      expect(Bravo.zone("stack")).toContain(woundingBlowRed.canonicalId);
      expect(Bravo.zone("combatChain")).not.toContain(woundingBlowRed.canonicalId);
      expect(game.combat()?.activeLink).toBeNull();
      expect(game.combat()?.chainLinkNumber ?? 0).toBe(0);
      expect(Bravo.hasPriority()).toBe(true);
    });

    it("ATK-005 / ATK-006: Layer pass/pass moves the attack onto chain link 1", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.play(woundingBlowRed, { target: game.as(dash).id });
      game.passBoth();

      expectCombat(game).toBeOpen().toBeAtStep("attack");
      expect(game.getState().rulesStack).toEqual([]);
      expect(Bravo.zone("stack")).not.toContain(woundingBlowRed.canonicalId);
      expect(Bravo.zone("combatChain")).toContain(woundingBlowRed.canonicalId);
      expect(game.combat()?.activeLink).toMatchObject({
        activeAttack: { kind: "card" },
        attackingPlayerId: Bravo.id,
      });
      expect(game.combat()?.chainLinkNumber).toBe(1);
    });

    it("ATK-007: “when this attacks” waits for Attack Step, not play", () => {
      const attack = attackTriggerTrainer({
        slug: "atk-007-intimidate",
        effect: { type: "intimidate", target: "opponent" },
      });
      const game = FabTestEngine.start(
        { hero: bravo, hand: [attack], deck: 6 },
        { hero: dash, hand: [nimblismBlue, browbeatBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);

      Bravo.play(attack, { target: Dash.id });
      expectCombat(game).toBeAtStep("layer");
      expect(topStack(game)).toMatchObject({ kind: "card", role: "attack" });
      expect(Dash.handCount()).toBe(2);
      expect(Dash.zone("banished")).toHaveLength(0);

      game.passBoth();
      expectCombat(game).toBeAtStep("attack");
      expect(topStack(game)).toMatchObject({ kind: "triggered" });
      game.passBoth();
      expect(Dash.zone("banished")).toHaveLength(1);
      expect(Dash.handCount()).toBe(1);
    });
  });

  describe("Layer Step / priority", () => {
    it("PRI-001: first Layer window belongs to the turn-player", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      game.as(bravo).play(woundingBlowRed, { target: game.as(dash).id });
      expectCombat(game).toBeAtStep("layer");
      expect(game.as(bravo).hasPriority()).toBe(true);
      expect(game.as(dash).hasPriority()).toBe(false);
    });

    it("PRI-002 / PRI-003: defender Instant sits above the attack; resolving it returns priority to the turn-player", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed], deck: 6 },
        { hero: dash, life: 17, hand: [sigilOfSolaceRed], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);

      Bravo.play(woundingBlowRed, { target: Dash.id });
      Bravo.pass();
      expect(Dash.hasPriority()).toBe(true);

      Dash.play(sigilOfSolaceRed);
      expect(Dash.hasPriority()).toBe(true);
      expect(Dash.zone("stack")).toContain(sigilOfSolaceRed.canonicalId);
      expect(Bravo.zone("stack")).toContain(woundingBlowRed.canonicalId);
      expect(topStack(game)).toMatchObject({ kind: "card", role: "instant" });

      game.passBoth();
      expectFabPlayer(Dash).toHaveLife(20);
      expectFabCard(Dash, sigilOfSolaceRed).toBeIn("graveyard");
      expectCombat(game).toBeAtStep("layer");
      expect(topStack(game)).toMatchObject({ kind: "card", role: "attack" });
      expect(Bravo.hasPriority()).toBe(true);
    });

    it("PRI-004: attacker may Instant in Layer before passing", () => {
      const game = FabTestEngine.start(
        { hero: bravo, life: 17, hand: [woundingBlowRed, sigilOfSolaceRed], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.play(woundingBlowRed, { target: game.as(dash).id });
      Bravo.play(sigilOfSolaceRed);
      expect(topStack(game)).toMatchObject({ kind: "card", role: "instant" });
      expect(Bravo.zone("stack")).toEqual(
        expect.arrayContaining([woundingBlowRed.canonicalId, sigilOfSolaceRed.canonicalId]),
      );
    });

    it("PRI-005: Attack Reaction is illegal while the attack is still on the stack", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed, lungingPressBlue], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.play(woundingBlowRed, { target: game.as(dash).id });
      const reactionId = Bravo.findCardInZone("hand", lungingPressBlue);
      expect(
        Bravo.expectFailure({ move: "begin-play", payload: { instanceId: reactionId } }).errorCode,
      ).toBe("illegal_reaction_timing");
      expect(Bravo.zone("hand")).toContain(lungingPressBlue.canonicalId);
    });

    it("PRI-006: a normal Action is illegal during Layer Step", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed, nimblismBlue], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.play(woundingBlowRed, { target: game.as(dash).id });
      const actionId = Bravo.findCardInZone("hand", nimblismBlue);
      expect(
        Bravo.expectFailure({ move: "begin-play", payload: { instanceId: actionId } }).errorCode,
      ).toBe("illegal_action_timing");
    });

    it("PRI-007: an Action permitted as an Instant is legal in Layer and spends no AP", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed], deck: 6 },
        {
          hero: prism,
          hand: [astralEtchingsBlue],
          arena: [sigilOfProtectionYellow, spectralShield],
          resourcePoints: 1,
          deck: 6,
        },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Prism = game.as(prism);
      Bravo.play(woundingBlowRed, { target: Prism.id });
      expectFabPlayer(Prism).toHaveAP(0);
      Bravo.pass();
      Prism.play(astralEtchingsBlue);
      expect(topStack(game)).toMatchObject({ kind: "card" });
      game.passBoth();
      expectFabCard(Prism, sigilOfProtectionYellow).toHaveCounters(1);
      expectCombat(game).toBeAtStep("layer");
    });
  });

  describe("Attack Step", () => {
    it("AST-001: leaving Layer makes the card the active attacking chain link", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [headJabBlue], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.play(headJabBlue, { target: game.as(dash).id });
      game.passBoth();
      const attackId = game.combat()!.activeLink!.activeAttack.sourceObjectId;
      expect(game.getState().objects[attackId]?.canonicalId).toBe(headJabBlue.canonicalId);
      expect(Bravo.zone("combatChain")).toContain(headJabBlue.canonicalId);
      expectCombat(game).toBeAtStep("attack");
    });

    it("AST-002 / AST-004: attack triggers sit on the stack before Attack-Step priority, and Instants may respond", () => {
      const attack = attackTriggerTrainer({
        slug: "ast-002-intimidate",
        effect: { type: "intimidate", target: "opponent" },
      });
      const game = FabTestEngine.start(
        { hero: bravo, hand: [attack], deck: 6 },
        { hero: dash, life: 17, hand: [sigilOfSolaceRed], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      Bravo.play(attack, { target: Dash.id });
      game.passBoth();
      expectCombat(game).toBeAtStep("attack");
      expect(topStack(game)).toMatchObject({ kind: "triggered" });
      Bravo.pass();
      Dash.play(sigilOfSolaceRed);
      expect(topStack(game)).toMatchObject({ kind: "card", role: "instant" });
      game.passBoth();
      expectFabPlayer(Dash).toHaveLife(20);
      expect(topStack(game)).toMatchObject({ kind: "triggered" });
    });

    it("AST-003: two independent “when this attacks” triggers become two layers", () => {
      const canonicalId = trainerId("ast-003-two-triggers");
      const attack: FabCardDefinitionInput = {
        canonicalId,
        types: ["Generic", "Action", "Attack"],
        cost: 0,
        power: 4,
        defense: 2,
        abilities: [
          {
            kind: "static",
            staticKind: "triggered",
            id: `${canonicalId}-a1`,
            text: "When this attacks, intimidate.",
            trigger: {
              kind: "event",
              event: {
                name: "attack",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "source",
                  selector: "attack",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: { type: "intimidate", target: "opponent" },
            },
          },
          {
            kind: "static",
            staticKind: "triggered",
            id: `${canonicalId}-a2`,
            text: "When this attacks, draw a card.",
            trigger: {
              kind: "event",
              event: {
                name: "attack",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "source",
                  selector: "attack",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: { type: "draw", count: 1, player: "controller" },
            },
          },
        ],
      };
      const game = FabTestEngine.start(
        { hero: bravo, hand: [attack], deck: 6 },
        { hero: dash, hand: [nimblismBlue, browbeatBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      game.as(bravo).play(attack, { target: game.as(dash).id });
      game.passBoth();
      const attackTriggers = game
        .getState()
        .rulesStack.filter(
          (layer) =>
            layer.kind === "triggered" &&
            (layer.abilityId === `${canonicalId}-a1` || layer.abilityId === `${canonicalId}-a2`),
        );
      const pending =
        game
          .getState()
          .rulesProcess?.pendingTriggers.filter(
            (trigger) =>
              trigger.abilityId === `${canonicalId}-a1` ||
              trigger.abilityId === `${canonicalId}-a2`,
          ) ?? [];
      expect(attackTriggers.length + pending.length).toBe(2);
    });

    it("AST-005 / SPEC-001: a disappeared Spectra target is cleared instead of becoming a chain link", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, arena: [shimmersOfSilverBlue], hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      const spectraId = Dash.findCardInZone("arena", shimmersOfSilverBlue);
      Bravo.play(snatchRed, { target: spectraId });
      expect(Dash.zone("graveyard")).toContain(shimmersOfSilverBlue.canonicalId);
      game.helpers.resolveRestOfCombat();
      expectCombat(game).toBeClosed();
      expectFabPlayer(Dash).toHaveLife(20);
      expect(Dash.zone("combatChain")).toEqual([]);
    });

    it("AST-007: a later chain link may target a different legal object without closing combat", () => {
      const game = FabTestEngine.start(
        { hero: bravo, life: 10, hand: [scarForAScarRed, snatchRed], deck: 6 },
        { hero: dash, arena: [shimmersOfSilverBlue], hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      Bravo.play(scarForAScarRed, { target: Dash.id });
      game.advanceCombatTo("resolution");
      expect(game.combat()).toMatchObject({ open: true, step: "resolution", chainLinkNumber: 1 });
      Bravo.play(snatchRed, { target: Dash.findCardInZone("arena", shimmersOfSilverBlue) });
      expectCombat(game).toBeOpen().toBeAtStep("layer");
      expect(game.combat()?.chainLinkNumber).toBe(1);
    });
  });

  describe("defending", () => {
    it("DEF-001 / DEF-006: no block is legal and nobody has priority before the declaration", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed], deck: 6 },
        { hero: dash, hand: [sigilOfSolaceRed], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      Bravo.attackWith(woundingBlowRed);
      expect(game.getState().priority).toBeNull();
      expect(game.combat()).toMatchObject({ step: "defend", defenseDeclarationPending: true });
      expect(Bravo.expectFailure({ move: "pass", payload: {} }).errorCode).toBe(
        "not_priority_player",
      );
      const sigilId = Dash.findCardInZone("hand", sigilOfSolaceRed);
      expect(
        Dash.expectFailure({ move: "begin-play", payload: { instanceId: sigilId } }).errorCode,
      ).toBe("not_priority_player");
      Dash.defendWith([]);
      expect(defendingIds(game)).toEqual([]);
      expect(Bravo.hasPriority()).toBe(true);
    });

    it("DEF-002: one hand card becomes the defending card", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      game.as(bravo).attackWith(snatchRed);
      game.as(dash).defendWith(nimblismBlue);
      expect(defendingIds(game)).toHaveLength(1);
      expect(game.as(dash).zone("combatChain")).toContain(nimblismBlue.canonicalId);
      game.helpers.resolveRestOfCombat();
      expectFabPlayer(game.as(dash)).toHaveLife(18);
    });

    it("DEF-003: multiple declared cards share one defend multi-event", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, hand: [nimblismBlue, browbeatBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      const [firstId, secondId] = Dash.findCardsInZone("hand", [nimblismBlue, browbeatBlue]);
      game.as(bravo).attackWith(snatchRed);
      Dash.defendWith([nimblismBlue, browbeatBlue]);
      expect(defendingIds(game)).toEqual(expect.arrayContaining([firstId, secondId]));
      const defendEvents = game
        .committedEvents()
        .filter((event) => event.name === "defend")
        .filter((event) => [firstId, secondId].includes(event.data.object.instanceId));
      expect(defendEvents).toHaveLength(2);
      expect(new Set(defendEvents.map((event) => event.processId)).size).toBe(1);
    });

    it("DEF-004: eligible equipment may be declared as a defending card", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, head: [ironrotHelm], hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      game.as(bravo).attackWith(snatchRed);
      Dash.defendWith(ironrotHelm);
      expect(Dash.zone("combatChain")).toContain(ironrotHelm.canonicalId);
      expect(
        game.combat()?.activeLink?.defendingOrigins[
          Dash.findCardInZone("combatChain", ironrotHelm)
        ],
      ).toMatchObject({ kind: "equipment" });
    });

    it("DEF-005: a Defense Reaction cannot be the initial declared defender", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed], deck: 6 },
        { hero: dash, hand: [dodgeBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      game.as(bravo).attackWith(woundingBlowRed);
      const rejected = game.as(dash).expectBlockRejected(dodgeBlue);
      expect(rejected.accepted).toBe(false);
      expect(rejected.errorCode).toBe("defense_reaction_not_defend");
      expect(game.as(dash).zone("hand")).toContain(dodgeBlue.canonicalId);
    });

    it("DEF-007: “when this defends” triggers before Defend-Step priority", () => {
      const defender = hitTrainer({
        slug: "def-007-on-defend",
        power: 3,
        defense: 3,
        text: "When this defends, draw a card.",
      });
      const onDefend: FabCardDefinitionInput = {
        ...defender,
        abilities: [
          {
            kind: "static",
            staticKind: "triggered",
            id: `${defender.canonicalId}-defend`,
            text: "When this defends, draw a card.",
            trigger: {
              kind: "event",
              event: {
                name: "defend",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "source",
                  selector: "defender",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: { type: "draw", count: 1, player: "controller" },
            },
          },
        ],
      };
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, hand: [onDefend], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      game.as(bravo).attackWith(snatchRed);
      const handBefore = Dash.handCount();
      Dash.defendWith(onDefend);
      expect(topStack(game)).toMatchObject({ kind: "triggered" });
      expect(game.as(bravo).hasPriority()).toBe(true);
      game.passBoth();
      expect(Dash.handCount()).toBe(handBefore);
    });

    it("DEF-008: a card without a defense property cannot be declared", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, hand: [crackedBaubleYellow], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      game.as(bravo).attackWith(snatchRed);
      expect(game.as(dash).expectBlockRejected(crackedBaubleYellow).errorCode).toBe("no_defense");
    });

    it("DEF-009: a 0-defense property may still be declared", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, legs: [snapdragonScalers], hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      game.as(bravo).attackWith(snatchRed);
      Dash.defendWith(snapdragonScalers);
      expect(Dash.zone("combatChain")).toContain(snapdragonScalers.canonicalId);
    });

    it("DEF-010: the same defending card cannot be declared twice", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, hand: [nimblismBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      const cardId = Dash.findCardInZone("hand", nimblismBlue);
      game.as(bravo).attackWith(snatchRed);
      expect(
        Dash.expectFailure({ move: "defend", payload: { instanceIds: [cardId, cardId] } })
          .errorCode,
      ).toBe("invalid_defenders");
    });
  });

  describe("Dominate / Overpower", () => {
    it("RST-001: Dominate rejects a second card from hand", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [isolateRed], deck: 6 },
        { hero: dash, hand: [nimblismBlue, browbeatBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      game.as(bravo).attackWith(isolateRed);
      expect(game.as(dash).expectBlockRejected([nimblismBlue, browbeatBlue]).errorCode).toBe(
        "dominate",
      );
    });

    it("RST-002: Dominate still allows one hand card plus equipment", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [isolateRed], deck: 6 },
        { hero: dash, life: 20, weapon2: [rottenOldBuckler], hand: [nimblismBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      game.as(bravo).attackWith(isolateRed);
      Dash.defendWith([nimblismBlue, rottenOldBuckler]);
      expect(defendingIds(game)).toHaveLength(2);
    });

    it("RST-003: Dominate blocks a hand Defense Reaction after a hand defender", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [isolateRed], deck: 6 },
        { hero: dash, hand: [nimblismBlue, dodgeBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      game.as(bravo).attackWith(isolateRed);
      Dash.defendWith(nimblismBlue);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Dash);
      expect(
        Dash.expectFailure({
          move: "begin-play",
          payload: { instanceId: Dash.findCardInZone("hand", dodgeBlue) },
        }).errorCode,
      ).toBe("dominate");
    });

    it("RST-004: Dominate gained after two hand defenders does not remove them", () => {
      const grant = grantKeywordInstant("rst-004-dominate", dominate);
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed, grant], deck: 6 },
        { hero: dash, hand: [nimblismBlue, browbeatBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      Bravo.attackWith(snatchRed);
      Dash.defendWith([nimblismBlue, browbeatBlue]);
      const before = defendingIds(game);
      expect(before).toHaveLength(2);
      game.advanceCombatTo("reaction");
      Bravo.play(grant);
      game.passBoth();
      expect(defendingIds(game)).toEqual(before);
      expectCombat(game).toHaveKeyword("dominate");
    });

    it("RST-005: Overpower rejects a second Action defender", () => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          hand: [theSuspenseIsKillingMeBlue, overTheTopRed],
          resourcePoints: 3,
          actionPoints: 2,
          deck: 6,
        },
        { hero: dash, hand: [snatchRed, nimblismBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      // The Suspense Is Killing Me makes the next attack 7{p} — greater than
      // Over the Top's base 6{p} — so its printed conditional overpower holds.
      game.as(bravo).play(theSuspenseIsKillingMeBlue);
      game.helpers.resolveUntilIdle();
      game.as(bravo).attackWith(overTheTopRed);
      expect(game.as(dash).expectBlockRejected([snatchRed, nimblismBlue]).errorCode).toBe(
        "overpower",
      );
    });

    it("RST-006: Overpower gained after two Action defenders does not remove them", () => {
      const grant = grantKeywordInstant("rst-006-overpower", overpower);
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed, grant], deck: 6 },
        { hero: dash, hand: [nimblismBlue, browbeatBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.attackWith(snatchRed);
      game.as(dash).defendWith([nimblismBlue, browbeatBlue]);
      const before = defendingIds(game);
      game.advanceCombatTo("reaction");
      Bravo.play(grant);
      game.passBoth();
      expect(defendingIds(game)).toEqual(before);
      expectCombat(game).toHaveKeyword("overpower");
    });
  });

  describe("Reaction Step", () => {
    it("REA-001 / REA-002: only the attack controller may play Attack Reactions", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed, lungingPressBlue], deck: 6 },
        { hero: dash, hand: [lungingPressBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      Bravo.attackWith(woundingBlowRed);
      Dash.defendWith([]);
      game.advanceCombatTo("reaction");
      const attackId = Bravo.findCardInZone("combatChain", woundingBlowRed);
      Bravo.play(lungingPressBlue, { targetInstanceId: attackId });
      expect(topStack(game)).toMatchObject({ kind: "card", role: "attack-reaction" });
      game.passBoth();
      game.helpers.passPriorityTo(Dash);
      expect(
        Dash.expectFailure({
          move: "begin-play",
          payload: { instanceId: Dash.findCardInZone("hand", lungingPressBlue) },
        }).errorCode,
      ).toBe("illegal_reaction_timing");
    });

    it("REA-003 / REA-004 / REA-005: only the attacked hero plays a Defense Reaction, which becomes defending", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed, sinkBelowRed], deck: 6 },
        { hero: dash, hand: [dodgeBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      Bravo.attackWith(woundingBlowRed);
      Dash.defendWith([]);
      game.advanceCombatTo("reaction");
      expect(
        Bravo.expectFailure({
          move: "begin-play",
          payload: { instanceId: Bravo.findCardInZone("hand", sinkBelowRed) },
        }).errorCode,
      ).toBe("illegal_reaction_timing");
      Bravo.pass();
      Dash.play(dodgeBlue);
      game.passBoth();
      expect(defendingIds(game)).toHaveLength(1);
      expect(Dash.zone("combatChain")).toContain(dodgeBlue.canonicalId);
    });

    it("REA-008: the attacker may play a second Attack Reaction while retaining priority", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed, lungingPressBlue, lungingPressBlue], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.attackWith(woundingBlowRed);
      game.as(dash).defendWith([]);
      game.advanceCombatTo("reaction");
      const attackId = Bravo.findCardInZone("combatChain", woundingBlowRed);
      const [first, second] = Bravo.findCardsInZone("hand", [lungingPressBlue, lungingPressBlue]);
      Bravo.playInstance(first, { targetInstanceId: attackId });
      expect(Bravo.hasPriority()).toBe(true);
      Bravo.playInstance(second, { targetInstanceId: attackId });
      expect(Bravo.zone("stack").filter((id) => id === lungingPressBlue.canonicalId)).toHaveLength(
        2,
      );
    });

    it("REA-009 / REA-010: a later Instant or reaction resolves first; the turn-player then receives priority", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed, lungingPressBlue], deck: 6 },
        { hero: dash, life: 17, hand: [sigilOfSolaceRed], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      Bravo.attackWith(woundingBlowRed);
      Dash.defendWith([]);
      game.advanceCombatTo("reaction");
      Bravo.play(lungingPressBlue, {
        targetInstanceId: Bravo.findCardInZone("combatChain", woundingBlowRed),
      });
      Bravo.pass();
      Dash.play(sigilOfSolaceRed);
      expect(topStack(game)).toMatchObject({ role: "instant" });
      game.passBoth();
      expectFabPlayer(Dash).toHaveLife(20);
      expect(topStack(game)).toMatchObject({ role: "attack-reaction" });
      expect(Bravo.hasPriority()).toBe(true);
    });
  });

  describe("Damage / hit", () => {
    it("DMG-001: leftover power is dealt as physical damage and the attack hits", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [regurgitatingSlogRed], resourcePoints: 2, deck: 6 },
        { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      game.as(bravo).attackWith(regurgitatingSlogRed);
      game.as(dash).defendWith(nimblismBlue);
      game.helpers.resolveRestOfCombat();
      expectFabPlayer(game.as(dash)).toHaveLife(16);
    });

    it("DMG-002 / DMG-003: exact and over-defense deal 0 and do not hit", () => {
      const exact = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, hand: [nimblismBlue, browbeatBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      exact.as(bravo).attackWith(snatchRed);
      exact.as(dash).defendWith([nimblismBlue, browbeatBlue]);
      const handBefore = exact.as(bravo).handCount();
      exact.helpers.resolveRestOfCombat();
      expectFabPlayer(exact.as(dash)).toHaveLife(20);
      expect(exact.as(bravo).handCount()).toBe(handBefore);

      const over = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, hand: [browbeatBlue, nimblismBlue, nimblismBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      over.as(bravo).attackWith(snatchRed);
      over.as(dash).defendWith([browbeatBlue, nimblismBlue, nimblismBlue]);
      over.helpers.resolveRestOfCombat();
      expectFabPlayer(over.as(dash)).toHaveLife(20);
    });

    it("DMG-004 / DMG-005: damage is applied before Damage-Step priority", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed], deck: 6 },
        { hero: dash, life: 20, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      Bravo.attackWith(woundingBlowRed);
      Dash.defendWith([]);
      game.passBoth();
      game.passBoth();
      expectCombat(game).toBeAtStep("damage");
      expectFabPlayer(Dash).toHaveLife(16);
      expect(Bravo.hasPriority()).toBe(true);
    });

    it("DMG-006: leftover physical damage creates a hit trigger", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 8 },
        { hero: dash, life: 20, hand: [], deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      game.as(bravo).attackWith(snatchRed);
      game.as(dash).defendWith([]);
      game.passBoth();
      game.passBoth();
      expectCombat(game).toBeAtStep("damage");
      expect(topStack(game)).toMatchObject({
        kind: "triggered",
        abilityId: "PHktCwKzLmBMwmCBwb7Cw:drawOnHit",
      });
    });

    it("DMG-007 / DMG-008: full prevention is not a hit; leftover prevented damage still can hit", () => {
      const full = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed], deck: 6 },
        { hero: dash, life: 20, hand: [peaceOfMindRed], resourcePoints: 2, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      full.as(bravo).attackWith(woundingBlowRed);
      full.as(dash).defendWith([]);
      full.advanceCombatTo("reaction");
      full.helpers.passPriorityTo(full.as(dash));
      full.as(dash).play(peaceOfMindRed);
      full.helpers.resolveRestOfCombat();
      expectFabPlayer(full.as(dash)).toHaveLife(20);
      expect(full.getState().players[full.as(bravo).id]!.history.combatChain.lastAttackDidHit).toBe(
        false,
      );

      const partial = FabTestEngine.start(
        { hero: bravo, hand: [regurgitatingSlogRed], resourcePoints: 2, deck: 6 },
        { hero: dash, life: 20, hand: [peaceOfMindRed], resourcePoints: 2, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      partial.as(bravo).attackWith(regurgitatingSlogRed);
      partial.as(dash).defendWith([]);
      partial.advanceCombatTo("reaction");
      partial.helpers.passPriorityTo(partial.as(dash));
      partial.as(dash).play(peaceOfMindRed);
      partial.helpers.resolveRestOfCombat();
      expectFabPlayer(partial.as(dash)).toHaveLife(18);
      expect(
        partial.getState().players[partial.as(bravo).id]!.history.combatChain.lastAttackDidHit,
      ).toBe(true);
    });

    it("DMG-010: unrelated life loss during combat is not an attack hit", () => {
      const ping = loseLifeInstant("dmg-010-lose-life");
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed, ping], deck: 6 },
        { hero: dash, life: 20, hand: [nimblismBlue, browbeatBlue], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      Bravo.attackWith(snatchRed);
      Dash.defendWith([nimblismBlue, browbeatBlue]);
      game.advanceCombatTo("reaction");
      Bravo.play(ping, { target: Dash.id });
      game.passBoth();
      expectFabPlayer(Dash).toHaveLife(19);
      const handBefore = Bravo.handCount();
      game.helpers.resolveRestOfCombat();
      expectFabPlayer(Dash).toHaveLife(19);
      expect(Bravo.handCount()).toBe(handBefore);
      expect(game.getState().players[Bravo.id]!.history.combatChain.lastAttackDidHit).toBe(false);
    });
  });

  describe("Go again / multiple attacks", () => {
    it("GO-001: an attack without go again does not refund an action point", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      game.as(bravo).attackWith(woundingBlowRed);
      game.advanceCombatTo("resolution");
      expectFabPlayer(game.as(bravo)).toHaveAP(0);
    });

    it("GO-002: go again grants exactly 1 AP at the start of Resolution", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [headJabBlue], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.attackWith(headJabBlue);
      expectFabPlayer(Bravo).toHaveAP(0);
      game.advanceCombatTo("resolution");
      expectFabPlayer(Bravo).toHaveAP(1);
    });

    it("GO-004 / GO-006: a Resolution attack opens Layer on the same open chain as link 2", () => {
      const game = FabTestEngine.start(
        { hero: bravo, life: 10, hand: [scarForAScarRed, woundingBlowRed], deck: 6 },
        { hero: dash, life: 20, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.attackWith(scarForAScarRed);
      game.advanceCombatTo("resolution");
      Bravo.play(woundingBlowRed, { target: game.as(dash).id });
      expect(game.combat()).toMatchObject({ open: true, step: "layer", chainLinkNumber: 1 });
      expect(Bravo.zone("combatChain")).toContain(scarForAScarRed.canonicalId);
      expect(Bravo.zone("stack")).toContain(woundingBlowRed.canonicalId);
      game.advanceCombatTo("attack");
      expect(game.combat()).toMatchObject({ open: true, step: "attack", chainLinkNumber: 2 });
    });

    it("GO-005: a normal Action attack cannot start from Resolution at 0 AP", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed, snatchRed], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.attackWith(woundingBlowRed);
      game.advanceCombatTo("resolution");
      expectFabPlayer(Bravo).toHaveAP(0);
      expect(
        Bravo.expectFailure({
          move: "begin-play",
          payload: { instanceId: Bravo.findCardInZone("hand", snatchRed) },
        }).errorCode,
      ).toBe("insufficient_action_points");
    });

    it("GO-007 / GO-008: three links then a Resolution pass closes the chain", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [headJabBlue, headJabBlue, headJabBlue], deck: 6 },
        { hero: dash, life: 20, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      const [first, second, third] = Bravo.findCardsInZone("hand", [
        headJabBlue,
        headJabBlue,
        headJabBlue,
      ]);
      Bravo.playInstance(first, { target: Dash.id });
      game.advanceCombatTo("resolution");
      expect(game.combat()).toMatchObject({ step: "resolution", chainLinkNumber: 1 });
      Bravo.playInstance(second, { target: Dash.id });
      game.advanceCombatTo("resolution");
      expect(game.combat()).toMatchObject({ step: "resolution", chainLinkNumber: 2 });
      Bravo.playInstance(third, { target: Dash.id });
      game.advanceCombatTo("resolution");
      expect(game.combat()).toMatchObject({ step: "resolution", chainLinkNumber: 3 });
      game.passBoth();
      expectCombat(game).toBeClosed();
      expectFabPlayer(Dash).toHaveLife(17);
    });
  });

  describe("Weapon / attack-proxy", () => {
    it("WPN-001 / WPN-002 / WPN-003: activating a weapon puts a proxy on the stack and later onto the chain", () => {
      const game = FabTestEngine.start(
        { hero: bravo, weapon1: [boneBasher], resourcePoints: 2, deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const weaponId = Bravo.findCardInZone("weapon1", boneBasher);
      Bravo.activate(boneBasher);
      expect(topStack(game)).toMatchObject({
        kind: "activated",
        role: "attack",
        attackKind: "proxy",
        source: { instanceId: weaponId },
      });
      expectCombat(game).toBeOpen().toBeAtStep("layer");
      game.passBoth();
      expect(game.combat()!.activeLink).toMatchObject({
        activeAttack: { kind: "proxy", sourceObjectId: weaponId },
        attackingPlayerId: Bravo.id,
      });
      expect(Bravo.zone("weapon1")).toContain(boneBasher.canonicalId);
      expectCombat(game).toHaveAttackPower(4);
    });

    it("WPN-004: destroying the weapon while its proxy is on the stack removes the proxy", () => {
      const destroy = destroyWeaponInstant("wpn-004-destroy");
      const game = FabTestEngine.start(
        { hero: bravo, weapon1: [boneBasher], resourcePoints: 2, deck: 6 },
        { hero: dash, hand: [destroy], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      Bravo.activate(boneBasher);
      Bravo.pass();
      Dash.play(destroy, { targetInstanceId: Bravo.findCardInZone("weapon1", boneBasher) });
      game.passBoth();
      expect(Bravo.zone("weapon1")).not.toContain(boneBasher.canonicalId);
      expect(game.getState().rulesStack.every((layer) => layer.kind !== "activated")).toBe(true);
    });

    it("WPN-005: a weapon attack after go again preserves the existing combat chain", () => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          life: 10,
          hand: [scarForAScarRed],
          weapon1: [boneBasher],
          resourcePoints: 3,
          deck: 6,
        },
        { hero: dash, life: 20, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.attackWith(scarForAScarRed);
      game.advanceCombatTo("resolution");
      expectFabPlayer(Bravo).toHaveAP(1);

      Bravo.activate(boneBasher);
      expect(game.combat()).toMatchObject({ open: true, step: "layer", chainLinkNumber: 1 });
      game.passBoth();

      expect(game.combat()).toMatchObject({
        open: true,
        step: "attack",
        chainLinkNumber: 2,
        closedLinks: [{ activeAttack: { kind: "card" } }],
        activeLink: { activeAttack: { kind: "proxy" } },
      });
    });

    it("WPN-006: a source-weapon power buff is inherited by the attack-proxy", () => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          hand: [ironsongDetermination],
          weapon1: [boneBasher],
          actionPoints: 2,
          resourcePoints: 2,
          deck: 6,
        },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.play(ironsongDetermination);
      if (game.getState().decision) Bravo.target(boneBasher);
      game.passBoth();
      if (game.getState().decision) Bravo.target(boneBasher);
      game.helpers.resolveUntilIdle();
      Bravo.activate(boneBasher);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(5);
    });
  });

  describe("Attack-layer", () => {
    it("LYR-001 / LYR-002 / LYR-003 / LYR-004: “attack with” is an attack-layer that keeps its declared target", () => {
      const game = FabTestEngine.start(
        { hero: prism, weapon1: [luminaris], arena: [spectralShield], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Prism = game.as(prism);
      const Dash = game.as(dash);
      Prism.activate(spectralShield);
      const layer = topStack(game);
      expect(layer).toMatchObject({ kind: "activated", role: "attack" });
      expect((layer as { attackKind?: string }).attackKind).toBe("layer");
      expect((layer as { attackTarget?: { kind: string } }).attackTarget).toMatchObject({
        kind: "hero",
      });
      game.passBoth();
      expectCombat(game).toBeOpen();
      expect(game.combat()!.activeLink!.attackTargetRef).toEqual({
        kind: "hero",
        playerId: Dash.id,
      });
      expect(game.combat()!.activeLink!.attackingPlayerId).toBe(Prism.id);
    });
  });

  describe("Phantasm", () => {
    it("PHA-001 / PHA-003: a 6-power Attack Action defender destroys the Phantasm attack and can close combat", () => {
      const phantasmAtk = hitTrainer({
        slug: "pha-001",
        keywords: [{ name: "phantasm" }],
        power: 6,
      });
      const game = FabTestEngine.start(
        { hero: bravo, hand: [phantasmAtk], deck: 6 },
        { hero: dash, life: 20, hand: [regurgitatingSlogRed], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      game.as(bravo).attackWith(phantasmAtk);
      game.as(dash).blockWith(regurgitatingSlogRed);
      expect(
        topStack(game)?.kind === "triggered" ||
          game.combat()?.activeLink?.keywords.includes("phantasm-destroyed"),
      ).toBe(true);
      game.helpers.resolveUntilIdle();
      expect(game.as(bravo).zone("graveyard")).toContain(phantasmAtk.canonicalId);
      expectCombat(game).toBeClosed();
      expectFabPlayer(game.as(dash)).toHaveLife(20);
    });

    it("PHA-002: Phantasm fails if the defender is below 6 power when the trigger resolves", () => {
      const phantasmAtk = hitTrainer({
        slug: "pha-002",
        keywords: [{ name: "phantasm" }],
        power: 6,
      });
      const reduce = reduceDefenderPowerInstant("pha-002-reduce", 1);
      const game = FabTestEngine.start(
        { hero: bravo, hand: [phantasmAtk, reduce], deck: 6 },
        { hero: dash, life: 20, hand: [regurgitatingSlogRed], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.attackWith(phantasmAtk);
      const slogId = game.as(dash).findCardInZone("hand", regurgitatingSlogRed);
      game.as(dash).blockWith(regurgitatingSlogRed);
      Bravo.play(reduce, { targetInstanceId: slogId });
      game.passBoth();
      game.passBoth();
      expect(Bravo.zone("combatChain")).toContain(phantasmAtk.canonicalId);
      game.helpers.resolveRestOfCombat();
      expectFabPlayer(game.as(dash)).toHaveLife(16);
    });
  });

  describe("Combat termination", () => {
    it("CLS-001 / CLS-002 / CLS-008: Resolution pass/pass closes; Close has no priority; attack cards leave the chain", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [woundingBlowRed, sigilOfSolaceRed], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      Bravo.attackWith(woundingBlowRed);
      game.advanceCombatTo("resolution");
      game.passBoth();
      expectCombat(game).toBeClosed();
      expect(game.getState().priority).toMatchObject({
        holderPlayerId: Bravo.id,
        kind: "action",
        combatStep: null,
      });
      expectFabCard(Bravo, woundingBlowRed).toBeIn("graveyard");
    });

    it("CLS-003: destroying the sole attacking object before damage starts Close with no priority", () => {
      const game = FabTestEngine.start(
        { hero: prism, weapon1: [luminaris], arena: [spectralShield], deck: 6 },
        { hero: dash, hand: [flashBoltRed], resourcePoints: 2, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Prism = game.as(prism);
      const Dash = game.as(dash);
      Prism.activate(spectralShield);
      game.passBoth();
      game.helpers.passPriorityTo(Dash);
      Dash.play(flashBoltRed, { target: Prism.id });
      game.passBoth();
      expect(Prism.zone("arena")).not.toContain(spectralShield.canonicalId);
      expect(game.combat()?.step).toBe("close");
      expect(game.getState().priority).toBeNull();
      expect(Dash.hasPriority()).toBe(false);
      expect(Prism.hasPriority()).toBe(false);
    });

    it("CLS-005: “when combat chain closes” triggers after a missed attack", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [swingBigRed], resourcePoints: 2, deck: 6 },
        {
          hero: dash,
          life: 20,
          hand: [nimblismBlue, nimblismBlue, nimblismBlue, browbeatBlue],
          deck: 6,
        },
        FAB_MANUAL_HARNESS,
      );
      game.as(bravo).attackWith(swingBigRed);
      game.as(dash).defendWith([nimblismBlue, nimblismBlue, nimblismBlue, browbeatBlue]);
      game.helpers.resolveRestOfCombat();
      expect(game.as(dash).zone("arena")).toContain("token:quicken");
    });

    it("CLS-006: forcing Close while a reaction is on the stack gives nobody priority", () => {
      const game = FabTestEngine.start(
        { hero: prism, weapon1: [luminaris], arena: [spectralShield], deck: 6 },
        { hero: dash, hand: [dodgeBlue, flashBoltRed], resourcePoints: 2, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Prism = game.as(prism);
      const Dash = game.as(dash);
      Prism.activate(spectralShield);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Dash);
      Dash.play(dodgeBlue);
      expect(topStack(game)).toMatchObject({ role: "defense-reaction" });
      Dash.play(flashBoltRed, { target: Prism.id });
      game.passBoth();
      expect(game.combat()?.step).toBe("close");
      expect(game.getState().priority).toBeNull();
      expect(Dash.hasPriority()).toBe(false);
      expect(Dash.zone("graveyard")).toContain(dodgeBlue.canonicalId);
      expect(game.getState().rulesStack).toHaveLength(0);
    });

    it("CLS-007: defending equipment returns to its equipment zone when the chain closes", () => {
      const helm = equipmentTrainer({ slug: "cls-007-helm", keywords: [], defense: 1 });
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        { hero: dash, life: 20, head: [helm], hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      game.as(bravo).attackWith(snatchRed);
      Dash.defendWith(helm);
      expect(Dash.zone("combatChain")).toContain(helm.canonicalId);
      game.helpers.resolveRestOfCombat();
      expect(Dash.zone("head")).toContain(helm.canonicalId);
      expect(Dash.zone("combatChain")).not.toContain(helm.canonicalId);
    });
  });
});
