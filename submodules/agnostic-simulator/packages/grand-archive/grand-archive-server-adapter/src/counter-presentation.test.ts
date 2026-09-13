import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { projectGrandArchiveViewerState } from "@tcg/grand-archive-engine/simulator";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { portSmuggler, spiritOfWind } from "@tcg/grand-archive-cards";
import { projectGrandArchiveSimulator, projectGrandArchiveViewerSimulator } from "./projection.ts";

describe("Grand Archive counter projection", () => {
  it("projects identical visible counters from runtime and serialized viewer state", () => {
    const engine = GrandArchiveTestEngine.startFixture({
      playerOne: { id: "p1", champion: spiritOfWind, zones: { field: [portSmuggler] } },
      playerTwo: { id: "p2", champion: spiritOfWind },
    });
    const id = engine.player("p1").card(portSmuggler, { zone: "field" }).objectId;
    const championId = engine.player("p1").card(spiritOfWind).objectId;
    const state = {
      ...engine.state,
      objects: {
        ...engine.state.objects,
        [championId]: { ...engine.state.objects[championId]!, damage: 7 },
        [id]: {
          ...engine.state.objects[id]!,
          damage: 2,
          counters: {
            buff: 3,
            debuff: 0,
            damage: 99,
            durability: 0,
            "named:charge": 12,
            preparation: 2,
          },
        },
      },
    };
    const champion = projectGrandArchiveSimulator(
      engine.program,
      state,
      grandArchivePlayerId("p1"),
    ).entities.find((entry) => entry.id === championId)!;
    expect(champion.decorations?.[0]?.ariaLabel).toContain("Persists until removed by an effect");
    const viewer = grandArchivePlayerId("p1");
    const direct = projectGrandArchiveSimulator(engine.program, state, viewer).entities.find(
      (entry) => entry.id === id,
    )!;
    const projected = projectGrandArchiveViewerSimulator(
      projectGrandArchiveViewerState(engine.program, state, viewer),
    ).entities.find((entry) => entry.id === id)!;
    expect(direct.decorations).toEqual(projected.decorations);
    expect(direct.stats).toEqual(projected.stats);
    expect(direct.stats).toEqual([
      { label: "Damage", value: "2" },
      { label: "Buff", value: "3" },
      { label: "Durability", value: "0" },
      { label: "charge", value: "12" },
      { label: "Preparation", value: "2" },
    ]);
    expect(direct.decorations?.map((entry) => entry.id)).toEqual([
      "ga:counter:damage",
      "ga:counter:buff",
      "ga:counter:durability",
      "ga:counter:named:charge",
      "ga:counter:preparation",
    ]);
    expect(direct.decorations?.[0]?.content).toEqual({ kind: "text", text: "2" });
    expect(direct.decorations?.[0]?.ariaLabel).toContain("Clears during the end phase");
    expect(
      direct.decorations?.find((entry) => entry.id === "ga:counter:named:charge")?.ariaLabel,
    ).toBe("charge: 12. Card-defined counter.");
    expect(direct.decorations?.at(-1)?.ariaLabel).toBe(
      "Preparation: 2. May be paid as an additional cost when activating a card with Prepare; distinct from the Prepared state.",
    );
    expect(
      projectGrandArchiveSimulator(engine.program, state, grandArchivePlayerId("p2")).entities.find(
        (entry) => entry.id === id,
      )?.decorations,
    ).toEqual(direct.decorations);
  });
});
