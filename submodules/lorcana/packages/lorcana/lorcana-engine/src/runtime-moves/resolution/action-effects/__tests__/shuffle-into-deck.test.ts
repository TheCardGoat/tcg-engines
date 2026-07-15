import { describe, it } from "bun:test";

/**
 * `shuffle-into-deck` moves a chosen card to the owner's deck and then calls
 * the framework's shuffle primitive. The shuffle primitive isn't modelled by
 * the unit harness (it relies on the full game's RNG and zone ordering); the
 * simulator integration suite exercises this variant end-to-end.
 */
describe("shuffle-into-deck", () => {
  it.todo(
    "unit: add shuffle-into-deck coverage once the harness models the framework shuffle primitive",
  );
});
