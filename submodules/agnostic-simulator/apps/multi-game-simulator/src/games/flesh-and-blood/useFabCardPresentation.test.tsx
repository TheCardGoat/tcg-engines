import { MantineProvider } from "@mantine/core";
import { FabPresentationCatalogProvider } from "./FabPresentationCatalog";
import { webcrypto } from "node:crypto";
import { useFabCardArt } from "./FabPresentationCatalog";
// @vitest-environment jsdom
import { cleanup, render as renderRaw, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type FabPresentationDefinition } from "./cardArt";
import { useFabCardPresentation } from "./useFabCardPresentation";

function PresentationHarness({
  definitions,
  requestKey,
  lookupCanonicalId,
}: {
  readonly definitions: readonly FabPresentationDefinition[];
  readonly requestKey: number;
  readonly lookupCanonicalId: string;
}) {
  const { boardImageUrlForFabCard } = useFabCardArt();
  const state = useFabCardPresentation(definitions, requestKey);
  return (
    <output data-testid="presentation-harness" data-state={state.kind}>
      {boardImageUrlForFabCard({ canonicalId: lookupCanonicalId }) ?? "missing"}
    </output>
  );
}

beforeEach(() => vi.stubGlobal("crypto", webcrypto));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useFabCardPresentation", () => {
  it("loads presentation for a canonical id introduced after the initial render", async () => {
    const snatch = {
      canonicalId: "PHktCwKzLmBMwmCBwb7Cw",
      name: "Snatch",
      slug: "snatch-red",
    } as const;
    const deathDealer = {
      canonicalId: "Nnmtz6GrR6MWMcptb6wD7",
      name: "Death Dealer",
      slug: "death-dealer",
    } as const;
    const view = render(
      <PresentationHarness
        definitions={[snatch]}
        requestKey={1}
        lookupCanonicalId={snatch.canonicalId}
      />,
    );
    expect(screen.getByTestId("presentation-harness").getAttribute("data-state")).toBe("loading");

    await waitFor(
      () =>
        expect(screen.getByTestId("presentation-harness").textContent).toMatch(/\/assets\/board\//),
      { timeout: 15_000 },
    );
    expect(screen.getByTestId("presentation-harness").textContent).toMatch(
      /\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/,
    );

    view.rerender(
      <PresentationHarness
        definitions={[snatch, deathDealer]}
        requestKey={2}
        lookupCanonicalId={deathDealer.canonicalId}
      />,
    );
    await waitFor(() => {
      const harness = screen.getByTestId("presentation-harness");
      expect(harness.getAttribute("data-state")).toBe("ready");
      expect(harness.textContent).toMatch(/\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/);
    });
  });
});

function render(ui: Parameters<typeof renderRaw>[0]) {
  return renderRaw(ui, {
    wrapper: ({ children }) => (
      <MantineProvider>
        <FabPresentationCatalogProvider>{children}</FabPresentationCatalogProvider>
      </MantineProvider>
    ),
  });
}

it("reports a missing scope instead of creating disconnected loader and reader registries", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    expect(() =>
      renderRaw(<PresentationHarness definitions={[]} requestKey={1} lookupCanonicalId="card" />),
    ).toThrow("FAB card presentation requires FabPresentationCatalogProvider");
  } finally {
    error.mockRestore();
  }
});
