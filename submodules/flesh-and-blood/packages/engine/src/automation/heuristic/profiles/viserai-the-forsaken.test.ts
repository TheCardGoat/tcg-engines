import { describe, expect, it } from "vite-plus/test";
import { decodeFabCommand } from "../../../moves.ts";
import { FabMatchRuntime } from "../../../runtime.ts";
import { FAB_MANUAL_HARNESS } from "../../../testing/harness-config.ts";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { listLegalCommands } from "../../legal-commands.ts";
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../../catalog-test-cards.ts";
import { buildHeuristicSnapshot } from "../snapshot.ts";
import { isViseraiForsakenHero } from "./names.ts";
import { viseraiForsakenAdjustScore, viseraiForsakenStrategy } from "./viserai-the-forsaken.ts";

const CARD_DEFINITIONS = CATALOG_TEST_DEFINITIONS;

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

function forsakenSeat(
  hand: readonly string[],
  extras?: { arena?: readonly string[]; resourcePoints?: number },
): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "viserai-forsaken-guide",
      player1: {
        heroCardId: catalogIds.viseraiTheForsaken,
        hand: [...hand],
        deck: 8,
        arena: extras?.arena ? [...extras.arena] : undefined,
        actionPoints: 1,
        resourcePoints: extras?.resourcePoints ?? 0,
      },
      player2: { heroCardId: catalogIds.bravo, hand: [], deck: 8 },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
}

function forsakenDefending(hand: readonly string[]): FabTestEngine {
  const game = FabTestEngine.create(
    {
      seed: "viserai-forsaken-defend",
      player1: { heroCardId: catalogIds.bravo, hand: [catalogIds.snatch], deck: 6 },
      player2: { heroCardId: catalogIds.viseraiTheForsaken, hand: [...hand], deck: 6 },
      cardDefinitions: CARD_DEFINITIONS,
    },
    FAB_MANUAL_HARNESS,
  );
  game.as(catalogIds.bravo).attackWith(catalogIds.snatch);
  return game;
}

