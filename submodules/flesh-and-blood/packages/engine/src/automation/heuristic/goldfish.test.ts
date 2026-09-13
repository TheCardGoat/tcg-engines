import { describe, expect, it } from "vite-plus/test";
import { decodeFabCommand } from "../../moves.ts";
import { FabMatchRuntime } from "../../runtime.ts";
import { FAB_MANUAL_HARNESS } from "../../testing/harness-config.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { listLegalCommands } from "../legal-commands.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../catalog-test-cards.ts";
import { getSafeFabAutomatedActionStrategyOption } from "../strategy-registry.ts";
import { defendOnlyStrategy, neverDefendStrategy, valueExtractStrategy } from "./goldfish.ts";
import { savageFeastRed } from "../../../../cards/src/cards/actions/savage-feast.ts";
import { compassOfSunkenDepths } from "../../../../cards/src/cards/equipment/compass-of-sunken-depths.ts";
import { gravyBonesShipwreckedLooter } from "../../../../cards/src/cards/heroes/gravy-bones-shipwrecked-looter.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { gold } from "../../../../cards/src/cards/tokens/gold.ts";
import { jitteryBonesBlue } from "../../../../cards/src/cards/actions/jittery-bones.ts";
import { ankaDragUnderYellow } from "../../../../cards/src/cards/actions/anka-drag-under.ts";
import { chooseAutomatedAction, submitAutomatedAction } from "../bot-strategies.ts";

function applyLegalCommand(
  runtime: FabMatchRuntime,
  actorId: string,
  command: {
    readonly move: Parameters<typeof decodeFabCommand>[0];
    readonly payload: Record<string, unknown>;
  },
) {
  const decoded = decodeFabCommand(command.move, command.payload);
  if (!decoded) throw new Error(`Generated legal command ${command.move} did not decode.`);
  return runtime.applyCommand(actorId, decoded);
}

function handInstance(game: FabTestEngine, playerId: string, canonicalId: string): string {
  const ids = game.getState().containers.zonesByPlayerId[playerId]!.hand;
  const match = ids.find((id) => game.getState().objects[id]?.canonicalId === canonicalId);
  if (!match) throw new Error(`Expected ${canonicalId} in ${playerId} hand.`);
  return match;
}

function mixedExtractSeat(): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "goldfish-extract",
      player1: {
        heroCardId: catalogIds.bravo,
        hand: [
          catalogIds.snatch,
          catalogIds.nimblismBlue,
          catalogIds.crackedBauble,
          catalogIds.disable,
        ],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 0,
      },
      player2: {
        heroCardId: catalogIds.rhinar,
        hand: [],
        deck: 6,
      },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
}

function leftoverArsenalSeat(): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "goldfish-arsenal",
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
        deck: 6,
      },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
}

function openDefendWithBlocks(): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "goldfish-defend",
      player1: {
        heroCardId: catalogIds.rhinar,
        hand: [catalogIds.snatch],
        deck: 5,
      },
      player2: {
        heroCardId: catalogIds.bravo,
        hand: [catalogIds.enlightenedStrike, catalogIds.snatch, catalogIds.sinkBelow],
        deck: 5,
      },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
  game.as(catalogIds.rhinar).attackWith(catalogIds.snatch);
  return game;
}

describe("goldfish legal-command surface", () => {
  it("lists end-turn with a hand instance when arsenal is empty", () => {
    const game = mixedExtractSeat();
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const hand = game.getState().containers.zonesByPlayerId["player-1"]!.hand;
    const arsenalEnds = legal.filter(
      (command) =>
        command.move === "end-turn" &&
        typeof command.payload.arsenalInstanceId === "string" &&
        hand.includes(command.payload.arsenalInstanceId),
    );
    expect(arsenalEnds.length).toBeGreaterThan(0);
    expect(
      legal.find((command) => command.move === "end-turn" && !command.payload.arsenalInstanceId)
        ?.payload,
    ).toEqual({ chooseArsenal: true });
  });
});

