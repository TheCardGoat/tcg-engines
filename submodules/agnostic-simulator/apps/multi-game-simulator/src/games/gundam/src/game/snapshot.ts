/**
 * Wire-safe match snapshot for SSR hydration (and future persisted
 * matches). Carries the full card catalog + the serialized engine
 * state so the client can reconstruct an identical `MatchRuntime` +
 * `staticResources` without re-running the fixture factory.
 *
 * Why ship the catalog instead of re-running `resolveFixture` on the
 * client: mock-card factories (`createMockUnit` etc.) use a
 * module-scope counter for `cardNumber`, so identical fixture calls
 * on server vs client produce DIFFERENT card ids. That breaks the
 * whole staticResources/state mapping. Shipping the catalog
 * sidesteps the non-determinism.
 *
 * This mirrors the resource-refs concept in the Lorcana engine but
 * resolves them inline since the simulator's fixtures aren't yet
 * backed by a stable production catalog.
 */

import {
  createStaticResources,
  deserializeState,
  MatchRuntime,
  serializeState,
  type MatchStaticResources,
  type Player,
  type SerializedMatchState,
} from "@tcg/gundam-engine";
import type { Card } from "@tcg/gundam-types";

import type { DevRuntime } from "./dev-runtime.ts";
import type { ViewerId } from "./types.ts";

/** One row in the serialized instance registry. Mirrors the value
 * shape `createStaticResources` stores in `cardsMaps.instances`. */
export interface SerializedInstance {
  readonly instanceId: string;
  readonly definitionId: string;
  readonly ownerID: string;
}

export interface MatchSnapshot {
  /** Fixture key the snapshot was produced from. Drives client-side
   * bot attachment (see `useClientBot`). Not needed for state
   * reconstruction; kept for telemetry + bot wiring. */
  readonly fixtureName: string;
  /** Player configs at initialization time. Feeds `createStaticResources`
   * on reconstruction. Deck + resourceDeck cards get instance entries
   * derived from this via the deterministic scheme in
   * `static-resources.ts`. */
  readonly players: readonly Player[];
  /** Full card catalog as `[cardNumber, Card]` entries. Cards are
   * plain data objects (no functions, no class instances) so they
   * round-trip via turbo-stream (RR's loader serialization). */
  readonly catalog: ReadonlyArray<readonly [string, Card]>;
  /** Complete `cardsMaps.instances` snapshot. This includes deck +
   * resourceDeck entries (which `createStaticResources` produces
   * deterministically from `players`) AND any entries added later
   * via `runtime.registerCardInstance` — the dev fixtures' placement
   * helpers register extra instances for cards in hand/battleArea/
   * shieldArea/etc., which `createStaticResources` alone can't
   * reproduce. Without this the engine can't resolve placed card
   * instances during effect processing on the reconstructed side. */
  readonly instances: readonly SerializedInstance[];
  /** Complete `cardsMaps.definitions` snapshot as `[definitionId,
   * Card]` entries. Includes everything the catalog carries AND any
   * **runtime-registered token definitions** that live only in the
   * definitions map (see `project-board.ts`'s token creation path).
   * Reconstructing only from the catalog would drop those tokens and
   * re-introduce the same silent-skip class of bug this PR fixes. */
  readonly definitions: ReadonlyArray<readonly [string, Card]>;
  /** Serialized engine state (G + ctx). `deserializeState` rebuilds
   * the live MatchState. */
  readonly state: SerializedMatchState;
  readonly p1Id: ViewerId;
  readonly p2Id: ViewerId;
  /** Whether the original `DevRuntime` carried a strategy bot. The
   * bot handle itself isn't serialized (holds closures over the
   * runtime); the client re-attaches post-hydration based on this
   * flag + the fixture name. */
  readonly hasBot: boolean;
  /**
   * Bot configuration carried across SSR hydration so the client can
   * re-attach a bot with the same strategy as the server-side
   * factory. Absent for fixtures that don't need a choice (e.g.
   * `vs-ai-demo`, which hard-codes `greedy-legal`).
   */
  readonly botConfig?: SnapshotBotConfig;
}

