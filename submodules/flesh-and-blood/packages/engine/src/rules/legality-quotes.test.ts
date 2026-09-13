import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../testing/test-engine.ts";
import { FAB_RUNTIME_TEST_RECEIPT } from "../runtime-access.ts";
import type { FabCardDefinitionInput } from "../cards.ts";
import {
  bravo,
  cintariSellsword,
  dash,
  nimblismBlue,
  snatchRed,
  unmovableRed,
} from "./fixtures.ts";
import { quoteFabAttackTargets, quoteFabDefense, quoteFabPlay } from "./legality-quotes.ts";
import { executeFabPlayQuote } from "../procedures/play-card/index.ts";
import type { FabEventTransactionOptions } from "../kernel/process-runner/index.ts";
import { listLegalCommands } from "../automation/legal-commands.ts";
import { demonboundGloombladeRed } from "../../../cards/src/cards/actions/demonbound-gloomblade.ts";
import { runechantOfLustYellow } from "../../../cards/src/cards/instants/runechant-of-lust.ts";
import { stickyFingers } from "../../../cards/src/cards/companions/sticky-fingers.ts";
import { parableOfHumilityYellow } from "../../../cards/src/cards/instants/parable-of-humility.ts";
import { spreadingPlagueYellow } from "../../../cards/src/cards/attack-reactions/spreading-plague.ts";
import { zeroToSixtyRed } from "../../../cards/src/cards/actions/zero-to-sixty.ts";
import { entwineIceRed } from "../../../cards/src/cards/actions/entwine-ice.ts";
import { blizzardBlue } from "../../../cards/src/cards/instants/blizzard.ts";
import { bonebreakerBellowRed } from "../../../cards/src/cards/actions/bonebreaker-bellow.ts";
import { alphaRampageRed } from "../../../cards/src/cards/actions/alpha-rampage.ts";
import { scrapTraderRed } from "../../../cards/src/cards/actions/scrap-trader.ts";
import { hadronColliderRed } from "../../../cards/src/cards/actions/hadron-collider.ts";
import { crossTheLineYellow } from "../../../cards/src/cards/actions/cross-the-line.ts";
import { nimbleStrikeRed } from "../../../cards/src/cards/actions/nimble-strike.ts";
import { nimblismBlue as authoredNimblismBlue } from "../../../cards/src/cards/actions/nimblism.ts";
import { hurlRed } from "../../../cards/src/cards/actions/hurl.ts";

const transactionOptions: FabEventTransactionOptions = {
  triggerContext: { evaluateStateCondition: () => true },
  legalTargets: () => [],
  evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
  randomIndex: () => 0,
};

const freezeOpposingHands: FabCardDefinitionInput = {
  canonicalId: "test:freeze-opposing-hands",
  name: "Freeze Opposing Hands",
  types: ["Action", "Aura"],
  abilities: [
    {
      id: "test:freeze-opposing-hands-a1",
      kind: "static",
      staticKind: "continuous",
      text: "Cards in opponents' hands are frozen.",
      effect: {
        type: "freeze",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["hand"],
          count: { type: "all" },
        },
        duration: "while-in-arena",
      },
    },
  ],
};