describe("value-extract goldfish", () => {
  it("fully covers a turn-one attack instead of preserving the hand as next-turn offense", () => {
    const game = openDefendWithBlocks();
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = valueExtractStrategy(game.getRuntime(), "player-2", legal);
    const snatchId = handInstance(game, "player-2", catalogIds.snatch);

    expect(choice?.move).toBe("defend");
    expect(choice?.payload.instanceIds).toContain(snatchId);
    expect(choice?.payload.instanceIds).toHaveLength(2);
  });

  it("plays an on-curve attack instead of ending with a mixed attack+pitch hand", () => {
    const game = mixedExtractSeat();
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = valueExtractStrategy(game.getRuntime(), "player-1", legal);
    expect(choice).not.toBeNull();
    expect(choice!.move).toBe("begin-play");
    const played = game.getState().objects[String(choice!.payload.instanceId)];
    expect([catalogIds.disable, catalogIds.snatch, catalogIds.enlightenedStrike]).toContain(
      played?.canonicalId,
    );
    const result = applyLegalCommand(game.getRuntime(), "player-1", choice!);
    expect(result.success).toBe(true);
  });

  it("pays a costed attack with a non-attack rather than the first hand attack", () => {
    const game = mixedExtractSeat();
    const disableId = handInstance(game, "player-1", catalogIds.disable);
    const snatchId = handInstance(game, "player-1", catalogIds.snatch);
    applyLegalCommand(game.getRuntime(), "player-1", {
      move: "begin-play",
      payload: { instanceId: disableId },
    });
    expect(game.getState().decision?.kind).toBe("payment");

    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const firstPayment = legal.find((command) => command.move === "answer-decision");
    expect(firstPayment).toBeDefined();

    const choice = valueExtractStrategy(game.getRuntime(), "player-1", legal);
    expect(choice).not.toBeNull();
    expect(choice!.move).toBe("answer-decision");
    const answer = choice!.payload.answer as { instanceIds?: string[] };
    expect(answer.instanceIds).toEqual(expect.any(Array));
    expect(answer.instanceIds).not.toContain(snatchId);
    const pitched = game.getState().objects[answer.instanceIds![0]!];
    expect(pitched?.canonicalId).not.toBe(catalogIds.snatch);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("ends the turn with a leftover arsenal card when AP is 0 and arsenal is empty", () => {
    const game = leftoverArsenalSeat();
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = valueExtractStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("end-turn");
    expect(typeof choice?.payload.arsenalInstanceId).toBe("string");
    const hand = game.getState().containers.zonesByPlayerId["player-1"]!.hand;
    expect(hand).toContain(choice!.payload.arsenalInstanceId);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });
});

describe("goldfish terminal window", () => {
  it("ends the turn rather than passing when end-turn is legal", () => {
    const game = leftoverArsenalSeat();
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    expect(legal.some((command) => command.move === "end-turn")).toBe(true);
    expect(legal.some((command) => command.move === "pass")).toBe(true);
    const choice = valueExtractStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("end-turn");
  });
});

describe("goldfish utility activations", () => {
  it("ends the turn instead of tapping Compass of Sunken Depths", () => {
    const game = FabTestEngine.create(
      {
        seed: "goldfish-skip-compass",
        player1: {
          heroCardId: catalogIds.bravo,
          hand: [catalogIds.nimblismBlue],
          weapon2: [compassOfSunkenDepths.canonicalId],
          deck: 6,
          actionPoints: 0,
          resourcePoints: 0,
        },
        player2: {
          heroCardId: catalogIds.rhinar,
          hand: [],
          deck: 6,
        },
        cardDefinitions: {
          ...CATALOG_TEST_DEFINITIONS,
          [compassOfSunkenDepths.canonicalId]: compassOfSunkenDepths,
        },
      },
      FAB_MANUAL_HARNESS,
    );
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    expect(
      legal.some(
        (command) =>
          command.move === "activate" &&
          game.getState().objects[String(command.payload.instanceId)]?.canonicalId ===
            compassOfSunkenDepths.canonicalId,
      ),
    ).toBe(true);
    const choice = valueExtractStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("end-turn");
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });
});

describe("goldfish entity-target prompts", () => {
  it("discards a card after Gravy Bones loot instead of an empty target", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBonesShipwreckedLooter,
        arena: [gold],
        hand: [jitteryBonesBlue],
        deck: [ankaDragUnderYellow],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const gravy = game.as(gravyBonesShipwreckedLooter);
    gravy.activate(gravyBonesShipwreckedLooter);
    const runtime = game.getRuntime();
    for (let safety = 0; safety < 6; safety += 1) {
      if (game.hasGameEnded()) break;
      const actorId = game.getState().decision?.actorId ?? gravy.id;
      const legal = listLegalCommands(runtime, actorId);
      if (!legal.some((command) => command.move === "answer-decision")) break;
      const chosen = chooseAutomatedAction(runtime, actorId, valueExtractStrategy);
      expect(chosen).not.toBeNull();
      const submitted = submitAutomatedAction(runtime, actorId, chosen!, legal);
      expect(submitted.conceded).toBe(false);
      expect(submitted.advanced).toBe(true);
      const answer = submitted.command.payload.answer as { instanceIds?: unknown } | undefined;
      if (submitted.command.move === "answer-decision" && Array.isArray(answer?.instanceIds)) {
        expect(answer.instanceIds.length).toBeGreaterThan(0);
      }
    }
    expect(game.hasGameEnded()).toBe(false);
    const pass = listLegalCommands(runtime, gravy.id).find((command) => command.move === "pass");
    if (pass) {
      expect(applyLegalCommand(runtime, gravy.id, pass).success).toBe(true);
    }
  });
});

describe("goldfish additional-cost affordability", () => {
  it("does not announce Savage Feast when paying it would leave no discard fodder", () => {
    const game = FabTestEngine.create(
      {
        seed: "goldfish-savage-feast-unpayable",
        player1: {
          heroCardId: catalogIds.rhinar,
          hand: [savageFeastRed.canonicalId, catalogIds.nimblismBlue],
          deck: 6,
          actionPoints: 1,
          resourcePoints: 0,
        },
        player2: {
          heroCardId: catalogIds.bravo,
          hand: [],
          deck: 6,
        },
        cardDefinitions: {
          ...CATALOG_TEST_DEFINITIONS,
          [savageFeastRed.canonicalId]: savageFeastRed,
        },
      },
      FAB_MANUAL_HARNESS,
    );
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    expect(
      legal.some(
        (command) =>
          command.move === "begin-play" &&
          game.getState().objects[String(command.payload.instanceId)]?.canonicalId ===
            savageFeastRed.canonicalId,
      ),
    ).toBe(true);
    const choice = valueExtractStrategy(game.getRuntime(), "player-1", legal);
    expect(choice).not.toBeNull();
    if (choice!.move === "begin-play") {
      expect(game.getState().objects[String(choice!.payload.instanceId)]?.canonicalId).not.toBe(
        savageFeastRed.canonicalId,
      );
    }
  });
});

describe("goldfish personas", () => {
  it("defend-only does not open a begin-play attack when end-turn exists", () => {
    const game = mixedExtractSeat();
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    expect(legal.some((command) => command.move === "end-turn")).toBe(true);
    expect(legal.some((command) => command.move === "begin-play")).toBe(true);
    const choice = defendOnlyStrategy(game.getRuntime(), "player-1", legal);
    expect(choice).not.toBeNull();
    expect(choice!.move).not.toBe("begin-play");
    expect(["end-turn", "pass", "activate"]).toContain(choice!.move);
  });

  it("never-defend does not submit a non-empty defend", () => {
    const game = openDefendWithBlocks();
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    expect(
      legal.some(
        (command) =>
          command.move === "defend" &&
          Array.isArray(command.payload.instanceIds) &&
          command.payload.instanceIds.length > 0,
      ),
    ).toBe(true);
    const choice = neverDefendStrategy(game.getRuntime(), "player-2", legal);
    expect(choice).not.toBeNull();
    if (choice!.move === "defend") {
      expect(choice!.payload.instanceIds).toEqual([]);
    } else {
      expect(choice!.move).toBe("pass");
    }
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });
});

describe("line ranking hint", () => {
  it("prefers a named leftover card on end-turn", () => {
    const game = leftoverArsenalSeat();
    const baubleId = handInstance(game, "player-1", catalogIds.crackedBauble);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const nimblismId = handInstance(game, "player-1", catalogIds.nimblismBlue);
    const withoutHint = valueExtractStrategy(game.getRuntime(), "player-1", legal);
    expect(withoutHint?.move).toBe("end-turn");
    expect(withoutHint?.payload.arsenalInstanceId).toBe(nimblismId);

    const hinted = valueExtractStrategy(game.getRuntime(), "player-1", legal, {
      ranking: {
        preferred: { name: "Cracked Bauble", role: "arsenal" },
      },
    });
    expect(hinted?.move).toBe("end-turn");
    expect(hinted?.payload.arsenalInstanceId).toBe(baubleId);
    expect(hinted?.payload.arsenalInstanceId).not.toBe(withoutHint?.payload.arsenalInstanceId);
    expect(applyLegalCommand(game.getRuntime(), "player-1", hinted!).success).toBe(true);
  });
});

describe("mirror disruption (Masterclass: Mirror Matches)", () => {
  it("sends The Weakest Link over Snatch when both seats are the same hero", () => {
    const game = FabTestEngine.create(
      {
        seed: "mirror-disrupt",
        player1: {
          heroCardId: catalogIds.bravo,
          hand: [catalogIds.weakestLink, catalogIds.snatch, catalogIds.nimblismBlue],
          deck: 6,
          actionPoints: 1,
        },
        player2: { heroCardId: catalogIds.bravo, hand: [], deck: 6 },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      },
      FAB_MANUAL_HARNESS,
    );
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = valueExtractStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(game.getState().objects[String(choice?.payload.instanceId)]?.canonicalId).toBe(
      catalogIds.weakestLink,
    );
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });
});

describe("default goldfish registry", () => {
  it("unknown-hero default dispatches hero-profile and still extracts value", () => {
    const game = mixedExtractSeat();
    const option = getSafeFabAutomatedActionStrategyOption();
    expect(option.id).toBe("hero-profile");
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = option.strategy(game.getRuntime(), "player-1", legal);
    expect(choice).not.toBeNull();
    expect(legal).toContainEqual(choice);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });
});
