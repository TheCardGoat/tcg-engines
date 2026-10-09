// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react";
import type { AnimationPlanV2 } from "@tcg/protocol";
import type { SimulatorDeckReveal } from "@tcg/simulator-contract";
import { compileAnimationPlan } from "@tcg/simulator-runtime/animation";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { usePendingDeckRevealForSide } from "../components/GameBoard/deckReveal";
import { CyberpunkDeckRevealMotion } from "./CyberpunkDeckRevealMotion";

vi.mock("../engine", () => ({ useEngine: () => ({ humanSide: "player" }) }));
vi.mock("../components/GameBoard/deckReveal", () => ({ usePendingDeckRevealForSide: vi.fn() }));
vi.mock("../components/GameBoard/CardImage", () => ({
  CardImage: ({ imageUrl, faceDown }: { imageUrl?: string; faceDown?: boolean }) => (
    <div data-testid="reveal-card" data-image-url={imageUrl} data-face-down={String(faceDown)} />
  ),
}));

const reveal: SimulatorDeckReveal = {
  id: "public-reveal",
  zoneId: "opp-deck",
  ownerId: "p2",
  position: "top",
  visibility: "public",
  turnNumber: 1,
  count: 1,
  cards: [{ entityId: "card-1", imageUrl: "/card-art.png" }],
};
const plan: AnimationPlanV2 = {
  id: "reveal-plan",
  version: 2,
  steps: [
    {
      id: "spotlight",
      type: "emphasize",
      style: "spotlight",
      at: { kind: "zone", id: "opp-deck", ownerId: "p2" },
      reveal: {
        kind: "card",
        cardId: "card-1",
        audience: { kind: "all" },
        imageUrl: "/card-art.png",
      },
      startAtMs: 800,
      durationMs: 800,
    },
  ],
};
const compiledPlan = compileAnimationPlan(plan);

function cueStyles(): { flyInDelay: string; returnDelay: string; slotX: string }[] {
  return screen.getAllByTestId("reveal-card").map((card) => {
    const wrapper = card.parentElement as HTMLElement;
    return {
      flyInDelay: wrapper.style.getPropertyValue("--fly-in-delay"),
      returnDelay: wrapper.style.getPropertyValue("--return-delay"),
      slotX: wrapper.style.getPropertyValue("--slot-x"),
    };
  });
}

