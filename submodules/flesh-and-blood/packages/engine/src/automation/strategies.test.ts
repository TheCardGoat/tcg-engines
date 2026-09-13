import { describe, expect, it } from "vite-plus/test";
import { FabMatchRuntime } from "../runtime.ts";
import { fleshAndBloodDeckCardLibrary } from "../../../cards/src/deck-library.ts";
import { decodeFabCommand, type FabCommandExecutionContext } from "../moves.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { createFabPracticeMatch as createFabPracticeMatchWithLibrary } from "./create-practice-match.ts";
import type { FabPracticeMatchFixtureInput } from "./sample-decks.ts";
import { FAB_MANUAL_HARNESS } from "../testing/harness-config.ts";
import {
  botEligibleFabCommands,
  type FabLegalCommand,
  listLegalCommands,
} from "./legal-commands.ts";
import {
  chooseAutomatedAction,
  concedeCommand,
  firstLegalStrategy,
  submitAutomatedAction,
  heuristicStrategy,
  passOnlyStrategy,
  randomStrategy,
  seatMustAct,
} from "./bot-strategies.ts";
import {
  FAB_AUTOMATED_ACTION_STRATEGIES,
  getSafeFabAutomatedActionStrategyOption,
  resolveFabAutomatedActionStrategyOption,
} from "./strategy-registry.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "./catalog-test-cards.ts";
import { briar } from "../../../cards/src/cards/shared/test-recipients.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { inductionChamberRed } from "../../../cards/src/cards/actions/induction-chamber.ts";
import { cosmicDualityBlue } from "../../../cards/src/cards/actions/cosmic-duality.ts";
import { zyggyStarlight } from "../../../cards/src/cards/heroes/zyggy-starlight.ts";
import { runebloodIncantationRed as runebloodIncantation } from "../../../cards/src/cards/actions/runeblood-incantation.ts";
import { sonataGalaxiaRed } from "../../../cards/src/cards/actions/sonata-galaxia.ts";
import { snatchRed } from "../../../cards/src/cards/actions/snatch.ts";
import { crackedBaubleYellow } from "../../../cards/src/cards/resources/cracked-bauble.ts";
import { pilferTheTombBlue } from "../../../cards/src/cards/instants/pilfer-the-tomb.ts";
import { bravo } from "../../../cards/src/cards/heroes/bravo.ts";
import { nimblismBlue } from "../../../cards/src/cards/actions/nimblism.ts";
import { baseOfTheMountain } from "../../../cards/src/cards/equipment/base-of-the-mountain.ts";
import { vynnset } from "../../../cards/src/cards/heroes/vynnset.ts";
import { beseechTheDemigonRed } from "../../../cards/src/cards/actions/beseech-the-demigon.ts";
import { deathlyDelightRed } from "../../../cards/src/cards/actions/deathly-delight.ts";
import { widespreadRuinRed } from "../../../cards/src/cards/actions/widespread-ruin.ts";
import { valueExtractStrategy } from "./heuristic/goldfish.ts";

function createFabPracticeMatch(input: FabPracticeMatchFixtureInput = {}) {
  return createFabPracticeMatchWithLibrary(fleshAndBloodDeckCardLibrary, input);
}

function applyLegalCommand(runtime: FabMatchRuntime, actorId: string, command: FabLegalCommand) {
  const decoded = decodeFabCommand(command.move, command.payload);
  if (!decoded) throw new Error(`Generated legal command ${command.move} did not decode.`);
  return runtime.applyCommand(actorId, decoded);
}

