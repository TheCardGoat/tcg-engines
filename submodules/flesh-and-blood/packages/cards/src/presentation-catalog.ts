import generated from "./generated/presentation-catalog.json";
import type { FabPresentationCatalog } from "./presentation.ts";

/** Server entrypoint. Browser routes import only presentation / presentation-revision. */
export const fabPresentationCatalog: FabPresentationCatalog = {
  ...generated,
  schemaVersion: 1,
  game: "flesh-and-blood",
};
