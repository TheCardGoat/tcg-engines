import { readTheRunesYellow } from "@tcg/flesh-and-blood-cards/cards/actions/read-the-runes";
import { viseraiBetweenWorlds } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai-between-worlds";
import { PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID } from "@tcg/flesh-and-blood-cards/runtime-registry";
import { visibleFabPlayerLog } from "@tcg/flesh-and-blood-engine/simulator";
import { expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { describe, expect, it } from "vitest";

import { projectFabPlayerNarrativeHistory } from "../player-narrative-projection";
import { TRAVERSE_SCENARIOS } from "./traverse";

describe("Viserai traverse QA fixture", () => {
  it("covers the Runechant-threshold traverse and the optional end-phase traverse back", () => {
    const match = TRAVERSE_SCENARIOS["viserai-traverse-threshold"].boot();
    const game = match.engine;
    const physicalViserai = PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID.get(
      viseraiBetweenWorlds.canonicalId,
    );
    if (!physicalViserai) throw new Error("Missing physical Viserai twin card.");
    const player = game.as(physicalViserai);

    expectFabPlayer(player).toHaveLife(17).toBeMarked().toHaveTokenCount("runechant", 1);
    expectFabCard(player, physicalViserai).toHaveName("Viserai, Between Worlds");
    expect(player.zone("banished")).toHaveLength(1);

    player.must.play(readTheRunesYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(player).toHaveLife(17).toBeMarked().toHaveTokenCount("runechant", 3);
    expectFabCard(player, physicalViserai).toHaveName("Viserai, Usurper");
    expect(player.zone("banished")).toHaveLength(2);

    for (let passCycle = 0; passCycle < 6 && !game.getState().decision; passCycle += 1) {
      game.passBoth();
    }
    expect(player.expectDecision("boolean")).toMatchObject({
      acceptLabel: "Use effect",
      declineLabel: "Decline",
    });
    player.accept();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(player).toHaveLife(17).toBeMarked();
    expectFabCard(player, physicalViserai).toHaveName("Viserai, Between Worlds");

    const transformMessages = game
      .moveLogs()
      .flatMap((log) => log.public)
      .filter((message) => message.key === "flesh-and-blood.transform");
    expect(transformMessages).toHaveLength(2);
    expect(transformMessages[0]?.objectRefs).toEqual({
      cardName: {
        instanceId: expect.any(String),
        canonicalId: viseraiBetweenWorlds.canonicalId,
      },
      intoName: {
        instanceId: expect.any(String),
        canonicalId: viseraiBetweenWorlds.canonicalId,
      },
    });
    expect(transformMessages[1]?.objectRefs).toEqual({
      cardName: {
        instanceId: expect.any(String),
        canonicalId: viseraiBetweenWorlds.canonicalId,
      },
      intoName: {
        instanceId: expect.any(String),
        canonicalId: viseraiBetweenWorlds.canonicalId,
      },
    });

    const transformRow = projectFabPlayerNarrativeHistory(
      game.playerNarratives().map((log) => visibleFabPlayerLog(log, match.player1Id)),
      {
        viewerId: match.player1Id,
        seatIds: [match.player1Id, match.player2Id],
      },
    ).find((row) => row.title === "Viserai, Between Worlds transformed into Viserai, Usurper");
    expect(transformRow?.cardRefs?.map((reference) => reference.name)).toEqual([
      "Viserai, Between Worlds",
      "Viserai, Usurper",
    ]);

    const returnTransformRow = projectFabPlayerNarrativeHistory(
      game.playerNarratives().map((log) => visibleFabPlayerLog(log, match.player1Id)),
      {
        viewerId: match.player1Id,
        seatIds: [match.player1Id, match.player2Id],
      },
    ).find((row) => row.title === "Viserai, Usurper transformed into Viserai, Between Worlds");
    expect(returnTransformRow?.cardRefs?.map((reference) => reference.name)).toEqual([
      "Viserai, Usurper",
      "Viserai, Between Worlds",
    ]);
  });
});
