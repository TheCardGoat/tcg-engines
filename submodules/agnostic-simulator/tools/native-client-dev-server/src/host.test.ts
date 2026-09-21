import { grandArchivePlayerId, grandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, test, spyOn } from "bun:test";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { NativeClientMessage, NATIVE_LIMITS, type NativeServerMessage } from "@tcg/protocol/native";
import {
  replayGrandArchiveReplay,
  fingerprintGrandArchiveValue,
} from "@tcg/grand-archive-server-adapter";
import type { InteractionAction, InteractionSubmissionValue } from "@tcg/protocol";
import { startNativeHost } from "./host.ts";
import { connectNative } from "./socket-client.ts";

// Normal server tests need no client checkout. Cross-repository checks opt in explicitly.
const fixtureOutput = process.env.NATIVE_FIXTURE_OUTPUT;
const fixtureCompare = process.env.NATIVE_FIXTURE_COMPARE;
if (fixtureOutput && fixtureCompare) {
  throw new Error("Choose NATIVE_FIXTURE_OUTPUT or NATIVE_FIXTURE_COMPARE, not both.");
}

type Snapshot = Extract<NativeServerMessage, { type: "state_sync" | "state_update" }>;
function submission(
  state: Snapshot,
  action: InteractionAction,
  correlationId: string,
  values: Record<string, InteractionSubmissionValue> = {},
) {
  return NativeClientMessage.parse({
    v: 1,
    type: "submit_interaction",
    gameId: state.gameId,
    expectedVersion: state.stateVersion,
    correlationId,
    submission: {
      protocolVersion: 2,
      stateVersion: state.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values,
      correlationId,
    },
  });
}
function pass(state: Snapshot) {
  const action = state.interaction.actions.find(
    (action) => action.intent === "pass" && action.enabled,
  );
  if (!action) throw new Error("No offered pass");
  return action;
}