afterEach(() => {
  cleanup();
  vi.mocked(usePendingDeckRevealForSide).mockReset();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("CyberpunkDeckRevealMotion", () => {
  it("waits for an active plan and shows its two revealed cards in sequence", () => {
    const twoCards = {
      ...reveal,
      count: 2,
      cards: [
        { entityId: "card-1", imageUrl: "/first.png" },
        { entityId: "card-2", imageUrl: "/second.png" },
      ],
    } satisfies SimulatorDeckReveal;
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent" ? twoCards : undefined,
    );
    const twoCardPlan = compileAnimationPlan({
      id: "two-card-reveal",
      version: 2,
      steps: twoCards.cards.map((card, index) => ({
        id: `reveal-${index}`,
        type: "emphasize" as const,
        style: "spotlight" as const,
        at: { kind: "zone" as const, id: "opp-deck", ownerId: "p2" },
        reveal: {
          kind: "card" as const,
          cardId: card.entityId,
          audience: { kind: "all" as const },
          imageUrl: card.imageUrl,
        },
        startAtMs: index * 800,
        durationMs: 800,
      })),
    });
    const view = render(
      <CyberpunkDeckRevealMotion plan={twoCardPlan} phase="preparing" speed="normal" />,
    );
    expect(screen.queryAllByTestId("reveal-card")).toHaveLength(0);

    view.rerender(<CyberpunkDeckRevealMotion plan={twoCardPlan} phase="running" speed="normal" />);
    const [first, second] = cueStyles();
    // Later cards animate later: the second reveal starts after the first, in
    // a slot beside it, and both fly back at the same return delay.
    expect(Number.parseFloat(first!.flyInDelay)).toBeGreaterThanOrEqual(0);
    expect(Number.parseFloat(second!.flyInDelay)).toBeGreaterThan(
      Number.parseFloat(first!.flyInDelay),
    );
    expect(Number.parseFloat(first!.slotX)).toBeLessThan(Number.parseFloat(second!.slotX));
    expect(first!.returnDelay).toBe(second!.returnDelay);
  });

  it("captions the reveal with the triggering ability and whose deck it is", () => {
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent"
        ? { ...reveal, source: { title: "Sketchy Ripper", imageUrl: "/sketchy.png" } }
        : undefined,
    );
    render(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    const caption = document.querySelector("[data-owner-side='opponent']");
    expect(caption?.textContent).toContain("Sketchy Ripper");
    expect(caption?.textContent).toContain("Revealed the top 1 card of the Rival's deck");
    const art = caption?.querySelector("img");
    expect(art?.getAttribute("src")).toBe("/sketchy.png");
  });

  it("marks hidden reveals as looking, not revealing", () => {
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent"
        ? { ...reveal, visibility: "private", cards: [], source: { title: "Viktor Vektor" } }
        : undefined,
    );
    render(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    const caption = document.querySelector("[data-owner-side='opponent']");
    expect(caption?.hasAttribute("data-reveal-private")).toBe(true);
    expect(caption?.textContent).toContain("Looking at the top 1 card of the Rival's deck");
  });

  it("tells a bystander when their Rival is looking at their own deck", () => {
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent"
        ? {
            ...reveal,
            visibility: "private",
            cards: [],
            source: { title: "Viktor Vektor: Sit Down and Relax" },
            actor: "opponent",
          }
        : undefined,
    );
    render(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    const caption = document.querySelector("[data-owner-side='opponent']");
    expect(caption?.getAttribute("data-actor-side")).toBe("opponent");
    expect(caption?.textContent).toContain(
      "Your Rival is looking at the top 1 card of their own deck",
    );
    // The row of card backs carries an explicit private badge naming who is
    // choosing, so the bystander is never left guessing.
    const badge = document.querySelector("[data-private-badge]");
    expect(badge?.textContent).toContain("your Rival is choosing");
  });

  it("warns the bystander when their Rival is looking at THEIR deck", () => {
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "player"
        ? {
            ...reveal,
            zoneId: "p-deck",
            ownerId: "p1",
            visibility: "private",
            cards: [],
            actor: "opponent",
          }
        : undefined,
    );
    render(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    const caption = document.querySelector("[data-owner-side='player']");
    expect(caption?.getAttribute("data-actor-side")).toBe("opponent");
    expect(caption?.textContent).toContain("Your Rival is looking at the top 1 card of YOUR deck");
  });

  it("names the viewer as the actor on their own reveal", () => {
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent"
        ? { ...reveal, source: { title: "Sketchy Ripper" }, actor: "player" }
        : undefined,
    );
    render(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    const caption = document.querySelector("[data-owner-side='opponent']");
    expect(caption?.getAttribute("data-actor-side")).toBe("player");
    expect(caption?.textContent).toContain("You reveal the top 1 card of the Rival's deck");
    // A public reveal shows faces, so there is no private badge.
    expect(document.querySelector("[data-private-badge]")).toBeNull();
  });

  it("keeps the reveal for its return leg after the plan finishes, without replaying it", () => {
    vi.useFakeTimers();
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent" ? reveal : undefined,
    );
    const view = render(
      <CyberpunkDeckRevealMotion plan={compiledPlan} phase="preparing" speed="normal" />,
    );
    expect(screen.queryByTestId("reveal-card")).toBeNull();
    view.rerender(<CyberpunkDeckRevealMotion plan={compiledPlan} phase="running" speed="normal" />);
    expect(screen.getByTestId("reveal-card")).toBeTruthy();
    // The plan ending does not cut the reveal short: the cards must be seen
    // flying back to the deck before the cue clears.
    view.rerender(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    expect(screen.getByTestId("reveal-card")).toBeTruthy();
    act(() => vi.advanceTimersByTime(2_500));
    expect(screen.queryByTestId("reveal-card")).toBeNull();
    // The finished cue never replays from the still-pending projection.
    act(() => vi.advanceTimersByTime(2_000));
    expect(screen.queryByTestId("reveal-card")).toBeNull();
  });

  it("scales plan-less reveal timing with the playback speed", () => {
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent"
        ? { ...reveal, count: 2, cards: [reveal.cards[0]!, reveal.cards[0]!] }
        : undefined,
    );
    const normalView = render(
      <CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />,
    );
    const normalDelays = cueStyles().map((style) => Number.parseFloat(style.flyInDelay));
    normalView.unmount();

    render(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="fast" />);
    const fastDelays = cueStyles().map((style) => Number.parseFloat(style.flyInDelay));
    // Fast playback never delays a card more than normal playback would;
    // the first card starts immediately at both speeds.
    expect(fastDelays).toHaveLength(normalDelays.length);
    expect(fastDelays[0]).toBe(normalDelays[0]);
    for (let index = 1; index < normalDelays.length; index += 1) {
      expect(fastDelays[index]).toBeLessThan(normalDelays[index]!);
    }
  });

  it("spaces projected reveals when no animation plan is active", () => {
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent"
        ? {
            ...reveal,
            count: 2,
            cards: [
              { entityId: "card-1", imageUrl: "/first.png" },
              { entityId: "card-2", imageUrl: "/second.png" },
            ],
          }
        : undefined,
    );
    render(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    const delays = cueStyles().map((style) => Number.parseFloat(style.flyInDelay));
    // Projected reveals are spaced out: each card animates after the previous one.
    expect(delays[0]).toBeGreaterThanOrEqual(0);
    expect(delays[1]).toBeGreaterThan(delays[0]!);
  });

  it("keeps public card art when the plan arrives after the projection", () => {
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent" ? reveal : undefined,
    );
    const view = render(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    expect(screen.getByTestId("reveal-card").getAttribute("data-image-url")).toBe("/card-art.png");

    view.rerender(<CyberpunkDeckRevealMotion plan={compiledPlan} phase="running" speed="normal" />);
    expect(screen.getByTestId("reveal-card").getAttribute("data-image-url")).toBe("/card-art.png");
    expect(screen.getByTestId("reveal-card").getAttribute("data-face-down")).toBe("false");
  });

  it("does not replay card backs when a queued plan starts after public art ends", () => {
    vi.useFakeTimers();
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent" ? reveal : undefined,
    );
    const view = render(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    expect(screen.getByTestId("reveal-card").getAttribute("data-image-url")).toBe("/card-art.png");

    act(() => vi.advanceTimersByTime(1_700));
    expect(screen.queryByTestId("reveal-card")).toBeNull();
    view.rerender(<CyberpunkDeckRevealMotion plan={compiledPlan} phase="running" speed="normal" />);
    expect(screen.queryByTestId("reveal-card")).toBeNull();
  });

  it("plays a later reveal with a different card after an earlier cue ends", () => {
    vi.useFakeTimers();
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent" ? reveal : undefined,
    );
    const view = render(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    act(() => vi.advanceTimersByTime(1_700));
    const laterPlan = compileAnimationPlan({
      id: "later-reveal",
      version: 2,
      steps: [
        {
          id: "later-card",
          type: "emphasize",
          style: "spotlight",
          at: { kind: "zone", id: "opp-deck", ownerId: "p2" },
          reveal: {
            kind: "card",
            cardId: "card-2",
            audience: { kind: "all" },
            imageUrl: "/later-art.png",
          },
          durationMs: 800,
        },
      ],
    });
    view.rerender(<CyberpunkDeckRevealMotion plan={laterPlan} phase="running" speed="normal" />);
    expect(screen.getByTestId("reveal-card").getAttribute("data-image-url")).toBe("/later-art.png");
  });

  it("keeps the plan's card when an older projection arrives later", () => {
    vi.mocked(usePendingDeckRevealForSide).mockReturnValue(undefined);
    const view = render(
      <CyberpunkDeckRevealMotion plan={compiledPlan} phase="running" speed="normal" />,
    );
    expect(screen.getByTestId("reveal-card").getAttribute("data-face-down")).toBe("false");
    const cardMotion = screen.getByTestId("reveal-card").parentElement;
    const planDelay = cardMotion?.style.getPropertyValue("--fly-in-delay") ?? "";
    // The plan-driven cue is scheduled: it carries a non-empty, positive delay.
    expect(Number.parseFloat(planDelay)).toBeGreaterThan(0);

    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent"
        ? {
            ...reveal,
            id: "old-search",
            cards: [{ entityId: "old-card", imageUrl: "/old-art.png" }],
          }
        : undefined,
    );
    view.rerender(<CyberpunkDeckRevealMotion plan={compiledPlan} phase="running" speed="normal" />);
    expect(screen.getByTestId("reveal-card").getAttribute("data-image-url")).toBe("/card-art.png");
    expect(screen.getByTestId("reveal-card").parentElement).toBe(cardMotion);
    // The older projection does not reset the scheduled cue.
    expect(cardMotion?.style.getPropertyValue("--fly-in-delay")).toBe(planDelay);
  });

  it("waits for playback and clears the cue when animations are off", () => {
    vi.mocked(usePendingDeckRevealForSide).mockReturnValue(undefined);
    const view = render(
      <CyberpunkDeckRevealMotion plan={compiledPlan} phase="preparing" speed="normal" />,
    );
    expect(screen.queryByTestId("reveal-card")).toBeNull();

    view.rerender(<CyberpunkDeckRevealMotion plan={compiledPlan} phase="running" speed="normal" />);
    expect(screen.getByTestId("reveal-card").getAttribute("data-face-down")).toBe("false");

    view.rerender(<CyberpunkDeckRevealMotion plan={compiledPlan} phase="running" speed="off" />);
    expect(screen.queryByTestId("reveal-card")).toBeNull();
  });

  it("does not replay a reveal received while animations were off", () => {
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "opponent" ? reveal : undefined,
    );
    const view = render(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="off" />);
    expect(screen.queryByTestId("reveal-card")).toBeNull();

    view.rerender(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    expect(screen.queryByTestId("reveal-card")).toBeNull();
  });

  it("keeps a scheduled reveal alive when its transition goes away before the tail", () => {
    vi.useFakeTimers();
    vi.mocked(usePendingDeckRevealForSide).mockReturnValue(undefined);
    const view = render(
      <CyberpunkDeckRevealMotion plan={compiledPlan} phase="running" speed="normal" />,
    );
    // The cue is scheduled behind a positive delay before the transition ends.
    expect(
      Number.parseFloat(
        screen.getByTestId("reveal-card").parentElement?.style.getPropertyValue("--fly-in-delay") ??
          "",
      ),
    ).toBeGreaterThan(0);

    view.rerender(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    // The cue still runs to its own end so the return-to-deck leg stays visible.
    expect(screen.getByTestId("reveal-card")).toBeTruthy();
    act(() => vi.advanceTimersByTime(2_500));
    expect(screen.queryByTestId("reveal-card")).toBeNull();
  });

  it("renders both deck cues from one plan", () => {
    vi.useFakeTimers();
    vi.mocked(usePendingDeckRevealForSide).mockReturnValue(undefined);
    const twoDeckPlan = compileAnimationPlan({
      id: "both-decks",
      version: 2,
      steps: [
        {
          id: "p",
          type: "emphasize",
          style: "spotlight",
          at: { kind: "zone", id: "p-deck", ownerId: "p1" },
          reveal: { kind: "hidden" },
          startAtMs: 0,
          durationMs: 800,
        },
        {
          id: "opp",
          type: "emphasize",
          style: "spotlight",
          at: { kind: "zone", id: "opp-deck", ownerId: "p2" },
          reveal: { kind: "hidden" },
          startAtMs: 800,
          durationMs: 800,
        },
      ],
    });
    render(<CyberpunkDeckRevealMotion plan={twoDeckPlan} phase="running" speed="normal" />);
    expect(document.querySelectorAll('[data-deck-reveal-side="player"]')).toHaveLength(1);
    expect(document.querySelectorAll('[data-deck-reveal-side="opponent"]')).toHaveLength(1);
    const opponentCue = document.querySelector<HTMLElement>('[data-deck-reveal-side="opponent"]');
    // The opponent cue is shifted aside by a non-empty pixel offset.
    const opponentOffset = opponentCue?.style.getPropertyValue("--slot-x") ?? "";
    expect(Number.parseFloat(opponentOffset)).toBeGreaterThan(0);

    act(() => vi.advanceTimersByTime(1_700));
    expect(document.querySelector('[data-deck-reveal-side="player"]')).toBeNull();
    expect(opponentCue?.isConnected).toBe(true);
    expect(opponentCue?.style.getPropertyValue("--slot-x")).toBe(opponentOffset);

    act(() => vi.advanceTimersByTime(800));
    expect(opponentCue?.isConnected).toBe(false);
  });

  it("keeps a centered cue still when the other deck starts later", () => {
    vi.useFakeTimers();
    vi.stubGlobal("innerWidth", 390);
    const playerReveal: SimulatorDeckReveal = {
      ...reveal,
      id: "player-reveal",
      zoneId: "p-deck",
      ownerId: "p1",
    };
    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "player" ? playerReveal : undefined,
    );
    const view = render(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    const playerCue = document.querySelector<HTMLElement>('[data-deck-reveal-side="player"]');
    expect(playerCue?.style.getPropertyValue("--slot-x")).toBe("0px");
    act(() => vi.advanceTimersByTime(300));

    vi.mocked(usePendingDeckRevealForSide).mockImplementation((side) =>
      side === "player" ? playerReveal : reveal,
    );
    view.rerender(<CyberpunkDeckRevealMotion plan={null} phase={null} speed="normal" />);
    const opponentCue = document.querySelector<HTMLElement>('[data-deck-reveal-side="opponent"]');
    expect(playerCue?.isConnected).toBe(true);
    expect(playerCue?.style.getPropertyValue("--slot-x")).toBe("0px");
    const opponentOffset = Number.parseFloat(opponentCue?.style.getPropertyValue("--slot-x") ?? "");
    expect(opponentOffset).toBeGreaterThan(93);
    expect(opponentOffset).toBeLessThan(148);

    act(() => vi.advanceTimersByTime(600));
    expect(opponentCue?.isConnected).toBe(true);
    expect(opponentCue?.style.getPropertyValue("--slot-x")).toBe(`${opponentOffset}px`);
  });

  it("uses each card's compiled start time and returns every card together", () => {
    vi.useFakeTimers();
    vi.mocked(usePendingDeckRevealForSide).mockReturnValue(undefined);
    const variedPlan = compileAnimationPlan({
      id: "varied-reveals",
      version: 2,
      steps: [
        {
          id: "first",
          type: "emphasize",
          style: "spotlight",
          at: { kind: "zone", id: "opp-deck", ownerId: "p2" },
          reveal: { kind: "hidden" },
          startAtMs: 0,
          durationMs: 800,
        },
        {
          id: "second",
          type: "emphasize",
          style: "spotlight",
          at: { kind: "zone", id: "opp-deck", ownerId: "p2" },
          reveal: { kind: "hidden" },
          startAtMs: 900,
          durationMs: 400,
        },
        {
          id: "third",
          type: "emphasize",
          style: "spotlight",
          at: { kind: "zone", id: "opp-deck", ownerId: "p2" },
          reveal: { kind: "hidden" },
          startAtMs: 1_300,
          durationMs: 800,
        },
      ],
    });
    render(<CyberpunkDeckRevealMotion plan={variedPlan} phase="running" speed="normal" />);
    const styles = cueStyles();
    const delays = styles.map((style) => Number.parseFloat(style.flyInDelay));
    // Each card flies out at its own compiled start time.
    expect(delays).toHaveLength(3);
    expect(delays[0]).toBeGreaterThanOrEqual(0);
    expect(delays[1]).toBeGreaterThan(delays[0]!);
    expect(delays[2]).toBeGreaterThan(delays[1]!);
    // The return leg is synchronized: one shared return delay for the cue.
    expect(new Set(styles.map((style) => style.returnDelay)).size).toBe(1);
    expect(Number.parseFloat(styles[0]!.returnDelay)).toBeGreaterThan(delays[2]!);

    act(() => vi.advanceTimersByTime(2_000));
    expect(document.querySelectorAll('[data-deck-reveal-side="opponent"]')).toHaveLength(3);
    act(() => vi.advanceTimersByTime(1_000));
    expect(document.querySelector('[data-deck-reveal-side="opponent"]')).toBeNull();
  });
});
