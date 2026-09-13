import { describe, expect, it } from "vite-plus/test";
import { decodeFabCommand } from "../../../moves.ts";
import { FabMatchRuntime } from "../../../runtime.ts";
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";
import { FAB_MANUAL_HARNESS } from "../../../testing/harness-config.ts";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { listLegalCommands } from "../../legal-commands.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../../catalog-test-cards.ts";
import { buildHeuristicSnapshot } from "../snapshot.ts";
import { heroProfileStrategy } from "./dispatch.ts";
import { isMaliceHero } from "./names.ts";
import { maliceRankingHint, maliceStrategy, readMaliceBoard } from "./malice.ts";

const CARD_DEFINITIONS = CATALOG_TEST_DEFINITIONS;
const MALICE = catalogIds.malice;
const BRAVO = catalogIds.bravo;

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

function playedCanonical(
  game: FabTestEngine,
  choice: { payload: Record<string, unknown> },
): string {
  return String(game.getState().objects[String(choice.payload.instanceId)]?.canonicalId);
}

function maliceSeat(
  hand: readonly string[],
  extras?: {
    graveyard?: readonly string[];
    banished?: readonly string[];
    arena?: readonly string[];
    actionPoints?: number;
    resourcePoints?: number;
    weapon1?: readonly string[];
    arms?: readonly string[];
    head?: readonly string[];
  },
): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "malice-guide",
      player1: {
        heroCardId: MALICE,
        hand: [...hand],
        deck: 8,
        graveyard: extras?.graveyard ? [...extras.graveyard] : undefined,
        banished: extras?.banished ? [...extras.banished] : undefined,
        arena: extras?.arena ? [...extras.arena] : undefined,
        actionPoints: extras?.actionPoints ?? 1,
        resourcePoints: extras?.resourcePoints ?? 1,
        weapon1: extras?.weapon1 ? [...extras.weapon1] : undefined,
        arms: extras?.arms ? [...extras.arms] : undefined,
        head: extras?.head ? [...extras.head] : undefined,
      },
      player2: {
        heroCardId: BRAVO,
        hand: [],
        deck: 8,
      },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
}

function maliceDefending(hand: readonly string[], life?: number): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "malice-defend",
      player1: {
        heroCardId: BRAVO,
        hand: [catalogIds.snatch],
        deck: 6,
      },
      player2: {
        heroCardId: MALICE,
        hand: [...hand],
        deck: 6,
        life,
      },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
  game.as(BRAVO).attackWith(catalogIds.snatch);
  return game;
}