describe("native loopback public socket", () => {
  test("Standard pregame, paid activation, resolution, privacy, retry/reconnect and journal", async () => {
    const host = startNativeHost({ testSeed: "native-standard-1" });
    const clients: Awaited<ReturnType<typeof connectNative>>[] = [];
    try {
      const a = await connectNative(host.url, host.sessions[0]!.credential);
      clients.push(a);
      const b = await connectNative(host.url, host.sessions[1]!.credential);
      clients.push(b);
      b.send({ v: 1, type: "join_game", fixtureIds: ["lorraine-pnp-1-4", "rai-pnp-1-4"] });
      expect((await b.wait("error")).code).toBe("forbidden");
      a.send({ v: 1, type: "join_game", fixtureIds: ["unknown", "rai-pnp-1-4"] });
      expect((await a.wait("error")).code).toBe("unknown_fixture");
      a.send({ v: 1, type: "join_game", fixtureIds: ["lorraine-pnp-1-4", "rai-pnp-1-4"] });
      let sa: Snapshot = await a.wait("state_sync");
      b.send({ v: 1, type: "join_game", gameId: sa.gameId });
      let sb: Snapshot = await b.wait("state_sync");
      const engine = host.engine!;
      function privacy(view: Snapshot, actorId: string) {
        const expected = engine.getViewerState({ role: "player", actorId });
        const allowed = new Set(Object.keys(view.display.objects));
        const wire = JSON.stringify(view);
        expect(wire).not.toContain("randomSeed");
        expect(wire).not.toContain("randomState");
        expect(wire).not.toContain("abilities");
        expect(wire).not.toContain("eventHistory");
        expect(wire).not.toContain("initialSnapshot");
        expect(wire).not.toContain("printingIdByObjectId");
        for (const player of expected.players)
          for (const zone of Object.values(player.zones)) {
            for (const object of zone.visibility === "visible"
              ? zone.objects
              : zone.revealedObjects)
              expect(allowed.has(object.id)).toBe(true);
          }
        for (const object of Object.values(engine.runtime.state.objects)) {
          if (allowed.has(object.id)) continue;
          expect(wire).not.toContain(`"${object.id}"`);
          expect(wire).not.toContain(`${object.id}@`);
        }
        const definitionIds = new Set(
          Object.values(view.display.objects).map((object) => object.definitionId),
        );
        expect(Object.keys(view.display.cards).every((id) => definitionIds.has(id))).toBe(true);
        expect(view.state).toMatchObject({ players: expected.players });
      }
      privacy(sa, "p1");
      privacy(sb, "p2");
      async function updates() {
        const nextA = await a.wait("state_update");
        const nextB = await b.wait("state_update");
        expect(nextA.sequence).toBeGreaterThan(sa.sequence);
        expect(nextB.sequence).toBeGreaterThan(sb.sequence);
        expect(nextA.stateVersion).toBeGreaterThan(sa.stateVersion);
        sa = nextA;
        sb = nextB;
        privacy(sa, "p1");
        privacy(sb, "p2");
      }
      a.send(submission(sa, pass(sa), "pregame-p1"));
      expect((await a.wait("action_result")).accepted).toBe(true);
      await updates();
      b.send(submission(sb, pass(sb), "pregame-p2"));
      expect((await b.wait("action_result")).accepted).toBe(true);
      await updates();
      expect(sa.stateVersion).toBe(28);
      function checkDrawProjection(snapshot: Snapshot) {
        if (snapshot.type !== "state_update") throw new Error("Expected opening-hand update");
        const draws = snapshot
          .animation!.steps.filter((step) => step.type === "entityTransfer")
          .filter((step) => step.audioCue === "card.draw");
        expect(draws).toHaveLength(14);
        expect(new Set(draws.map((step) => step.id)).size).toBe(14);
        expect(draws.filter((step) => step.destinationFace === "public")).toHaveLength(7);
        expect(draws.filter((step) => step.destinationFace === "hidden")).toHaveLength(7);
        for (const draw of draws) {
          expect(draw.from).toMatchObject({ kind: "zone", id: "main-deck" });
          expect(draw.to).toMatchObject({ kind: "zone", id: "hand" });
          expect(draw.sourceFace).toBe("hidden");
          if (draw.destinationFace === "hidden") {
            expect(draw.entity.id.startsWith("hidden-draw-")).toBe(true);
            expect(snapshot.display.objects[draw.entity.id]).toBeUndefined();
          } else expect(snapshot.display.objects[draw.entity.id]).toBeDefined();
        }
      }

      checkDrawProjection(sa);
      checkDrawProjection(sb);
      expect(sa.state).toMatchObject({
        pregamePlayerId: null,
        championIds: { p1: ["object-12"], p2: ["object-84"] },
        players: [
          { zones: { hand: { visibility: "visible" } } },
          { zones: { hand: { visibility: "hidden", count: 7 } } },
        ],
      });
      expect(engine.runtime.state.zones[grandArchivePlayerId("p1")].hand).toHaveLength(7);
      expect(engine.runtime.state.zones[grandArchivePlayerId("p2")].hand).toHaveLength(7);
      const action = sa.interaction.actions.find(
        (action) => action.source?.definitionId === "2Q60hBYO3i",
      )!;
      expect(action.intent).toBe("play-card");
      const input = action.inputs[0];
      if (input?.kind !== "entity-selection") throw new Error("Expected reserve payment");
      expect(input.min).toBe(3);
      const payment = input.candidates
        .slice(0, input.min)
        .map((candidate) => candidate.entity.instanceId);
      const play = submission(sa, action, "play-crusader", { [input.id]: payment });
      const initialFingerprint = fingerprintGrandArchiveValue(engine.getState());
      a.send(submission(sa, action, "bad-payment", { [input.id]: ["not-a-card"] }));
      expect((await a.wait("action_result")).accepted).toBe(false);
      b.send(play);
      expect((await b.wait("action_result")).accepted).toBe(false);
      a.socket.send(JSON.stringify({ ...play, actorId: "p2" }));
      expect((await a.wait("error")).code).toBe("unsupported_or_malformed_message");
      a.socket.send(
        JSON.stringify({
          ...play,
          correlationId: "missing-action",
          submission: {
            ...(play.type === "submit_interaction" ? play.submission : {}),
            actionId: "unavailable",
            correlationId: "missing-action",
          },
        }),
      );
      expect((await a.wait("action_result")).accepted).toBe(false);
      expect(fingerprintGrandArchiveValue(engine.getState())).toBe(initialFingerprint);
      a.send(play);
      const accepted = await a.wait("action_result");
      expect(accepted.accepted).toBe(true);
      await updates();
      expect(engine.runtime.state.zones[grandArchivePlayerId("p1")].hand).toHaveLength(3);
      expect(engine.runtime.state.zones[grandArchivePlayerId("p1")].memory).toHaveLength(3);
      expect(engine.runtime.state.zones[grandArchivePlayerId("p1")].memory).toEqual(
        expect.arrayContaining(payment),
      );
      expect(engine.runtime.state.stack).toHaveLength(1);
      const activatedVersion = sa.stateVersion;
      a.send(play);
      expect(await a.wait("action_result")).toEqual(accepted);
      a.socket.send(
        JSON.stringify({
          ...play,
          submission: {
            ...(play.type === "submit_interaction" ? play.submission : {}),
            values: {},
          },
        }),
      );
      expect((await a.wait("error")).code).toBe("correlation_conflict");
      a.send(
        submission({ ...sa, stateVersion: 28 }, action, "stale-play", { [input.id]: payment }),
      );
      expect((await a.wait("action_result")).accepted).toBe(false);
      expect(engine.getStateID()).toBe(activatedVersion);
      // Lose a result intentionally: send the opportunity pass, close without consuming it.
      const uncertain = submission(sa, pass(sa), "uncertain-pass");
      a.send(uncertain);
      const uncertainEnd = a.transcript.length;
      a.socket.close();
      const recovered = await connectNative(host.url, host.sessions[0]!.credential);
      clients.push(recovered);
      recovered.send({ v: 1, type: "join_game", gameId: sa.gameId, lastSequence: sa.sequence });
      let recoveredState: Snapshot = await recovered.wait("state_sync");
      recovered.send(uncertain);
      const original = await recovered.wait("action_result");
      expect(original.accepted).toBe(true);
      expect(original.stateVersion).toBe(recoveredState.stateVersion);
      expect(
        engine.replayJournal.commands.filter(
          (command) => command.correlationId === "p1:uncertain-pass",
        ),
      ).toHaveLength(1);
      sb = await b.wait("state_update");
      privacy(sb, "p2");
      // Omit that update on p1; the complete reconnect snapshot already recovered it.
      expect(recoveredState.sequence).toBeGreaterThan(sa.sequence);
      b.send(submission(sb, pass(sb), "resolve-crusader"));
      expect((await b.wait("action_result")).accepted).toBe(true);
      recoveredState = await recovered.wait("state_update");
      sb = await b.wait("state_update");
      privacy(recoveredState, "p1");
      privacy(sb, "p2");
      expect(engine.runtime.state.stack).toHaveLength(0);
      expect(engine.runtime.state.zones[grandArchivePlayerId("p1")].field).toContain(
        grandArchiveObjectId(action.source!.instanceId),
      );
      expect(
        engine.runtime.state.objects[grandArchiveObjectId(action.source!.instanceId)]!.states,
      ).toContain("rested");
      expect(engine.runtime.state.zones[grandArchivePlayerId("p1")].hand).toHaveLength(3);
      expect(engine.runtime.state.zones[grandArchivePlayerId("p1")].memory).toHaveLength(3);
      expect(
        recoveredState.type === "state_update" &&
          recoveredState.animation?.steps.some(
            (step) => step.type === "effect" && step.label === "Resolved",
          ),
      ).toBe(true);
      expect(
        recoveredState.type === "state_update" &&
          recoveredState.animation?.steps.some(
            (step) =>
              step.type === "entityTransfer" && step.entity.id === action.source!.instanceId,
          ),
      ).toBe(true);
      for (const [actorId, counts] of [
        ["p1", { hand: 3, memory: 3, field: 2, "main-deck": 53 }],
        ["p2", { hand: 7, memory: 0, field: 1, "main-deck": 53 }],
      ] as const) {
        const zones = engine.runtime.state.zones[grandArchivePlayerId(actorId)];
        expect({
          hand: zones.hand.length,
          memory: zones.memory.length,
          field: zones.field.length,
          "main-deck": zones["main-deck"].length,
        }).toEqual(counts);
      }
      const replay = engine.exportReplay();
      expect(fingerprintGrandArchiveValue(replayGrandArchiveReplay(engine.program, replay))).toBe(
        replay.finalSnapshotFingerprint,
      );
      if (fixtureOutput || fixtureCompare) {
        const fixture = {
          description:
            "Standard: normal pregame, Crusader of Aesa reserve payment, opportunity passes, rested field entry",
          testSeed: "native-standard-1",
          selectedCard: action.source,
          payment,
          finalCounts: {
            p1: { hand: 3, memory: 3, field: 2, mainDeck: 53 },
            p2: { hand: 7, memory: 0, field: 1, mainDeck: 53 },
            stack: 0,
          },
          viewers: {
            p1: [...a.transcript.slice(0, uncertainEnd), ...recovered.transcript],
            p2: b.transcript,
          },
        };
        let json = JSON.stringify(fixture, null, 2)
          .replaceAll(sa.gameId, "fixture-game")
          .replaceAll(sa.matchId, "fixture-match");
        for (const session of host.sessions)
          json = json.replaceAll(session.id, `fixture-session-${session.actorId}`);
        // The closed socket may receive the result before TCP closes; omit undelivered/uncertain tail.
        if (fixtureOutput) {
          const path = resolve(fixtureOutput);
          await mkdir(dirname(path), { recursive: true });
          await writeFile(path, json + "\n");
        } else if (fixtureCompare) {
          const golden = JSON.parse(await readFile(resolve(fixtureCompare), "utf8"));
          expect(JSON.parse(json)).toEqual(golden);
        }
      }
    } finally {
      for (const client of clients) client.socket.close();
      await host.stop();
    }
  }, 30000);

  test("malformed traffic, versions, session authority, input size, connection and ingress bounds", async () => {
    const host = startNativeHost();
    const sockets: WebSocket[] = [];
    try {
      const client = await connectNative(host.url, host.sessions[0]!.credential);
      sockets.push(client.socket);
      for (const raw of [
        "{",
        '{"v":2,"type":"ping","nonce":"x"}',
        '{"v":1,"type":"execute_move"}',
        '{"v":1,"type":"join_game","fixtureIds":["x","y"],"seed":"client-seed"}',
      ]) {
        client.socket.send(raw);
        expect((await client.wait("error")).type).toBe("error");
      }
      client.socket.send(new Uint8Array([1, 2, 3]));
      expect((await client.wait("error")).code).toBe("invalid_frame");
      client.send({ v: 1, type: "hello", credential: host.sessions[1]!.credential });
      expect((await client.wait("error")).code).toBe("already_authenticated");
      client.send({ v: 1, type: "ping", nonce: "heartbeat" });
      expect((await client.wait("pong")).nonce).toBe("heartbeat");
      for (let i = 0; i < 100; i++) client.send({ v: 1, type: "ping", nonce: `burst-${i}` });
      expect((await client.wait("error")).code).toBe("queue_full");
      const unauth = new WebSocket(host.url);
      sockets.push(unauth);
      await new Promise<void>((resolve) => unauth.addEventListener("open", () => resolve()));
      const reply = new Promise<string>((resolve) =>
        unauth.addEventListener("message", (event) => resolve(String(event.data)), { once: true }),
      );
      unauth.send(JSON.stringify({ v: 1, type: "hello", credential: "wrong" }));
      expect(JSON.parse(await reply).code).toBe("unauthorized");
      const closed = new Promise<CloseEvent>((resolve) =>
        unauth.addEventListener("close", resolve, { once: true }),
      );
      unauth.send("x".repeat(NATIVE_LIMITS.inputBytes + 1));
      expect([1006, 1009]).toContain((await closed).code);
      expect(
        (
          await fetch(host.url.replace("ws:", "http:"), {
            headers: { Origin: "https://example.com" },
          })
        ).status,
      ).toBe(404);
    } finally {
      for (const socket of sockets) socket.close();
      await host.stop();
    }
  }, 30000);
});

