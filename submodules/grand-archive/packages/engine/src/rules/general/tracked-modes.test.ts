import { devouringMalice, huntWeissKing, tonorisGenesisAegis } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  getGrandArchiveAnnouncementModes,
  proposeGrandArchiveAbilityActivation,
} from "../../procedures/activation/activation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { listGrandArchiveLegalCommands } from "../../commands/legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import { collectGrandArchivePendingTriggerProgressEvents } from "../abilities/triggers.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  options: {
    readonly level?: number;
    readonly lineageName?: string;
    readonly subtypes?: readonly string[];
  } = {},
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
        ...(options.lineageName ? { lineageName: options.lineageName } : {}),
        cost:
          type === "CHAMPION"
            ? { kind: "memory", amount: options.level ?? 0 }
            : { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["WARRIOR"],
          subtypes: options.subtypes ?? [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: options.level ?? 0, life: 30 }
            : type === "ALLY"
              ? { power: 1, life: 3 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const baseChampion = card("tracked-modes-base-champion", "CHAMPION", {
  level: 0,
  lineageName: "Tonoris",
});
const knight = card("tracked-modes-knight", "ALLY", {
  subtypes: ["CHESSMAN", "KNIGHT"],
});
const filler = card("tracked-modes-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([
    baseChampion,
    knight,
    filler,
    devouringMalice,
    huntWeissKing,
    tonorisGenesisAegis,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 8 },
      ...(id === "p1"
        ? [
            { definitionId: huntWeissKing.canonicalId, count: 1 },
            { definitionId: knight.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [
      { definitionId: baseChampion.canonicalId, count: 1 },
      ...(id === "p1"
        ? [
            { definitionId: tonorisGenesisAegis.canonicalId, count: 1 },
            { definitionId: devouringMalice.canonicalId, count: 1 },
          ]
        : []),
    ],
    startingChampionDefinitionId: baseChampion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 952,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const find = (definitionId: string) => {
    const object = Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing tracked-mode fixture object ${definitionId}`);
    return object;
  };
  const hunt = find(huntWeissKing.canonicalId);
  const knightObject = find(knight.canonicalId);
  const devouring = find(devouringMalice.canonicalId);
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: hunt.id, from: hunt.zone, to: "field" },
    {
      type: "object-moved",
      objectId: knightObject.id,
      from: knightObject.zone,
      to: "field",
    },
    {
      type: "object-moved",
      objectId: devouring.id,
      from: devouring.zone,
      to: "field",
      initialCounters: { "named:gem": 1 },
    },
  ]).state;
  return {
    program,
    state: prepared,
    p1,
    championId: find(baseChampion.canonicalId).id,
    devouringId: devouring.id,
    huntId: hunt.id,
    knightId: knightObject.id,
    tonorisCardId: find(tonorisGenesisAegis.canonicalId).id,
  };
}

describe("Grand Archive tracked mode choices", () => {
  it("finds and records Devouring Malice's nested perform-as mode declaration", () => {
    const fixture = setup();
    const proposal = proposeGrandArchiveAbilityActivation(
      fixture.program,
      fixture.state,
      fixture.p1,
      {
        move: "activate-ability",
        sourceId: fixture.devouringId,
        abilityId: "1keruycrwi-a2",
        modeIds: ["mode-1"],
        targets: { "target-1": [fixture.knightId] },
      },
    );

    expect(proposal.stackItem.selectedModeIds).toEqual(["mode-1"]);
    expect(
      proposal.events.find((event) => event.type === "object-characteristic-tracked"),
    ).toMatchObject({
      objectId: fixture.devouringId,
      key: "chosen-modes",
      values: ["mode-1"],
    });
  });

  it("records Hunt's chosen catalog mode, rejects it on the same object, and resets on re-entry", () => {
    const fixture = setup();
    const command = {
      move: "activate-ability" as const,
      sourceId: fixture.huntId,
      abilityId: "Y6PZntlVDl-a2",
      modeIds: ["mode-2"],
      targets: { "target-1": [fixture.knightId] },
    };
    const proposal = proposeGrandArchiveAbilityActivation(
      fixture.program,
      fixture.state,
      fixture.p1,
      command,
    );
    const trackingEvent = proposal.events.find(
      (event) => event.type === "object-characteristic-tracked",
    );
    expect(trackingEvent).toMatchObject({
      objectId: fixture.huntId,
      key: "chosen-modes",
      values: ["mode-2"],
    });
    if (!trackingEvent || trackingEvent.type !== "object-characteristic-tracked") {
      throw new Error("Expected Hunt mode tracking event");
    }
    const tracked = new GrandArchiveTransactionKernel().transact(fixture.state, [
      trackingEvent,
    ]).state;

    expect(() =>
      proposeGrandArchiveAbilityActivation(fixture.program, tracked, fixture.p1, command),
    ).toThrow("Mode is not available: mode-2");
    expect(
      proposeGrandArchiveAbilityActivation(fixture.program, tracked, fixture.p1, {
        move: "activate-ability",
        sourceId: fixture.huntId,
        abilityId: "Y6PZntlVDl-a2",
        modeIds: ["mode-1"],
      }).stackItem.selectedModeIds,
    ).toEqual(["mode-1"]);

    const reentered = new GrandArchiveTransactionKernel().transact(tracked, [
      { type: "object-moved", objectId: fixture.huntId, from: "field", to: "graveyard" },
      { type: "object-moved", objectId: fixture.huntId, from: "graveyard", to: "field" },
    ]).state;
    expect(reentered.trackedCharacteristics[fixture.huntId]).toBeUndefined();
    expect(
      proposeGrandArchiveAbilityActivation(fixture.program, reentered, fixture.p1, command)
        .stackItem.selectedModeIds,
    ).toEqual(["mode-2"]);
  });

  it("tracks Tonoris modes on its lineage card and resets them when that card is re-leveled", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const leveled = kernel.transact(fixture.state, [
      {
        type: "champion-leveled-up",
        championId: fixture.championId,
        cardId: fixture.tonorisCardId,
      },
    ]).state;
    if (tonorisGenesisAegis.layout.kind !== "single-faced") {
      throw new Error("Tonoris catalog definition must be single-faced");
    }
    const ability = tonorisGenesisAegis.layout.face.abilities.find(
      (candidate) => candidate.id === "ta6qsesw2u-a2",
    );
    if (!ability || ability.kind !== "triggered") throw new Error("Missing Tonoris trigger");
    const evaluation = {
      program: fixture.program,
      state: leveled,
      controllerId: fixture.p1,
      sourceId: fixture.championId,
      abilityBearerId: fixture.championId,
      bindings: {},
    };
    expect(
      getGrandArchiveAnnouncementModes(undefined, ability.effect, evaluation)?.modes,
    ).toHaveLength(3);

    const pendingTrigger = {
      id: "tracked-tonoris-trigger",
      batchId: "tracked-tonoris-batch",
      orderingConfirmed: true,
      sourceId: fixture.championId,
      sourceIncarnation: leveled.objects[fixture.championId]!.incarnation,
      controllerId: fixture.p1,
      ability,
      selectedModeIds: [],
      bindings: {},
      variables: {},
      activationPayment: [],
      createdAtVersion: leveled.stateVersion,
    } as const;
    const awaitingAnnouncement = kernel.transact(leveled, [
      { type: "pending-trigger-added", trigger: pendingTrigger },
    ]).state;
    const decisionState = kernel.transact(
      awaitingAnnouncement,
      collectGrandArchivePendingTriggerProgressEvents(fixture.program, awaitingAnnouncement),
    ).state;
    const decision = decisionState.decision;
    if (!decision || decision.kind !== "announce-triggered-ability") {
      throw new Error("Expected Tonoris mode announcement");
    }
    const runtime = new GrandArchiveMatchRuntime(fixture.program, decisionState);
    const modeCommand = listGrandArchiveLegalCommands(
      fixture.program,
      decisionState,
      fixture.p1,
    ).find((candidate) => JSON.stringify(candidate.command).includes('"modeIds":["mode-1"]'));
    if (!modeCommand) throw new Error("Legal commands omitted Tonoris mode 1");
    expect(runtime.execute(modeCommand.command, { playerId: fixture.p1 })).toMatchObject({
      ok: true,
    });
    expect(runtime.state.trackedCharacteristics[fixture.tonorisCardId]).toEqual({
      incarnation: runtime.state.objects[fixture.tonorisCardId]?.incarnation,
      values: { "chosen-modes": ["mode-1"] },
    });

    const exhausted = kernel.transact(leveled, [
      {
        type: "object-characteristic-tracked",
        objectId: fixture.tonorisCardId,
        key: "chosen-modes",
        values: ["mode-1", "mode-2", "mode-3"],
      },
      {
        type: "pending-trigger-added",
        trigger: pendingTrigger,
      },
    ]).state;
    expect(
      getGrandArchiveAnnouncementModes(undefined, ability.effect, {
        ...evaluation,
        state: exhausted,
      })?.modes,
    ).toHaveLength(0);
    expect(collectGrandArchivePendingTriggerProgressEvents(fixture.program, exhausted)).toEqual([
      expect.objectContaining({
        type: "pending-trigger-removed",
        triggerId: "tracked-tonoris-trigger",
      }),
    ]);

    const withoutPending = kernel.transact(exhausted, [
      { type: "pending-trigger-removed", triggerId: "tracked-tonoris-trigger" },
      {
        type: "champion-deleveled",
        championId: fixture.championId,
        cardId: fixture.tonorisCardId,
      },
      {
        type: "champion-leveled-up",
        championId: fixture.championId,
        cardId: fixture.tonorisCardId,
      },
    ]).state;
    expect(withoutPending.trackedCharacteristics[fixture.tonorisCardId]).toBeUndefined();
    expect(
      getGrandArchiveAnnouncementModes(undefined, ability.effect, {
        ...evaluation,
        state: withoutPending,
      })?.modes,
    ).toHaveLength(3);
  });
});