export interface SnapshotBotConfig {
  /** String id matching `OpponentStrategyId` in `match-factory.ts`.
   * Kept as a loose string in the snapshot type to avoid coupling
   * the snapshot layer to the simulator's strategy enum — the
   * bot-registry resolves it back to a concrete strategy. */
  readonly strategy: string;
}

export interface SnapshotOptions {
  readonly botConfig?: SnapshotBotConfig;
}

export function snapshotFromDevRuntime(
  fixtureName: string,
  dev: DevRuntime,
  options: SnapshotOptions = {},
): MatchSnapshot {
  const staticResources = dev.runtime.getStaticResources();
  return {
    fixtureName,
    players: staticResources.players,
    catalog: [...staticResources.catalog.entries()],
    instances: [...staticResources.cardsMaps.instances.entries()],
    definitions: [...staticResources.cardsMaps.definitions.entries()] as ReadonlyArray<
      readonly [string, Card]
    >,
    state: serializeState(dev.runtime.getState()),
    p1Id: dev.p1Id,
    p2Id: dev.p2Id,
    hasBot: Boolean(dev.bot),
    ...(options.botConfig ? { botConfig: options.botConfig } : {}),
  };
}

export interface ReconstructedMatch {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly p1Id: ViewerId;
  readonly p2Id: ViewerId;
  readonly hasBot: boolean;
  readonly fixtureName: string;
  readonly botConfig?: SnapshotBotConfig;
}

export function reconstructFromSnapshot(snapshot: MatchSnapshot): ReconstructedMatch {
  const catalog = new Map(snapshot.catalog);
  const staticResources = createStaticResources([...snapshot.players], catalog);

  // `createStaticResources` seeded the registry with deck +
  // resourceDeck instances from `players`, and populated
  // `cardsMaps.definitions` with ONLY those deck-referenced
  // definitions. Fixtures that place cards in other zones
  // (hand/battleArea/shieldArea/etc. via `runtime.registerCardInstance`)
  // add extra instance entries whose definitions never made it into
  // `cardsMaps.definitions` — the projection path in `project-board.ts`
  // reads from that map, so those placed cards become unresolvable
  // and effect processing (e.g. burst triggers) silently skips.
  //
  // Also: runtime-registered token definitions live only in
  // `cardsMaps.definitions` (not in the catalog — see
  // `project-board.ts`'s token creation path). Rebuilding from the
  // catalog alone loses them. Replay the snapshot's full maps for
  // both instances and definitions so the reconstructed resources
  // are byte-for-byte equivalent to the source.
  for (const [definitionId, def] of snapshot.definitions) {
    staticResources.cardsMaps.definitions.set(definitionId, def);
  }
  for (const entry of snapshot.instances) {
    staticResources.cardsMaps.instances.register(entry.instanceId, {
      definitionId: entry.definitionId,
      ownerID: entry.ownerID,
    });
  }

  const runtime = new MatchRuntime(staticResources);
  // `deserializeState` is generic across games and returns
  // `MatchState<object>`; `MatchRuntime.loadState` expects
  // `MatchState<GundamG>`. The runtime shape is identical — the
  // wire serializer is just type-erased over the game-specific G,
  // and the engine doesn't re-export `GundamG` from its public
  // surface. Cross the gap with a `Parameters` lookup so TS doesn't
  // need the concrete G type.
  type LoadStateArg = Parameters<typeof runtime.loadState>[0];
  runtime.loadState(deserializeState(snapshot.state) as LoadStateArg);
  return {
    runtime,
    staticResources,
    p1Id: snapshot.p1Id,
    p2Id: snapshot.p2Id,
    hasBot: snapshot.hasBot,
    fixtureName: snapshot.fixtureName,
    ...(snapshot.botConfig ? { botConfig: snapshot.botConfig } : {}),
  };
}