test("lost activation response reconnects without double payment or double play", async () => {
  const host = startNativeHost({ testSeed: "native-standard-1" });
  const clients: Awaited<ReturnType<typeof connectNative>>[] = [];
  try {
    const a = await connectNative(host.url, host.sessions[0]!.credential);
    clients.push(a);
    const b = await connectNative(host.url, host.sessions[1]!.credential);
    clients.push(b);
    a.send({ v: 1, type: "join_game", fixtureIds: ["lorraine-pnp-1-4", "rai-pnp-1-4"] });
    let sa: Snapshot = await a.wait("state_sync");
    b.send({ v: 1, type: "join_game", gameId: sa.gameId });
    await b.wait("state_sync");
    a.send(submission(sa, pass(sa), "pregame-1"));
    await a.wait("action_result");
    await a.wait("state_update");
    const sb = await b.wait("state_update");
    b.send(submission(sb, pass(sb), "pregame-2"));
    await b.wait("action_result");
    await b.wait("state_update");
    sa = await a.wait("state_update");
    const action = sa.interaction.actions.find(
      (action) => action.source?.definitionId === "2Q60hBYO3i",
    )!;
    const input = action.inputs[0];
    if (input?.kind !== "entity-selection") throw new Error("Missing payment");
    const play = submission(sa, action, "lost-play", {
      [input.id]: input.candidates
        .slice(0, input.min)
        .map((candidate) => candidate.entity.instanceId),
    });
    a.send(play);
    a.socket.close();
    const recovered = await connectNative(host.url, host.sessions[0]!.credential);
    clients.push(recovered);
    recovered.send({ v: 1, type: "join_game", gameId: sa.gameId });
    const current = await recovered.wait("state_sync");
    recovered.send(play);
    recovered.send(play);
    const original = await recovered.wait("action_result");
    expect(original.accepted).toBe(true);
    expect(await recovered.wait("action_result")).toEqual(original);
    expect(original.stateVersion).toBe(current.stateVersion);
    // Discard p2's activation update, then recover solely through the public sync request.
    await b.wait("state_update");
    b.send({ v: 1, type: "request_game_state_sync", gameId: current.gameId });
    const synced = await b.wait("state_sync");
    expect(synced.stateVersion).toBe(current.stateVersion);
    expect(synced.sequence).toBeGreaterThan(sb.sequence);
    expect(
      host.engine!.replayJournal.commands.filter(
        (command) => command.correlationId === "p1:lost-play",
      ),
    ).toHaveLength(1);
    expect(host.engine!.runtime.state.zones[grandArchivePlayerId("p1")].memory).toHaveLength(3);
    expect(host.engine!.runtime.state.zones[grandArchivePlayerId("p1")].hand).toHaveLength(3);
    expect(host.engine!.runtime.state.stack).toHaveLength(1);
  } finally {
    for (const client of clients) client.socket.close();
    await host.stop();
  }
}, 30000);

