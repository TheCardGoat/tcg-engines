import { webcrypto } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { definitionsForFabMatchPresentation } from "./cardArt";
import { FAB_ENGINE_SCENARIOS } from "./engineScenarios";
import { fixturePresentationDefinitions } from "./fixture-presentation";
import { FabPresentationRegistry } from "./presentation-registry";

beforeEach(() => vi.stubGlobal("crypto", webcrypto));
afterEach(() => vi.unstubAllGlobals());

// Source printing catalogs explicitly contain no image pairs for these cards.
// Keep this list exact: new gaps AND repaired entries fail the audit, so the
// documented debt cannot grow silently or outlive its repair.
const KNOWN_SOURCE_GAPS: ReadonlySet<string> = new Set([
  "QfFBhL9WNg9pdbTGqfPrh", // Demonbound Gloomblade, yellow
  "Jr9TkGFQQQbFzNhQbPCCR", // Demonbound Gloomblade, blue
  "r7JgDQFn8LQRRBDDwMMTj", // Hellbound Assault, yellow
  "zRNknjBBKWttC7kRgJG9g", // Hellbound Assault, blue
  "qk9CgqWCcCFdkddzNngPh", // Otherworldly Sins, red
  "HCjKd6dWLBBJbkwhbBtfC", // Otherworldly Sins, yellow
  "nWPD8WCfJkKhb6JRhczTk", // Otherworldly Sins, blue
  "jpGQNdgmndK8bBGmDRhp9", // Blessing of Suraya, yellow
  "HNdCrFPzJPThCzLBqpMdt", // Bravery of the Blade, red
  "GDPhkGLTWbJFN6LDq9HW6", // Channel Stormgarden, yellow
  "fCHHw7hpnDBBMk7QT6t69", // Exorcism, red
  "WCDQmHjfcPBRfrpGh9dq8", // Mark of Neverest, blue
  "C8jPCtGhgHQnQLLnPzdRd", // Mark of Pathstone, blue
  "LfctPwBM8nzQKQPmpLBRm", // Mark of Ushering, blue
  "dBwz9ngzQjPkbrdqRkhFf", // Restless Looter, red
  "MQRmLGWG6rGCHtNChtbkm", // Restless Templar, red
  "zQmwGLpLKkjtLTdpNdFK6", // Tome of Necrosis, red
  "b6jbtNjPhLb8BwJPWNJ6g", // Violent Gusto, red
]);

// Exercise the production catalog loader and match-scoped registry, including
// explicit artwork references for synthetic fixtures. Do not seed test art.
it.each(FAB_ENGINE_SCENARIOS)(
  "$id has no undocumented board or preview artwork gaps",
  async (scenario) => {
    const match = scenario.boot();
    const definitions = fixturePresentationDefinitions(
      definitionsForFabMatchPresentation(match.runtime.getState()),
    );
    const registry = new FabPresentationRegistry();
    await registry.ensure(definitions);
    expect(registry.getSnapshot().error).toBeUndefined();
    const missing = definitions.flatMap((definition) => {
      const art = registry.getSnapshot().resolver.resolveFabCardArt({
        ...definition,
        name: definition.name ?? definition.base?.names[0],
      });
      return art.boardImageUrl && art.printedImageUrl ? [] : [definition.canonicalId];
    });
    expect(missing.sort()).toEqual(
      definitions
        .map((definition) => definition.canonicalId)
        .filter((id) => KNOWN_SOURCE_GAPS.has(id))
        .sort(),
    );
  },
);
