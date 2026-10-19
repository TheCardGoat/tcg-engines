import type { GrandArchiveAnyCard, GrandArchiveAbilityDefinition } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "../testing/test-engine.ts";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "./identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { listGrandArchiveLegalCommands } from "../commands/legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import { grandArchiveObjectHasState } from "./object-state.ts";
import { projectGrandArchiveViewerState } from "../projection/view.ts";
import { grandArchivePlayerZoneObjectIds } from "./zone-ownership.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "ATTACK" | "CHAMPION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name: canonicalId,
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        speed: "slow",
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20, power: 1 }
            : type === "ALLY"
              ? { power: 1, life: 3 }
              : type === "ATTACK"
                ? { power: 1 }
                : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("shared-zone-champion", "CHAMPION");
const ally = card("shared-zone-ally", "ALLY");
const action = card("shared-zone-action", "ACTION");
const attack = card("shared-zone-attack", "ATTACK");

function setup() {
  const program = createGrandArchiveMatchProgram([champion, ally, action, attack]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 1 },
      { definitionId: action.canonicalId, count: 1 },
      { definitionId: attack.canonicalId, count: 1 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 913,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const owned = (playerId: typeof p1, definitionId: string) =>
    Object.values(state.objects).find(
      (object) => object.ownerId === playerId && object.definitionId === definitionId,
    )!;
  return {
    program,
    state,
    p1,
    p2,
    p1ChampionId: owned(p1, champion.canonicalId).id,
    p2AllyId: owned(p2, ally.canonicalId).id,
    p2ActionId: owned(p2, action.canonicalId).id,
    p2AttackId: owned(p2, attack.canonicalId).id,
  };
}

describe("Grand Archive shared and hosted zone control", () => {
  it("gives a card entering an opposing Intent to that champion's controller", () => {
    const transfer = card("transfer-to-opposing-intent", "ACTION", [
      {
        id: "transfer-to-opposing-intent-a1",
        kind: "card-resolution",
        text: "Put this card into your opponent's Intent.",
        effect: {
          kind: "move",
          subject: { kind: "source" },
          destination: { zone: "intent", host: { kind: "champion", player: "opponent" } },
        },
      },
    ]);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { hand: [transfer], "main-deck": [ally] } },
      playerTwo: { champion, zones: { "main-deck": [ally] } },
    });
    const player = game.player("player-one");
    const transferred = player.card(transfer);
    player.activate(transfer);
    for (let n = 0; game.state.stack.length && n < 10; n++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected wait: ${wait.kind}`);
      game.player(wait.playerId).execute({ move: "pass" });
    }
    expect(game.state.stack).toHaveLength(0);
    expect(game.state.objects[transferred.objectId]).toMatchObject({
      zone: "intent",
      ownerId: player.id,
      controllerId: game.player("player-two").id,
      baseControllerId: game.player("player-two").id,
    });
  });
  it("offers a controlled opposing-owned field object to its controller", () => {
    const fixture = setup();
    const controlled = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.p2AllyId,
        from: "main-deck",
        to: "field",
      },
      {
        type: "object-controller-changed",
        objectId: fixture.p2AllyId,
        controllerId: fixture.p1,
      },
    ]).state;
    const afterFirstTurn = {
      ...controlled,
      players: {
        ...controlled.players,
        [fixture.p1]: { ...controlled.players[fixture.p1]!, hasTakenFirstTurn: true },
      },
    };
    const attackCommands = listGrandArchiveLegalCommands(
      fixture.program,
      afterFirstTurn,
      fixture.p1,
    )
      .map((candidate) => candidate.command)
      .filter((command) => command.move === "declare-attack");

    expect(grandArchivePlayerZoneObjectIds(controlled, fixture.p1, "field")).toContain(
      fixture.p2AllyId,
    );
    expect(grandArchivePlayerZoneObjectIds(controlled, fixture.p2, "field")).not.toContain(
      fixture.p2AllyId,
    );
    expect(
      grandArchiveObjectHasState(
        fixture.program,
        controlled,
        controlled.objects[fixture.p2AllyId]!,
        "awake",
      ),
    ).toBe(true);
    expect(attackCommands.some((command) => command.attackerId === fixture.p2AllyId)).toBe(true);
  });

  it("projects shared cards by controller and Intent cards beneath the host controller", () => {
    const fixture = setup();
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.p2ActionId,
        from: "main-deck",
        to: "effects-stack",
        newControllerId: fixture.p1,
      },
      {
        type: "object-moved",
        objectId: fixture.p2AttackId,
        from: "main-deck",
        to: "intent",
        hostId: fixture.p1ChampionId,
      },
    ]).state;
    const view = projectGrandArchiveViewerState(fixture.program, positioned, fixture.p1);
    expect(positioned.objects[fixture.p2AttackId]?.controllerId).toBe(fixture.p1);
    const p1View = view.players.find((player) => player.id === fixture.p1)!;
    const p2View = view.players.find((player) => player.id === fixture.p2)!;
    if (
      p1View.zones["effects-stack"].visibility !== "visible" ||
      p1View.zones.intent.visibility !== "visible" ||
      p2View.zones["effects-stack"].visibility !== "visible" ||
      p2View.zones.intent.visibility !== "visible"
    ) {
      throw new Error("Shared public zones must be visible");
    }

    expect(p1View.zones["effects-stack"].objects.map((object) => object.id)).toContain(
      fixture.p2ActionId,
    );
    expect(p2View.zones["effects-stack"].objects.map((object) => object.id)).not.toContain(
      fixture.p2ActionId,
    );
    expect(p1View.zones.intent.objects.map((object) => object.id)).toContain(fixture.p2AttackId);
    expect(p2View.zones.intent.objects.map((object) => object.id)).not.toContain(
      fixture.p2AttackId,
    );
  });
});
