import { parseProjectedState } from "../../pages/LiveMatch.page";
import { PresentationSettingsProvider } from "@tcg/simulator-presentation/settings";
import { SimulatorSettingsProvider } from "../../../../simulator/settings/SimulatorSettingsProvider";
import { DEFAULT_SIMULATOR_SETTINGS } from "../../../../simulator/settings/simulator-settings";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { playSimulatorSound } from "@tcg/simulator-presentation/audio/sound-service";
import { MantineProvider } from "@mantine/core";
import { InteractionWorkspace, useInteractionBoard, type DragMotion } from "@tcg/simulator-ui";
import { afterEach, beforeAll, expect, test, vi } from "vite-plus/test";
import { createAlphaClashVisualFixture } from "../../visual-fixtures";
import AlphaClashArena3D from "./AlphaClashArena3D";
import type { InteractionSubmission } from "@tcg/protocol";
import type { ArenaOpening } from "./useArenaOpening";
import { useCombatSelection } from "../useCombatSelection";
import {
  fixtureSubmit,
  fixtureBeginDestination,
  fixtureAttack,
  fixturePassResponses,
} from "../../native-fixture-test-actions";
import type { AcSeat, LiveBoardCard } from "../board-types";
import type { PlacedCard } from "./layout";
import { useEffect, type ComponentProps } from "react";
import type { CardAnchor, ZoneAnchor } from "./Scene";
import type { ArenaZone } from "./zones";
const media = vi.hoisted(() => ({ portrait: false, compact: false }));
vi.mock("@mantine/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@mantine/hooks")>();
  return {
    ...actual,
    useMediaQuery: (query: string) =>
      query.includes("orientation: portrait")
        ? media.portrait
        : query.includes("max-height: 550px") && media.compact,
  };
});
let inspected: LiveBoardCard | null;
let hovered: string | null;
let placements: PlacedCard[];
let sceneSelectable: ReadonlySet<string> | null | undefined;
let sceneSelected: ReadonlySet<string>;
let dragMotion: DragMotion<string>;
vi.mock("./Scene", () => ({
  ArenaScene: (props: {
    dragMotion: DragMotion<string>;
    inspectedCard: LiveBoardCard | null;
    hovered: string | null;
    cards: PlacedCard[];
    selectable?: ReadonlySet<string> | null;
    selected: ReadonlySet<string>;
    onAnchors: (anchors: CardAnchor[]) => void;
    zones: ArenaZone[];
    onZoneAnchors: (anchors: ZoneAnchor[]) => void;
  }) => {
    useEffect(() => {
      props.onAnchors(
        props.cards.map((placed, index) => ({
          id: placed.card.instanceId,
          left: index * 80,
          top: 100,
          width: 70,
          height: 100,
        })),
      );
    }, [props.cards, props.onAnchors]);
    useEffect(() => {
      props.onZoneAnchors(
        props.zones.map((zone, index) => ({
          id: zone.id,
          left: index * 80,
          top: 300,
          width: 70,
          height: 100,
          captionLeft: index * 80,
          captionTop: 300,
        })),
      );
    }, [props.zones, props.onZoneAnchors]);
    dragMotion = props.dragMotion;
    inspected = props.inspectedCard;
    hovered = props.hovered;
    placements = props.cards;
    sceneSelectable = props.selectable;
    sceneSelected = props.selected;
    return <div>Scene boundary</div>;
  },
}));
vi.mock("@tcg/simulator-presentation/audio/sound-service", () => ({
  playSimulatorSound: vi.fn(),
  initSimulatorSoundService: vi.fn().mockResolvedValue(undefined),
  preloadSimulatorSoundAsset: vi.fn(),
}));
beforeAll(() => {
  window.matchMedia = vi
    .fn()
    .mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {} });
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterEach(() => {
  cleanup();
  window.localStorage.removeItem("alpha-clash.auto-pay");
  media.portrait = false;
  media.compact = false;
  vi.clearAllMocks();
});
function BoundArena(props: ComponentProps<typeof AlphaClashArena3D>) {
  useCombatSelection(props.view, props.disabled);
  const interaction = useInteractionBoard(props.view);
  return (
    <AlphaClashArena3D
      {...props}
      selectableInstanceIds={interaction.candidateIds}
      selectedInstanceIds={interaction.selectedIds}
      onCardClick={interaction.selectEntity}
    />
  );
}
function setup(
  soundVolume = 75,
  fixture = "inspection-arrangement",
  options: {
    prepare?: (engine: ReturnType<typeof createAlphaClashVisualFixture>) => void;
    openingScene?: ArenaOpening;
    viewerSeat?: AcSeat;
    liveSelection?: boolean;
    applySubmitted?: boolean;
  } = {},
) {
  const engine = createAlphaClashVisualFixture(fixture);
  options.prepare?.(engine);
  const viewerSeat = options.viewerSeat ?? "player-one";
  const viewerId = engine.seatToPlayerId[viewerSeat];
  const projection = engine.getViewerState({ role: "player", actorId: viewerId });
  const board = parseProjectedState(projection);
  if (!board) throw new Error("Invalid fixture projection");
  const view = engine.getInteractionView(viewerId);
  let rendered: ReturnType<typeof render>;
  const submit = vi.fn((submission: InteractionSubmission) => {
    if (!options.applySubmitted) return false;
    const result = engine.submitInteraction(viewerId, submission, {
      gameId: engine.state.id,
      sourceAuthority: "server",
    });
    expect(result.success).toBe(true);
    rendered.rerender(element());
    return result.success;
  });
  const Arena = options.liveSelection ? BoundArena : AlphaClashArena3D;
  const element = () => {
    const liveBoard = options.applySubmitted
      ? parseProjectedState(engine.getViewerState({ role: "player", actorId: viewerId }))!
      : board;
    const liveView = options.applySubmitted ? engine.getInteractionView(viewerId) : view;
    return (
      <SimulatorSettingsProvider initialSettings={{ ...DEFAULT_SIMULATOR_SETTINGS, soundVolume }}>
        <MantineProvider env="test">
          <InteractionWorkspace
            view={liveView}
            viewerId={viewerId}
            onSubmit={submit}
            disabled={!!options.openingScene}
          >
            <PresentationSettingsProvider>
              <Arena
                board={liveBoard}
                openingScene={options.openingScene}
                viewerSeat={viewerSeat}
                participantNames={{}}
                view={liveView}
                selectableInstanceIds={null}
                selectedInstanceIds={new Set()}
              />
            </PresentationSettingsProvider>
          </InteractionWorkspace>
        </MantineProvider>
      </SimulatorSettingsProvider>
    );
  };
  rendered = render(element());
  return { engine, board, submit, rerender: () => rendered.rerender(element()) };
}
test.each([0, 3])("Bombardment resolves amount %i with one button click", async (amount) => {
  const { engine, board, submit, rerender } = setup(0, "prompt-bombardment", {
    liveSelection: true,
    applySubmitted: true,
  });
  expect(engine.state.pendingChoices).toHaveLength(0);
  const source = board.cards.find(
    (card) => card.controller === "player-one" && card.zone === "hand",
  )!;
  const target = board.cards.find(
    (card) => card.controller === "player-two" && card.zone === "clash",
  )!;
  const deckSize = () =>
    Object.values(engine.state.cards).filter(
      (card) => card.controller === "player-one" && card.zone === "deck",
    ).length;
  const before = deckSize();
  fireEvent.click(await screen.findByTestId(`ac-card:${source.instanceId}`));
  fireEvent.click(await screen.findByTestId(`ac-card:${target.instanceId}`));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  act(() => {
    fixturePassResponses(engine);
    rerender();
  });
  const choice = await screen.findByRole("button", { name: `Choose amount ${amount}` });
  expect(screen.queryByRole("spinbutton")).toBeNull();
  expect(screen.queryByRole("button", { name: "Confirm amount" })).toBeNull();
  fireEvent.click(choice);
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(2));
  expect(submit.mock.calls[1][0].values).toEqual({ count: amount });
  expect(deckSize()).toBe(before - amount);
  expect(engine.state.cards[target.instanceId].zone).toBe(amount === 0 ? "clash" : "oblivion");
  expect(engine.state.pendingChoices).toHaveLength(0);
});

