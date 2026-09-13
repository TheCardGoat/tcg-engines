import type { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { fabPresentationCatalog } from "@tcg/flesh-and-blood-cards/presentation-catalog";
import { FAB_PRESENTATION_CATALOG } from "@tcg/flesh-and-blood-cards/presentation-revision";
import { PresentationBundleSchema, emptyPresentationRecords } from "@tcg/protocol/presentation";
import { createFabCardArtResolver } from "./cardArt";
import { FabPresentationCatalogProvider } from "./FabPresentationCatalog";

export const testPresentationBundle = PresentationBundleSchema.parse({
  schemaVersion: 1,
  manifestId: "a".repeat(64),
  catalog: FAB_PRESENTATION_CATALOG,
  records: fabPresentationCatalog.records,
  aliases: fabPresentationCatalog.aliases,
});
export const testFabArt = createFabCardArtResolver(testPresentationBundle);
export const testPresentationEnvelope = {
  kind: "full" as const,
  bundle: testPresentationBundle,
  supplements: emptyPresentationRecords(),
  bindings: { printingIdByInstanceId: {} },
};
/** Every mount owns its mutable registry; only the immutable fixture catalog is shared. */
export function FabPresentationTestProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider>
      <FabPresentationCatalogProvider initial={testPresentationEnvelope}>
        {children}
      </FabPresentationCatalogProvider>
    </MantineProvider>
  );
}
