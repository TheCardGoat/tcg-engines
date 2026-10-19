import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { projectGrandArchiveViewerState } from "@tcg/grand-archive-engine/simulator";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import type {
  GrandArchiveActivationState,
  GrandArchiveObjectState,
} from "@tcg/grand-archive-types";
import { portSmuggler, spiritOfWind } from "@tcg/grand-archive-cards";
import { grandArchiveStatusDecorations } from "./status-presentation.ts";
import { projectGrandArchiveSimulator, projectGrandArchiveViewerSimulator } from "./projection.ts";

describe("Grand Archive native state projection", () => {
  it("retains object and activation scope for both viewers without exposing hidden cards", () => {
    const engine = GrandArchiveTestEngine.startFixture({
      playerOne: {
        id: "p1",
        champion: spiritOfWind,
        zones: { field: [portSmuggler], "main-deck": [portSmuggler] },
      },
      playerTwo: { id: "p2", champion: spiritOfWind },
    });
    const id = engine.player("p1").card(portSmuggler, { zone: "field" }).objectId;
    const hiddenId = engine.player("p1").card(portSmuggler, { zone: "main-deck" }).objectId;
    const states: readonly GrandArchiveObjectState[] = [
      "rested",
      "attacking",
      "defending",
      "retaliating",
      "intercepting",
      "distant",
      "fostered",
      "loaded",
      "brewed",
      "imbued",
      "prepared",
      "preserved",
      "ephemeral",
      "wielded",
    ];
    const activationStates: readonly GrandArchiveActivationState[] = [
      "prepared",
      "imbued",
      "brewed",
      "empowered",
      "ephemeral",
      "copy",
      "negated",
      "starcalled",
      "entered-from-banishment",
    ];
    const state = {
      ...engine.state,
      objects: {
        ...engine.state.objects,
        [id]: {
          ...engine.state.objects[id]!,
          temporaryDamage: 2,
          states: new Set(states),
          activationStates: new Set(activationStates),
        },
        [hiddenId]: {
          ...engine.state.objects[hiddenId]!,
          states: new Set(states),
          activationStates: new Set(activationStates),
        },
      },
    };
    for (const viewerId of [grandArchivePlayerId("p1"), grandArchivePlayerId("p2")]) {
      const direct = projectGrandArchiveSimulator(engine.program, state, viewerId);
      const serialized = projectGrandArchiveViewerSimulator(
        projectGrandArchiveViewerState(engine.program, state, viewerId),
      );
      const entity = direct.entities.find((candidate) => candidate.id === id)!;
      expect(entity.states).toEqual(["rested"]);
      expect(entity.decorations).toEqual(
        serialized.entities.find((candidate) => candidate.id === id)?.decorations,
      );
      const ids = entity.decorations?.map((decoration) => decoration.id);
      const publicView = projectGrandArchiveViewerState(engine.program, state, viewerId);
      const publicObject = publicView.players
        .flatMap((player) =>
          Object.values(player.zones).flatMap((zone) =>
            zone.visibility === "visible" ? zone.objects : zone.revealedObjects,
          ),
        )
        .find((object) => object.id === id)!;
      // Loaded/wielded are derived by the engine from linked objects, not trusted stored flags.
      for (const status of publicObject.states.filter(
        (value) => value !== "rested" && value !== "awake",
      ))
        expect(ids).toContain(`ga:state:${status}`);
      const allMapped = grandArchiveStatusDecorations(states, activationStates).map(
        (decoration) => decoration.id,
      );
      for (const status of states.filter((value) => value !== "rested"))
        expect(allMapped).toContain(`ga:state:${status}`);
      expect(ids).toContain("ga:state:damaged");
      for (const status of activationStates) expect(ids).toContain(`ga:activation:${status}`);
      expect(direct.entities.some((candidate) => candidate.id === hiddenId)).toBe(false);
      expect(serialized.entities.some((candidate) => candidate.id === hiddenId)).toBe(false);
    }
  });
});
