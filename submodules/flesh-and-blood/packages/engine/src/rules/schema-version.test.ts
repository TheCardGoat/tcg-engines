import { describe, expect, it, vi } from "vitest";
import { fleshAndBloodDeckCardLibrary } from "../../../cards/src/deck-library.ts";
import { FabMatchRuntime } from "../runtime.ts";
import { createFabTestState, registerFabTestObject } from "../testing/test-fixtures.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { createFabPracticeMatch } from "../automation/create-practice-match.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../automation/catalog-test-cards.ts";
import { collectReachableFabLki } from "../game/lki.ts";
import { fabObjectInstanceId, fabPlayerId } from "../game/identity.ts";
import { FAB_MATCH_SCHEMA_VERSION } from "../state.ts";
import {
  createFabMatchContext,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../snapshot/match-context.ts";

describe("FAB match snapshot schema", () => {
  const isFabMatchSnapshot = isFabMatchSnapshotV21;

  it("restores a snapshot with the current compiled card program when definitions change", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "program-fingerprint",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    const snapshot = serializeFabMatchSnapshot(state);
    const changed = {
      ...state.cardDefinitions,
      "program-only": { canonicalId: "program-only", types: [] },
    };
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const context = createFabMatchContext(changed, state.publicCardIdentities);

    const restored = restoreFabMatchSnapshot(snapshot, context);
    const runtime = new FabMatchRuntime(restored);
    const priorityPlayerId = runtime.getPriorityPlayerId();
    if (!priorityPlayerId) throw new Error("Expected an active priority holder after restore.");
    const pass = runtime.applyCommand(priorityPlayerId, { move: "pass" });

    expect(restored.cardDefinitions).toBe(context.cardDefinitions);
    expect(restored.cardDefinitions["program-only"]).toEqual(
      context.cardDefinitions["program-only"],
    );
    expect(pass.success).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("current card program"), {
      snapshotProgramFingerprint: snapshot.programFingerprint,
      currentProgramFingerprint: context.program.fingerprint,
    });
    warn.mockRestore();
  });

  it("restores a snapshot with the current public naming catalog", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "public-catalog-fingerprint",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
      publicCardIdentities: [{ canonicalId: "public-a", names: ["Public A"] }],
    });
    const snapshot = serializeFabMatchSnapshot(state);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const context = createFabMatchContext(state.cardDefinitions, [
      { canonicalId: "public-b", names: ["Public B"] },
    ]);

    const restored = restoreFabMatchSnapshot(snapshot, context);

    expect(restored.publicCardIdentities).toBe(context.publicCardIdentities);
    expect(restored.publicCardIdentities).toEqual([
      { canonicalId: "public-b", names: ["Public B"] },
    ]);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it("rejects impossible split-face and meld property states at persistence", () => {
    const ordinary = { canonicalId: "ordinary", name: "Ordinary", types: ["Action"] };
    const state = FabTestEngine.createStateForRulesTest({
      seed: "invalid-card-property-state",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { ordinary1: ordinary.canonicalId },
        owners: { p1: ["ordinary1"], p2: [] },
      },
      cardDefinitions: { [ordinary.canonicalId]: ordinary },
    });
    const record = state.objects.ordinary1!;
    const validSnapshot = serializeFabMatchSnapshot(state);
    const forgedSnapshot = {
      ...validSnapshot,
      objects: {
        ...validSnapshot.objects,
        ordinary1: {
          ...validSnapshot.objects.ordinary1!,
          cardPropertyState: { kind: "face", face: "left" } as const,
        },
      },
    };
    expect(() =>
      restoreFabMatchSnapshot(
        forgedSnapshot,
        createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
      ),
    ).toThrow("non-split card");

    state.objects.ordinary1 = {
      ...record,
      cardPropertyState: { kind: "face", face: "left" },
    };
    expect(() => serializeFabMatchSnapshot(state)).toThrow("non-split card");

    state.objects.ordinary1 = {
      ...record,
      cardPropertyState: { kind: "meld" },
    };
    expect(() => serializeFabMatchSnapshot(state)).toThrow("without a printed meld ability");
  });

  it("restores public identities canonically from equivalent match contexts", () => {
    const identitiesA = [
      { canonicalId: "public-b", names: [" Beta ", "Alpha", "Alpha"] },
      { canonicalId: "public-a", names: ["Zulu"] },
    ];
    const identitiesB = [
      { canonicalId: "public-a", names: ["Zulu"] },
      { canonicalId: "public-b", names: ["Alpha", "Beta"] },
    ];
    const state = FabTestEngine.createStateForRulesTest({
      seed: "public-catalog-canonical-restore",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
      publicCardIdentities: identitiesA,
    });
    const snapshot = serializeFabMatchSnapshot(state);
    const contextA = createFabMatchContext(state.cardDefinitions, identitiesA);
    const contextB = createFabMatchContext(state.cardDefinitions, identitiesB);

    expect(contextA.program.fingerprint).toBe(contextB.program.fingerprint);
    expect(snapshot).not.toHaveProperty("publicCardIdentities");

    const restoredA = restoreFabMatchSnapshot(snapshot, contextA);
    const restoredB = restoreFabMatchSnapshot(snapshot, contextB);
    expect(restoredA.publicCardIdentities).toEqual([
      { canonicalId: "public-a", names: ["Zulu"] },
      { canonicalId: "public-b", names: ["Alpha", "Beta"] },
    ]);
    expect(restoredB.publicCardIdentities).toEqual(restoredA.publicCardIdentities);
    expect(serializeFabMatchSnapshot(restoredB)).toEqual(serializeFabMatchSnapshot(restoredA));
  });

  it("initializes current-schema runtime object records with explicit defaults", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "schema-v2-objects",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { card1: "canonical-card" },
        owners: { p1: ["card1"], p2: [] },
      },
    });

    expect(state.schemaVersion).toBe(FAB_MATCH_SCHEMA_VERSION);
    expect(state).not.toHaveProperty("committedEvents");
    expect(state).not.toHaveProperty("log");
    expect(state.lkiArena).toEqual({});
    expect(state.objects.card1).toEqual({
      instanceId: "card1",
      canonicalId: "canonical-card",
      objectKind: "catalog-card",
      baseSource: { kind: "registered" },
      ownerId: "p1",
      incarnation: 1,
      cardPropertyState: { kind: "whole-card" },
      visibility: "private",
      activeFace: { kind: "single" },
      counters: [],
      markers: [],
      history: { moves: [] },
    });
    expect(state.counters.objectIncarnation).toBe(1);
  });

  it("rejects legacy snapshots with an explicit unsupported-version error", () => {
    const current = FabTestEngine.createStateForRulesTest({
      seed: "schema-version",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    const { schemaVersion: _schemaVersion, ...legacy } = structuredClone(current);
    void _schemaVersion;

    expect(() => new FabMatchRuntime(legacy)).toThrow(
      `Unsupported Flesh and Blood match snapshot schema version undefined; expected ${FAB_MATCH_SCHEMA_VERSION}. Legacy FAB snapshots cannot be restored.`,
    );
  });

  it("rejects every pre-current snapshot without migration", () => {
    const current = FabTestEngine.createStateForRulesTest({
      seed: "schema-version-one",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    for (let schemaVersion = 1; schemaVersion < FAB_MATCH_SCHEMA_VERSION; schemaVersion += 1) {
      expect(() => new FabMatchRuntime({ ...structuredClone(current), schemaVersion })).toThrow(
        `Unsupported Flesh and Blood match snapshot schema version ${schemaVersion}; expected ${FAB_MATCH_SCHEMA_VERSION}. Legacy FAB snapshots cannot be restored.`,
      );
    }
  });

  it("rejects unknown runtime fields and legacy delayed-trigger flag combinations", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "closed-v9-dto",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    const snapshot = serializeFabMatchSnapshot(state);
    expect(isFabMatchSnapshot({ ...snapshot, runtimeCache: {} })).toBe(false);
    expect(
      isFabMatchSnapshot({
        ...snapshot,
        delayedTriggers: [
          {
            delayedTriggerId: "legacy-delayed",
            controllerId: "p1",
            source: {},
            trigger: {},
            effect: {},
            createdByEventId: null,
            consumeOnUse: true,
            expiresAt: { kind: "triggered" },
          },
        ],
      }),
    ).toBe(false);
  });

  it("omits default object values and restores the strict runtime representation", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "compact-object-defaults",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { privateCard: "private-card", publicCard: "public-card" },
        owners: { p1: ["privateCard", "publicCard"], p2: [] },
      },
    });
    state.objects.publicCard = {
      ...state.objects.publicCard!,
      visibility: "public",
      counters: [{ kind: "named", name: "steam", count: 1 }],
      markers: [{ kind: "tapped" }],
      declarationFacts: [{ kind: "fusion", revealedSupertypes: ["Earth"] }, { kind: "boost" }],
    };

    const snapshot = serializeFabMatchSnapshot(state);
    expect(snapshot.objects.privateCard).toEqual({
      instanceId: "privateCard",
      canonicalId: "private-card",
      objectKind: "catalog-card",
      baseSource: { kind: "registered" },
      ownerId: "p1",
      incarnation: 1,
      history: { moves: [] },
    });
    expect(snapshot.objects.publicCard).toMatchObject({
      visibility: "public",
      counters: [{ kind: "named", name: "steam", count: 1 }],
      markers: [{ kind: "tapped" }],
      declarationFacts: [{ kind: "fusion", revealedSupertypes: ["Earth"] }, { kind: "boost" }],
    });

    const restored = restoreFabMatchSnapshot(
      snapshot,
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );
    expect(restored.objects).toEqual(state.objects);
  });

  it("round-trips soul membership without persisting a duplicate soul count", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "soul-zone-authority",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    registerFabTestObject(state, "soul-card", "soul-card-definition", "p1");
    state.containers.zonesByPlayerId["p1"]!.soul.push("soul-card");

    const snapshot = serializeFabMatchSnapshot(state);
    expect(JSON.stringify(snapshot)).not.toContain("soulCount");

    const restored = restoreFabMatchSnapshot(
      snapshot,
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );
    expect(restored.containers.zonesByPlayerId["p1"]!.soul).toEqual(["soul-card"]);
    expect(restored.containers.zonesByPlayerId["p1"]!.soul).toHaveLength(1);
    expect(restored.containers.subcardsByHostId).toEqual({ "soul:p1": ["soul-card"] });
    expect(serializeFabMatchSnapshot(restored)).toEqual(snapshot);
  });

  it("preserves empty arsenal slots and their stable identities across restore", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "arsenal-slot-identity",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    registerFabTestObject(state, "arsenal-card", "arsenal-card-definition", "p1");
    state.containers.zonesByPlayerId["p1"]!.arsenal = ["arsenal-card"];
    state.containers.arsenalZonesByPlayerId["p1"]! = [
      { id: "arsenal:p1:left", cardId: null },
      { id: "arsenal:p1:middle", cardId: "arsenal-card" },
      { id: "arsenal:p1:right", cardId: null },
    ];

    const snapshot = serializeFabMatchSnapshot(state);
    const restored = restoreFabMatchSnapshot(
      snapshot,
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );

    expect(restored.players.p1).not.toHaveProperty("zones");
    expect(restored.players.p1).not.toHaveProperty("arsenalZones");
    expect(restored.containers.arsenalZonesByPlayerId["p1"]!).toEqual(
      snapshot.containerModel.players.p1!.arsenalZones,
    );
    expect(serializeFabMatchSnapshot(restored)).toEqual(snapshot);
  });

  it("restores subcards hosted by equipped objects", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "equipped-host-subcards",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    registerFabTestObject(state, "equipped-arms", "equipped-arms-definition", "p1");
    registerFabTestObject(state, "under-card", "under-card-definition", "p1");
    state.containers.zonesByPlayerId["p1"]!.arms = ["equipped-arms"];
    state.containers.subcardsByHostId["equipped-arms"] = [fabObjectInstanceId("under-card")];

    const snapshot = serializeFabMatchSnapshot(state);
    const restored = restoreFabMatchSnapshot(
      snapshot,
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );

    expect(restored.containers.subcardsByHostId).toEqual({
      "equipped-arms": ["under-card"],
    });
    expect(restored.containers.zonesByPlayerId["p1"]!.under).toEqual([]);
    expect(restored.objects["equipped-arms"]).not.toHaveProperty("underInstanceIds");
    expect(serializeFabMatchSnapshot(restored)).toEqual(snapshot);

    for (const subcardIds of [[], ["under-card", "under-card"], ["missing-card"]]) {
      expect(
        isFabMatchSnapshot({
          ...snapshot,
          containerModel: {
            ...snapshot.containerModel,
            subcardsByHostId: { "equipped-arms": subcardIds },
          },
        }),
      ).toBe(false);
    }
  });

  it("requires one seated controller mapping for every and only shared member", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "shared-controller-totality",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    registerFabTestObject(state, "shared-object", "shared-definition", "p1");
    state.containers.zonesByPlayerId["p1"]!.arena = ["shared-object"];
    const snapshot = serializeFabMatchSnapshot(state);
    expect(isFabMatchSnapshot(snapshot)).toBe(true);

    const withoutController = {
      ...snapshot,
      containerModel: {
        ...snapshot.containerModel,
        shared: { ...snapshot.containerModel.shared, controllerIdByObjectId: {} },
      },
    };
    expect(isFabMatchSnapshot(withoutController)).toBe(false);

    const unseatedController = {
      ...snapshot,
      containerModel: {
        ...snapshot.containerModel,
        shared: {
          ...snapshot.containerModel.shared,
          controllerIdByObjectId: {
            ...snapshot.containerModel.shared.controllerIdByObjectId,
            "shared-object": "p3",
          },
        },
      },
    };
    expect(isFabMatchSnapshot(unseatedController)).toBe(false);

    const mappingForNonShared = {
      ...snapshot,
      containerModel: {
        ...snapshot.containerModel,
        shared: {
          ...snapshot.containerModel.shared,
          controllerIdByObjectId: {
            ...snapshot.containerModel.shared.controllerIdByObjectId,
            extra: "p1",
          },
        },
      },
    };
    expect(isFabMatchSnapshot(mappingForNonShared)).toBe(false);
  });

  it("validates every additional declared attack target reference", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "additional-attack-target-admission",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    for (const instanceId of ["attack", "primary-target", "additional-target"]) {
      registerFabTestObject(state, instanceId, `${instanceId}-definition`, "p1");
    }
    state.combat = {
      open: true,
      step: "attack",
      defenseDeclarationPending: false,
      activeLink: {
        activeAttack: { kind: "card", sourceObjectId: fabObjectInstanceId("attack") },
        attackingPlayerId: fabPlayerId("p1"),
        defendingPlayerId: fabPlayerId("p2"),
        attackTargetRef: {
          kind: "object",
          ref: {
            instanceId: "primary-target",
            incarnation: state.objects["primary-target"]!.incarnation,
          },
          controllerIdAtDeclaration: fabPlayerId("p2"),
        },
        additionalAttackTargetRefs: [
          {
            kind: "object",
            ref: {
              instanceId: "additional-target",
              incarnation: state.objects["additional-target"]!.incarnation,
            },
            controllerIdAtDeclaration: fabPlayerId("p2"),
          },
        ],
        defendingInstanceIdsByTarget: {
          "primary-target": [],
          "additional-target": [],
        },
        defendingOrigins: {},
        damage: {
          status: "pending",
          outcomes: [
            {
              target: {
                kind: "object",
                ref: {
                  instanceId: "primary-target",
                  incarnation: state.objects["primary-target"]!.incarnation,
                },
                controllerIdAtDeclaration: fabPlayerId("p2"),
              },
              damageDealtByActiveAttack: 0,
            },
            {
              target: {
                kind: "object",
                ref: {
                  instanceId: "additional-target",
                  incarnation: state.objects["additional-target"]!.incarnation,
                },
                controllerIdAtDeclaration: fabPlayerId("p2"),
              },
              damageDealtByActiveAttack: 0,
            },
          ],
        },
        wagers: [],
      },
    };
    state.priority = {
      kind: "combat",
      holderPlayerId: fabPlayerId("p1"),
      combatStep: "attack",
      consecutivePasses: 0,
    };
    const snapshot = serializeFabMatchSnapshot(state);
    expect(isFabMatchSnapshot(snapshot)).toBe(true);

    const link = snapshot.combat!.activeLink!;
    const additional = link.additionalAttackTargetRefs![0]!;
    if (additional.kind !== "object") throw new Error("Expected an exact object attack target.");
    const missingObject = {
      ...snapshot,
      combat: {
        ...snapshot.combat!,
        activeLink: {
          ...link,
          additionalAttackTargetRefs: [
            { ...additional, ref: { ...additional.ref, instanceId: "missing-target" } },
          ],
        },
      },
    };
    expect(isFabMatchSnapshot(missingObject)).toBe(false);

    const unseatedController = {
      ...snapshot,
      combat: {
        ...snapshot.combat!,
        activeLink: {
          ...link,
          additionalAttackTargetRefs: [{ ...additional, controllerIdAtDeclaration: "p3" }],
        },
      },
    };
    expect(isFabMatchSnapshot(unseatedController)).toBe(false);
  });

  it("rejects stale soul counters and invalid identity graphs at restore ingress", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "identity-admission",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { card1: "canonical-card" },
        owners: { p1: ["card1"], p2: [] },
      },
    });
    const snapshot = serializeFabMatchSnapshot(state);
    const staleSoulCount = {
      ...snapshot,
      players: {
        ...snapshot.players,
        p1: { ...snapshot.players.p1!, soulCount: 1 },
      },
    };
    const mismatchedPlayerRecord = {
      ...snapshot,
      players: {
        ...snapshot.players,
        p1: { ...snapshot.players.p1!, playerId: "p2" },
      },
    };
    const mismatchedObjectRecord = {
      ...snapshot,
      objects: {
        ...snapshot.objects,
        card1: { ...snapshot.objects.card1!, instanceId: "other-card" },
      },
    };
    const emptyCanonicalIdentity = {
      ...snapshot,
      objects: {
        ...snapshot.objects,
        card1: { ...snapshot.objects.card1!, canonicalId: "" },
      },
    };

    for (const invalid of [
      staleSoulCount,
      mismatchedPlayerRecord,
      mismatchedObjectRecord,
      emptyCanonicalIdentity,
    ]) {
      expect(isFabMatchSnapshot(invalid)).toBe(false);
      expect(() => restoreFabMatchSnapshot(invalid, createFabMatchContext({}, []))).toThrow(
        "Unsupported Flesh and Blood persisted snapshot",
      );
    }
  });

  it("reduces the representative persisted state by at least twelve percent", () => {
    const { runtime } = createFabPracticeMatch(fleshAndBloodDeckCardLibrary, {
      seed: "snapshot-size-regression",
    });
    const state = runtime.getState();
    const compact = serializeFabMatchSnapshot(state);
    const compactBytes = JSON.stringify(compact).length;
    const fullObjects = Object.fromEntries(
      Object.entries(compact.objects).map(([instanceId, persisted]) => [
        instanceId,
        {
          ...persisted,
          visibility: state.objects[instanceId]!.visibility,
          activeFace: state.objects[instanceId]!.activeFace,
          counters: state.objects[instanceId]!.counters,
          markers: state.objects[instanceId]!.markers,
        },
      ]),
    );
    const fullBytes = JSON.stringify({ ...compact, objects: fullObjects }).length;

    expect(fullBytes - compactBytes).toBeGreaterThanOrEqual(4_100);
    expect(compactBytes / fullBytes).toBeLessThanOrEqual(0.88);
  });

  it("does not serialize fixture-only annotations or legacy test-state encodings", () => {
    const state = createFabTestState({
      player1: {
        hand: [{ card: "fixture-card", state: { destroyOnChainClose: true } }],
      },
      player2: {},
    });

    const serialized = JSON.stringify(state);
    expect(serialized).not.toContain("test-state:");
    expect(serialized).not.toContain("destroyOnChainClose");
    expect(state).not.toHaveProperty("committedEvents");
    expect(state).not.toHaveProperty("log");
  });

  it("restores a compact multi-dispatch snapshot without losing future behavior or receipts", () => {
    const fixture = FabTestEngine.create({
      player1: { hand: [catalogIds.nimblismBlue], deck: 2 },
      player2: { hand: [catalogIds.nimblismBlue], deck: 2 },
    });
    const state = structuredClone(fixture.getState());
    const context = createFabMatchContext(state.cardDefinitions, state.publicCardIdentities);
    const uninterrupted = new FabMatchRuntime(structuredClone(state));
    const beforeSnapshot = new FabMatchRuntime(structuredClone(state));

    const first = dispatchTestCommand(beforeSnapshot, "end-turn", "player-1", {});
    expect(first).toMatchObject({ accepted: true });
    if (!first.accepted) throw new Error("Expected the first end-turn to be accepted.");

    const compactSnapshot = serializeFabMatchSnapshot(beforeSnapshot.getState());
    expect(compactSnapshot).not.toHaveProperty("committedEvents");
    expect(compactSnapshot).not.toHaveProperty("log");
    expect(compactSnapshot).not.toHaveProperty("cardDefinitions");
    expect(compactSnapshot).not.toHaveProperty("publicCardIdentities");
    expect(compactSnapshot).not.toHaveProperty("compiledRules");
    expect(first.moveLogs.length).toBeGreaterThan(0);

    const restored = new FabMatchRuntime(restoreFabMatchSnapshot(compactSnapshot, context));
    const uninterruptedFirst = dispatchTestCommand(uninterrupted, "end-turn", "player-1", {});
    expect(uninterruptedFirst).toMatchObject({ accepted: true });
    const uninterruptedSecond = dispatchTestCommand(uninterrupted, "end-turn", "player-2", {});
    const restoredSecond = dispatchTestCommand(restored, "end-turn", "player-2", {});

    expect(uninterruptedSecond).toMatchObject({ accepted: true });
    expect(restoredSecond).toMatchObject({ accepted: true });
    if (!uninterruptedSecond.accepted || !restoredSecond.accepted) {
      throw new Error("Expected restored and uninterrupted end-turns to be accepted.");
    }
    expect(restoredSecond.moveLogs.map((log) => log.public)).toEqual(
      uninterruptedSecond.moveLogs.map((log) => log.public),
    );
    expect(serializeFabMatchSnapshot(restored.getState())).toEqual(
      serializeFabMatchSnapshot(uninterrupted.getState()),
    );
  });

  it("restores reachable move LKI through its interned arena", () => {
    const fixture = FabTestEngine.create({
      player1: {
        hand: [catalogIds.wreckerRomp, catalogIds.nimblismBlue, catalogIds.nimblismBlue],
        deck: 2,
        actionPoints: 1,
      },
      player2: { deck: 2 },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    });
    const runtime = fixture.getRuntime();
    const result = fixture.play("player-1", catalogIds.wreckerRomp, {
      pitch: catalogIds.nimblismBlue,
      target: "player-2",
    });
    expect(result).toMatchObject({ accepted: true });

    const before = runtime.getState();
    expect(Object.keys(before.lkiArena).length).toBeGreaterThan(0);
    const snapshot = serializeFabMatchSnapshot(before);
    const context = createFabMatchContext(before.cardDefinitions, before.publicCardIdentities);
    const restored = restoreFabMatchSnapshot(snapshot, context);

    expect(serializeFabMatchSnapshot(restored)).toEqual(snapshot);
    expect(Object.keys(restored.lkiArena)).toEqual(Object.keys(before.lkiArena));

    for (const object of Object.values(restored.objects)) {
      restored.objects[object.instanceId] = { ...object, history: { moves: [] } };
    }
    collectReachableFabLki(restored);
    expect(restored.lkiArena).toEqual({});
  });

  it("keeps only the bounded current-window trigger occurrence ledger", () => {
    const fixture = FabTestEngine.create({
      player1: { hand: [catalogIds.nimblismBlue], deck: 24 },
      player2: { hand: [catalogIds.nimblismBlue], deck: 24 },
    });
    const runtime = new FabMatchRuntime(structuredClone(fixture.getState()));
    const replayReceipts: unknown[] = [];
    const initialSnapshotBytes = JSON.stringify(
      serializeFabMatchSnapshot(runtime.getState()),
    ).length;

    for (let turn = 0; turn < 12; turn += 1) {
      const actorId = runtime.getActivePlayerId();
      expect(actorId).toBeTruthy();
      const result = dispatchTestCommand(runtime, "end-turn", actorId!, {});
      expect(result.accepted).toBe(true);
      if (result.accepted) replayReceipts.push(...result.moveLogs);
    }

    const snapshot = serializeFabMatchSnapshot(runtime.getState());
    expect(snapshot).not.toHaveProperty("committedEvents");
    expect(snapshot).not.toHaveProperty("log");
    expect(snapshot.rulesProcess).toBeNull();
    expect(snapshot.lkiArena).toEqual({});
    expect(replayReceipts.length).toBeGreaterThan(12);
    expect(JSON.stringify(snapshot)).not.toContain("committedEvents");
    expect(JSON.stringify(snapshot)).not.toContain('"log"');
    expect(snapshot.triggerOccurrenceLedger.length).toBeLessThanOrEqual(128);
    expect(
      snapshot.triggerOccurrenceLedger.every(
        (record) => record.context.turnNumber === snapshot.turnNumber,
      ),
    ).toBe(true);
    expect(JSON.stringify(snapshot).length - initialSnapshotBytes).toBeLessThan(64_000);
  });

  it("fails closed when persisted schema-v20 state is non-canonical or embeds invalid data", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "forbidden-context",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    const snapshot = serializeFabMatchSnapshot(state);

    expect(isFabMatchSnapshot(snapshot)).toBe(true);
    expect(snapshot.players.p1).not.toHaveProperty("zones");
    expect(snapshot.players.p1).not.toHaveProperty("arsenalZones");
    expect(
      isFabMatchSnapshot({
        ...snapshot,
        players: { ...snapshot.players, p1: { ...snapshot.players.p1!, zones: {} } },
      }),
    ).toBe(false);
    expect(
      isFabMatchSnapshot({
        ...snapshot,
        players: {
          ...snapshot.players,
          p1: { ...snapshot.players.p1!, arsenalZones: [] },
        },
      }),
    ).toBe(false);
    expect(isFabMatchSnapshot({ ...snapshot, cardDefinitions: {} })).toBe(false);
    expect(isFabMatchSnapshot({ ...snapshot, committedEvents: [] })).toBe(false);
    expect(isFabMatchSnapshot({ ...snapshot, logs: [] })).toBe(false);
    expect(isFabMatchSnapshot({ ...snapshot, indexes: {} })).toBe(false);
    expect(isFabMatchSnapshot({ ...snapshot, rollbackSnapshot: snapshot })).toBe(false);
    expect(isFabMatchSnapshot({ ...snapshot, lkiArena: { "lki:unreachable": {} } })).toBe(false);
    for (const explicitDefault of [
      { visibility: "private" },
      { face: "front" },
      { activeFace: { kind: "single" } },
      { counters: [] },
      { markers: [] },
    ]) {
      expect(
        isFabMatchSnapshot({
          ...snapshot,
          objects: {
            ...snapshot.objects,
            invalid: {
              instanceId: "invalid",
              canonicalId: "invalid",
              ownerId: "p1",
              incarnation: 1,
              history: { moves: [] },
              ...explicitDefault,
            },
          },
        }),
      ).toBe(false);
    }
    expect(
      isFabMatchSnapshot({
        ...snapshot,
        objects: {
          ...snapshot.objects,
          invalid: {
            instanceId: "invalid",
            canonicalId: "invalid",
            ownerId: "p1",
            incarnation: 1,
            visibility: "secret",
            history: { moves: [] },
          },
        },
      }),
    ).toBe(false);
    expect(
      isFabMatchSnapshot({
        ...snapshot,
        priority: { ...snapshot.priority!, holderPlayerId: "not-seated" },
        priorityPlayerId: "not-seated",
      }),
    ).toBe(false);
    expect(
      isFabMatchSnapshot({
        ...snapshot,
        priority: { ...snapshot.priority!, kind: "combat", combatStep: "attack" },
      }),
    ).toBe(false);
    expect(isFabMatchSnapshot({ ...snapshot, priority: null, priorityPlayerId: null })).toBe(false);
  });
});
import { dispatchTestCommand } from "../testing/test-command.ts";
