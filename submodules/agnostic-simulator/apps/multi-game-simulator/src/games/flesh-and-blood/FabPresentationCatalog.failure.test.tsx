// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { FabPresentationCatalogProvider } from "./FabPresentationCatalog";
import { useFabCardPresentation } from "./useFabCardPresentation";
import { testPresentationEnvelope } from "./presentation-test-provider";
const missing = [{ canonicalId: "missing-authored-token" }];
function Board() {
  useFabCardPresentation(missing, "state-1");
  return <button>Pass priority</button>;
}
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("keeps gameplay usable during failed pinned recovery and retries only explicitly after the automatic retry", async () => {
  const fetcher = vi.fn().mockRejectedValue(new Error("offline"));
  vi.stubGlobal("fetch", fetcher);
  const revision = "f".repeat(64);
  const initial = {
    ...testPresentationEnvelope,
    bundle: {
      ...testPresentationEnvelope.bundle,
      catalog: { revision, url: `https://cdn.tcg.online/public/fab/presentation/${revision}.json` },
    },
  };
  const view = render(
    <MantineProvider>
      <FabPresentationCatalogProvider initial={initial}>
        <Board />
      </FabPresentationCatalogProvider>
    </MantineProvider>,
  );
  expect(view.getByRole("button", { name: "Pass priority" })).toBeTruthy();
  await waitFor(() => expect(view.getByTestId("fab-presentation-warning")).toBeTruthy());
  expect(fetcher).toHaveBeenCalledTimes(2);
  fireEvent.click(view.getByRole("button", { name: "Retry images" }));
  await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(4));
  expect(view.getByRole("button", { name: "Pass priority" })).toBeTruthy();
});
