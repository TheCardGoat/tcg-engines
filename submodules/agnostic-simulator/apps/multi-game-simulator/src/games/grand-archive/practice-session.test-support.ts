import { createGrandArchiveCatalogSmokeFixture } from "@tcg/grand-archive-engine/automation";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveServerEngine } from "@tcg/grand-archive-server-adapter";

export function createPracticeEngineForSessionTest() {
  const { program, initialState } = createGrandArchiveCatalogSmokeFixture(20260826);
  return new GrandArchiveServerEngine(program, new GrandArchiveMatchRuntime(program, initialState));
}
