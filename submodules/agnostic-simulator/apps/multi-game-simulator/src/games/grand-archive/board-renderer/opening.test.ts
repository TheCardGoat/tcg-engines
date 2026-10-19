import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import { projectGrandArchiveSimulator } from "@tcg/grand-archive-server-adapter";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { findGrandArchiveNativeFixture } from "../native-fixtures";
import { grandArchiveHarnessFixture } from "../fixtureProjection";
import { grandArchiveBoardProjection } from "../GrandArchiveBoard";
import { grandArchiveLayout } from "./layout";
import { grandArchiveOpeningFlights, sampleGrandArchiveOpeningFlight } from "./opening";
import type { GrandArchivePresentationSnapshot } from "./animation";

function nativeOpeningSnapshots() {
  const server = findGrandArchiveNativeFixture("native-opening")!.createServer();
  const snapshots: GrandArchivePresentationSnapshot[] = [];
  for (let step = 0; step < 5; step++) {
    const projection = grandArchiveBoardProjection(
      grandArchiveHarnessFixture(
        "native-opening",
        "Opening",
        "",
        projectGrandArchiveSimulator(
          server.program,
          server.runtime.state,
          grandArchivePlayerId("p1"),
        ),
      ),
    );
    const prior = snapshots.at(-1);
    snapshots.push({
      projection: { ...projection, resetKey: "stable-viewer" },
      poses: grandArchiveLayout(projection.cards),
      openingObserved: projection.opening?.pregame || prior?.openingObserved,
      openingDealt: [
        ...new Set([
          ...(prior?.openingDealt ?? []),
          ...projection.cards.filter((card) => card.zone === "hand").map((card) => card.owner),
        ]),
      ],
    });
    const wait = server.runtime.waitState();
    if (!("playerId" in wait)) break;
    const view = server.getInteractionView(wait.playerId);
    const action = view.actions.find((a) => a.intent === "pass");
    if (!action) break;
    const result = server.submitInteraction(
      wait.playerId,
      buildInteractionSubmission({ view, action }),
      { gameId: "native-opening-animation", sourceAuthority: "client" },
    );
    expect(result.success).toBe(true);
  }
  return snapshots;
}

describe("confirmed Grand Archive opening motion", () => {
  it("reveals real Spirits and deals authorized and anonymous hands from public pile positions", () => {
    const snapshots = nativeOpeningSnapshots();
    const flights = snapshots.flatMap((snapshot, i) =>
      [...grandArchiveOpeningFlights(snapshots[i - 1], snapshot.projection)].map(
        ([id, flight]) => ({
          card: snapshot.projection.cards.find((card) => card.id === id)!,
          flight,
          snapshot,
        }),
      ),
    );
    expect(flights.filter((f) => f.flight.showcase)).toHaveLength(2);
    expect(flights.filter((f) => f.card.zone === "hand" && f.card.owner === "self")).toHaveLength(
      7,
    );
    const opponent = flights.filter((f) => f.card.zone === "hand" && f.card.owner === "opponent");
    expect(opponent).toHaveLength(7);
    expect(opponent.every((f) => !f.flight.reveal && !f.card.faceUrl && !f.card.label)).toBe(true);
    const selfHand = flights.filter((f) => f.card.zone === "hand" && f.card.owner === "self");
    expect(selfHand[1]!.flight.delay - selfHand[0]!.flight.delay).toBe(100);
    for (const { card, flight, snapshot } of flights) {
      const target = snapshot.poses.get(card.id)!;
      const start = sampleGrandArchiveOpeningFlight(flight, target, 0);
      expect(start.x).toBeCloseTo(flight.origin.x);
      expect(start.z).toBeCloseTo(flight.origin.z);
      const finish = sampleGrandArchiveOpeningFlight(
        flight,
        target,
        flight.delay + flight.duration,
      );
      expect(finish).toMatchObject({ done: true, flip: 0 });
      for (const key of ["x", "y", "z", "scale"] as const)
        expect(finish[key]).toBeCloseTo(target[key]);
    }
  });
  it("does not animate initial loads, repeated snapshots, viewer changes or backwards versions", () => {
    const snapshots = nativeOpeningSnapshots();
    for (const snapshot of snapshots) {
      expect(grandArchiveOpeningFlights(undefined, snapshot.projection).size).toBe(0);
      expect(grandArchiveOpeningFlights(snapshot, snapshot.projection).size).toBe(0);
    }
    for (let i = 1; i < snapshots.length; i++) {
      expect(
        grandArchiveOpeningFlights(snapshots[i - 1], {
          ...snapshots[i]!.projection,
          resetKey: "changed-viewer",
        }).size,
      ).toBe(0);
      expect(grandArchiveOpeningFlights(snapshots[i], snapshots[i - 1]!.projection).size).toBe(0);
    }
  });
});
