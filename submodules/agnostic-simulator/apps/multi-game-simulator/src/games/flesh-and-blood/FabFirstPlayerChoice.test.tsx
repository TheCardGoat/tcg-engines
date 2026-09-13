// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { FabFirstPlayerChoice, FabPracticePreparation } from "./FabFirstPlayerChoice";
import { FabPresentationTestProvider } from "./presentation-test-provider";
import { resolvePracticeDeckSelection } from "./data/resolve-text-deck";

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
const player = { label: "You", heroName: "Dorinthea Ironsong" };
const opponent = { label: "Opponent", heroName: "Rhinar, Reckless Rampage" };

describe("FAB first-player decision", () => {
  it("lets the chooser go second and allows retry after a failed submission", async () => {
    const choose = vi
      .fn()
      .mockRejectedValueOnce(new Error("Connection lost. Try again."))
      .mockResolvedValue(undefined);
    render(
      <FabPresentationTestProvider>
        <FabFirstPlayerChoice
          player={player}
          opponent={opponent}
          canChoose
          onChoose={choose}
          deadline={Date.now() + 20_000}
        />
      </FabPresentationTestProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Go second" }));
    await screen.findByRole("alert");
    expect(choose).toHaveBeenCalledWith(false);
    fireEvent.click(screen.getByRole("button", { name: "Go second" }));
    await waitFor(() => expect(choose).toHaveBeenCalledTimes(2));
  });

  it.each([true, false])(
    "submits choice %s even when the browser clock is ahead of the server",
    async (first) => {
      const serverNow = Date.now();
      vi.spyOn(Date, "now").mockReturnValue(serverNow + 60_000);
      const choose = vi.fn().mockResolvedValue(undefined);
      render(
        <FabPresentationTestProvider>
          <FabFirstPlayerChoice
            player={player}
            opponent={opponent}
            canChoose
            deadline={serverNow + 20_000}
            onChoose={choose}
          />
        </FabPresentationTestProvider>,
      );
      expect(screen.getByRole("timer").textContent).toBe("0s");
      fireEvent.click(screen.getByRole("button", { name: first ? "Go first" : "Go second" }));
      await waitFor(() => expect(choose).toHaveBeenCalledWith(first));
    },
  );

  it("shows no choice controls to the other player", () => {
    render(
      <FabPresentationTestProvider>
        <FabFirstPlayerChoice
          player={player}
          opponent={opponent}
          canChoose={false}
          onChoose={() => {}}
          deadline={Date.now() + 20_000}
        />
      </FabPresentationTestProvider>,
    );
    expect(screen.queryByRole("button", { name: "Go first" })).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      screen.getByRole("status", { name: "Waiting for the first-player choice" }),
    ).toBeTruthy();
    expect(screen.getByText(/prepare your loadout while they choose/)).toBeTruthy();
  });

  it("opens loadout selection only after choosing and retains the choice on remount", async () => {
    sessionStorage.setItem(
      "choice-test",
      JSON.stringify({ stage: "choosing", chooserId: "player-1" }),
    );
    const resolved = resolvePracticeDeckSelection("cc-las-vegas-3rd-dorinthea", "choice-test");
    const view = () => (
      <FabPresentationTestProvider>
        <FabPracticePreparation
          storageKey="choice-test"
          pool={resolved.cardPool}
          player={player}
          opponent={opponent}
          onConfirm={() => {}}
          onLeave={() => {}}
        />
      </FabPresentationTestProvider>
    );
    const mounted = render(view());
    expect(screen.getByTestId("fab-pregame-sideboard")).toBeTruthy();
    expect(screen.getByTestId("fab-pregame-sideboard").hasAttribute("inert")).toBe(true);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Leave preparation" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Go second" }));
    await screen.findByTestId("fab-pregame-sideboard");
    expect(screen.getByLabelText("Your starting order").textContent).toBe("You go second");
    fireEvent.click(screen.getByText("Activity", { selector: "summary" }));
    const activity = screen.getByRole("log", { name: "Match activity" });
    expect(within(activity).getByText("You go second", { exact: false })).toBeTruthy();
    expect(within(activity).queryByText(/Your selection is (locked|editable)/)).toBeNull();
    mounted.unmount();
    render(view());
    expect(screen.getByLabelText("Your starting order").textContent).toBe("You go second");
  });
  it("randomizes a practice choice made at the deadline before the timer callback runs", async () => {
    vi.useFakeTimers();
    vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
      if (array instanceof Uint8Array) array.fill(1);
      return array;
    });
    sessionStorage.setItem(
      "late-test",
      JSON.stringify({ stage: "choosing", chooserId: "player-1" }),
    );
    const resolved = resolvePracticeDeckSelection("cc-las-vegas-3rd-dorinthea", "late-test");
    render(
      <FabPresentationTestProvider>
        <FabPracticePreparation
          storageKey="late-test"
          pool={resolved.cardPool}
          player={player}
          opponent={opponent}
          onConfirm={() => {}}
          onLeave={() => {}}
        />
      </FabPresentationTestProvider>,
    );
    vi.setSystemTime(Date.now() + 20_000);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Go first" }));
    });
    expect(screen.getByLabelText("Your starting order").textContent).toBe("You go second");
    expect(JSON.parse(sessionStorage.getItem("late-test")!)).toMatchObject({
      source: "timeout",
      firstPlayerId: "player-2",
    });
  });

  it("keeps the 20-second deadline across remount and randomly resolves it once", async () => {
    vi.useFakeTimers();
    vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
      if (array instanceof Uint8Array) array.fill(1);
      return array;
    });
    sessionStorage.setItem(
      "timeout-test",
      JSON.stringify({ stage: "choosing", chooserId: "player-1" }),
    );
    const resolved = resolvePracticeDeckSelection("cc-las-vegas-3rd-dorinthea", "timeout-test");
    const view = () => (
      <FabPresentationTestProvider>
        <FabPracticePreparation
          storageKey="timeout-test"
          pool={resolved.cardPool}
          player={player}
          opponent={opponent}
          onConfirm={() => {}}
          onLeave={() => {}}
        />
      </FabPresentationTestProvider>
    );
    const first = render(view());
    expect(screen.getByRole("timer", { name: "Time to choose turn order" }).textContent).toBe(
      "20s",
    );
    await act(async () => {
      vi.advanceTimersByTime(12_000);
    });
    first.unmount();
    render(view());
    expect(screen.getByRole("timer", { name: "Time to choose turn order" }).textContent).toBe("8s");
    await act(async () => {
      vi.advanceTimersByTime(8_000);
    });
    expect(screen.queryByTestId("fab-first-player-choice")).toBeNull();
    expect(screen.getByLabelText("Your starting order").textContent).toBe("You go second");
    expect(JSON.parse(sessionStorage.getItem("timeout-test")!)).toMatchObject({
      source: "timeout",
      firstPlayerId: "player-2",
    });
  });
});