describe("Malice, Domina of the Dead profile", () => {
  it("activates the {r},{t} ability while a Zombie waits in the graveyard", () => {
    const game = maliceSeat([catalogIds.sinkBelow], {
      graveyard: [catalogIds.restlessMagister],
      actionPoints: 2,
      resourcePoints: 1,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = maliceStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("activate");
    expect(String(choice?.payload.instanceId)).toContain("fab-hero");
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("binds the graveyard-play permission to the graveyard Zombie", () => {
    const game = maliceSeat([catalogIds.sinkBelow], {
      graveyard: [catalogIds.restlessMagister],
      actionPoints: 2,
      resourcePoints: 1,
    });
    const runtime = game.getRuntime();
    const legal = listLegalCommands(runtime, "player-1");
    const activate = legal.find(
      (command) =>
        command.move === "activate" && String(command.payload.instanceId).startsWith("fab-hero"),
    );
    expect(activate).toBeDefined();
    applyLegalCommand(runtime, "player-1", activate!);
    const target = maliceStrategy(runtime, "player-1", listLegalCommands(runtime, "player-1"));
    expect(target?.move).toBe("answer-decision");
    const answer = target?.payload.answer as { instanceIds?: readonly string[] };
    const gyInstance = game
      .getState()
      .containers.zonesByPlayerId["player-1"]?.graveyard.find(
        (id) => game.getState().objects[id]?.canonicalId === catalogIds.restlessMagister,
      );
    expect(gyInstance).toBeDefined();
    expect(answer.instanceIds).toContain(gyInstance);
  });

  it("plays a Restless Zombie from hand on an empty loop", () => {
    const game = maliceSeat([catalogIds.restlessCommander, catalogIds.sinkBelow], {
      actionPoints: 1,
      resourcePoints: 0,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = maliceStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.restlessCommander);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("opens with Ominous Toll when the loop is not set up", () => {
    const game = maliceSeat([catalogIds.ominousToll, catalogIds.sinkBelow], {
      graveyard: [catalogIds.restlessCommander],
      actionPoints: 1,
      resourcePoints: 0,
    });
    const snapshot = buildHeuristicSnapshot(
      game.getRuntime(),
      "player-1",
      buildFabRulesView(game.getState()),
    );
    const read = readMaliceBoard(snapshot);
    expect(read.gyZombies).toHaveLength(1);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = maliceStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.ominousToll);
  });

  it("prefers Ominous Toll with a Zombie in hand — the every-turn Gate generator", () => {
    const game = maliceSeat(
      [catalogIds.ominousToll, catalogIds.restlessMagister, catalogIds.sinkBelow],
      {
        actionPoints: 2,
        resourcePoints: 1,
      },
    );
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = maliceStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.ominousToll);
  });

  it("activates Undead Grasp before a follow-up zombie attack", () => {
    const game = maliceSeat([catalogIds.restlessMagister, catalogIds.sinkBelow], {
      arena: [catalogIds.restlessCommander],
      actionPoints: 3,
      resourcePoints: 1,
      weapon1: [catalogIds.voxNecropolis],
      arms: [catalogIds.undeadGrasp],
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const grasp = legal.find(
      (command) => command.move === "activate" && command.label.includes("Undead Grasp"),
    );
    expect(grasp).toBeDefined();
    const choice = maliceStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("activate");
    expect(String(choice?.payload.instanceId)).toBe(String(grasp!.payload.instanceId));
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("activates a live Gate to deploy the banked Corrupted Corpse", () => {
    const game = maliceSeat([catalogIds.sinkBelow], {
      arena: [catalogIds.gateToIArathael],
      banished: [catalogIds.corruptedCorpse],
      actionPoints: 2,
      resourcePoints: 1,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const gate = legal.find(
      (command) => command.move === "activate" && command.label.includes("Gate"),
    );
    expect(gate).toBeDefined();
    const choice = maliceStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("activate");
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("arsenals a corpse tutor while the graveyard loop is empty", () => {
    const game = maliceSeat([catalogIds.callToTheGrave, catalogIds.sinkBelow], {
      graveyard: [],
      actionPoints: 1,
      resourcePoints: 0,
    });
    const snapshot = buildHeuristicSnapshot(
      game.getRuntime(),
      "player-1",
      buildFabRulesView(game.getState()),
    );
    expect(readMaliceBoard(snapshot).corpseEngineLive).toBe(false);
    const hint = maliceRankingHint(snapshot);
    expect(hint.preferArsenalInstanceId).toBeDefined();
  });

  it("does not block with corpse tutors", () => {
    const game = maliceDefending([
      catalogIds.callToTheGrave,
      catalogIds.sinkBelow,
      catalogIds.arcanePolarity,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = maliceStrategy(game.getRuntime(), "player-2", legal);
    const ids = Array.isArray(choice?.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    const names = ids.map((id) => game.getState().objects[id]?.canonicalId);
    expect(names).not.toContain(catalogIds.callToTheGrave);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });

  it("blocks with a real-defense spell once life is low, sparing the Toll", () => {
    const game = maliceDefending([catalogIds.corpseCover, catalogIds.ominousToll], 8);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = maliceStrategy(game.getRuntime(), "player-2", legal);
    expect(choice?.move).toBe("defend");
    const ids = Array.isArray(choice?.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    const names = ids.map((id) => game.getState().objects[id]?.canonicalId);
    expect(names).toContain(catalogIds.corpseCover);
    expect(names).not.toContain(catalogIds.ominousToll);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });

  it("plays a defense reaction at the reaction window once life is low", () => {
    const game = FabTestEngine.create(
      {
        seed: "malice-defend",
        player1: {
          heroCardId: BRAVO,
          hand: [catalogIds.snatch],
          deck: 6,
        },
        player2: {
          heroCardId: MALICE,
          hand: [catalogIds.sinkBelow, catalogIds.restlessCommander],
          deck: 6,
          life: 8,
        },
        cardDefinitions: CARD_DEFINITIONS,
      },
      FAB_MANUAL_HARNESS,
    );
    const bravo = game.as(BRAVO);
    bravo.playAttack(catalogIds.snatch);
    game.advanceCombatTo("reaction");
    bravo.pass();
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = maliceStrategy(game.getRuntime(), "player-2", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.sinkBelow);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });

  it("hero-profile dispatches Malice, Domina of the Dead", () => {
    const game = maliceSeat([catalogIds.restlessCommander], {
      graveyard: [catalogIds.restlessMagister],
      actionPoints: 2,
      resourcePoints: 1,
    });
    const choice = heroProfileStrategy(
      game.getRuntime(),
      "player-1",
      listLegalCommands(game.getRuntime(), "player-1"),
    );
    expect(choice?.move).toBe("activate");
  });

  it("binds to Malice, Domina of the Dead — not young Malice", () => {
    expect(isMaliceHero({ heroName: "Malice, Domina of the Dead", heroCanonicalId: MALICE })).toBe(
      true,
    );
    // Young Malice shares the printed first name (IAR young printing).
    expect(isMaliceHero({ heroName: "Malice", heroCanonicalId: "rrJg7Bntjp9WzWNcnJcjw" })).toBe(
      false,
    );
  });
});