test("bounded result retention rejects new commands without evicting original outcomes", async () => {
  const host = startNativeHost({ testSeed: "native-standard-1", testResultLimit: 1 });
  const client = await connectNative(host.url, host.sessions[0]!.credential);
  try {
    client.send({ v: 1, type: "join_game", fixtureIds: ["lorraine-pnp-1-4", "rai-pnp-1-4"] });
    const initial = await client.wait("state_sync");
    const command = submission(initial, pass(initial), "retained");
    client.send(command);
    const result = await client.wait("action_result");
    await client.wait("state_update");
    client.send(submission(initial, pass(initial), "overflow"));
    expect((await client.wait("error")).code).toBe("session_capacity");
    client.send(command);
    expect(await client.wait("action_result")).toEqual(result);
    expect(host.engine!.replayJournal.commands).toHaveLength(1);
  } finally {
    client.socket.close();
    await host.stop();
  }
}, 30000);

test("oversized output closes the viewer and connection admission is bounded", async () => {
  const host = startNativeHost({ testOutputBytes: 1024 });
  const client = await connectNative(host.url, host.sessions[0]!.credential);
  try {
    const closed = new Promise<CloseEvent>((resolve) =>
      client.socket.addEventListener("close", resolve, { once: true }),
    );
    client.send({ v: 1, type: "join_game", fixtureIds: ["lorraine-pnp-1-4", "rai-pnp-1-4"] });
    expect((await closed).code).toBe(1009);
    expect(host.engine!.getStateID()).toBe(0);
  } finally {
    client.socket.close();
    await host.stop();
  }
  await expect(
    fetch(host.url.replace("ws:", "http:"), { signal: AbortSignal.timeout(1000) }),
  ).rejects.toThrow();
  const bounded = startNativeHost();
  const sockets: WebSocket[] = [];
  try {
    for (let i = 0; i < NATIVE_LIMITS.connections; i++) {
      const socket = new WebSocket(bounded.url);
      sockets.push(socket);
      await new Promise<void>((resolve) =>
        socket.addEventListener("open", () => resolve(), { once: true }),
      );
    }
    const denied = await fetch(bounded.url.replace("ws:", "http:"));
    expect(denied.status).toBe(503);
    await denied.text();
  } finally {
    for (const socket of sockets) socket.close();
    await bounded.stop();
  }
}, 30000);