describe("state-versioned FAB legality quotes", () => {
  it("offers Boost as a separate legal play declaration only when its deck cost is payable", () => {
    const payable = FabTestEngine.start(
      { hero: dash, hand: [zeroToSixtyRed], deck: [snatchRed] },
      { hero: bravo, hand: [], deck: 4 },
    );
    const actorId = payable.as(dash).id;
    const commands = listLegalCommands(payable.getRuntime(), actorId).filter(
      (command) =>
        command.move === "begin-play" &&
        command.payload.instanceId === payable.as(dash).findCardInZone("hand", zeroToSixtyRed),
    );

    expect(commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Play Zero To Sixty → Bravo",
          payload: expect.objectContaining({ target: "player-2" }),
        }),
        expect.objectContaining({
          label: "Play Zero To Sixty with Boost → Bravo",
          payload: expect.objectContaining({ target: "player-2", boost: true }),
        }),
      ]),
    );

    const emptyDeck = FabTestEngine.start(
      { hero: dash, hand: [zeroToSixtyRed], deck: [] },
      { hero: bravo, hand: [], deck: 4 },
    );
    const emptyDeckCommands = listLegalCommands(emptyDeck.getRuntime(), emptyDeck.as(dash).id);
    expect(emptyDeckCommands.some((command) => command.payload.boost === true)).toBe(false);
  });

  it("offers Fusion with its exact authored hand reveal and omits it when no reveal can pay the cost", () => {
    const payable = FabTestEngine.start(
      { hero: dash, hand: [entwineIceRed, blizzardBlue], deck: 4 },
      { hero: bravo, hand: [], deck: 4 },
    );
    const actorId = payable.as(dash).id;
    const entwineId = payable.as(dash).findCardInZone("hand", entwineIceRed);
    const blizzardId = payable.as(dash).findCardInZone("hand", blizzardBlue);
    const commands = listLegalCommands(payable.getRuntime(), actorId).filter(
      (command) => command.move === "begin-play" && command.payload.instanceId === entwineId,
    );

    expect(commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Play Entwine Ice with Fusion (reveal Blizzard) → Bravo",
          payload: expect.objectContaining({
            target: "player-2",
            fuse: true,
            fuseInstanceIds: [blizzardId],
          }),
        }),
      ]),
    );

    const noIceInHand = FabTestEngine.start(
      { hero: dash, hand: [entwineIceRed, snatchRed], deck: 4 },
      { hero: bravo, hand: [], deck: 4 },
    );
    const noIceCommands = listLegalCommands(noIceInHand.getRuntime(), noIceInHand.as(dash).id);
    expect(noIceCommands.some((command) => command.payload.fuse === true)).toBe(false);
  });

  it("offers Beat Chest with each legal 6-power discard and preserves the decline declaration", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [bonebreakerBellowRed, alphaRampageRed, snatchRed], deck: 4 },
      { hero: dash, hand: [], deck: 4 },
    );
    const Bravo = game.as(bravo);
    const bellowId = Bravo.findCardInZone("hand", bonebreakerBellowRed);
    const alphaId = Bravo.findCardInZone("hand", alphaRampageRed);
    const commands = listLegalCommands(game.getRuntime(), Bravo.id).filter(
      (command) => command.move === "begin-play" && command.payload.instanceId === bellowId,
    );

    expect(commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Play Bonebreaker Bellow",
          payload: expect.objectContaining({ instanceId: bellowId }),
        }),
        expect.objectContaining({
          label: "Play Bonebreaker Bellow with Beat Chest with Alpha Rampage",
          payload: expect.objectContaining({
            instanceId: bellowId,
            beatChest: true,
            beatChestInstanceId: alphaId,
          }),
        }),
      ]),
    );
    expect(commands.some((command) => command.payload.beatChestInstanceId === undefined)).toBe(
      true,
    );
    expect(
      commands.some(
        (command) =>
          command.payload.beatChestInstanceId === Bravo.findCardInZone("hand", snatchRed),
      ),
    ).toBe(false);
  });

  it("offers Scrap, Charge, and graveyard-banish declarations only for legal real cards", () => {
    const scrapGame = FabTestEngine.start(
      { hero: dash, hand: [scrapTraderRed], graveyard: [hadronColliderRed, snatchRed], deck: 4 },
      { hero: bravo, hand: [], deck: 4 },
    );
    const ScrapDash = scrapGame.as(dash);
    const scrapId = ScrapDash.findCardInZone("hand", scrapTraderRed);
    const hadronId = ScrapDash.findCardInZone("graveyard", hadronColliderRed);
    const scrapCommands = listLegalCommands(scrapGame.getRuntime(), ScrapDash.id).filter(
      (command) => command.move === "begin-play" && command.payload.instanceId === scrapId,
    );
    expect(scrapCommands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          payload: expect.objectContaining({ instanceId: scrapId }),
        }),
        expect.objectContaining({
          payload: expect.objectContaining({
            scrap: true,
            scrapInstanceId: hadronId,
          }),
        }),
      ]),
    );
    expect(
      scrapCommands.some(
        (command) =>
          command.payload.scrapInstanceId === ScrapDash.findCardInZone("graveyard", snatchRed),
      ),
    ).toBe(false);

    const chargeGame = FabTestEngine.start(
      { hero: bravo, hand: [crossTheLineYellow, snatchRed], deck: 4 },
      { hero: dash, hand: [], deck: 4 },
    );
    const ChargeBravo = chargeGame.as(bravo);
    const chargeAttackId = ChargeBravo.findCardInZone("hand", crossTheLineYellow);
    const chargeCardId = ChargeBravo.findCardInZone("hand", snatchRed);
    expect(
      listLegalCommands(chargeGame.getRuntime(), ChargeBravo.id).some(
        (command) =>
          command.move === "begin-play" &&
          command.payload.instanceId === chargeAttackId &&
          command.payload.chargeInstanceId === chargeCardId,
      ),
    ).toBe(true);

    const banishGame = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed],
        graveyard: [authoredNimblismBlue, snatchRed],
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
    );
    const BanishBravo = banishGame.as(bravo);
    const nimbleStrikeId = BanishBravo.findCardInZone("hand", nimbleStrikeRed);
    const nimblismId = BanishBravo.findCardInZone("graveyard", authoredNimblismBlue);
    const banishCommands = listLegalCommands(banishGame.getRuntime(), BanishBravo.id).filter(
      (command) => command.move === "begin-play" && command.payload.instanceId === nimbleStrikeId,
    );
    expect(
      banishCommands.some((command) => command.payload.banishCostInstanceId === nimblismId),
    ).toBe(true);
    expect(
      banishCommands.some(
        (command) =>
          command.payload.banishCostInstanceId ===
          BanishBravo.findCardInZone("graveyard", snatchRed),
      ),
    ).toBe(false);
  });

  it("offers authored generic optional additional costs as explicit pay or decline declarations", () => {
    const game = FabTestEngine.start(
      { hero: cintariSellsword, hand: [hurlRed, snatchRed], deck: 4 },
      { hero: bravo, hand: [], deck: 4 },
    );
    const actor = game.as(cintariSellsword);
    const hurlId = actor.findCardInZone("hand", hurlRed);
    const commands = listLegalCommands(game.getRuntime(), actor.id).filter(
      (command) => command.move === "begin-play" && command.payload.instanceId === hurlId,
    );

    expect(commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Play Hurl → Bravo",
          payload: expect.objectContaining({
            declaredOptionalCostAbilityIds: [
              "D9hnm7hf7fWbFWtqKbKFb:playResourcesGrantPropertyTriggeredAttackSequenceDealDamageConditionalBindingNumericSetStatusHitDestroyPermanent",
            ],
          }),
        }),
        expect.objectContaining({
          label: "Play Hurl with Pay 1 resource → Bravo",
          payload: expect.objectContaining({
            declaredOptionalCostAbilityIds: [
              "D9hnm7hf7fWbFWtqKbKFb:playResourcesGrantPropertyTriggeredAttackSequenceDealDamageConditionalBindingNumericSetStatusHitDestroyPermanent",
            ],
            paidOptionalCostAbilityIds: [
              "D9hnm7hf7fWbFWtqKbKFb:playResourcesGrantPropertyTriggeredAttackSequenceDealDamageConditionalBindingNumericSetStatusHitDestroyPermanent",
            ],
          }),
        }),
      ]),
    );

    const paid = commands.find((command) => command.payload.paidOptionalCostAbilityIds);
    if (!paid) throw new Error("Missing Hurl's paid optional-cost declaration.");
    expect(game.getRuntime().dispatch(paid.move, actor.id, paid.payload)).toMatchObject({
      accepted: true,
      state: {
        decision: {
          kind: "payment",
        },
      },
    });
  });

  it.each([
    {
      label: "attack reaction",
      reaction: spreadingPlagueYellow,
      owner: "attacker" as const,
      cost: 1,
    },
    {
      label: "defense reaction",
      reaction: unmovableRed,
      owner: "defender" as const,
      cost: 3,
    },
  ])("quotes and enforces the resource cost of a $label", ({ reaction, owner, cost }) => {
    const insufficient = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, ...(owner === "attacker" ? [reaction] : [])],
        resourcePoints: 0,
        deck: 4,
      },
      { hero: dash, hand: owner === "defender" ? [reaction] : [], resourcePoints: 0, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    insufficient.as(bravo).attackWith(snatchRed);
    insufficient.as(dash).defendWith([]);
    insufficient.passBoth();
    if (owner === "defender") insufficient.as(bravo).pass();

    const actor = insufficient.as(owner === "attacker" ? bravo : dash);
    const instanceId = actor.findCardInZone("hand", reaction);
    expect(
      quoteFabPlay(insufficient.getState(), { actorId: actor.id, instanceId, from: "hand" }),
    ).toMatchObject({
      allowed: false,
      reasonCode: "insufficient_resources",
      resourceCost: cost,
      actionPointCost: 0,
      timing: owner === "attacker" ? "attack-reaction" : "defense-reaction",
    });

    const payable = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, ...(owner === "attacker" ? [reaction, nimblismBlue] : [])],
        resourcePoints: 0,
        deck: 4,
      },
      {
        hero: dash,
        hand: owner === "defender" ? [reaction, nimblismBlue] : [],
        resourcePoints: 0,
        deck: 4,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    payable.as(bravo).attackWith(snatchRed);
    payable.as(dash).defendWith([]);
    payable.passBoth();
    if (owner === "defender") payable.as(bravo).pass();

    const payableActor = payable.as(owner === "attacker" ? bravo : dash);
    const payableInstanceId = payableActor.findCardInZone("hand", reaction);
    expect(
      quoteFabPlay(payable.getState(), {
        actorId: payableActor.id,
        instanceId: payableInstanceId,
        from: "hand",
      }),
    ).toMatchObject({ allowed: true, resourceCost: cost });
  });

  it("quotes an evaluated attack without dispatch probing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hand: [], hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = game.as(bravo).id;
    const instanceId = game.as(bravo).findCardInZone("hand", snatchRed);
    const quote = quoteFabPlay(game.getState(), { actorId, instanceId, from: "hand" });

    expect(quote).toMatchObject({
      allowed: true,
      stateID: game.getStateID(),
      object: { instanceId },
      allowedOrigins: ["hand"],
      resourceCost: 0,
      actionPointCost: 1,
      isAttack: true,
      timing: "action",
      effectIds: [],
    });
  });

  it("rejects a quote after its authoritative state version changes", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hand: [], hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = game.as(bravo).id;
    const instanceId = game.as(bravo).findCardInZone("hand", snatchRed);
    const quote = quoteFabPlay(game.getState(), { actorId, instanceId, from: "hand" });
    const changed = structuredClone(game.getState());
    changed.stateID += 1;

    const result = executeFabPlayQuote(
      changed,
      quote,
      { actorId, instanceId, from: "hand" },
      transactionOptions,
    );
    expect(result).toMatchObject({ kind: "failed", errorCode: "stale_play_quote" });
  });

  it("denies play through the evaluator's freeze rule instead of a player flag", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hand: [], hero: dash, arena: [freezeOpposingHands], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = game.as(bravo).id;
    const instanceId = game.as(bravo).findCardInZone("hand", snatchRed);

    expect(quoteFabPlay(game.getState(), { actorId, instanceId, from: "hand" })).toMatchObject({
      allowed: false,
      reasonCode: "restricted_by_rule",
      effectIds: [expect.any(String)],
    });
  });

  it("quotes defense from the evaluated attack and defender properties", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, hand: [nimblismBlue], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    const actorId = game.as(dash).id;
    const instanceId = game.as(dash).findCardInZone("hand", nimblismBlue);

    expect(quoteFabDefense(game.getState(), { actorId, instanceIds: [instanceId] })).toMatchObject({
      allowed: true,
      stateID: game.getStateID(),
      defenders: [{ ref: { instanceId }, origin: "hand" }],
      attack: { instanceId: expect.any(String) },
    });
  });

  it("quotes opposing heroes and attackable arena objects without raw card reads", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hand: [], hero: dash, arena: [cintariSellsword], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = game.as(bravo).id;
    const attackInstanceId = game.as(bravo).findCardInZone("hand", snatchRed);
    const allyId = game.as(dash).findCardInZone("arena", cintariSellsword);

    expect(quoteFabAttackTargets(game.getState(), { actorId, attackInstanceId })).toMatchObject({
      allowed: true,
      candidates: [
        { targetId: game.as(dash).id, kind: "hero", defendingPlayerId: game.as(dash).id },
        {
          targetId: allyId,
          kind: "ally",
          defendingPlayerId: game.as(dash).id,
          object: { instanceId: allyId },
        },
      ],
    });
  });

  it("carries an ally target from legal commands through the resolved attack event", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hand: [], hero: dash, arena: [cintariSellsword], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const runtime = game.getRuntime();
    const actorId = game.as(bravo).id;
    const defenderId = game.as(dash).id;
    const allyId = game.as(dash).findCardInZone("arena", cintariSellsword);
    const command = listLegalCommands(runtime, actorId).find(
      (candidate) => candidate.move === "begin-play" && candidate.payload.target === allyId,
    );

    expect(command).toBeDefined();
    expect(dispatchTestCommand(runtime, command!.move, actorId, command!.payload).accepted).toBe(
      true,
    );
    expect(dispatchTestCommand(runtime, "pass", actorId, {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", defenderId, {}).accepted).toBe(true);
    expect(runtime.getState().combat?.activeLink).toMatchObject({
      defendingPlayerId: defenderId,
      attackTargetRef: {
        kind: "object",
        ref: { instanceId: allyId },
        controllerIdAtDeclaration: defenderId,
      },
    });
    expect(
      runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.find((event) => event.name === "attack")
        ?.data,
    ).toMatchObject({
      target: { kind: "ally", ref: { instanceId: allyId }, controllerId: defenderId },
      defendingPlayerId: defenderId,
    });
  });

  it("offers the no-defense pass alias when a non-hero attack target reaches Defend", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hand: [nimblismBlue], hero: dash, arena: [cintariSellsword], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);
    const allyId = defender.findCardInZone("arena", cintariSellsword);
    attacker.play(snatchRed, { target: allyId });
    game.passBoth();
    game.passBoth();

    expect(game.combat()).toMatchObject({
      step: "defend",
      defenseDeclarationPending: true,
      activeLink: {
        attackTargetRef: {
          kind: "object",
          ref: { instanceId: allyId },
          controllerIdAtDeclaration: defender.id,
        },
      },
    });
    const ordinaryDefenderId = defender.findCardInZone("hand", nimblismBlue);
    expect(
      quoteFabDefense(game.getState(), {
        actorId: defender.id,
        instanceIds: [ordinaryDefenderId],
      }),
    ).toMatchObject({ allowed: false, reasonCode: "ally_target_no_defend" });

    const legal = listLegalCommands(game.getRuntime(), defender.id);
    expect(
      legal.some(
        (command) =>
          command.move === "defend" &&
          Array.isArray(command.payload.instanceIds) &&
          command.payload.instanceIds.includes(ordinaryDefenderId),
      ),
    ).toBe(false);
    const noDefense = legal.find(
      (command) => command.move === "pass" && command.label === "Do not defend",
    );
    expect(noDefense).toBeDefined();
    defender.exec(noDefense!);
    expect(game.combat()?.defenseDeclarationPending).toBe(false);
    expect(attacker.hasPriority()).toBe(true);
  });

  it("permits spectra targets but Usurp grants no permission to attack other auras or Perched objects", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [demonboundGloombladeRed], deck: 4 },
      {
        hand: [],
        hero: dash,
        arena: [parableOfHumilityYellow, runechantOfLustYellow, stickyFingers],
        deck: 4,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = game.as(bravo).id;
    const attackInstanceId = game.as(bravo).findCardInZone("hand", demonboundGloombladeRed);
    const spectraId = game.as(dash).findCardInZone("arena", parableOfHumilityYellow);
    const auraId = game.as(dash).findCardInZone("arena", runechantOfLustYellow);
    const perchedId = game.as(dash).findCardInZone("arena", stickyFingers);
    const targets = quoteFabAttackTargets(game.getState(), { actorId, attackInstanceId });

    expect(targets.candidates).toEqual(
      expect.arrayContaining([expect.objectContaining({ targetId: spectraId, kind: "spectra" })]),
    );
    expect(targets.candidates.some((candidate) => candidate.targetId === perchedId)).toBe(false);
    expect(targets.candidates.some((candidate) => candidate.targetId === auraId)).toBe(false);
  });
});
import { dispatchTestCommand } from "../testing/test-command.ts";
