import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { braveforgeBracers } from "../../cards/src/cards/equipment/braveforge-bracers.ts";
import { fyendalSSpringTunic } from "../../cards/src/cards/equipment/fyendal-s-spring-tunic.ts";
import { scabskinLeathers } from "../../cards/src/cards/equipment/scabskin-leathers.ts";
import { helmOfIsenSPeak } from "../../cards/src/cards/equipment/helm-of-isen-s-peak.ts";
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import { toFabCardDefinition } from "../src/cards.ts";
import { catalogCardDefinition } from "../src/automation/resolve-text-deck.ts";
import { catalogTestCardSpecs } from "./catalog-test-card-specs.mjs";

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(PACKAGE_ROOT, "src/automation/catalog-test-cards.generated.ts");

function exactRuntimeDefinition(definition) {
  const registered = toFabCardDefinition(definition);
  return {
    canonicalId: registered.canonicalId,
    slug: registered.slug,
    layout: registered.layout,
    base: registered.base,
  };
}

const catalogTestCards = Object.fromEntries(
  Object.entries(catalogTestCardSpecs).map(([key, [name, pitch]]) => [
    key,
    exactRuntimeDefinition(catalogCardDefinition(fleshAndBloodDeckCardLibrary, name, pitch)),
  ]),
);

const authoredOverrides = {
  scabskin: [scabskinLeathers, "Scabskin Leathers"],
  helmIron: [helmOfIsenSPeak, "Helm of Isen's Peak"],
  fyendalTunic: [fyendalSSpringTunic, "Fyendal's Spring Tunic"],
  braveforgeBracers: [braveforgeBracers, "Braveforge Bracers"],
};
for (const [key, [definition, name]] of Object.entries(authoredOverrides)) {
  catalogTestCards[key] = exactRuntimeDefinition({ ...definition, name });
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `import type { FabCardDefinitionInput } from "../cards.ts";

/** Generated bounded definitions used by fixtures and automation smoke tests. */
export const generatedCatalogTestCards = ${JSON.stringify(catalogTestCards, null, 2)} as const satisfies Record<string, FabCardDefinitionInput>;
`,
);

console.log(`Generated ${Object.keys(catalogTestCards).length} bounded FAB fixture definitions.`);