describe("server-owned practice opponent", () => {
  for (const opponent of ["pass-only", "champion-profile"] as const) {
    test(`${opponent} completes real opponent pregame without a second client`, async () => {
      const host = startNativeHost({ opponent, opponentDelayMs: 5, testSeed: "native-standard-1" });
      const client = await connectNative(host.url, host.sessions[0]!.credential);
      try {
        client.send({ v: 1, type: "join_game", fixtureIds: ["lorraine-pnp-1-4", "rai-pnp-1-4"] });
        const initial = await client.wait("state_sync");
        client.send(submission(initial, pass(initial), "human-pregame"));
        expect((await client.wait("action_result")).accepted).toBe(true);
        await client.wait("state_update");
        const ready = await client.wait("state_update");
        expect(ready.state).toMatchObject({
          pregamePlayerId: null,
          players: [
            {
              zones: {
                hand: {
                  visibility: "visible",
                },
              },
            },
            { zones: { hand: { visibility: "hidden", count: 7 } } },
          ],
        });
        expect(
          host.engine!.replayJournal.commands.filter((entry) => entry.actorId === "p2"),
        ).toHaveLength(1);
        const engine = host.engine!;
        const replay = engine.exportReplay();
        expect(fingerprintGrandArchiveValue(replayGrandArchiveReplay(engine.program, replay))).toBe(
          replay.finalSnapshotFingerprint,
        );
      } finally {
        client.socket.close();
        await host.stop();
      }
    });
  }
});