describe("Viserai, the Forsaken Runechant/Ursur profile", () => {
  it("keeps binding the seat after traverse flips the face to Viserai, Usurper", () => {
    // Seated front face.
    expect(
      isViseraiForsakenHero({ heroName: "Viserai, the Forsaken", heroCanonicalId: null }),
    ).toBe(true);
    // Post-traverse: the twin flip keeps the Forsaken canonical id under the
    // "Viserai, Usurper" active-face name.
    expect(
      isViseraiForsakenHero({
        heroName: "Viserai, Usurper",
        heroCanonicalId: "RLJggjWTcq6NK9PD9zQGh",
      }),
    ).toBe(true);
    // Flipped Between Worlds shows the same "Viserai, Usurper" face name but
    // keeps its own canonical id — a different seat, not this profile's.
    expect(
      isViseraiForsakenHero({
        heroName: "Viserai, Usurper",
        heroCanonicalId: "zggWCkTJQgBjj7FCDTwmQ",
      }),
    ).toBe(false);
    // Standalone Viserai, Usurper hero.
    expect(
      isViseraiForsakenHero({
        heroName: "Viserai, Usurper",
        heroCanonicalId: "QMGnHJqg6fhcKLfmpRQLz",
      }),
    ).toBe(false);
    expect(isViseraiForsakenHero({ heroName: "Viserai, Rune Blood", heroCanonicalId: null })).toBe(
      false,
    );
    expect(
      isViseraiForsakenHero({ heroName: "Viserai, Between Worlds", heroCanonicalId: null }),
    ).toBe(false);
  });

  it("starts the Runechant engine on a go-again aura before attacking", () => {
    const game = forsakenSeat([
      catalogIds.maleficIncantation,
      catalogIds.bloodsongGloomblade,
      catalogIds.goreBelching,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = viseraiForsakenStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.maleficIncantation);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("uses Become the Shadow Lord to open the engine without an incantation", () => {
    const game = forsakenSeat([
      catalogIds.becomeTheShadowLord,
      catalogIds.bloodsongGloomblade,
      catalogIds.goreBelching,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = viseraiForsakenStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.becomeTheShadowLord);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("recycles the aura with Deadwood Dirge before the Gloomblade once auras are live", () => {
    const game = forsakenSeat([catalogIds.bloodsongGloomblade, catalogIds.deadwoodDirge], {
      arena: [catalogIds.maleficIncantation],
      resourcePoints: 1,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = viseraiForsakenStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.deadwoodDirge);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("sends the Gloomblade once an aura is live and no chain piece is in hand", () => {
    const game = forsakenSeat([catalogIds.bloodsongGloomblade, catalogIds.hauntyRendition], {
      arena: [catalogIds.maleficIncantation],
      resourcePoints: 1,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = viseraiForsakenStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.bloodsongGloomblade);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("fires the go-again pump before the attack it boosts", () => {
    const game = forsakenSeat([catalogIds.painfulPassage, catalogIds.bloodsongGloomblade], {
      arena: [catalogIds.maleficIncantation],
      resourcePoints: 1,
    });
    const legal = listLegalCommands(game.getRuntime(), "player-1");
    const choice = viseraiForsakenStrategy(game.getRuntime(), "player-1", legal);
    expect(choice?.move).toBe("begin-play");
    expect(playedCanonical(game, choice!)).toBe(catalogIds.painfulPassage);
    expect(applyLegalCommand(game.getRuntime(), "player-1", choice!).success).toBe(true);
  });

  it("does not block with the Gloomblades", () => {
    const game = forsakenDefending([
      catalogIds.bloodsongGloomblade,
      catalogIds.becomeTheShadowLord,
      catalogIds.maleficIncantation,
    ]);
    const legal = listLegalCommands(game.getRuntime(), "player-2");
    const choice = viseraiForsakenStrategy(game.getRuntime(), "player-2", legal);
    const ids = Array.isArray(choice?.payload.instanceIds)
      ? (choice!.payload.instanceIds as string[])
      : [];
    const names = ids.map((id) => game.getState().objects[id]?.canonicalId);
    expect(names).not.toContain(catalogIds.bloodsongGloomblade);
    expect(applyLegalCommand(game.getRuntime(), "player-2", choice!).success).toBe(true);
  });

  it("passes instead of destroying Gate to i'Arathael on the opponent's turn", () => {
    const game = FabTestEngine.create(
      {
        seed: "viserai-forsaken-off-turn-gate",
        player1: { heroCardId: catalogIds.bravo, hand: [], deck: 8 },
        player2: {
          heroCardId: catalogIds.viseraiTheForsaken,
          hand: [],
          arena: [catalogIds.gateToIArathael],
          resourcePoints: 1,
          deck: 8,
        },
        cardDefinitions: CARD_DEFINITIONS,
      },
      FAB_MANUAL_HARNESS,
    );
    game.as(catalogIds.bravo).pass();
    const legal = listLegalCommands(game.getRuntime(), "player-2");

    expect(legal.some((command) => command.move === "activate")).toBe(true);
    expect(viseraiForsakenStrategy(game.getRuntime(), "player-2", legal)?.move).toBe("pass");
  });

  it("penalizes Invert Existence when the opposing graveyard is empty", () => {
    const game = forsakenSeat([catalogIds.maleficIncantation]);
    const base = buildHeuristicSnapshot(
      game.getRuntime(),
      "player-1",
      buildFabRulesView(game.getState()),
    );
    const source = base.hand[0]!;
    const invert = { ...source, name: "Invert Existence", types: ["Instant"] };
    const snapshot = { ...base, hand: [invert], opponentGraveyardCount: 0 };
    const command = listLegalCommands(game.getRuntime(), "player-1").find(
      (candidate) => candidate.move === "begin-play",
    )!;
    const line = {
      kind: "play" as const,
      command,
      score: 0,
      playInstanceId: invert.instanceId,
      pitchInstanceIds: [],
      arsenalInstanceId: null,
      defendInstanceIds: null,
    };

    expect(viseraiForsakenAdjustScore(line, snapshot)).toBeLessThan(-500);
    expect(
      viseraiForsakenAdjustScore(line, { ...snapshot, opponentGraveyardCount: 1 }),
    ).toBeGreaterThan(-500);
  });
});
