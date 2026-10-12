// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { ReactNode } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { CardPreviewProvider } from "../CardPreview/CardPreviewContext";
import { UserConfigProvider } from "../../engine";
import type { SideZoneViews } from "../../engine/zoneViews";
import { BoardSharedPage } from "../../pages/BoardShared.page";
import { theme } from "../../theme";
import { SeatStatus } from "./CyberpunkBoardV2";

vi.mock("./Scene", () => ({ default: () => null }));
vi.mock("../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../animation")>("../../animation");
  return {
    ...actual,
    CyberpunkSharedAnimationLayer: ({ children }: { children: ReactNode }) => children,
    SoundPlayer: () => null,
  };
});

beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("V2 shows banked sales as their revealed faces instead of hidden miniatures", async () => {
  render(
    <MemoryRouter
      initialEntries={[
        "/cyberpunk/simulator/tests/progBootlegBlackSapphireShowRetail?ui=v2&ai=off",
      ]}
    >
      <MantineProvider theme={theme} env="test">
        <CardPreviewProvider>
          <UserConfigProvider>
            <BoardSharedPage
              scenarioId="progBootlegBlackSapphireShowRetail"
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
            />
          </UserConfigProvider>
        </CardPreviewProvider>
      </MantineProvider>
    </MemoryRouter>,
  );

  const board = await screen.findByTestId("cyberpunk-board-v2");
  const rail = within(board).getByTestId("local-sale-rail");
  expect(within(board).getByRole("img", { name: "Your normal Sell action unused" })).toBeTruthy();

  for (const count of [1, 2]) {
    const inHand = within(board)
      .getAllByRole("img", { name: "Bootleg Black Sapphire Show" })
      .map((image) => image.closest('[data-testid="card"]'))
      .find((card) => card?.closest('[data-zone="p-hand"]'));
    expect(inHand).toBeTruthy();
    fireEvent.click(inHand!);
    fireEvent.click(
      await screen.findByRole("menuitem", { name: /Play Pay its current Eddie cost/ }),
    );
    const payment = screen.queryByRole("button", { name: /^Pay automatically/ });
    if (payment) fireEvent.click(payment);
    await waitFor(() => expect(within(rail).getAllByRole("button")).toHaveLength(count));
  }

  expect(
    within(rail)
      .getByRole("button", { name: /Sold Corpo Security/ })
      .getAttribute("data-resource-state"),
  ).toBe("spent");
  expect(
    within(rail)
      .getByRole("button", { name: /Sold Field Operator/ })
      .getAttribute("data-resource-state"),
  ).toBe("ready");
  // The Sell slot only exists while the action is unused; after selling it is
  // gone. Each banked Eddie renders once, as its revealed face — no
  // face-down miniature is duplicated next to the receipt.
  expect(within(board).queryByRole("img", { name: "Your normal Sell action unused" })).toBeNull();
  expect(within(rail).queryAllByAltText("Hidden card")).toHaveLength(0);

  fireEvent.click(within(board).getByRole("button", { name: /Your resources:/ }));
  const dialog = await screen.findByRole("dialog", { name: "Your Eddies" });
  // This turn's sales stay readable in the modal until turn cleanup
  // (Comprehensive Rules 11.9.1); afterwards they hide again.
  expect(within(dialog).getByRole("img", { name: "Corpo Security" })).toBeTruthy();
  expect(within(dialog).getByRole("img", { name: "Field Operator" })).toBeTruthy();
});

test.each([false, true])("V2 shows hidden Eddie spend and refresh (rival=%s)", (rival) => {
  // Hosted projections can omit physical card identities. Use the aggregate
  // spent count without revealing identities or changing the miniature order.
  const zones: SideZoneViews = {
    hand: [],
    field: [],
    legendArea: [],
    trash: [],
    trashTop: null,
    fixerArea: [],
    gigArea: [],
    deckCount: 0,
    trashCount: 0,
    eddies: 3,
    spentEddies: 2,
    eddieCards: [],
    eddieCardCount: 5,
    soldThisTurn: true,
    streetCred: 0,
    gigCount: 0,
    activeEffects: [],
  };
  const status = (view: SideZoneViews) => (
    <MantineProvider theme={theme} env="test">
      <CardPreviewProvider>
        <SeatStatus
          rival={rival}
          side={rival ? "opponent" : "player"}
          zones={view}
          sales={[]}
          movingIds={new Set()}
          onResources={() => {}}
        />
      </CardPreviewProvider>
    </MantineProvider>
  );
  const { rerender } = render(status(zones));
  const rail = screen.getByTestId(rival ? "rival-sale-rail" : "local-sale-rail");
  expect(rail.querySelectorAll('[data-resource-state="spent"]')).toHaveLength(2);
  expect(rail.querySelectorAll('[data-resource-state="ready"]')).toHaveLength(3);
  expect(within(rail).getAllByAltText("Hidden card")).toHaveLength(5);

  rerender(status({ ...zones, eddies: 5, spentEddies: 0 }));
  expect(rail.querySelectorAll('[data-resource-state="spent"]')).toHaveLength(0);
  expect(rail.querySelectorAll('[data-resource-state="ready"]')).toHaveLength(5);
});
