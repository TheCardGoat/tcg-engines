import { testFabArt } from "./presentation-test-provider";
const { resolveFabCardArt } = testFabArt;
// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSyncExternalStore } from "react";
import {
  FabPresentationCatalogProvider,
  useFabPresentationRegistry,
} from "./FabPresentationCatalog";
import { FabBoardCardFace } from "./FabBoardCardFace";
import { FabCardPreviewProvider, FabCardPreviewSurface } from "./FabCardPreview";
import { testPresentationEnvelope } from "./presentation-test-provider";

const quiver: SimulatorEntity = {
  id: "quiver",
  title: "Enchanted Quiver",
  subtitle: "Ranger Equipment Quiver",
  kind: "card",
  ownerId: "opponent",
  face: "public",
  states: [],
  stats: [],
  traits: [],
  dataAttributes: { "data-fab-canonical-id": "CWPHzh8wWpWNgwmQWgt7C" },
};
const heart: SimulatorEntity = {
  ...quiver,
  id: "heart",
  title: "Heart of Fyendal",
  dataAttributes: { "data-fab-canonical-id": "pBpLPQ7kg6mkBpNMMPdCD" },
};
function Cards({ entity, locale = "en-US" }: { entity: SimulatorEntity; locale?: string }) {
  return (
    <MantineProvider>
      <FabPresentationCatalogProvider locale={locale} initial={testPresentationEnvelope}>
        <FabCardPreviewProvider>
          <FabBoardCardFace entity={entity} density="compact" />
          <FabCardPreviewSurface entity={entity} />
        </FabCardPreviewProvider>
      </FabPresentationCatalogProvider>
    </MantineProvider>
  );
}
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: true, addEventListener() {}, removeEventListener() {} }),
  );
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe.sequential("FAB catalog readiness and rendering", () => {
  // The hosted bundle is installed before card components render.
  it("installs the hosted bundle synchronously and renders newly revealed identities", async () => {
    const view = render(<Cards entity={quiver} />);
    expect(view.queryByText("Loading card catalog")).toBeNull();
    await waitFor(
      () => expect(view.container.querySelector('[data-testid="card"] img')).not.toBeNull(),
      { timeout: 15_000 },
    );
    expect(view.container.querySelector('[data-testid="card"] img')?.getAttribute("src")).toContain(
      "/assets/board/",
    );
    expect(view.container.querySelector(".fab-card-preview-image")?.getAttribute("src")).toContain(
      "/assets/full/",
    );
    view.rerender(<Cards entity={heart} locale="fr-FR" />);
    const art = resolveFabCardArt({ canonicalId: "pBpLPQ7kg6mkBpNMMPdCD", locale: "fr-FR" });
    // Preserve the selected default art when it has no matching French printing.
    expect(art.assetLocale).toBe("en-US");
    expect(view.container.querySelector('[data-testid="card"] img')?.getAttribute("src")).toBe(
      art.boardImageUrl,
    );
    expect(view.container.querySelector(".fab-card-preview-image")?.getAttribute("src")).toBe(
      art.printedImageUrl,
    );
    view.rerender(<Cards entity={heart} locale="en-US" />);
    expect(view.container.querySelector(".fab-card-preview-image")?.getAttribute("src")).toBe(
      art.printedImageUrl,
    );
  }, 20_000);
  it("does not reveal hidden artwork even though the public catalog is complete", async () => {
    const view = render(<Cards entity={{ ...quiver, face: "hidden" }} />);
    await waitFor(() => expect(view.queryByTestId("fab-catalog-status")).toBeNull());
    expect(view.container.querySelector('img[src*="/assets/board/"]')).toBeNull();
    expect(view.container.querySelector('img[src*="/assets/full/"]')).toBeNull();
  });
  it("resets a failed image when switching locale or returning to a previous card", async () => {
    const view = render(<Cards entity={quiver} />);
    await waitFor(() =>
      expect(view.container.querySelector(".fab-card-preview-image")).not.toBeNull(),
    );
    fireEvent.error(view.container.querySelector(".fab-card-preview-image")!);
    expect(view.getByRole("button", { name: "Retry card image" })).toBeTruthy();
    view.rerender(<Cards entity={heart} locale="fr-FR" />);
    view.rerender(<Cards entity={quiver} />);
    expect(view.queryByRole("button", { name: "Retry card image" })).toBeNull();
  });
  it("retries transient image failures twice, then exposes an explicit preview retry", async () => {
    const view = render(<Cards entity={quiver} />);
    await waitFor(() =>
      expect(view.container.querySelector(".fab-card-preview-image")).not.toBeNull(),
    );
    vi.useFakeTimers();
    for (const delay of [500, 1000]) {
      fireEvent.error(view.container.querySelector(".fab-card-preview-image")!);
      expect(view.getByRole("button", { name: "Retry card image" })).toBeTruthy();
      act(() => {
        vi.advanceTimersByTime(delay);
      });
      expect(view.queryByRole("button", { name: "Retry card image" })).toBeNull();
    }
    fireEvent.error(view.container.querySelector(".fab-card-preview-image")!);
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    fireEvent.click(view.getByRole("button", { name: "Retry card image" }));
    fireEvent.load(view.container.querySelector(".fab-card-preview-image")!);
    expect(view.container.querySelector(".fab-card-preview-fallback--preview")).toBeNull();
  });
});

function BindingProbe() {
  const registry = useFabPresentationRegistry();
  const snapshot = useSyncExternalStore(
    registry.subscribe,
    registry.getSnapshot,
    registry.getSnapshot,
  );
  return (
    <button
      onClick={() =>
        registry.install({
          kind: "reference",
          manifestId: testPresentationEnvelope.bundle.manifestId,
          supplements: { records: {}, aliases: {} },
          bindings: { printingIdByInstanceId: { revealed: "selected" } },
        })
      }
    >
      {JSON.stringify(snapshot.bindings.printingIdByInstanceId)}
    </button>
  );
}
it("keeps newer viewer bindings when locale rerenders the original bootstrap", () => {
  const tree = (locale: string) => (
    <FabPresentationCatalogProvider initial={testPresentationEnvelope} locale={locale}>
      <BindingProbe />
    </FabPresentationCatalogProvider>
  );
  const view = render(tree("en-US"));
  fireEvent.click(view.getByRole("button"));
  expect(view.getByRole("button").textContent).toContain("selected");
  view.rerender(tree("fr-FR"));
  expect(view.getByRole("button").textContent).toContain("selected");
});