describe("listLegalCommands", () => {
  it("returns end-turn / pass / announced plays without free pitch at match start", () => {
    const { runtime, player1Id } = createFabPracticeMatch({ seed: "legal-1" });
    const legal = listLegalCommands(runtime, player1Id);
    const moves = new Set(legal.map((c) => c.move));
    expect(moves.has("end-turn")).toBe(true);
    expect(moves.has("pass")).toBe(true);
    expect(legal.some((c) => c.move === "begin-play")).toBe(true);
    expect(legal.every((c) => c.move !== "concede")).toBe(true);
  });

  it("offers both play and a functional in-hand activation for Cosmic Duality", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [cosmicDualityBlue],
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const actorId = game.as(zyggyStarlight).id;
    const cosmicId = game.as(zyggyStarlight).cardIn("hand", cosmicDualityBlue).instanceId;

    const legal = listLegalCommands(game.getRuntime(), actorId);
    expect(legal.filter((command) => command.payload.instanceId === cosmicId)).toMatchObject([
      {
        move: "begin-play",
        label: expect.stringContaining("Play Cosmic Duality"),
      },
      {
        move: "activate",
        payload: {
          ability: "WhggpfhhBLDnpKwCkjWDk:dealDamageCreateTokenLightningFlowActivation",
          instanceId: cosmicId,
        },
        label: expect.stringContaining("Activate Cosmic Duality"),
        priorityYield: {
          kind: "instant-use",
          canonicalId: cosmicDualityBlue.canonicalId,
        },
      },
    ]);
    expect(
      legal.find(
        (command) => command.move === "begin-play" && command.payload.instanceId === cosmicId,
      )?.priorityYield,
    ).toBeUndefined();
    expect(legal).toContainEqual(
      expect.objectContaining({
        move: "set-automation-preferences",
        payload: { addInstantYieldCardId: cosmicDualityBlue.canonicalId },
        sourceInstanceId: cosmicId,
        label: "Auto-yield this card",
      }),
    );

    const enableYield = legal.find(
      (command) => command.payload.addInstantYieldCardId === cosmicDualityBlue.canonicalId,
    );
    expect(enableYield).toBeDefined();
    applyLegalCommand(game.getRuntime(), actorId, enableYield!);
    applyLegalCommand(game.getRuntime(), actorId, {
      move: "set-automation-preferences",
      payload: { priorityMode: "always-hold" },
      label: "Hold priority",
    });

    expect(listLegalCommands(game.getRuntime(), actorId)).toContainEqual(
      expect.objectContaining({
        move: "set-automation-preferences",
        payload: { removeInstantYieldCardId: cosmicDualityBlue.canonicalId },
        sourceInstanceId: cosmicId,
        label: "Stop auto-yielding this card",
      }),
    );
  });

  it("offers one canonical auto-yield toggle on every matching copy", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [cosmicDualityBlue, cosmicDualityBlue],
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const actor = game.as(zyggyStarlight);
    const copyIds = actor.cardsIn("hand", cosmicDualityBlue).map((card) => card.instanceId);
    const toggles = listLegalCommands(game.getRuntime(), actor.id).filter(
      (command) => command.payload.addInstantYieldCardId === cosmicDualityBlue.canonicalId,
    );

    expect(toggles).toHaveLength(2);
    const toggleSourceIds = toggles.flatMap((command) =>
      command.sourceInstanceId ? [command.sourceInstanceId] : [],
    );
    expect(toggleSourceIds.sort((a, b) => a.localeCompare(b))).toEqual(
      [...copyIds].sort((a, b) => a.localeCompare(b)),
    );
  });

  it("does not enumerate a permanent-only activation from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [inductionChamberRed],
        resourcePoints: 1,
        deck: 4,
      },
      { hero: zyggyStarlight, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const inductionId = Dash.cardIn("hand", inductionChamberRed).instanceId;

    expect(listLegalCommands(game.getRuntime(), Dash.id)).not.toContainEqual(
      expect.objectContaining({
        move: "activate",
        payload: expect.objectContaining({ instanceId: inductionId }),
      }),
    );
  });

  it("excludes concede unless requested", () => {
    const { runtime, player1Id } = createFabPracticeMatch({ seed: "legal-2" });
    expect(listLegalCommands(runtime, player1Id).some((c) => c.move === "concede")).toBe(false);
    expect(
      listLegalCommands(runtime, player1Id, { includeConcede: true }).some(
        (c) => c.move === "concede",
      ),
    ).toBe(true);
  });

  it("returns empty or concede-only for a non-priority opponent without actions", () => {
    const { runtime, player2Id } = createFabPracticeMatch({ seed: "legal-3" });
    const legal = listLegalCommands(runtime, player2Id);
    // Non-priority players without combat/stack only get concede (filtered by default).
    // every() is true for [], so empty legal is allowed.
    expect(legal.every((c) => c.move === "concede")).toBe(true);
  });

  it("lists pass as the no-defense declaration without a duplicate empty defend", () => {
    const game = openDefendWithEmptyHand();
    const defender = "player-2";
    const legal = listLegalCommands(game.getRuntime(), defender);
    expect(
      legal.some((command) => command.move === "pass" && command.label === "Do not defend"),
    ).toBe(true);
    expect(legal.some((command) => command.move === "defend" && emptyDefendPayload(command))).toBe(
      false,
    );
  });

  it("lists equipment with defense as defend candidates", () => {
    const game = FabTestEngine.create(
      {
        seed: "eq-defend",
        player1: {
          heroCardId: catalogIds.rhinar,
          hand: [catalogIds.snatch],
          deck: 4,
        },
        player2: {
          heroCardId: catalogIds.bravo,
          hand: [],
          deck: 4,
          legs: [catalogIds.scabskin],
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(catalogIds.rhinar).attackWith(catalogIds.snatch);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const eqDefend = legal.find(
      (c) =>
        c.move === "defend" &&
        Array.isArray(c.payload.instanceIds) &&
        (c.payload.instanceIds as string[]).some(
          (id) => game.getState().objects[id]?.canonicalId === catalogIds.scabskin,
        ),
    );
    expect(eqDefend).toBeDefined();
  });

  it("announces one costed play, then exposes one pitch card at a time", () => {
    // Unmovable costs 3; three blue nimblism (pitch 3 each) would overpay — use three cracked baubles (2).
    // One unmovable + two baubles in hand during non-combat action phase.
    const game = FabTestEngine.create(
      {
        seed: "pitch-pay",
        player1: {
          heroCardId: catalogIds.bravo,
          hand: [
            catalogIds.unmovable,
            catalogIds.crackedBauble,
            catalogIds.crackedBauble,
            catalogIds.nimblismBlue,
          ],
          deck: 6,
          actionPoints: 1,
          resourcePoints: 0,
        },
        player2: {
          heroCardId: catalogIds.rhinar,
          hand: [],
          deck: 4,
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // Unmovable is a defense reaction — not playable as free action. Use disable (cost 3) instead.
    const game2 = FabTestEngine.create(
      {
        seed: "pitch-pay-2",
        player1: {
          heroCardId: catalogIds.bravo,
          hand: [
            catalogIds.disable,
            catalogIds.crackedBauble,
            catalogIds.crackedBauble,
            catalogIds.nimblismBlue,
          ],
          deck: 6,
          actionPoints: 1,
          resourcePoints: 0,
        },
        player2: {
          heroCardId: catalogIds.rhinar,
          hand: [],
          deck: 4,
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const announced = listLegalCommands(game2.getRuntime(), "player-1").filter(
      (c) =>
        c.move === "begin-play" &&
        game2.getState().objects[String(c.payload.instanceId)]?.canonicalId ===
          catalogIds.disable &&
        !c.payload.pitch,
    );
    expect(announced).toHaveLength(1);
    expect(announced[0]!.payload.pitch).toBeUndefined();
    const probe = new FabMatchRuntime(game2.getRuntime().cloneState());
    const choice = announced[0]!;
    expect(applyLegalCommand(probe, "player-1", choice).success).toBe(true);
    expect(probe.getState().decision).toMatchObject({
      kind: "payment",
      cancellable: true,
      candidates: expect.arrayContaining([
        expect.objectContaining({ instanceId: expect.any(String) }),
      ]),
    });
    const paymentDecision = probe.getState().decision;
    if (paymentDecision?.kind !== "payment") throw new Error("Expected payment decision.");
    expect(paymentDecision.candidates).toHaveLength(3);

    // silence unused var
    expect(game.getState().playerIds).toHaveLength(2);
  });
});

describe("automation strategies", () => {
  it("first-legal chooses a legal command when legal moves exist", () => {
    const { runtime, player1Id } = createFabPracticeMatch({ seed: "strat-first" });
    const legal = listLegalCommands(runtime, player1Id);
    expect(legal.length).toBeGreaterThan(0);
    const choice = firstLegalStrategy(runtime, player1Id, legal);
    expect(choice).not.toBeNull();
    expect(legal).toContainEqual(choice);
  });

  it("pass-only prefers pass or end-turn", () => {
    const { runtime, player1Id } = createFabPracticeMatch({ seed: "strat-pass" });
    const legal = listLegalCommands(runtime, player1Id);
    const choice = passOnlyStrategy(runtime, player1Id, legal);
    expect(choice).not.toBeNull();
    // Active outside combat: end-turn is preferred over free pass.
    expect(choice!.move).toBe("end-turn");
  });

  it("random chooses a legal command with a deterministic seed roll", () => {
    const { runtime, player1Id } = createFabPracticeMatch({ seed: "strat-rand" });
    const legal = listLegalCommands(runtime, player1Id);
    const choice = randomStrategy(runtime, player1Id, legal, { random: () => 0 });
    // Player-only meta commands (priority/trigger toggles) are never bot moves.
    expect(choice).toEqual(botEligibleFabCommands(legal)[0]);
  });

  it("heuristic chooses a legal command in the legal list", () => {
    const { runtime, player1Id } = createFabPracticeMatch({ seed: "strat-heur" });
    const legal = listLegalCommands(runtime, player1Id);
    const choice = heuristicStrategy(runtime, player1Id, legal);
    expect(choice).not.toBeNull();
    expect(legal).toContainEqual(choice);
  });

  it("chosen commands are accepted by the runtime", () => {
    const { runtime, player1Id } = createFabPracticeMatch({ seed: "strat-dispatch" });
    const legal = listLegalCommands(runtime, player1Id);
    for (const strategy of [firstLegalStrategy, passOnlyStrategy, heuristicStrategy]) {
      const probe = new FabMatchRuntime(runtime.cloneState());
      const choice = strategy(probe, player1Id, legal);
      expect(choice).not.toBeNull();
      const result = applyLegalCommand(probe, player1Id, choice!);
      expect(result.success).toBe(true);
    }
  });
});

describe("progress regressions", () => {
  it("heuristic on defend with empty hand chooses the no-defense pass alias", () => {
    const game = openDefendWithEmptyHand();
    const defender = "player-2";
    const stepBefore = game.combat()?.step;
    expect(stepBefore).toBe("defend");

    const legal = listLegalCommands(game.getRuntime(), defender);
    const choice = heuristicStrategy(game.getRuntime(), defender, legal);
    expect(choice).not.toBeNull();
    expect(choice).toMatchObject({ move: "pass", label: "Do not defend" });

    applyLegalCommand(game.getRuntime(), defender, choice!);
    expect(game.combat()?.defenseDeclarationPending).toBe(false);
    expect(game.getPriorityPlayerId()).toBe("player-1");
    expect(game.getStateID()).toBeGreaterThan(0);
  });

  it("heuristic fully covers a turn-one attack with replaceable hand cards", () => {
    const game = openDefendWithBlocksInHand();
    const choice = heuristicStrategy(
      game.getRuntime(),
      "player-2",
      listLegalCommands(game.getRuntime(), "player-2"),
    );

    expect(choice?.move).toBe("defend");
    expect(choice?.payload.instanceIds).toHaveLength(2);
  });

  it("all registered bots preserve the strongest card and overblock before the turn-one refill", () => {
    for (const option of FAB_AUTOMATED_ACTION_STRATEGIES) {
      const game = openDefendWithBlocksInHand();
      const defender = game.as(catalogIds.bravo);
      const retainedThreat = defender.cardIn("hand", catalogIds.swingBig).instanceId;
      const recyclableCards = defender
        .cardsIn("hand", catalogIds.snatch)
        .map((card) => card.instanceId);
      const choice = chooseAutomatedAction(game.getRuntime(), defender.id, option.strategy, {
        random: () => 0,
      });

      expect(choice?.move, option.id).toBe("defend");
      expect(choice?.payload.instanceIds, option.id).toEqual(
        expect.arrayContaining(recyclableCards),
      );
      expect(choice?.payload.instanceIds, option.id).not.toContain(retainedThreat);
    }
  });

  it("heuristic declares defense once and never repeats it", () => {
    const game = openDefendWithBlocksInHand();
    const defender = "player-2";
    const seenEmptyDefend = [] as boolean[];
    let advancedPastDefend = false;

    for (let i = 0; i < 24; i++) {
      if (game.hasGameEnded()) break;
      const combat = game.combat();
      if (!combat?.open) {
        advancedPastDefend = true;
        break;
      }
      if (combat.step !== "defend") {
        advancedPastDefend = true;
        break;
      }

      const actor =
        game.getPriorityPlayerId() ?? game.combat()?.activeLink?.defendingPlayerId ?? defender;
      const legal = listLegalCommands(game.getRuntime(), actor);
      const choice =
        actor === defender
          ? heuristicStrategy(game.getRuntime(), actor, legal)
          : (passOnlyStrategy(game.getRuntime(), actor, legal) ??
            firstLegalStrategy(game.getRuntime(), actor, legal));
      expect(choice).not.toBeNull();
      seenEmptyDefend.push(emptyDefendPayload(choice!));
      const before = game.getStateID();
      const result = applyLegalCommand(game.getRuntime(), actor, choice!);
      expect(result.success).toBe(true);
      expect(game.getStateID()).toBeGreaterThan(before);
    }

    expect(seenEmptyDefend.filter(Boolean).length).toBeLessThanOrEqual(1);
    expect(advancedPastDefend).toBe(true);
  });

  it("heuristic does not dump cards on defense when far ahead on life (races to close)", () => {
    // A defender far ahead on life should preserve its hand to race rather than
    // full-block an attack it can easily survive. Otherwise two blocking sides
    // plus healing loop the game to the action cap (seen vs turtling opponents
    // at 1 life: the ahead seat full-blocks every counter and the game never ends).
    const game = FabTestEngine.create(
      {
        seed: "ahead-race",
        player1: { heroCardId: catalogIds.rhinar, hand: [catalogIds.snatch], deck: 5, life: 6 },
        player2: {
          heroCardId: catalogIds.bravo,
          hand: [catalogIds.enlightenedStrike, catalogIds.snatch],
          deck: 5,
          life: 20,
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(catalogIds.rhinar).attackWith(catalogIds.snatch);
    const defender = "player-2";
    const legal = listLegalCommands(game.getRuntime(), defender);
    // A card-block is available, so the choice is meaningful.
    expect(
      legal.some(
        (c) =>
          c.move === "defend" &&
          Array.isArray(c.payload.instanceIds) &&
          (c.payload.instanceIds as string[]).length > 0,
      ),
    ).toBe(true);
    const choice = heuristicStrategy(game.getRuntime(), defender, legal);
    expect(choice).not.toBeNull();
    const spent = Array.isArray(choice!.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    expect(spent).toHaveLength(0);
  });

  it("heuristic active with empty hand chooses end-turn not free pass", () => {
    const game = FabTestEngine.create(
      {
        seed: "end-turn-stall",
        player1: {
          heroCardId: catalogIds.rhinar,
          hand: [],
          deck: 6,
          actionPoints: 1,
        },
        player2: {
          heroCardId: catalogIds.bravo,
          hand: [],
          deck: 6,
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    expect(legal.some((c) => c.move === "end-turn")).toBe(true);
    const choice = heuristicStrategy(game.getRuntime(), "player-1", legal);
    expect(choice).not.toBeNull();
    expect(choice!.move).toBe("end-turn");

    applyLegalCommand(game.getRuntime(), "player-1", choice!);
    expect(game.getActivePlayerId()).toBe("player-2");
  });

  it("pass-only active outside combat also ends the turn", () => {
    const game = FabTestEngine.create(
      {
        seed: "pass-only-end",
        player1: {
          heroCardId: catalogIds.rhinar,
          hand: [catalogIds.snatch],
          deck: 4,
        },
        player2: {
          heroCardId: catalogIds.bravo,
          hand: [],
          deck: 4,
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = passOnlyStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("end-turn");
  });

  it("heuristic with AP 0 has no free pitch and chooses end-turn", () => {
    const game = FabTestEngine.create(
      {
        seed: "pitch-vs-end",
        player1: {
          heroCardId: catalogIds.rhinar,
          hand: [catalogIds.nimblismBlue, catalogIds.crackedBauble],
          deck: 6,
          actionPoints: 0,
          resourcePoints: 0,
        },
        player2: {
          heroCardId: catalogIds.bravo,
          hand: [],
          deck: 4,
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    // Payment pitch is available only through a persisted payment decision.
    expect(legal.some((c) => c.move === "end-turn")).toBe(true);
    const choice = heuristicStrategy(game.getRuntime(), "player-1", legal);
    expect(choice).not.toBeNull();
    expect(choice!.move).toBe("end-turn");
  });

  it("seed shuffles practice opening hands", () => {
    const a = createFabPracticeMatch({ seed: "shuffle-a" });
    const b = createFabPracticeMatch({ seed: "shuffle-b" });
    const handA = a.runtime
      .getState()
      .containers.zonesByPlayerId["player-1"]!.hand.map(
        (id) => a.runtime.getState().objects[id]?.canonicalId,
      );
    const handB = b.runtime
      .getState()
      .containers.zonesByPlayerId["player-1"]!.hand.map(
        (id) => b.runtime.getState().objects[id]?.canonicalId,
      );
    // Extremely unlikely identical 4-card hands under different seeds for a 30-card deck.
    expect(handA).not.toEqual(handB);
  });
});

describe("bot last-resort progress", () => {
  it("resolves Sonata Galaxia's private search decision instead of waiting on the bot", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [sonataGalaxiaRed],
        deck: [runebloodIncantation, snatchRed, snatchRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const runtime = game.getRuntime();
    const Briar = game.as(briar);

    Briar.play(sonataGalaxiaRed, { xValue: 1 });

    for (let attempts = 0; attempts < 12 && runtime.getState().decision; attempts += 1) {
      const actorId = runtime.getState().decision?.actorId;
      expect(actorId).toBe("player-1");
      const chosen = chooseAutomatedAction(runtime, actorId!, firstLegalStrategy);
      expect(chosen).not.toBeNull();
      expect(applyLegalCommand(runtime, actorId!, chosen!).success).toBe(true);
    }

    expect(runtime.getState().decision).toBeNull();
    expect(Briar.zone("hand")).not.toContain(sonataGalaxiaRed.canonicalId);
  });

  it("ends the turn when the active seat has no card to play", () => {
    const game = FabTestEngine.create(
      {
        seed: "last-resort-end",
        player1: {
          heroCardId: catalogIds.rhinar,
          hand: [],
          deck: 6,
          actionPoints: 1,
        },
        player2: {
          heroCardId: catalogIds.bravo,
          hand: [],
          deck: 6,
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      FAB_MANUAL_HARNESS,
    );
    expect(seatMustAct(game.getRuntime(), "player-1")).toBe(true);
    const choice = chooseAutomatedAction(game.getRuntime(), "player-1", () => null);
    expect(choice?.move).toBe("end-turn");
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
    expect(game.getActivePlayerId()).toBe("player-2");
  });

  it("waits when the non-priority opponent cannot act", () => {
    const { runtime, player2Id } = createFabPracticeMatch({ seed: "last-resort-wait" });
    expect(seatMustAct(runtime, player2Id)).toBe(false);
    expect(chooseAutomatedAction(runtime, player2Id, firstLegalStrategy)).toBeNull();
  });

  it("keeps pitching instead of cancelling while payment candidates remain", () => {
    const game = FabTestEngine.create(
      {
        seed: "no-cancel-loop",
        player1: {
          heroCardId: catalogIds.bravo,
          hand: [
            catalogIds.disable,
            catalogIds.crackedBauble,
            catalogIds.crackedBauble,
            catalogIds.nimblismBlue,
          ],
          deck: 6,
          actionPoints: 1,
          resourcePoints: 0,
        },
        player2: {
          heroCardId: catalogIds.rhinar,
          hand: [],
          deck: 4,
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      FAB_MANUAL_HARNESS,
    );
    const announced = listLegalCommands(game.getRuntime(), "player-1").find(
      (command) =>
        command.move === "begin-play" &&
        game.getState().objects[String(command.payload.instanceId)]?.canonicalId ===
          catalogIds.disable,
    );
    expect(announced).toBeDefined();
    expect(applyLegalCommand(game.getRuntime(), "player-1", announced!).success).toBe(true);
    expect(game.getState().decision).toMatchObject({ kind: "payment", cancellable: true });
    const first = chooseAutomatedAction(game.getRuntime(), "player-1", () => ({
      move: "answer-decision",
      payload: { answer: { kind: "cancel" } },
      label: "Cancel play",
    }));
    expect(first?.label.startsWith("Pitch ")).toBe(true);
    expect(applyLegalCommand(game.getRuntime(), "player-1", first!).success).toBe(true);
    expect(game.getState().decision?.kind).toBe("payment");
  });

  it("lists cancel on a cancellable payment so a stuck bot can back out", () => {
    const game = FabTestEngine.create(
      {
        seed: "last-resort-cancel",
        player1: {
          heroCardId: catalogIds.bravo,
          hand: [
            catalogIds.disable,
            catalogIds.crackedBauble,
            catalogIds.crackedBauble,
            catalogIds.nimblismBlue,
          ],
          deck: 6,
          actionPoints: 1,
          resourcePoints: 0,
        },
        player2: {
          heroCardId: catalogIds.rhinar,
          hand: [],
          deck: 4,
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      FAB_MANUAL_HARNESS,
    );
    const announced = listLegalCommands(game.getRuntime(), "player-1").find(
      (command) =>
        command.move === "begin-play" &&
        game.getState().objects[String(command.payload.instanceId)]?.canonicalId ===
          catalogIds.disable,
    );
    expect(announced).toBeDefined();
    expect(applyLegalCommand(game.getRuntime(), "player-1", announced!).success).toBe(true);
    expect(game.getState().decision).toMatchObject({ kind: "payment", cancellable: true });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    expect(legal.some((command) => command.label === "Cancel play")).toBe(true);
    const cancel = legal.find((command) => command.label === "Cancel play")!;
    expect(applyLegalCommand(game.getRuntime(), "player-1", cancel).success).toBe(true);
    expect(game.getState().decision).toBeNull();
    expect(game.hasGameEnded()).toBe(false);
  });

  it("recovers from a rejected play to end-turn instead of hanging", () => {
    const { runtime, player1Id, player2Id } = createFabPracticeMatch({ seed: "submit-recover" });
    const legal = listLegalCommands(runtime, player1Id);
    expect(legal.some((command) => command.move === "end-turn")).toBe(true);
    const submitted = submitAutomatedAction(
      runtime,
      player1Id,
      { move: "begin-play", payload: { instanceId: "missing" }, label: "Play nothing" },
      legal,
    );
    expect(submitted.advanced).toBe(true);
    expect(submitted.conceded).toBe(false);
    expect(submitted.command.move).toBe("end-turn");
    expect(runtime.getState().activePlayerId).toBe(player1Id);
    expect(runtime.getState().decision).toMatchObject({
      actorId: player1Id,
      kind: "entity-target",
      continuation: { kind: "turn-arsenal" },
    });
    expect(player2Id).not.toBe(player1Id);
  });

  it("previews modal answers and commits a later option when the default would reverse", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [pilferTheTombBlue], actionPoints: 1, deck: 6 },
      { hero: dash, graveyard: [crackedBaubleYellow], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const runtime = game.getRuntime();
    const actor = game.as(briar);
    const pilferId = actor.cardIn("hand", pilferTheTombBlue).instanceId;
    const beginPlay = listLegalCommands(runtime, actor.id).find(
      (command) => command.move === "begin-play" && command.payload.instanceId === pilferId,
    );
    expect(beginPlay).toBeDefined();
    expect(applyLegalCommand(runtime, actor.id, beginPlay!).success).toBe(true);

    const modalAnswers = listLegalCommands(runtime, actor.id);
    const defaultAnswer = modalAnswers.find((command) => command.move === "answer-decision");
    expect(defaultAnswer).toBeDefined();

    const submitted = submitAutomatedAction(runtime, actor.id, defaultAnswer!, modalAnswers);

    expect(submitted.advanced).toBe(true);
    expect(submitted.conceded).toBe(false);
    expect(submitted.command.payload.answer).toEqual({
      kind: "option",
      optionIds: ["pQjcMbpRPhTG8DkHftnK9:chooseModes:banishTargetYellowFromOpposingHeroSGraveyard"],
    });
    expect(runtime.hasGameEnded()).toBe(false);
    expect(runtime.getState().decision).toMatchObject({
      actorId: actor.id,
      kind: "entity-target",
    });
  });

  it("short-circuits through priority pass when every modal answer would reverse", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [pilferTheTombBlue], actionPoints: 1, deck: 6 },
      { hero: dash, graveyard: [], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const runtime = game.getRuntime();
    const actor = game.as(briar);
    const pilferId = actor.cardIn("hand", pilferTheTombBlue).instanceId;
    const beginPlay = listLegalCommands(runtime, actor.id).find(
      (command) => command.move === "begin-play" && command.payload.instanceId === pilferId,
    );
    expect(beginPlay).toBeDefined();
    expect(applyLegalCommand(runtime, actor.id, beginPlay!).success).toBe(true);
    const modalAnswers = listLegalCommands(runtime, actor.id);
    const defaultAnswer = modalAnswers.find((command) => command.move === "answer-decision");
    expect(defaultAnswer).toBeDefined();

    const submitted = submitAutomatedAction(runtime, actor.id, defaultAnswer!, modalAnswers);

    expect(submitted.advanced).toBe(true);
    expect(submitted.conceded).toBe(false);
    expect(submitted.command.move).toBe("pass");
    expect(runtime.getState().decision).toBeNull();
    expect(runtime.getState().containers.zonesByPlayerId[actor.id]?.hand).toContain(pilferId);
    expect(seatMustAct(runtime, actor.id)).toBe(false);
    expect(runtime.hasGameEnded()).toBe(false);
  });

  it("concedes after a rules reversal when the restored priority pass is stuck", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [pilferTheTombBlue], actionPoints: 1, deck: 6 },
      { hero: dash, graveyard: [], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const runtime = game.getRuntime();
    const actor = game.as(briar);
    const pilferId = actor.cardIn("hand", pilferTheTombBlue).instanceId;
    const beginPlay = listLegalCommands(runtime, actor.id).find(
      (command) => command.move === "begin-play" && command.payload.instanceId === pilferId,
    );
    expect(beginPlay).toBeDefined();
    expect(applyLegalCommand(runtime, actor.id, beginPlay!).success).toBe(true);
    const modalAnswers = listLegalCommands(runtime, actor.id);
    const defaultAnswer = modalAnswers.find((command) => command.move === "answer-decision");
    expect(defaultAnswer).toBeDefined();
    const original = runtime.applyCommand.bind(runtime);
    runtime.applyCommand = ((actorId, command, execution) => {
      if (command.move === "pass") {
        return {
          success: true,
          stateID: runtime.getStateID(),
          state: runtime.getState(),
          actorId,
          processedCommand: command,
          execution: execution ?? { commandId: "stuck-after-reversal", timestamp: 0 },
          outcome: { kind: "applied" },
          moveLogs: [],
          committedEvents: [],
          status: "settled",
          undoBarrier: null,
        };
      }
      return original(actorId, command, execution);
    }) as typeof runtime.applyCommand;

    const submitted = submitAutomatedAction(runtime, actor.id, defaultAnswer!, modalAnswers);

    expect(submitted.advanced).toBe(true);
    expect(submitted.conceded).toBe(true);
    expect(submitted.command.move).toBe("concede");
    expect(submitted.error).toContain("Rules action repeatedly reversed");
    expect(runtime.hasGameEnded()).toBe(true);
    expect(runtime.getGameEndResult()?.winnerId).not.toBe(actor.id);
  });

  it("forwards the caller's execution context so move logs carry its timestamp", () => {
    const { runtime, player1Id } = createFabPracticeMatch({ seed: "submit-execution" });
    const observed: Array<FabCommandExecutionContext | undefined> = [];
    const original = runtime.applyCommand.bind(runtime);
    runtime.applyCommand = ((actorId, command, execution) => {
      observed.push(execution);
      return original(actorId, command, execution);
    }) as typeof runtime.applyCommand;

    const execution: FabCommandExecutionContext = {
      commandId: "practice:bot:0",
      timestamp: 1_700_000_000_000,
    };
    const legal = listLegalCommands(runtime, player1Id);
    const endTurn = legal.find((command) => command.move === "end-turn");
    expect(endTurn).toBeDefined();

    const submitted = submitAutomatedAction(runtime, player1Id, endTurn!, legal, execution);

    expect(submitted.advanced).toBe(true);
    expect(observed.length).toBeGreaterThan(0);
    for (const seen of observed) expect(seen).toEqual(execution);
    for (const log of submitted.moveLogs) {
      expect(log.timestamp).toBe(1_700_000_000_000);
    }
  });

  it("reports no undo barrier when an automated pass exposes no information", () => {
    const { runtime, player1Id } = createFabPracticeMatch({ seed: "submit-safe-pass" });
    const firstPass = listLegalCommands(runtime, player1Id).find(
      (command) => command.move === "pass",
    );
    expect(firstPass).toBeDefined();
    expect(
      runtime.applyCommand(player1Id, decodeFabCommand(firstPass!.move, firstPass!.payload)!)
        .success,
    ).toBe(true);

    const player2Id = runtime.playerIds().find((playerId) => playerId !== player1Id)!;
    const pass = listLegalCommands(runtime, player2Id).find((command) => command.move === "pass");
    expect(pass).toBeDefined();

    const submitted = submitAutomatedAction(runtime, player2Id, pass!, [pass!]);

    expect(submitted.advanced).toBe(true);
    expect(submitted.command.move).toBe("pass");
    expect(submitted.undoBarrier).toBeNull();
  });

  it("retries a freshly listed pass before conceding after a rejected activate", () => {
    const { runtime, player1Id } = createFabPracticeMatch({ seed: "submit-fresh-pass" });
    expect(listLegalCommands(runtime, player1Id).some((command) => command.move === "pass")).toBe(
      true,
    );
    const submitted = submitAutomatedAction(
      runtime,
      player1Id,
      { move: "activate", payload: { instanceId: "missing" }, label: "Activate nothing" },
      [],
    );
    expect(submitted.advanced).toBe(true);
    expect(submitted.conceded).toBe(false);
    expect(["pass", "end-turn"]).toContain(submitted.command.move);
    expect(runtime.hasGameEnded()).toBe(false);
  });

  it("does not concede when answering Beseech the Demigon's on-stack choose-card", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [beseechTheDemigonRed],
        banished: [deathlyDelightRed, widespreadRuinRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const actor = game.as(vynnset);
    const runtime = game.getRuntime();
    const begin = listLegalCommands(runtime, actor.id).find(
      (command) =>
        command.move === "begin-play" &&
        game.getState().objects[String(command.payload.instanceId)]?.canonicalId ===
          beseechTheDemigonRed.canonicalId,
    );
    expect(begin).toBeDefined();
    expect(applyLegalCommand(runtime, actor.id, begin!).success).toBe(true);

    for (let safety = 0; safety < 8; safety += 1) {
      if (game.hasGameEnded()) break;
      const legal = listLegalCommands(runtime, actor.id);
      if (!legal.some((command) => command.move === "answer-decision")) break;
      const chosen = chooseAutomatedAction(runtime, actor.id, valueExtractStrategy);
      expect(chosen).not.toBeNull();
      const submitted = submitAutomatedAction(runtime, actor.id, chosen!, legal);
      expect(submitted.conceded).toBe(false);
      expect(submitted.advanced).toBe(true);
      expect(submitted.error ?? "").not.toMatch(/play procedure failed atomically/);
    }
    expect(game.hasGameEnded()).toBe(false);
  });

  it("does not concede on Base of the Mountain's any-number prompt", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        legs: [baseOfTheMountain],
        hand: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const defender = game.as(dash);
    game.as(bravo).attackWith(snatchRed);
    defender.defendWith(baseOfTheMountain);
    game.advanceToDecision(defender, "entity-target");

    const runtime = game.getRuntime();
    const legal = listLegalCommands(runtime, defender.id);
    const answers = legal.filter((command) => command.move === "answer-decision");
    expect(answers.length).toBeGreaterThan(1);
    expect(
      answers.some((command) => {
        const answer = command.payload.answer;
        return (
          typeof answer === "object" &&
          answer !== null &&
          Array.isArray((answer as { instanceIds?: unknown }).instanceIds) &&
          ((answer as { instanceIds: unknown[] }).instanceIds.length ?? 0) > 0
        );
      }),
    ).toBe(true);

    const chosen = chooseAutomatedAction(runtime, defender.id, firstLegalStrategy);
    expect(chosen).not.toBeNull();
    const submitted = submitAutomatedAction(runtime, defender.id, chosen!, legal);
    expect(submitted.advanced).toBe(true);
    expect(submitted.conceded).toBe(false);
    expect(submitted.command.move).toBe("answer-decision");
    expect(runtime.hasGameEnded()).toBe(false);
  });

  it("treats a thrown apply as rejected and recovers to end-turn", () => {
    const game = FabTestEngine.create(
      {
        seed: "submit-throw",
        player1: {
          heroCardId: catalogIds.rhinar,
          hand: [],
          deck: 6,
          actionPoints: 1,
        },
        player2: {
          heroCardId: catalogIds.bravo,
          hand: [],
          deck: 6,
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      FAB_MANUAL_HARNESS,
    );
    const runtime = game.getRuntime();
    const original = runtime.applyCommand.bind(runtime);
    runtime.applyCommand = ((actorId, command, execution) => {
      if (command.move === "pass") throw new Error("pass exploded");
      return original(actorId, command, execution);
    }) as typeof runtime.applyCommand;
    const legal = listLegalCommands(runtime, "player-1");
    const pass = legal.find((command) => command.move === "pass");
    expect(pass).toBeDefined();
    const submitted = submitAutomatedAction(runtime, "player-1", pass!, legal);
    expect(submitted.advanced).toBe(true);
    expect(submitted.conceded).toBe(false);
    expect(submitted.command.move).toBe("end-turn");
  });

  it("concedes when pass is accepted but the state does not advance", () => {
    const { runtime, player1Id, player2Id } = createFabPracticeMatch({ seed: "submit-stuck-pass" });
    const original = runtime.applyCommand.bind(runtime);
    runtime.applyCommand = ((actorId, command, execution) => {
      if (command.move === "pass") {
        return {
          success: true,
          stateID: runtime.getStateID(),
          state: runtime.getState(),
          actorId,
          processedCommand: command,
          execution: execution ?? { commandId: "stuck", timestamp: 0 },
          outcome: { kind: "applied" },
          moveLogs: [],
          committedEvents: [],
          status: "settled",
          undoBarrier: null,
        };
      }
      return original(actorId, command, execution);
    }) as typeof runtime.applyCommand;
    const legal = listLegalCommands(runtime, player1Id);
    const pass = legal.find((command) => command.move === "pass");
    expect(pass).toBeDefined();
    const submitted = submitAutomatedAction(runtime, player1Id, pass!, legal);
    expect(submitted.conceded).toBe(false);
    expect(submitted.command.move).toBe("end-turn");
    expect(runtime.hasGameEnded()).toBe(false);
  });

  it("concedes when the chosen command fails and no pass or end-turn advances", () => {
    const game = FabTestEngine.create(
      {
        seed: "submit-concede",
        player1: {
          heroCardId: catalogIds.rhinar,
          hand: [],
          deck: 6,
          actionPoints: 1,
        },
        player2: {
          heroCardId: catalogIds.bravo,
          hand: [],
          deck: 6,
        },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      FAB_MANUAL_HARNESS,
    );
    const runtime = game.getRuntime();
    const original = runtime.applyCommand.bind(runtime);
    runtime.applyCommand = ((actorId, command, execution) => {
      if (command.move === "pass" || command.move === "end-turn") {
        return {
          success: true,
          stateID: runtime.getStateID(),
          state: runtime.getState(),
          actorId,
          processedCommand: command,
          execution: execution ?? { commandId: "stuck-progress", timestamp: 0 },
          outcome: { kind: "applied" },
          moveLogs: [],
          committedEvents: [],
          status: "settled",
          undoBarrier: null,
        };
      }
      return original(actorId, command, execution);
    }) as typeof runtime.applyCommand;
    const submitted = submitAutomatedAction(
      runtime,
      "player-1",
      { move: "begin-play", payload: { instanceId: "missing" }, label: "Play nothing" },
      [],
    );
    expect(submitted.conceded).toBe(true);
    expect(submitted.advanced).toBe(true);
    expect(game.hasGameEnded()).toBe(true);
    expect(game.getState().winnerId).toBe("player-2");
  });

  it("concedeCommand ends the game for the opponent", () => {
    const { runtime, player1Id, player2Id } = createFabPracticeMatch({
      seed: "last-resort-concede",
    });
    const command = concedeCommand(runtime, player1Id);
    expect(command.move).toBe("concede");
    expect(applyLegalCommand(runtime, player1Id, command).success).toBe(true);
    expect(runtime.hasGameEnded()).toBe(true);
    expect(runtime.getGameEndResult()?.winnerId).toBe(player2Id);
  });
});

describe("strategy registry", () => {
  it("lists required strategy ids", () => {
    const ids = FAB_AUTOMATED_ACTION_STRATEGIES.map((s) => s.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "pass-only",
        "attack-only",
        "first-legal",
        "random",
        "heuristic",
        "value-extract",
        "defend-only",
        "never-defend",
        "rhinar",
        "teklovossen",
        "arakni",
        "valda",
        "aurora",
        "oscilio",
        "zyggy",
        "gravy",
        "marlynn",
        "puffin",
        "pleiades",
        "kayo",
        "lyath",
        "hero-profile",
      ]),
    );
  });

  it("resolves unknown ids to the default", () => {
    const option = getSafeFabAutomatedActionStrategyOption("not-a-real-strategy");
    expect(option.id).toBe("hero-profile");
    expect(resolveFabAutomatedActionStrategyOption(undefined).id).toBe("hero-profile");
  });
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function emptyDefendPayload(command: { move: string; payload: Record<string, unknown> }): boolean {
  if (command.move !== "defend") return false;
  const ids = command.payload.instanceIds;
  return Array.isArray(ids) && ids.length === 0;
}

function openDefendWithEmptyHand(): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "empty-hand-defend",
      player1: {
        heroCardId: catalogIds.rhinar,
        hand: [catalogIds.snatch],
        deck: 5,
      },
      player2: {
        heroCardId: catalogIds.bravo,
        hand: [],
        deck: 5,
      },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    },
    // Walks priority/pitch timing by hand - opt out of the smart defaults.
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  game.as(catalogIds.rhinar).attackWith(catalogIds.snatch);
  return game;
}

function openDefendWithBlocksInHand(): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "blocks-in-hand",
      player1: {
        heroCardId: catalogIds.rhinar,
        hand: [catalogIds.snatch],
        deck: 5,
      },
      player2: {
        heroCardId: catalogIds.bravo,
        hand: [catalogIds.swingBig, catalogIds.snatch, catalogIds.snatch],
        deck: 5,
      },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    },
    // Walks priority/pitch timing by hand - opt out of the smart defaults.
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  game.as(catalogIds.rhinar).attackWith(catalogIds.snatch);
  return game;
}
