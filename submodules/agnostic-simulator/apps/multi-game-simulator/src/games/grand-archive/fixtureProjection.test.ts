import { expect, it } from "vitest";
import { createGrandArchiveCatalogSmokeFixture } from "@tcg/grand-archive-engine/automation";
import {
  grandArchiveConcealedCard,
  projectGrandArchiveSimulator,
} from "@tcg/grand-archive-server-adapter";
import { grandArchiveHarnessFixture } from "./fixtureProjection";

it("retains portrait presentation through the shared live, practice, and fixture boundary", () => {
  const { program, initialState } = createGrandArchiveCatalogSmokeFixture(20260826);
  const projection = projectGrandArchiveSimulator(
    program,
    initialState,
    initialState.turnOrder[0]!,
  );
  const hidden = grandArchiveConcealedCard("opponent:hand:concealed:0", "opponent");
  const fixture = grandArchiveHarnessFixture("presentation", "Presentation", "", {
    ...projection,
    entities: [...projection.entities, hidden],
  });

  expect(fixture.entities).toHaveLength(projection.entities.length + 1);
  for (const entity of fixture.entities) {
    expect(entity.backImageUrl).toBe(
      "https://cdn.tcg.online/public/grand-archive/simulator/card-back.webp",
    );
    expect(entity.hiddenBackLayout).toBeUndefined();
    expect(entity.imageAspectRatio).toBe(5 / 7);
  }
  expect(fixture.entities.at(-1)).toEqual(hidden);
  expect(fixture.table).toBe(projection.table);
  expect(fixture.interactions).toEqual(projection.interactions);
});