test("automated opponent respects the configured command retention bound", async () => {
  const host = startNativeHost({
    opponent: "pass-only",
    opponentDelayMs: 5,
    testSeed: "native-standard-1",
    testResultLimit: 1,
  });
  const client = await connectNative(host.url, host.sessions[0]!.credential);
  try {
    client.send({ v: 1, type: "join_game", fixtureIds: ["lorraine-pnp-1-4", "rai-pnp-1-4"] });
    const initial = await client.wait("state_sync");
    client.send(submission(initial, pass(initial), "human-pregame"));
    expect((await client.wait("action_result")).accepted).toBe(true);
    await client.wait("state_update");
    expect((await client.wait("error")).code).toBe("session_capacity");
    expect(host.engine!.replayJournal.commands).toHaveLength(1);
    expect(host.engine!.replayJournal.commands[0]!.actorId).toBe("p1");
  } finally {
    client.socket.close();
    await host.stop();
  }
});

for (const scenario of [
  {
    name: "optional unsupported input omitted",
    required: false,
    min: 1,
    supplied: false,
    conditional: false,
    accepted: true,
  },
  {
    name: "zero-minimum unsupported input omitted",
    required: true,
    min: 0,
    supplied: false,
    conditional: false,
    accepted: true,
  },
  {
    name: "unsupported input supplied even though optional",
    required: false,
    min: 1,
    supplied: true,
    conditional: false,
    accepted: false,
  },
  {
    name: "optional unsupported input explicitly null",
    required: false,
    min: 1,
    supplied: false,
    conditional: false,
    accepted: true,
    explicitValue: null,
  },
  {
    name: "required unsupported input explicitly null",
    required: true,
    min: 1,
    supplied: false,
    conditional: false,
    accepted: false,
    explicitValue: null,
  },
  {
    name: "optional unsupported input explicitly empty array",
    required: false,
    min: 1,
    supplied: false,
    conditional: false,
    accepted: false,
    explicitValue: [],
  },
  {
    name: "required unsupported input omitted",
    required: true,
    min: 1,
    supplied: false,
    conditional: false,
    accepted: false,
  },
  {
    name: "conditional unsupported input not required",
    required: false,
    min: 1,
    supplied: false,
    conditional: true,
    accepted: true,
  },
  {
    name: "conditional unsupported input required",
    required: false,
    min: 1,
    supplied: false,
    conditional: true,
    accepted: false,
  },
]) {
  test(`native capability guard: ${scenario.name}`, async () => {
    const host = startNativeHost({ testSeed: "native-standard-1" });
    const client = await connectNative(host.url, host.sessions[0]!.credential);
    try {
      client.send({ v: 1, type: "join_game", fixtureIds: ["lorraine-pnp-1-4", "rai-pnp-1-4"] });
      const initial = await client.wait("state_sync");
      const engine = host.engine!;
      const original = engine.getInteractionView.bind(engine);
      // Decorate the public projection to exercise a future optional input family;
      // the actual pregame action still runs through the real engine and socket.
      const projection = spyOn(engine, "getInteractionView").mockImplementation((viewer) => {
        const view = original(viewer);
        return {
          ...view,
          actions: view.actions.map((action) => ({
            ...action,
            inputs: [
              ...action.inputs,
              {
                kind: "ordering" as const,
                id: "optional-order",
                text: { key: "test.order" },
                entityKind: "card" as const,
                required: scenario.required,
                min: scenario.min,
                max: 1,
                candidates: [
                  {
                    entity: { kind: "card" as const, instanceId: "test-candidate" },
                    enabled: true,
                  },
                ],
                ...(scenario.conditional
                  ? { requiredWhen: [{ all: [{ inputId: "mode", value: ["ordered"] }] }] }
                  : {}),
              },
            ],
          })),
        };
      });
      client.send({ v: 1, type: "request_game_state_sync", gameId: initial.gameId });
      const state = await client.wait("state_sync");
      const values: Record<string, InteractionSubmissionValue> = scenario.supplied
        ? { "optional-order": ["test-candidate"] }
        : {};
      if ("explicitValue" in scenario) values["optional-order"] = scenario.explicitValue ?? null;
      if (scenario.conditional && !scenario.accepted) values.mode = ["ordered"];
      client.send(submission(state, pass(state), "capability-check", values));
      const result = await client.wait("action_result");
      projection.mockRestore();
      expect(result.accepted).toBe(scenario.accepted);
      if (scenario.accepted) {
        expect((await client.wait("state_update")).stateVersion).toBeGreaterThan(
          state.stateVersion,
        );
      } else {
        expect(result.code).toBe("unsupported_interaction");
        expect(result.stateVersion).toBe(state.stateVersion);
      }
    } finally {
      client.socket.close();
      await host.stop();
    }
  });
}