test.each(["right-click", "Shift+Enter"])(
  "%s can inspect then attack a legal target directly",
  async (gesture) => {
    const { engine, board, submit } = setup(0, "arena-drop-targets", {
      liveSelection: true,
      applySubmitted: true,
    });
    const attacker = board.cards.find(
      (card) => card.controller === "player-one" && card.zone === "clash",
    )!;
    const target = board.cards.find(
      (card) => card.controller === "player-two" && card.zone === "contender",
    )!;
    fireEvent.click(await screen.findByTestId(`ac-card:${attacker.instanceId}`));
    const inspectTarget = screen.getByTestId(`ac-card:${target.instanceId}`);
    if (gesture === "right-click") fireEvent.contextMenu(inspectTarget);
    else fireEvent.keyDown(inspectTarget, { key: "Enter", shiftKey: true });
    expect(submit).not.toHaveBeenCalled();
    expect(engine.state.clash).toBeNull();
    fireEvent.click(await screen.findByRole("button", { name: "Attack this target" }));
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(engine.state.clash).toMatchObject({
      attackerId: attacker.instanceId,
      targetId: target.instanceId,
    });
    expect(screen.queryByRole("button", { name: "Close card inspection" })).toBeNull();
  },
);

test("Clarity opens its legal Oblivion choices and one pick submits the native return", async () => {
  const { engine, board, submit, rerender } = setup(0, "prompt-oblivion-return", {
    liveSelection: true,
    applySubmitted: true,
  });
  const contender = board.cards.find(
    (card) => card.controller === "player-one" && card.zone === "contender",
  )!;
  const target = board.cards.find(
    (card) => card.controller === "player-two" && card.zone === "contender",
  )!;
  const chosen = board.cards.find(
    (card) => card.zone === "oblivion" && card.name === "Magnate, Cunning Planner",
  )!;
  expect(engine.state.pendingChoices).toHaveLength(0);
  fireEvent.click(await screen.findByTestId(`ac-card:${contender.instanceId}`));
  fireEvent.click(screen.getByTestId(`ac-card:${target.instanceId}`));
  act(() => {
    fixturePassResponses(engine);
    rerender();
  });
  fireEvent.click(await screen.findByRole("button", { name: "Place Sonoro in Top" }));
  fireEvent.click(screen.getByRole("button", { name: "Place Denver in Bottom" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm order" }));
  fireEvent.click(await screen.findByRole("button", { name: "Put it into your hand" }));
  act(() => {
    fixturePassResponses(engine);
    rerender();
  });
  expect(await screen.findByRole("heading", { name: "Choose a card" })).toBeTruthy();
  expect(screen.getByText("Select a card to move to Top of deck.")).toBeTruthy();
  // Bombardment is in the pile, but the native effect permits only Clash cards.
  expect(screen.queryByRole("button", { name: "Select Bombardment" })).toBeNull();
  const before = submit.mock.calls.length;
  fireEvent.click(screen.getByRole("button", { name: "Select Magnate, Cunning Planner" }));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(before + 1));
  expect(engine.state.cards[chosen.instanceId].zone).toBe("deck");
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(screen.queryByRole("heading", { name: "Choose a card" })).toBeNull();
});
test("keyboard inspection can arrange a real hand, cancel and retry without a game command", async () => {
  const { board, submit } = setup();
  const firstHand = board.cards.find(
    (card) => card.zone === "hand" && card.controller === "player-one",
  )!;
  fireEvent.contextMenu(await screen.findByTestId(`ac-card:${firstHand.instanceId}`));
  await waitFor(() => expect(inspected?.instanceId).toBe(firstHand.instanceId));
  expect(screen.getByRole("button", { name: "Move left" }).hasAttribute("disabled")).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Move right" }));
  expect(screen.getByText(/Position 2 of 12/)).toBeTruthy();
  expect(
    placements.filter((card) => card.hand && card.card.controller === "player-one")[1].card
      .instanceId,
  ).toBe(firstHand.instanceId);
  fireEvent.keyDown(window, { key: "Escape" });
  await waitFor(() => expect(inspected).toBeNull());
  expect(submit).not.toHaveBeenCalled();
  expect(playSimulatorSound).toHaveBeenCalledWith("card.move", expect.any(Function));
  fireEvent.click(screen.getByRole("button", { name: "Cards & piles" }));
  expect(await screen.findByRole("button", { name: "Close cards and targets" })).toBeTruthy();
});

test("sound can be muted and reduced motion remains available outside opening", async () => {
  const { board } = setup();
  fireEvent.click(screen.getByRole("button", { name: "Settings" }));
  fireEvent.click(await screen.findByRole("checkbox", { name: "Sound" }));
  fireEvent.click(await screen.findByRole("checkbox", { name: "Reduced motion" }));
  fireEvent.click(await screen.findByRole("button", { name: "Close settings" }));
  const handCard = board.cards.find(
    (card) => card.zone === "hand" && card.controller === "player-one",
  )!;
  fireEvent.contextMenu(await screen.findByTestId(`ac-card:${handCard.instanceId}`));
  await screen.findByRole("button", { name: "Move right" });
  fireEvent.click(screen.getByRole("button", { name: "Move right" }));
  expect(playSimulatorSound).not.toHaveBeenCalled();
});

test("portrait rotation hides inspection actions and restores them in landscape", async () => {
  const { board, rerender, submit } = setup();
  const handCard = board.cards.find(
    (card) => card.zone === "hand" && card.controller === "player-one",
  )!;
  fireEvent.contextMenu(await screen.findByTestId(`ac-card:${handCard.instanceId}`));
  await screen.findByRole("button", { name: "Move right" });
  media.portrait = true;
  rerender();
  expect(await screen.findByRole("heading", { name: "Turn to landscape" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Move right" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Play Sonoro (1)" })).toBeNull();
  media.portrait = false;
  media.compact = false;
  rerender();
  expect(screen.getByRole("button", { name: "Move right" })).toBeTruthy();
  expect(submit).not.toHaveBeenCalled();
});

test("right-click or Shift+Enter inspects without submitting a play", async () => {
  const { board, submit } = setup();
  const firstHand = board.cards.find(
    (card) => card.zone === "hand" && card.controller === "player-one",
  )!;
  const card = await screen.findByTestId(`ac-card:${firstHand.instanceId}`);
  fireEvent.contextMenu(card);
  await waitFor(() => expect(inspected?.instanceId).toBe(firstHand.instanceId));
  fireEvent.keyDown(window, { key: "Escape" });
  await waitFor(() => expect(inspected).toBeNull());
  fireEvent.keyDown(screen.getByTestId(`ac-card:${firstHand.instanceId}`), {
    key: "Enter",
    shiftKey: true,
  });
  await waitFor(() => expect(inspected?.instanceId).toBe(firstHand.instanceId));
  expect(submit).not.toHaveBeenCalled();
});

test("a public pile click opens ordered inspection directly without a library or command", async () => {
  const { board, submit } = setup();
  const pile = board.cards.filter(
    (card) => card.zone === "oblivion" && card.controller === "player-one",
  );
  fireEvent.click(await screen.findByRole("button", { name: "Your oblivion · 7 cards" }));
  await waitFor(() => expect(inspected?.instanceId).toBe(pile[0].instanceId));
  expect(screen.queryByRole("textbox", { name: "Find a card" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Next card" }));
  expect(inspected?.instanceId).toBe(pile[1].instanceId);
  expect(submit).not.toHaveBeenCalled();
});

test("a legal hand card gives mouse and keyboard feedback without starting a command", async () => {
  const { board, submit } = setup(75, "arena");
  const firstHand = board.cards.find(
    (card) => card.zone === "hand" && card.controller === "player-one",
  )!;
  const card = await screen.findByTestId(`ac-card:${firstHand.instanceId}`);
  expect(card.getAttribute("aria-roledescription")).toBe("draggable");
  fireEvent.mouseEnter(card);
  await waitFor(() => expect(hovered).toBe(firstHand.instanceId));
  fireEvent.mouseLeave(card);
  await waitFor(() => expect(hovered).toBeNull());
  fireEvent.focus(card);
  await waitFor(() => expect(hovered).toBe(firstHand.instanceId));
  fireEvent.blur(card);
  await waitFor(() => expect(hovered).toBeNull());
  expect(submit).not.toHaveBeenCalled();
});

test.each(["click", "Enter"])(
  "a playable hand card starts a legal play with one %s",
  async (gesture) => {
    const { engine, board, submit } = setup(75, "arena-drop-targets", { applySubmitted: true });
    const sonoro = board.cards.find((card) => card.zone === "hand" && card.name === "Sonoro")!;
    const card = await screen.findByTestId(`ac-card:${sonoro.instanceId}`);
    expect(card.getAttribute("aria-label")).toMatch(/^Play Sonoro/);
    if (gesture === "click") fireEvent.click(card);
    else fireEvent.keyDown(card, { key: "Enter" });
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(engine.state.cards[sonoro.instanceId].zone).not.toBe("hand");
    expect(screen.queryByRole("button", { name: "Close card inspection" })).toBeNull();
    expect(screen.queryByTestId("ac-payment-stage")).toBeNull();
  },
);

test.each([
  { gesture: "click", compact: false },
  { gesture: "Enter", compact: false },
  { gesture: "click", compact: true },
])("one $gesture deploys a legal resource (compact: $compact)", async ({ gesture, compact }) => {
  media.compact = compact;
  const { engine, board, submit } = setup(75, "resource-step", {
    applySubmitted: true,
    liveSelection: true,
  });
  const sonoro = board.cards.find((card) => card.zone === "hand" && card.name === "Sonoro")!;
  const card = await screen.findByTestId(`ac-card:${sonoro.instanceId}`);
  expect(card.getAttribute("aria-label")).toMatch(/^Deploy as resource Sonoro/);
  if (gesture === "click") fireEvent.click(card);
  else fireEvent.keyDown(card, { key: "Enter" });
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit.mock.calls[0][0]).toMatchObject({
    actionId: "deployResource",
    values: { cardId: [sonoro.instanceId] },
  });
  expect(engine.state.cards[sonoro.instanceId]).toMatchObject({ zone: "resource", ready: true });
  expect(engine.state.phase.name).toBe("primary");
  expect(screen.queryByRole("button", { name: "Close card inspection" })).toBeNull();
});

test.each(["right-click", "Shift+Enter"])(
  "%s inspects a deployable resource without a command",
  async (gesture) => {
    const { board, submit } = setup(75, "resource-step");
    const sonoro = board.cards.find((card) => card.zone === "hand" && card.name === "Sonoro")!;
    const card = await screen.findByTestId(`ac-card:${sonoro.instanceId}`);
    if (gesture === "right-click") fireEvent.contextMenu(card);
    else fireEvent.keyDown(card, { key: "Enter", shiftKey: true });
    expect(await screen.findByRole("button", { name: "Deploy as resource" })).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
  },
);

test.each(["Cadavros", "Ultimate Power Armor"])(
  "clicking ineligible resource %s opens inspection",
  async (name) => {
    const { engine, board, submit } = setup(75, "resource-step");
    const card = board.cards.find(
      (entry) => entry.zone === "hand" && entry.controller === "player-one" && entry.name === name,
    )!;
    expect(
      engine
        .getInteractionView(engine.seatToPlayerId["player-one"])
        .actions.some(
          (action) =>
            action.enabled &&
            action.intent === "play-card" &&
            action.source?.instanceId === card.instanceId,
        ),
    ).toBe(false);
    fireEvent.click(await screen.findByTestId(`ac-card:${card.instanceId}`));
    expect(await screen.findByRole("button", { name: "Close card inspection" })).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
  },
);

test.each([
  { gesture: "click", compact: false, fixture: "arena-drop-targets" },
  { gesture: "Enter", compact: false, fixture: "arena-drop-targets" },
  { gesture: "click", compact: true, fixture: "arena-drop-targets" },
  { gesture: "click", compact: false, fixture: "combat-target-legality" },
])(
  "direct attack uses attacker then target ($gesture, compact: $compact, $fixture)",
  async ({ gesture, compact, fixture }) => {
    media.compact = compact;
    const { engine, board, submit } = setup(0, fixture, {
      applySubmitted: true,
      liveSelection: true,
    });
    const action = engine
      .getInteractionView("human")
      .actions.find((action) => action.id === "initiateClash")!;
    const attackers = action.inputs.find((input) => input.id === "attackerId");
    if (attackers?.kind !== "entity-selection") throw new Error("Missing native attackers");
    const attackerId = attackers.candidates.find((candidate) => candidate.enabled)!.entity
      .instanceId;
    const targets = action.inputs.find(
      (input) => input.id === `targetId:${attackerId}` || input.id === "targetId",
    );
    if (targets?.kind !== "entity-selection") throw new Error("Missing native attack targets");
    const targetId = targets.candidates.find((candidate) => candidate.enabled)!.entity.instanceId;
    const attacker = await screen.findByTestId(`ac-card:${attackerId}`);
    expect(attacker.getAttribute("aria-label")).toMatch(/^Attack with /);
    if (gesture === "Enter") fireEvent.keyDown(attacker, { key: "Enter" });
    else fireEvent.click(attacker);
    expect(await screen.findByRole("button", { name: "Cancel attack" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Close card inspection" })).toBeNull();
    expect(submit).not.toHaveBeenCalled();
    expect(engine.state.clash).toBeNull();
    expect(engine.state.cards[attackerId].ready).toBe(true);
    for (const card of board.cards.filter(
      (card) => card.controller === "player-two" && ["clash", "contender"].includes(card.zone),
    )) {
      const legal = targets.candidates.some(
        (candidate) => candidate.enabled && candidate.entity.instanceId === card.instanceId,
      );
      expect(screen.getByTestId(`ac-card:${card.instanceId}`).hasAttribute("data-selectable")).toBe(
        legal,
      );
    }
    const target = screen.getByTestId(`ac-card:${targetId}`);
    expect(target.getAttribute("aria-label")).toMatch(/^Attack target /);
    if (gesture === "Enter") fireEvent.keyDown(target, { key: "Enter" });
    else fireEvent.click(target);
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(submit.mock.calls[0][0]).toMatchObject({
      actionId: "initiateClash",
      values: { attackerId: [attackerId], [targets.id]: [targetId] },
    });
    expect(engine.state.clash).toMatchObject({ attackerId, targetId });
    expect(engine.state.cards[attackerId].ready).toBe(false);
  },
);

test.each(["right-click", "Shift+Enter"])(
  "%s inspects an attacker and target without declaring an attack",
  async (gesture) => {
    const { engine, board, submit } = setup(0, "arena-drop-targets", {
      liveSelection: true,
      applySubmitted: true,
    });
    const attacker = board.cards.find(
      (card) => card.controller === "player-one" && card.zone === "clash",
    )!;
    const target = board.cards.find(
      (card) => card.controller === "player-two" && card.zone === "contender",
    )!;
    const inspectCard = (id: string) => {
      const card = screen.getByTestId(`ac-card:${id}`);
      if (gesture === "right-click") fireEvent.contextMenu(card);
      else fireEvent.keyDown(card, { key: "Enter", shiftKey: true });
    };
    await screen.findByTestId(`ac-card:${attacker.instanceId}`);
    inspectCard(attacker.instanceId);
    expect(await screen.findByRole("button", { name: "Close card inspection" })).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Close card inspection" }));
    fireEvent.click(screen.getByTestId(`ac-card:${attacker.instanceId}`));
    expect(await screen.findByRole("button", { name: "Cancel attack" })).toBeTruthy();
    inspectCard(target.instanceId);
    expect(await screen.findByRole("button", { name: "Close card inspection" })).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
    expect(engine.state.clash).toBeNull();
    expect(engine.state.cards[attacker.instanceId].ready).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Close card inspection" }));
    fireEvent.click(screen.getByTestId(`ac-card:${target.instanceId}`));
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(engine.state.clash).toMatchObject({
      attackerId: attacker.instanceId,
      targetId: target.instanceId,
    });
  },
);

test("canceling a direct attack keeps the attacker ready and allows retry", async () => {
  const { engine, board, submit } = setup(0, "arena-drop-targets", {
    liveSelection: true,
    applySubmitted: true,
  });
  const attacker = board.cards.find(
    (card) => card.controller === "player-one" && card.zone === "clash",
  )!;
  fireEvent.click(await screen.findByTestId(`ac-card:${attacker.instanceId}`));
  fireEvent.click(await screen.findByRole("button", { name: "Cancel attack" }));
  expect(submit).not.toHaveBeenCalled();
  expect(engine.state.cards[attacker.instanceId].ready).toBe(true);
  fireEvent.click(screen.getByTestId(`ac-card:${attacker.instanceId}`));
  expect(await screen.findByRole("button", { name: "Cancel attack" })).toBeTruthy();
});

test("a direct play keeps the alternate cost route as a player choice", async () => {
  const { board, submit } = setup(75, "prompt-alternate-cost");
  const caoLing = board.cards.find(
    (card) => card.zone === "hand" && card.definitionId === "ac-ac3-063",
  )!;
  fireEvent.click(await screen.findByTestId(`ac-card:${caoLing.instanceId}`));
  expect(await screen.findByRole("button", { name: "Normal" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Alternative" })).toBeTruthy();
  expect(submit).not.toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: "Close card inspection" })).toBeNull();
});

test("the board payment control lets a direct hand click start manual payment", async () => {
  const { board, submit } = setup(75, "arena-drop-targets");
  fireEvent.click(screen.getByRole("button", { name: "Resource payment: Automatic" }));
  fireEvent.click(await screen.findByRole("radio", { name: "Choose resources" }));
  fireEvent.click(screen.getByRole("button", { name: "Resource payment: Choose resources" }));
  const sonoro = board.cards.find((card) => card.zone === "hand" && card.name === "Sonoro")!;
  fireEvent.click(await screen.findByTestId(`ac-card:${sonoro.instanceId}`));
  expect(await screen.findByTestId("ac-payment-stage")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Close card inspection" })).toBeNull();
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  await waitFor(() => expect(screen.queryByTestId("ac-payment-stage")).toBeNull());
  fireEvent.contextMenu(screen.getByTestId(`ac-card:${sonoro.instanceId}`));
  expect(await screen.findByRole("radio", { name: "Choose resources" })).toBeTruthy();
  expect(submit).not.toHaveBeenCalled();
});

test("new players see automatic payment beside Play and submit a legal native payment", async () => {
  const { engine, board, submit } = setup(75, "arena-drop-targets");
  expect(screen.getByRole("button", { name: "Resource payment: Automatic" })).toBeTruthy();
  const sonoro = board.cards.find((card) => card.zone === "hand" && card.name === "Sonoro")!;
  fireEvent.contextMenu(await screen.findByTestId(`ac-card:${sonoro.instanceId}`));
  expect(
    ((await screen.findByRole("radio", { name: "Automatic" })) as HTMLInputElement).checked,
  ).toBe(true);
  expect(screen.getByRole("radio", { name: "Choose resources" })).toBeTruthy();
  expect(screen.getByText(/By default, we choose ready resources/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Play Sonoro (1)" }));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(screen.queryByTestId("ac-payment-stage")).toBeNull();
  const result = engine.submitInteraction(engine.getActivePlayerId()!, submit.mock.calls[0][0], {
    gameId: engine.state.id,
    sourceAuthority: "server",
  });
  expect(result.success).toBe(true);
  expect(engine.state.cards[sonoro.instanceId].zone).not.toBe("hand");
});

test("players can choose their resources before Play and pay with a native board click", async () => {
  const { engine, board, submit } = setup(75, "arena-drop-targets", { applySubmitted: true });
  const sonoro = board.cards.find((card) => card.zone === "hand" && card.name === "Sonoro")!;
  fireEvent.contextMenu(await screen.findByTestId(`ac-card:${sonoro.instanceId}`));
  fireEvent.click(await screen.findByRole("radio", { name: "Choose resources" }));
  expect(window.localStorage.getItem("alpha-clash.auto-pay")).toBe("0");
  fireEvent.click(screen.getByRole("button", { name: "Play Sonoro (1)" }));
  expect(await screen.findByTestId("ac-payment-stage")).toBeTruthy();
  expect(submit).not.toHaveBeenCalled();
  const resource = board.cards.find((card) => card.zone === "resource" && card.name === "Sonoro")!;
  fireEvent.click(screen.getByTestId(`ac-card:${resource.instanceId}`));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(engine.state.cards[resource.instanceId].ready).toBe(false);
});

test("manual payment remains available through compact board resources", async () => {
  media.compact = true;
  const { engine, board, submit } = setup(75, "arena-drop-targets", { applySubmitted: true });
  const sonoro = board.cards.find((card) => card.zone === "hand" && card.name === "Sonoro")!;
  fireEvent.contextMenu(await screen.findByTestId(`ac-card:${sonoro.instanceId}`));
  fireEvent.click(await screen.findByRole("radio", { name: "Choose resources" }));
  fireEvent.click(screen.getByRole("button", { name: "Play Sonoro (1)" }));
  const payment = await screen.findByTestId("ac-payment-stage");
  expect(payment.getAttribute("data-compact")).toBe("true");
  expect(submit).not.toHaveBeenCalled();
  const resource = board.cards.filter(
    (card) => card.zone === "resource" && card.name === "Sonoro",
  )[1];
  expect(placements.some((placed) => placed.card.instanceId === resource.instanceId)).toBe(true);
  fireEvent.click(screen.getByTestId(`ac-card:${resource.instanceId}`));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(engine.state.cards[resource.instanceId].ready).toBe(false);
});

test("attention appears for a native payment choice and clears when that choice is cancelled", async () => {
  window.localStorage.setItem("alpha-clash.auto-pay", "0");
  const { board, submit } = setup(75, "arena-drop-targets");
  expect(screen.queryByTestId("arena-attention-layer")).toBeNull();
  const sonoro = board.cards.find((card) => card.zone === "hand" && card.name === "Sonoro")!;
  fireEvent.contextMenu(await screen.findByTestId(`ac-card:${sonoro.instanceId}`));
  fireEvent.click(await screen.findByRole("button", { name: "Play Sonoro (1)" }));
  expect(await screen.findByTestId("arena-attention-layer")).toBeTruthy();
  expect(await screen.findByRole("button", { name: "Pay automatically" })).toBeTruthy();
  // Sonoro needs green: black/red resources must not invite a dead-end tap.
  expect(screen.getAllByRole("button", { name: "Select Sonoro" })).toHaveLength(2);
  expect(screen.queryByRole("button", { name: "Select Webber, Weapons Expert" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Select Antarctica" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  await waitFor(() => expect(screen.queryByTestId("arena-attention-layer")).toBeNull());
  expect(submit).not.toHaveBeenCalled();
});

test("board sound control reflects shared master mute and enables the default volume", async () => {
  setup(0);
  fireEvent.click(screen.getByRole("button", { name: "Settings" }));
  const sound = await screen.findByRole("checkbox", { name: "Sound" });
  expect((sound as HTMLInputElement).checked).toBe(false);
  fireEvent.click(sound);
  expect((sound as HTMLInputElement).checked).toBe(true);
  fireEvent.click(sound);
  expect((sound as HTMLInputElement).checked).toBe(false);
});

test("board sound control restores the previous non-default master volume", async () => {
  setup(37);
  fireEvent.click(screen.getByRole("button", { name: "Settings" }));
  const sound = await screen.findByRole("checkbox", { name: "Sound" });
  fireEvent.click(sound);
  expect(window.localStorage.getItem("matchmaking.player.soundVolume")).toBe("0");
  fireEvent.click(sound);
  expect(window.localStorage.getItem("matchmaking.player.soundVolume")).toBe("37");
});

test("board Portal submits the adapter action without optimistically changing state", async () => {
  const { board, submit } = setup(0, "board-actions");
  const portal = screen.getByRole("button", { name: "Portal closed. Open the Portal" });
  expect(portal.getAttribute("aria-pressed")).toBe("false");
  fireEvent.click(portal);
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit.mock.calls[0][0]).toMatchObject({ actionId: "activatePortal", values: {} });
  expect(board.portalOpen).toBe(false);
  expect(portal.getAttribute("aria-pressed")).toBe("false");
});

test.each([
  ["Heavy Metal", "Attach Heavy Metal"],
  ["Death Blades", "Attach Death Blades to your Contender"],
])("%s inspection exposes its native attachment action", async (name, label) => {
  const { board, submit } = setup(0, "board-actions");
  const weapon = board.cards.find((card) => card.zone === "accessory" && card.name === name)!;
  fireEvent.contextMenu(await screen.findByTestId(`ac-card:${weapon.instanceId}`));
  fireEvent.click(await screen.findByRole("button", { name: label }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: "Close card inspection" })).toBeNull();
});

test.each([false, true])("opening waiting copy follows native hand readiness (%s)", (resolved) => {
  const { board, engine } = setup(0, "opening-preview", {
    viewerSeat: "player-two",
    prepare: (engine) => {
      fixtureSubmit(engine, "declareMulligan:take");
      fixtureSubmit(engine, "declareMulligan:take");
      fixtureSubmit(engine, "mulligan", { cardIds: [] });
      if (resolved) fixtureSubmit(engine, "mulligan", { cardIds: [] });
    },
  });
  const view = engine.getInteractionView("bot");
  expect(board.openingHandsReady).toBe(resolved);
  if (resolved) {
    expect(view.status).toBe("waiting");
    expect(view.actions.some((action) => action.id === "startGame")).toBe(false);
    expect(
      screen.getByText("Both hands are ready. Waiting for the starting player to begin."),
    ).toBeTruthy();
    expect(screen.queryByText("Waiting for the other player's opening choice.")).toBeNull();
  } else {
    expect(
      screen.getByText("Select any number of cards to replace. Right-click to inspect."),
    ).toBeTruthy();
    expect(
      screen.queryByText("Both hands are ready. Waiting for the starting player to begin."),
    ).toBeNull();
  }
});

test.each(["declaration", "replacement"])(
  "opening %s shares all local card candidates and selected state with the scene",
  (stage) => {
    const redraw = vi.fn();
    const openingScene: ArenaOpening = {
      beat: {
        id: "hand",
        title: "Opening",
        detail: "Select cards",
        leaders: "field",
        hand: "review",
        localCount: 8,
        rivalCount: 8,
        action: "hand",
      },
      advance: vi.fn(),
      redraw,
      retainedIds: new Set(),
      handOrder: [],
      declare: vi.fn(),
      keep: vi.fn(),
      cancel: vi.fn(),
    };
    const { submit, board } = setup(0, "opening-preview", {
      openingScene,
      prepare:
        stage === "replacement"
          ? (engine) => {
              fixtureSubmit(engine, "declareMulligan:take");
              fixtureSubmit(engine, "declareMulligan:keep");
            }
          : undefined,
    });
    const localHand = board.cards.filter(
      (card) => card.zone === "hand" && card.controller === "player-one",
    );
    expect([...(sceneSelectable ?? [])].sort()).toEqual(
      localHand.map((card) => card.instanceId).sort(),
    );
    expect(sceneSelected.size).toBe(0);
    const card = screen.getByRole("button", { name: /Select Captain Maxine Riggins/ });
    const cardId = localHand.find((entry) =>
      entry.name?.includes("Captain Maxine Riggins"),
    )!.instanceId;
    fireEvent.click(card);
    expect(card.getAttribute("aria-pressed")).toBe("true");
    expect([...sceneSelected]).toEqual([cardId]);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(openingScene.declare).not.toHaveBeenCalled();
    fireEvent.click(card);
    expect(card.getAttribute("aria-pressed")).toBe("false");
    expect(sceneSelected.size).toBe(0);
    fireEvent.keyDown(card, { key: "Enter" });
    expect([...sceneSelected]).toEqual([cardId]);
    fireEvent.click(screen.getByRole("button", { name: "Replace 1 selected card" }));
    expect(openingScene.declare).not.toHaveBeenCalled();
    expect(redraw).toHaveBeenCalledTimes(1);
    expect(redraw.mock.calls[0][0]).toHaveLength(1);
    expect(redraw.mock.calls[0][1]).toHaveLength(8);
    expect(submit).not.toHaveBeenCalled();
  },
);

test("opening replacement confirmation stays available for zero and selected cards", () => {
  const redraw = vi.fn();
  const openingScene: ArenaOpening = {
    beat: {
      id: "hand",
      title: "Opening",
      detail: "Select cards",
      leaders: "field",
      hand: "review",
      localCount: 8,
      rivalCount: 8,
      action: "hand",
    },
    advance: vi.fn(),
    redraw,
    retainedIds: new Set(),
    handOrder: [],
    declare: vi.fn(),
    keep: vi.fn(),
    cancel: vi.fn(),
  };
  const { engine, submit } = setup(0, "opening-preview", {
    openingScene,
    prepare: (engine) => {
      fixtureSubmit(engine, "declareMulligan:take");
      fixtureSubmit(engine, "declareMulligan:keep");
    },
  });
  fireEvent.click(screen.getByRole("button", { name: "Replace 0 selected cards" }));
  expect(redraw.mock.calls[0][0]).toEqual([]);
  const card = Object.values(engine.state.cards).find(
    (card) => card.controller === "player-one" && card.zone === "hand",
  )!;
  fireEvent.click(screen.getByRole("button", { name: /Select Captain Maxine Riggins/ }));
  fireEvent.click(screen.getByRole("button", { name: "Replace 1 selected card" }));
  expect(redraw.mock.calls[1][0]).toEqual([card.instanceId]);
  expect(redraw.mock.calls[1][1]).toHaveLength(8);
  expect(submit).not.toHaveBeenCalled();
});

test.each([true, false])(
  "resource inspection respects native candidate eligibility (%s)",
  async (eligible) => {
    const { engine, board, submit } = setup(0, "resource-step");
    const action = engine
      .getInteractionView("human")
      .actions.find((action) => action.id === "deployResource")!;
    const input = action.inputs.find((input) => input.kind === "entity-selection");
    if (input?.kind !== "entity-selection") throw new Error("Missing native resource input");
    const ids = new Set(
      input.candidates
        .filter((candidate) => candidate.enabled)
        .map((candidate) => candidate.entity.instanceId),
    );
    const card = board.cards.find(
      (card) =>
        card.controller === "player-one" &&
        card.zone === "hand" &&
        ids.has(card.instanceId) === eligible,
    )!;
    expect(card).toBeDefined();
    fireEvent.contextMenu(await screen.findByTestId(`ac-card:${card.instanceId}`));
    if (!eligible) {
      expect(screen.queryByRole("button", { name: "Deploy as resource" })).toBeNull();
      expect(submit).not.toHaveBeenCalled();
      return;
    }
    fireEvent.click(screen.getByRole("button", { name: "Deploy as resource" }));
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(submit.mock.calls[0][0]).toMatchObject({
      actionId: "deployResource",
      values: { [input.id]: [card.instanceId] },
    });
  },
);

test("opponent deck viewer exposes the native revealed face without the rest of the deck", async () => {
  const { engine, submit } = setup(0, "destination-reveal", {
    prepare: (engine) => fixtureBeginDestination(engine, "destination-reveal"),
  });
  const top = engine.state.deckOrder["player-two"][0];
  fireEvent.click(screen.getByRole("button", { name: "Opponent's deck · 43 cards" }));
  expect(
    await screen.findByText(
      "Only cards visible to you are shown. Other deck identities and order stay hidden.",
    ),
  ).toBeTruthy();
  const dialog = screen.getByRole("dialog");
  const { within } = await import("@testing-library/react");
  const target = within(dialog).getByRole("button", { name: /Magnate, Cunning Planner/ });
  fireEvent.click(target);
  await waitFor(() => expect(inspected?.instanceId).toBe(top));
  expect(submit).not.toHaveBeenCalled();
});

test("revealed non-target hand faces remain inspectable with the live selection binding", async () => {
  const { submit } = setup(0, "destination-reveal-hand", {
    viewerSeat: "player-two",
    liveSelection: true,
    prepare: (engine) => fixtureBeginDestination(engine, "destination-reveal-hand"),
  });
  fireEvent.click(screen.getByRole("button", { name: "Opponent's hand · 4 cards" }));
  const { within } = await import("@testing-library/react");
  const dialog = await screen.findByRole("dialog");
  const magnate = within(dialog).getByRole("button", { name: /Magnate, Cunning Planner/ });
  fireEvent.click(magnate);
  await waitFor(() => expect(inspected?.definitionId).toBe("ac-ac1-028"));
  fireEvent.click(screen.getByRole("button", { name: "Close card inspection" }));
  expect(screen.queryByRole("button", { name: "Choose Magnate, Cunning Planner" })).toBeNull();
  expect(screen.getByRole("button", { name: "Select Denver" })).toBeTruthy();
  expect(submit).not.toHaveBeenCalled();
});

test("drag owns the lifted hand pose across pointer leave and other card hover", async () => {
  const { board, submit } = setup(0, "arena-drop-targets");
  const handCard = board.cards.find((card) => card.zone === "hand" && card.name === "Antarctica")!;
  const resource = board.cards.find((card) => card.zone === "resource")!;
  const source = await screen.findByTestId(`ac-card:${handCard.instanceId}`);
  fireEvent.mouseEnter(source);
  act(() =>
    dragMotion.begin(handCard.instanceId, { left: 600, top: 500, width: 140, height: 200 }),
  );
  fireEvent.mouseLeave(source);
  fireEvent.mouseEnter(screen.getByTestId(`ac-card:${resource.instanceId}`));
  act(() => dragMotion.move(0, -180));
  expect(hovered).toBe(handCard.instanceId);
  expect(screen.getByText(/drop to play/i)).toBeTruthy();
  act(() => dragMotion.release());
  expect(hovered).toBe(handCard.instanceId);
  act(() => dragMotion.finish());
  expect(hovered).toBe(resource.instanceId);
  expect(submit).not.toHaveBeenCalled();
});
test("native counter cost route retains its discard instruction and cancel control", async () => {
  const { engine, submit } = setup(0, "destination-reveal-hand", {
    prepare: fixtureAttack,
    viewerSeat: "player-two",
  });
  const counterAction = engine
    .getInteractionView("bot")
    .actions.find((action) => action.text.key === "Counter with Purging Heat")!;
  expect(counterAction).toBeDefined();
  fireEvent.contextMenu(await screen.findByTestId(`ac-card:${counterAction.source!.instanceId}`));
  fireEvent.click(await screen.findByRole("button", { name: "Counter with Purging Heat" }));
  fireEvent.click(await screen.findByRole("button", { name: "Additional (required)" }));
  expect(
    await screen.findByText("Discard 1 as an activation cost", { selector: "strong" }),
  ).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Cancel action" }));
  expect(screen.queryByRole("region", { name: "Current game prompt" })).toBeNull();
  expect(submit).not.toHaveBeenCalled();
});

test("native obstruction highlights candidates immediately and confirms the selected cards", async () => {
  const { engine, board, submit } = setup(0, "combat-buffs-victory", {
    viewerSeat: "player-two",
    liveSelection: true,
    applySubmitted: true,
    prepare: (engine) => {
      fixtureAttack(engine);
      expect(engine.state.clash?.step).toBe("obstruct");
    },
  });
  const action = engine
    .getInteractionView("bot")
    .actions.find((action) => action.id === "declareObstructors")!;
  const input = action.inputs[0];
  if (input.kind !== "entity-selection") throw new Error("Missing native obstruction choice");
  const id = input.candidates.find((candidate) => candidate.enabled)!.entity.instanceId;
  const card = board.cards.find((card) => card.instanceId === id)!;
  expect(screen.queryByRole("button", { name: "Choose obstructors" })).toBeNull();
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(await screen.findByRole("button", { name: `Obstruct with ${card.name}` }));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Obstruct with 1" }));
  await waitFor(() => expect(submit).toHaveBeenCalledOnce());
  expect(submit.mock.calls[0][0]).toMatchObject({
    actionId: "declareObstructors",
    values: { obstructorIds: [id] },
  });
  expect(engine.state.clash?.step).not.toBe("obstruct");
});

for (const viewerSeat of ["player-one", "player-two"] as const) {
  test(`compact set-card pile respects native visibility for ${viewerSeat}`, async () => {
    media.compact = true;
    const { submit } = setup(0, "ambush-set-response", {
      viewerSeat,
      prepare: (engine) => {
        fixtureSubmit(engine, "activatePortal");
        const gur = Object.values(engine.state.cards).find(
          (c) =>
            c.zone === "hand" && c.controller === "player-one" && c.definitionId === "ac-ac3-007",
        );
        if (!gur) throw new Error("Missing native Gur");
        fixtureSubmit(engine, `setCard:${gur.instanceId}`);
      },
    });
    fireEvent.click(
      screen.getByRole("button", {
        name:
          viewerSeat === "player-one"
            ? "Your accessories · 1 card"
            : "Opponent's accessories · 1 card",
      }),
    );
    const { within } = await import("@testing-library/react");
    const dialog = await screen.findByRole("dialog");
    if (viewerSeat === "player-one") {
      fireEvent.click(
        within(dialog).getByRole("button", { name: "Inspect Gur, Savage Aggressor" }),
      );
      await waitFor(() => expect(inspected?.name).toBe("Gur, Savage Aggressor"));
      expect(screen.queryByRole("button", { name: "Ambush Gur, Savage Aggressor" })).toBeNull();
    } else {
      expect(within(dialog).queryByRole("button", { name: /Gur/ })).toBeNull();
    }
    expect(submit).not.toHaveBeenCalled();
  });
}

test("live pacing parser preserves real trigger ownership and response priority", () => {
  const { engine, board } = setup(0, "combat-obstruct-forced-unable", {
    prepare: (engine) => fixtureAttack(engine, "ac-ac2-108"),
  });
  expect(board.decisionSeat).toBe("player-one");
  expect(board.responseWindow?.openFor).toBe("player-two");
  expect(
    screen.getByRole("status", { name: /YOUR CHOICE.*Priority: Opponent.*Decision: You/ }),
  ).toBeDefined();
  const announcement = screen.getByRole("status", {
    name: /YOUR CHOICE.*Priority: Opponent.*Decision: You/,
  });
  expect(announcement.textContent).toContain("Priority: Opponent. Decision: You.");
  expect(announcement.textContent).not.toContain("You have priority");
  const other = engine.getViewerState({ role: "player", actorId: "bot" });
  expect(other.pendingChoices).toHaveLength(0);
  expect(parseProjectedState(other)?.decisionSeat).toBe("player-one");
  expect(
    parseProjectedState({
      ...other,
      responseWindow: { ...other.responseWindow, passedPlayers: ["invalid-seat"] },
    }),
  ).toBeNull();
});

test("mulligan animation keeps both hands and places every replacement in the local hand", () => {
  const openingScene: ArenaOpening = {
    beat: {
      id: "redraw",
      title: "Replacement hand",
      detail: "Drawing",
      leaders: "field",
      hand: "review",
      localCount: 8,
      rivalCount: 8,
      duration: 1800,
    },
    advance: vi.fn(),
    redraw: vi.fn(),
    declare: vi.fn(),
    keep: vi.fn(),
    cancel: vi.fn(),
    retainedIds: new Set(),
    handOrder: [],
  };
  const { board } = setup(0, "opening-preview", {
    openingScene,
    prepare: (engine) => {
      const hand = engine
        .getViewerState({ role: "player", actorId: "human" })
        .cards.filter((card) => card.controller === "player-one" && card.zone === "hand");
      const selected = hand.slice(0, 4).map((card) => card.instanceId);
      openingScene.handOrder = hand.map((card) => card.instanceId);
      openingScene.retainedIds = new Set(hand.slice(4).map((card) => card.instanceId));
      fixtureSubmit(engine, "declareMulligan:take");
      fixtureSubmit(engine, "declareMulligan:keep");
      fixtureSubmit(engine, "mulligan", { cardIds: selected });
    },
  });
  for (const seat of ["player-one", "player-two"]) {
    const expected = board.cards.filter((card) => card.zone === "hand" && card.controller === seat);
    const visible = placements.filter((placed) => placed.hand && placed.card.controller === seat);
    expect(visible.map((placed) => placed.card.instanceId).sort()).toEqual(
      expected.map((card) => card.instanceId).sort(),
    );
    expect(visible).toHaveLength(8);
  }
});
