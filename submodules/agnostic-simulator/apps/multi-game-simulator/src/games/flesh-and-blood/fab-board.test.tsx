import { FabPresentationCatalogProvider } from "./FabPresentationCatalog";
import { testFabArt } from "./presentation-test-provider";
const { imageUrlForFabCard } = testFabArt;
import { FabPresentationTestProvider } from "./presentation-test-provider";
import { rhinar } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { bravo } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { nimblismBlue } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { commandForFabSubmission } from "@tcg/flesh-and-blood-server-adapter";
import { completePracticeTurnOrder } from "./testing/complete-practice-turn-order";
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render as testingLibraryRender,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HeadlessMantineProvider } from "@mantine/core";
import type { ReactElement, ReactNode } from "react";
import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type InteractionSubmission,
} from "@tcg/protocol";
import type { SimulatorDeckRevealCard } from "@tcg/simulator-contract";

import { FleshAndBloodSimulatorProviders } from "./App";
import { FleshAndBloodFixtureIndexPage } from "./Fixtures.page";
import {
  commandCardKey,
  commandCardLabel,
  FleshAndBloodPracticePage,
  listFabActionCardChoices,
  resolveFabRouteFixtureId,
  resolveHandCardTap,
  shouldAutoDispatchCardCommands,
  shouldScheduleFabPracticeBot,
} from "./Practice.page";
import {
  deriveFabMobileRailAction,
  FabPriorityAutomationSettingsPanel,
  FleshAndBloodTabletop,
  MobileAssetPills,
  type FabParticipantPresentation,
} from "./FleshAndBloodTabletop";
import { SimulatorSelfParticipantActions } from "../../simulator/participant-actions";
import { FabMobileBoard, type FabMobileSeat } from "./FabMobileBoard";
import { FabCardPreviewProvider } from "./FabCardPreview";
import { FabActiveEffectsInspector } from "./FabActiveEffects";
import { toFabCardDefinition } from "@tcg/flesh-and-blood-engine/catalog";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import {
  CATALOG_TEST_DEFINITIONS,
  catalogIds,
  listLegalCommands,
  type FabLegalCommand,
} from "@tcg/flesh-and-blood-engine/simulator";
import {
  FAB_AUTOMATION_PREFERENCE_LABELS,
  FAB_ARM_PRIORITY_HOLD_LABEL,
  FAB_PRIORITY_MODE_ACTION_LABEL,
  projectFabInteraction,
} from "@tcg/flesh-and-blood-server-adapter";
import { HeroSpecialArea } from "./HeroSpecialArea";
import { HeroSpecialPreviewGallery } from "./HeroSpecialPreviewGallery";
import { FabPregameSideboard } from "./FabPregameSideboard";
import { HERO_SPECIAL_UI_CATALOG } from "./hero-special-ui";
import { projectCombatChainView } from "./combatChainView";
import { CombatChain } from "./CombatChain";
import { engineDefToPresentation, presentRuntime } from "./projection";
import {
  createClosedWithPermanentsFixtureState,
  createCombatFixtureState,
  createMultiLinkActiveFixtureState,
  createOpeningFixtureState,
  FAB_VISUAL_FIXTURES,
} from "./fixtures";
import { reduceFabPresentationState, type FabPresentationState } from "./state";
import { installBrowserShims } from "../../testing/browser-shims";

import { allFleshAndBloodCatalogCards } from "@tcg/flesh-and-blood-cards/catalog";
import { secondStrikeRed } from "@tcg/flesh-and-blood-cards/cards/actions/second-strike";
import { limpitHopALongYellow } from "@tcg/flesh-and-blood-cards/cards/actions/limpit-hop-a-long";
import {
  dash,
  noHeroStandsAloneYellow,
  snatchRed,
  tuffnut,
} from "@tcg/flesh-and-blood-cards/simulator-scenario-cards";
import { getFabPracticeDeckOption } from "./data/practice-deck-options";
import { resolvePracticeDeckSelection } from "./data/resolve-text-deck";
import { FAB_KEYWORD_ANIMATION_FIXTURE_IDS, getFabEngineScenario } from "./engineScenarios";
import { renderFabSimulatorScenario } from "./testing/render-fab-simulator";

function parseCssAspectRatio(value: string): number {
  const [numerator = "1", denominator = "1"] = value.split("/");
  return Number(numerator.trim()) / Number(denominator.trim());
}

function render(ui: ReactElement) {
  return testingLibraryRender(ui, {
    wrapper: ({ children }) => (
      <HeadlessMantineProvider>
        <FabPresentationCatalogProvider>{children}</FabPresentationCatalogProvider>
      </HeadlessMantineProvider>
    ),
  });
}

/** Presentation-only between-links state (engine does not yet emit multi-link open history). */
function presentationBetweenLinksState(): FabPresentationState {
  const base = createClosedWithPermanentsFixtureState();
  return {
    ...base,
    combat: {
      open: true,
      step: "resolution",
      defenseDeclarationPending: false,
      activeLink: null,
      resolvedLinks: [
        {
          attackInstanceId: "a1",
          attackingPlayerId: "player-1",
          defendingPlayerId: "player-2",
          attackTarget: { kind: "hero", playerId: "player-2" },
          additionalAttackTargets: [],
          defendingInstanceIdsByTarget: { "player-2": [] },
          attackPower: 6,
          totalDefense: 4,
          damage: 2,
          didHit: true,
        },
        {
          attackInstanceId: "a2",
          attackingPlayerId: "player-1",
          defendingPlayerId: "player-2",
          attackTarget: { kind: "hero", playerId: "player-2" },
          additionalAttackTargets: [],
          defendingInstanceIdsByTarget: { "player-2": [] },
          attackPower: 5,
          totalDefense: 7,
          damage: 0,
          didHit: false,
        },
      ],
    },
  };
}

function createDecisionView(actingPlayerId: string): EngineInteractionView {
  const prompt = "Choose an amount.";
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "flesh-and-blood",
    actorId: actingPlayerId,
    stateVersion: 4,
    status: "choosing",
    resolution: {
      actingPlayerId,
      pendingCount: 1,
      currentEffect: { id: "amount-decision", text: { key: prompt } },
      currentStep: {
        index: 1,
        count: 1,
        text: { key: prompt },
        requirement: { kind: "number", text: { key: prompt }, required: true },
      },
    },
    actions: [
      {
        id: "answer-amount",
        requestId: "answer:4",
        intent: "choose-option",
        text: { key: prompt },
        enabled: true,
        inputs: [
          {
            id: "answer",
            kind: "number",
            text: { key: prompt },
            required: true,
            min: 0,
            max: 3,
          },
        ],
      },
    ],
  };
}

function renderTabletop(
  state: ReturnType<typeof createOpeningFixtureState>,
  options: {
    viewerId?: string;
    forceMobileLayout?: boolean;
    publicTargeting?: boolean;
    onAction?: (action: import("./state").FabPresentationAction) => void;
    onEndTurn?: () => void;
    canEndTurn?: boolean;
    onOpenLegalActions?: () => void;
    onPassPriority?: () => void;
    legalCommands?: readonly FabLegalCommand[];
    onLegalCommand?: (command: FabLegalCommand) => void;
    matchActions?: ReactNode;
    interactionView?: EngineInteractionView;
    onSubmitInteraction?: (submission: InteractionSubmission) => void;
    animationVersion?: number;
    readOnly?: boolean;
    handReveals?: Readonly<Record<string, readonly SimulatorDeckRevealCard[] | undefined>>;
    participantActions?: ReactNode;
    participantPresentation?: Readonly<Record<string, FabParticipantPresentation>>;
  } = {},
) {
  const {
    viewerId = "player-1",
    forceMobileLayout = false,
    publicTargeting = false,
    onAction,
    onEndTurn,
    canEndTurn,
    onOpenLegalActions,
    onPassPriority,
    legalCommands,
    onLegalCommand,
    matchActions,
    interactionView,
    onSubmitInteraction,
    animationVersion,
    readOnly = true,
    handReveals,
    participantActions,
    participantPresentation,
  } = options;
  return render(
    <HeadlessMantineProvider>
      <FabPresentationTestProvider>
        <FleshAndBloodSimulatorProviders>
          <FleshAndBloodTabletop
            state={state}
            viewerId={viewerId}
            readOnly={readOnly}
            forceMobileLayout={forceMobileLayout}
            publicTargeting={publicTargeting}
            onAction={onAction}
            onEndTurn={onEndTurn}
            canEndTurn={canEndTurn}
            onOpenLegalActions={onOpenLegalActions}
            onPassPriority={onPassPriority}
            legalCommands={legalCommands}
            onLegalCommand={onLegalCommand}
            matchActions={matchActions}
            interactionView={interactionView}
            onSubmitInteraction={onSubmitInteraction}
            animationVersion={animationVersion}
            handReveals={handReveals}
            participantPresentation={
              participantPresentation ??
              (participantActions
                ? { [viewerId]: { displayName: "You", actions: participantActions } }
                : undefined)
            }
          />
        </FleshAndBloodSimulatorProviders>
      </FabPresentationTestProvider>
    </HeadlessMantineProvider>,
  );
}

function withDeterministicStackArtwork(
  state: ReturnType<typeof createOpeningFixtureState>,
): ReturnType<typeof createOpeningFixtureState> {
  const cardDefinitions = { ...state.cardDefinitions };
  for (const instanceId of state.stackInstanceIds ?? state.combat?.stackInstanceIds ?? []) {
    const card = state.cards[instanceId];
    if (!card) continue;
    cardDefinitions[card.cardId] = {
      ...cardDefinitions[card.cardId],
      imageUrl: "https://example.test/fab-stack-card.webp",
    };
  }
  return { ...state, cardDefinitions };
}

function renderFixtureRoute(fixtureId: string) {
  return render(
    <HeadlessMantineProvider>
      <FabPresentationTestProvider>
        <MemoryRouter initialEntries={[`/flesh-and-blood/simulator/tests/${fixtureId}`]}>
          <FleshAndBloodSimulatorProviders>
            <Routes>
              <Route
                path="/flesh-and-blood/simulator/tests/:fixtureId"
                element={<FleshAndBloodPracticePage />}
              />
            </Routes>
          </FleshAndBloodSimulatorProviders>
        </MemoryRouter>
      </FabPresentationTestProvider>
    </HeadlessMantineProvider>,
  );
}

describe("Flesh and Blood board", () => {
  // These interaction fixtures start after the common route readiness boundary.
  beforeEach(() => {
    installBrowserShims();
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
  });

  afterEach(() => {
    cleanup();
    window.localStorage.removeItem("fab-sideboard-grid-density");
    window.sessionStorage.removeItem("fab-practice:active-match:v1");
    window.sessionStorage.removeItem("fab-practice:preparation:v1");
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each([false, true])(
    "explains empty-stack defender priority and submits its pass on mobile=%s",
    (forceMobileLayout) => {
      const base = createCombatFixtureState();
      if (!base.combat) throw new Error("Expected combat fixture");
      const onSubmitInteraction = vi.fn();
      renderTabletop(
        {
          ...base,
          priorityPlayerId: "player-2",
          priorityWindow: { kind: "combat-resolution-response", role: "defender" },
          combat: { ...base.combat, step: "resolution", stackInstanceIds: [] },
          stackInstanceIds: [],
        },
        {
          viewerId: "player-2",
          forceMobileLayout,
          readOnly: false,
          onPassPriority: vi.fn(),
          legalCommands: [{ move: "pass", label: "Pass priority", payload: {} }],
          interactionView: {
            protocolVersion: INTERACTION_PROTOCOL_VERSION,
            gameSlug: "flesh-and-blood",
            actorId: "player-2",
            stateVersion: 4,
            status: "ready",
            actions: [
              {
                id: "fab:control:pass",
                requestId: "pass:4",
                intent: "pass",
                text: { key: "Pass priority" },
                enabled: true,
                inputs: [],
              },
            ],
          },
          onSubmitInteraction,
        },
      );
      const prompt = screen.getByTestId("interaction-resolution-prompt");
      expect(prompt.textContent).toContain("Before the combat chain closes");
      expect(prompt.textContent).toContain("You have no available responses");
      expect(within(prompt).queryByRole("button", { name: "Close combat chain" })).toBeNull();
      fireEvent.click(within(prompt).getByRole("button", { name: "Pass priority" }));
      expect(onSubmitInteraction).toHaveBeenCalledWith(
        expect.objectContaining({ actionId: "fab:control:pass" }),
      );
    },
  );

  it.each([false, true])(
    "does not overlay idle turn-player Action Phase instructions on mobile=%s",
    (forceMobileLayout) => {
      const onSubmitInteraction = vi.fn();
      renderTabletop(createOpeningFixtureState(), {
        forceMobileLayout,
        readOnly: false,
        legalCommands: [{ move: "pass", label: "Pass priority", payload: {} }],
        interactionView: {
          protocolVersion: INTERACTION_PROTOCOL_VERSION,
          gameSlug: "flesh-and-blood",
          actorId: "player-1",
          stateVersion: 4,
          status: "ready",
          actions: [
            {
              id: "fab:control:pass",
              requestId: "pass:4",
              intent: "pass",
              text: { key: "Pass priority" },
              enabled: true,
              inputs: [],
            },
          ],
        },
        onSubmitInteraction,
      });
      expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
      expect(screen.queryByText(/your action phase/i)).toBeNull();
      const pass = forceMobileLayout
        ? screen.getByTestId("fab-chain-pass-priority")
        : screen.getByTestId("fab-quick-pass");
      fireEvent.click(pass);
      expect(onSubmitInteraction).toHaveBeenCalledWith(
        expect.objectContaining({ actionId: "fab:control:pass" }),
      );
    },
  );

  it("still overlays the non-turn player's empty-stack Action Phase response", () => {
    const opening = createOpeningFixtureState();
    const onSubmitInteraction = vi.fn();
    renderTabletop(
      {
        ...opening,
        activePlayerId: "player-1",
        priorityPlayerId: "player-2",
        combat: null,
        stackInstanceIds: [],
        priorityWindow: { kind: "terminal-action-phase" },
      },
      {
        viewerId: "player-2",
        readOnly: false,
        legalCommands: [{ move: "pass", label: "Pass priority", payload: {} }],
        interactionView: {
          protocolVersion: INTERACTION_PROTOCOL_VERSION,
          gameSlug: "flesh-and-blood",
          actorId: "player-2",
          stateVersion: 4,
          status: "ready",
          actions: [
            {
              id: "fab:control:pass",
              requestId: "pass:4",
              intent: "pass",
              text: { key: "Pass priority" },
              enabled: true,
              inputs: [],
            },
          ],
        },
        onSubmitInteraction,
      },
    );
    const prompt = screen.getByTestId("interaction-resolution-prompt");
    expect(prompt.textContent).toContain("Before the action phase ends");
    expect(prompt.textContent).toContain("You have no available responses");
    fireEvent.click(within(prompt).getByRole("button", { name: "Pass priority" }));
    expect(onSubmitInteraction).toHaveBeenCalledWith(
      expect.objectContaining({ actionId: "fab:control:pass" }),
    );
  });

  it("still overlays a pending layer during the turn player's Action Phase", () => {
    const opening = createOpeningFixtureState();
    const pending = Object.values(opening.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "arsenal",
    );
    if (!pending) throw new Error("expected an arsenal card for the pending layer");
    const pendingName = opening.cardDefinitions[pending.cardId]?.name ?? pending.cardId;
    const onSubmitInteraction = vi.fn();
    renderTabletop(
      {
        ...opening,
        activePlayerId: "player-1",
        priorityPlayerId: "player-1",
        combat: null,
        stackInstanceIds: [pending.id],
        priorityWindow: { kind: "ordinary-priority" },
      },
      {
        readOnly: false,
        legalCommands: [{ move: "pass", label: "Pass priority", payload: {} }],
        interactionView: {
          protocolVersion: INTERACTION_PROTOCOL_VERSION,
          gameSlug: "flesh-and-blood",
          actorId: "player-1",
          stateVersion: 4,
          status: "ready",
          actions: [
            {
              id: "fab:control:pass",
              requestId: "pass:4",
              intent: "pass",
              text: { key: "Pass priority" },
              enabled: true,
              inputs: [],
            },
          ],
        },
        onSubmitInteraction,
      },
    );
    const prompt = screen.getByTestId("interaction-resolution-prompt");
    expect(prompt.textContent).toContain(`Before ${pendingName} resolves`);
    expect(screen.queryByText(/your action phase/i)).toBeNull();
    fireEvent.click(within(prompt).getByRole("button", { name: "Pass priority" }));
    expect(onSubmitInteraction).toHaveBeenCalledWith(
      expect.objectContaining({ actionId: "fab:control:pass" }),
    );
  });

  it.each([false, true])(
    "keeps both player stack animation endpoints mounted when the stack is empty on mobile=%s",
    (forceMobileLayout) => {
      const { container } = renderTabletop(createOpeningFixtureState(), { forceMobileLayout });

      expect(container.querySelectorAll(".fab-animation-stack-anchor")).toHaveLength(2);
      expect(screen.queryByTestId("fab-compact-resolution-stack")).toBeNull();
      expect(screen.queryByTestId("fab-resolution-stack")).toBeNull();
    },
  );

  it.each([false, true])(
    "explains an unavailable hand action on mobile=%s",
    (forceMobileLayout) => {
      const state = createOpeningFixtureState();
      renderTabletop(state, { readOnly: false, forceMobileLayout, legalCommands: [] });
      const hand = screen.getByTestId("fab-hand-bottom");
      const card = hand.querySelector("[data-entity-id]")?.closest("button");
      if (!card) throw new Error("Missing hand card");
      fireEvent.click(card);
      const unavailable = screen.getByRole("menuitem", { name: /Action unavailable/ });
      expect(unavailable.textContent).toContain("No action is available for this card");
      expect(unavailable.getAttribute("aria-disabled")).toBe("true");
    },
  );

  it("explains a hosted arsenal click when no play action was published", () => {
    const match = getFabEngineScenario("shift-tide-arsenal-feedback")?.boot();
    if (!match) throw new Error("Missing Shift the Tide fixture");
    const onLegalCommand = vi.fn();
    renderTabletop(presentRuntime(match.runtime, match.player1Id), {
      readOnly: false,
      viewerId: match.player1Id,
      legalCommands: [],
      onLegalCommand,
    });
    fireEvent.click(screen.getByRole("button", { name: /^Shift the Tide of Battle, card,/i }));
    const unavailable = screen.getByRole("menuitem", { name: /Action unavailable/ });
    expect(unavailable.textContent).toContain("No action is available for this card");
    expect(unavailable.getAttribute("aria-disabled")).toBe("true");
    expect(onLegalCommand).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Close card menu" }));
    expect(screen.queryByRole("menuitem", { name: /Action unavailable/ })).toBeNull();
  });

  it.each([false, true])(
    "explains that a non-attack action needs the combat chain closed on mobile=%s",
    (forceMobileLayout) => {
      const base = createCombatFixtureState();
      const card = Object.values(base.cards).find(
        (candidate) => candidate.ownerId === "player-1" && candidate.zone === "hand",
      );
      if (!card || !base.combat?.activeLink) throw new Error("expected a combat hand card");
      const state = {
        ...base,
        priorityWindow: { kind: "combat-chain-continuation" as const, role: "attacker" as const },
        combat: {
          ...base.combat,
          step: "resolution" as const,
          activeLink: { ...base.combat.activeLink, damageResolved: true },
        },
        cardDefinitions: {
          ...base.cardDefinitions,
          [card.cardId]: {
            ...base.cardDefinitions[card.cardId]!,
            name: "Lumina Ascension",
            cardType: "action",
            typeLine: "Light Action",
          },
        },
      };
      renderTabletop(state, { readOnly: false, forceMobileLayout, legalCommands: [] });

      const cardButton = screen
        .getByTestId("fab-hand-bottom")
        .querySelector(`[data-entity-id="${card.id}"]`)
        ?.closest("button");
      fireEvent.click(cardButton!);

      const unavailable = screen.getByRole("menuitem", { name: /Action unavailable/ });
      expect(unavailable.textContent).toContain(
        "This is a non-attack action. Close the combat chain before playing it.",
      );
      expect(unavailable.textContent).toContain(
        "Actions played as instants can be played while the chain is open.",
      );
    },
  );

  it("closes the combat chain and then plays a selected non-attack action", async () => {
    const base = createCombatFixtureState();
    const card = Object.values(base.cards).find(
      (candidate) => candidate.ownerId === "player-1" && candidate.zone === "hand",
    );
    if (!card || !base.combat?.activeLink) throw new Error("expected a combat hand card");
    const resolutionState = {
      ...base,
      priorityWindow: { kind: "combat-chain-continuation" as const, role: "attacker" as const },
      combat: {
        ...base.combat,
        step: "resolution" as const,
        activeLink: { ...base.combat.activeLink, damageResolved: true },
      },
      cardDefinitions: {
        ...base.cardDefinitions,
        [card.cardId]: {
          ...base.cardDefinitions[card.cardId]!,
          name: "Lumina Ascension",
          cardType: "action",
          typeLine: "Light Action",
        },
      },
    };
    const pass: FabLegalCommand = { move: "pass", label: "Pass priority", payload: {} };
    const play: FabLegalCommand = {
      move: "begin-play",
      label: "Play Lumina Ascension",
      payload: { instanceId: card.id },
    };
    const onPassPriority = vi.fn();
    const onLegalCommand = vi.fn();
    const view = renderTabletop(resolutionState, {
      readOnly: false,
      animationVersion: 1,
      legalCommands: [pass],
      onPassPriority,
      onLegalCommand,
    });

    const cardButton = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${card.id}"]`)
      ?.closest("button");
    fireEvent.click(cardButton!);
    expect(onPassPriority).toHaveBeenCalledOnce();
    expect(onLegalCommand).not.toHaveBeenCalled();

    view.rerender(
      <HeadlessMantineProvider>
        <FabPresentationTestProvider>
          <FleshAndBloodSimulatorProviders>
            <FleshAndBloodTabletop
              state={{
                ...resolutionState,
                combat: null,
                priorityPlayerId: "player-1",
                priorityWindow: { kind: "ordinary-priority" },
              }}
              viewerId="player-1"
              animationVersion={2}
              readOnly={false}
              legalCommands={[play]}
              onPassPriority={onPassPriority}
              onLegalCommand={onLegalCommand}
            />
          </FleshAndBloodSimulatorProviders>
        </FabPresentationTestProvider>
      </HeadlessMantineProvider>,
    );

    await waitFor(() => expect(onLegalCommand).toHaveBeenCalledWith(play));
    expect(onPassPriority).toHaveBeenCalledOnce();
  });

  it("plays an instant-granted non-attack action without closing the combat chain", () => {
    const base = createCombatFixtureState();
    const card = Object.values(base.cards).find(
      (candidate) => candidate.ownerId === "player-1" && candidate.zone === "hand",
    );
    if (!card || !base.combat?.activeLink) throw new Error("expected a combat hand card");
    const state = {
      ...base,
      priorityWindow: { kind: "combat-chain-continuation" as const, role: "attacker" as const },
      combat: {
        ...base.combat,
        step: "resolution" as const,
        activeLink: { ...base.combat.activeLink, damageResolved: true },
      },
      cardDefinitions: {
        ...base.cardDefinitions,
        [card.cardId]: {
          ...base.cardDefinitions[card.cardId]!,
          name: "Lumina Ascension",
          cardType: "action",
          typeLine: "Light Action",
        },
      },
    };
    const playAsInstant: FabLegalCommand = {
      move: "begin-play",
      label: "Play Lumina Ascension as an instant",
      payload: { instanceId: card.id },
    };
    const onPassPriority = vi.fn();
    const onLegalCommand = vi.fn();
    renderTabletop(state, {
      readOnly: false,
      legalCommands: [playAsInstant],
      onPassPriority,
      onLegalCommand,
    });

    const cardButton = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${card.id}"]`)
      ?.closest("button");
    fireEvent.click(cardButton!);

    expect(onLegalCommand).toHaveBeenCalledWith(playAsInstant);
    expect(onPassPriority).not.toHaveBeenCalled();
  });

  it.each([true, false])(
    "honors hosted pass availability (%s) without local callbacks or legal commands",
    (enabled) => {
      const state = createOpeningFixtureState();
      const onSubmitInteraction = vi.fn();
      const interactionView: EngineInteractionView = {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        gameSlug: "flesh-and-blood",
        actorId: "player-1",
        stateVersion: 7,
        status: "ready",
        actions: [
          {
            id: "fab:control:pass",
            requestId: "fab:7",
            intent: "pass",
            text: { key: "Pass priority" },
            enabled,
            inputs: [],
          },
        ],
      };
      renderTabletop(state, {
        readOnly: false,
        legalCommands: [],
        interactionView,
        onSubmitInteraction,
      });
      expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
      expect(screen.queryByText(/your action phase/i)).toBeNull();
      const button = screen.getByTestId("fab-quick-pass");
      expect(button.hasAttribute("disabled")).toBe(!enabled);
      fireEvent.click(button);
      if (!enabled) {
        expect(onSubmitInteraction).not.toHaveBeenCalled();
        return;
      }
      expect(onSubmitInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          actionId: "fab:control:pass",
          stateVersion: 7,
        }),
      );
    },
  );

  // Hosted projection/interaction contract: public UI submits the exact server command.
  it.each([0, 2, 4])(
    "declares %s hosted defenders atomically without rules priority",
    (blockCount) => {
      const noDefense = blockCount === 0;
      const game = FabTestEngine.start(
        { hero: rhinar, hand: [snatchRed], deck: [snatchRed] },
        {
          hero: bravo,
          hand:
            blockCount === 4
              ? [snatchRed, nimblismBlue, snatchRed, nimblismBlue]
              : [snatchRed, nimblismBlue],
          deck: [snatchRed],
        },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      game.as(rhinar).playAttack(snatchRed);
      const runtime = game.getRuntime();
      const actorId = game.as(bravo).id;
      const state = presentRuntime(runtime, actorId);
      expect(state.priorityPlayerId).toBeNull();
      const interactionView = projectFabInteraction(runtime, actorId).view;
      const onSubmitInteraction = vi.fn((submission: InteractionSubmission) => {
        const command = commandForFabSubmission(runtime, actorId, submission);
        if (!command) throw new Error("Missing server command");
        expect(runtime.dispatch(command.move, actorId, command.payload).accepted).toBe(true);
      });
      renderTabletop(state, {
        viewerId: actorId,
        readOnly: false,
        legalCommands: [],
        interactionView,
        onSubmitInteraction,
      });
      const defenders = Object.values(state.cards).filter(
        (card) => card.ownerId === actorId && card.zone === "hand",
      );
      if (!noDefense) {
        for (const defender of defenders) {
          const button = screen
            .getByTestId("fab-hand-bottom")
            .querySelector(`[data-entity-id="${defender.id}"]`)
            ?.closest("button");
          if (!button) throw new Error("Missing defense card button");
          fireEvent.click(button);
        }
        expect(onSubmitInteraction).not.toHaveBeenCalled();
      }
      const defensePrompt = screen.getByTestId("interaction-resolution-prompt");
      expect(defensePrompt.textContent).toContain("Choose your defenders");
      expect(defensePrompt.textContent).toContain(
        noDefense ? "Select highlighted cards" : `${blockCount} defenders selected`,
      );
      fireEvent.click(
        within(defensePrompt).getByRole("button", {
          name: noDefense ? "Declare no defense" : "Declare defense",
        }),
      );
      if (noDefense) {
        expect(onSubmitInteraction).not.toHaveBeenCalled();
        expect(defensePrompt.textContent).toContain("No cards are selected");
        fireEvent.click(within(defensePrompt).getByRole("button", { name: "Confirm no defense" }));
      }
      expect(onSubmitInteraction).toHaveBeenCalledOnce();
      const next = presentRuntime(runtime, actorId);
      expect(next.combat?.activeLink?.defendingInstanceIds).toEqual(
        noDefense ? [] : expect.arrayContaining(defenders.map((card) => card.id)),
      );
      expect(next.priorityPlayerId).toBe(game.as(rhinar).id);
    },
  );

  it("opens the hosted arsenal choice from End turn instead of passing priority", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [snatchRed], deck: [snatchRed] },
      { hero: bravo, hand: [], deck: [snatchRed] },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const runtime = game.getRuntime();
    const actorId = game.as(rhinar).id;
    const view = projectFabInteraction(runtime, actorId).view;
    const onSubmitInteraction = vi.fn();
    renderTabletop(presentRuntime(runtime, actorId), {
      viewerId: actorId,
      readOnly: false,
      forceMobileLayout: true,
      legalCommands: [],
      interactionView: view,
      onSubmitInteraction,
    });
    fireEvent.click(screen.getByTestId("fab-mobile-end-turn"));
    expect(onSubmitInteraction).toHaveBeenCalledOnce();
    const submission = onSubmitInteraction.mock.calls[0]![0];
    expect(commandForFabSubmission(runtime, actorId, submission)).toMatchObject({
      move: "end-turn",
      payload: { chooseArsenal: true },
    });
  });

  it("shows participant names and offers auto-order for player-order decisions", () => {
    const prompt = "Choose the first player to add simultaneous triggers.";
    const interactionView: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "player-1",
      stateVersion: 4,
      status: "choosing",
      resolution: {
        actingPlayerId: "player-1",
        pendingCount: 1,
        currentEffect: { id: "trigger-first-player", text: { key: prompt } },
        currentStep: {
          index: 1,
          count: 1,
          text: { key: prompt },
          requirement: {
            kind: "option-selection",
            text: { key: prompt },
            required: true,
            min: 1,
            max: 1,
          },
        },
      },
      actions: [
        {
          id: "answer-trigger-first-player",
          requestId: "answer:4",
          intent: "choose-option",
          text: { key: prompt },
          enabled: true,
          inputs: [
            {
              id: "answer",
              kind: "option-selection",
              text: { key: prompt },
              required: true,
              min: 1,
              max: 1,
              options: [
                { id: "player-1", text: { key: "player-1" }, enabled: true },
                { id: "player-2", text: { key: "player-2" }, enabled: true },
              ],
            },
          ],
        },
      ],
    };

    const onLegalCommand = vi.fn();
    renderTabletop(createOpeningFixtureState(), {
      readOnly: false,
      interactionView,
      onSubmitInteraction: vi.fn(),
      legalCommands: [
        {
          move: "set-automation-preferences",
          payload: { autoOrderTriggers: true },
          label: FAB_AUTOMATION_PREFERENCE_LABELS.autoOrderTriggersOn,
        },
      ],
      onLegalCommand,
      participantPresentation: {
        "player-1": { displayName: "Mina" },
        "player-2": { displayName: "Practice bot" },
      },
    });

    const decision = screen.getByTestId("interaction-resolution-prompt");
    expect(within(decision).getByRole("radio", { name: "Mina" })).not.toBeNull();
    expect(within(decision).getByRole("radio", { name: "Practice bot" })).not.toBeNull();
    expect(within(decision).queryByRole("radio", { name: "player-1" })).toBeNull();
    expect(within(decision).queryByRole("radio", { name: "player-2" })).toBeNull();
    fireEvent.click(within(decision).getByRole("button", { name: "Auto-order" }));
    expect(onLegalCommand).toHaveBeenCalledWith({
      move: "set-automation-preferences",
      payload: { autoOrderTriggers: true },
      label: FAB_AUTOMATION_PREFERENCE_LABELS.autoOrderTriggersOn,
    });
  });

  it("renders a prompt source from stable definition identity when its physical card is absent", () => {
    const state = createOpeningFixtureState();
    const equipment = Object.values(state.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "chest",
    );
    expect(equipment).toBeDefined();
    state.cardDefinitions[equipment!.cardId] = {
      ...state.cardDefinitions[equipment!.cardId]!,
      printedText: "The next attack action card you play costs {r} less.",
    };
    const equipmentName = state.cardDefinitions[equipment!.cardId]!.name;
    const equipmentText = state.cardDefinitions[equipment!.cardId]!.printedText;
    expect(equipmentText).toBeDefined();
    const stateWithoutSource = {
      ...state,
      cards: Object.fromEntries(
        Object.entries(state.cards).filter(([instanceId]) => instanceId !== equipment!.id),
      ),
    };
    const prompt = `Use the optional effect of ${equipmentName}?`;
    const interactionView: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "player-1",
      stateVersion: 4,
      status: "choosing",
      resolution: {
        actingPlayerId: "player-1",
        pendingCount: 1,
        currentEffect: {
          id: "optional-trigger",
          text: { key: prompt },
          source: {
            kind: "card",
            instanceId: equipment!.id,
            definitionId: equipment!.cardId,
            ownerId: equipment!.ownerId,
          },
        },
        currentStep: {
          index: 1,
          count: 1,
          text: { key: prompt },
          requirement: {
            kind: "option-selection",
            text: { key: prompt },
            required: true,
            min: 1,
            max: 1,
          },
        },
      },
      actions: [
        {
          id: "answer-optional-trigger",
          requestId: "answer:4",
          intent: "choose-option",
          text: { key: prompt },
          enabled: true,
          inputs: [
            {
              id: "answer",
              kind: "option-selection",
              text: { key: prompt },
              required: true,
              min: 1,
              max: 1,
              options: [
                { id: "decline", text: { key: "Don't use it" }, enabled: true },
                { id: "accept", text: { key: "Use it" }, enabled: true },
              ],
            },
          ],
        },
      ],
    };

    const tabletop = () => (
      <FabPresentationTestProvider>
        <FleshAndBloodSimulatorProviders>
          <FleshAndBloodTabletop
            state={stateWithoutSource}
            viewerId="player-1"
            readOnly={false}
            forceMobileLayout={false}
            interactionView={interactionView}
            onSubmitInteraction={vi.fn()}
          />
        </FleshAndBloodSimulatorProviders>
      </FabPresentationTestProvider>
    );
    const view = render(tabletop());

    const reference = within(screen.getByTestId("interaction-resolution-prompt")).getByRole(
      "button",
      { name: equipmentName },
    );
    fireEvent.mouseEnter(reference);
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");

    expect(
      within(screen.getByTestId("interaction-resolution-prompt")).queryByText(equipmentText!),
    ).toBeNull();

    // A pending prompt must not clear hand inspection on the next board render.
    const handCard = screen.getByTestId("fab-hand-bottom").querySelector("[data-fab-preview-id]");
    expect(handCard).not.toBeNull();
    fireEvent.mouseEnter(handCard!);
    const preview = screen.getByTestId("fab-card-preview");
    const inspectedText = preview.textContent;
    expect(preview.getAttribute("data-visible")).toBe("true");
    view.rerender(tabletop());
    expect(preview.getAttribute("data-visible")).toBe("true");
    expect(preview.textContent).toBe(inspectedText);
    fireEvent.mouseLeave(handCard!);
    expect(preview.getAttribute("data-visible")).toBeNull();
    fireEvent.click(
      within(screen.getByTestId("interaction-resolution-prompt")).getByRole("button", {
        name: "Prompt controls",
      }),
    );
    const showDetails = screen.getByRole("button", { name: /Show details/ });
    const detailsId = showDetails.getAttribute("aria-controls");
    expect(detailsId).toBeTruthy();
    fireEvent.click(showDetails);
    const details = document.getElementById(detailsId!);
    expect(details?.textContent).toContain(equipmentText!.split("{r}")[0]);
    expect(within(details!).getByTestId("fab-icon-resource")).not.toBeNull();
  });

  it("resolves an optional hand-card effect by clicking the highlighted card once", () => {
    const state = createOpeningFixtureState();
    const handCards = Object.values(state.cards).filter(
      (card) => card.ownerId === "player-1" && card.zone === "hand",
    );
    const [firstChoice, secondChoice] = handCards;
    expect(firstChoice).toBeDefined();
    expect(secondChoice).toBeDefined();
    const prompt = "You may put a card from your hand on the bottom of your deck.";
    const interactionView: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "player-1",
      stateVersion: 4,
      status: "choosing",
      resolution: {
        actingPlayerId: "player-1",
        pendingCount: 1,
        currentEffect: { id: "optional-hand-cycle", text: { key: prompt } },
        currentStep: {
          index: 1,
          count: 1,
          text: { key: prompt },
          requirement: { kind: "boolean", text: { key: prompt }, required: true },
        },
      },
      actions: [
        {
          id: "answer-optional-hand-cycle",
          requestId: "answer:4",
          intent: "choose-option",
          text: { key: prompt },
          enabled: true,
          inputs: [
            {
              id: "use-effect",
              kind: "boolean",
              text: { key: prompt },
              required: true,
              trueText: { key: "Use it" },
              falseText: { key: "Skip it" },
            },
            {
              id: "card",
              kind: "entity-selection",
              role: "target",
              entityKinds: ["card"],
              text: { key: "Choose a card from your hand." },
              required: false,
              min: 0,
              max: 1,
              ordered: false,
              candidates: [firstChoice!, secondChoice!].map((card) => ({
                entity: {
                  kind: "card",
                  instanceId: card.id,
                  definitionId: card.cardId,
                  ownerId: card.ownerId,
                  zoneId: `${card.ownerId}:hand`,
                },
                text: { key: state.cardDefinitions[card.cardId]?.name ?? card.id },
                enabled: true,
              })),
              requiredWhen: [{ all: [{ inputId: "use-effect", value: true }] }],
            },
          ],
        },
      ],
    };
    const onSubmitInteraction = vi.fn();

    renderTabletop(state, {
      readOnly: false,
      interactionView,
      onSubmitInteraction,
    });

    const choice = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${firstChoice!.id}"]`)
      ?.closest("button");
    expect(choice).not.toBeNull();
    expect(
      choice?.querySelector('[data-card-interaction="actionable"]') ??
        choice?.closest('[data-card-interaction="actionable"]'),
    ).not.toBeNull();

    fireEvent.click(choice!);

    expect(onSubmitInteraction).toHaveBeenCalledTimes(1);
    expect(onSubmitInteraction).toHaveBeenCalledWith(
      expect.objectContaining({
        actionId: "answer-optional-hand-cycle",
        values: { "use-effect": true, card: [firstChoice!.id] },
      }),
    );
  });

  it("keeps selected defenders in hand until their committed transfer settles", async () => {
    const state = createCombatFixtureState();
    const defender = Object.values(state.cards).find(
      (card) => card.ownerId === "player-2" && card.zone === "hand",
    );
    if (!defender) throw new Error("expected a real authored defender in hand");
    const command: FabLegalCommand = {
      move: "defend",
      label: `Defend with ${defender.id}`,
      payload: { instanceIds: [defender.id] },
    };
    const onLegalCommand = vi.fn();
    const onTransitionSettled = vi.fn();
    const renderTransition = (
      nextState: typeof state,
      animationTransition?: import("./FleshAndBloodTabletop").FabAnimationTransition,
    ) => (
      <HeadlessMantineProvider>
        <FabPresentationTestProvider>
          <FleshAndBloodSimulatorProviders>
            <FleshAndBloodTabletop
              sessionKey="fab:test:reconciled-defense-settlement"
              state={nextState}
              animationVersion={animationTransition?.version ?? 0}
              animationTransition={animationTransition}
              viewerId="player-2"
              readOnly={false}
              legalCommands={[command]}
              onLegalCommand={onLegalCommand}
              onTransitionSettled={onTransitionSettled}
            />
          </FleshAndBloodSimulatorProviders>
        </FabPresentationTestProvider>
      </HeadlessMantineProvider>
    );
    const view = render(renderTransition(state));
    const defenderButton = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${defender.id}"]`)
      ?.closest("button");
    if (!(defenderButton instanceof HTMLButtonElement)) {
      throw new Error("expected the authored defender to be selectable");
    }
    fireEvent.click(defenderButton);
    expect(
      screen.getByTestId("fab-hand-bottom").querySelector(`[data-entity-id="${defender.id}"]`),
    ).not.toBeNull();
    fireEvent.click(screen.getByTestId("fab-action-pass-priority"));
    expect(onLegalCommand).toHaveBeenCalledWith(command);

    const committedState = {
      ...state,
      cards: {
        ...state.cards,
        [defender.id]: { ...defender, zone: "combat-chain" as const },
      },
    };
    const correlationId = "fab:test:declare-defense";
    view.rerender(
      renderTransition(committedState, {
        version: 1,
        correlationId,
        mode: "enqueue",
        plan: {
          id: "declare-defense",
          version: 2,
          steps: [
            {
              id: "committed-defender",
              type: "entityTransfer",
              entity: { kind: "entity", id: defender.id },
              from: { kind: "zone", id: "player-2:hand", ownerId: "player-2" },
              to: {
                kind: "zone",
                id: "player-2:combat-chain",
                ownerId: "player-2",
              },
              sourceFace: "hidden",
              destinationFace: "public",
              startAtMs: 0,
            },
          ],
        },
      }),
    );

    await waitFor(() => {
      expect(onTransitionSettled).toHaveBeenCalledWith(expect.objectContaining({ correlationId }));
    });
  });

  it.each(["graveyard", "banished"] as const)(
    "retains combat-chain sources while cards animate to %s",
    async (destinationZone) => {
      vi.stubGlobal("__TCG_TEST_DISABLE_SIMULATOR_MOTION__", false);
      const state = createCombatFixtureState();
      const combatCards = Object.values(state.cards).filter((card) => card.zone === "combat-chain");
      expect(combatCards.length).toBeGreaterThan(0);
      const cards = { ...state.cards };
      for (const card of combatCards) {
        cards[card.id] = { ...card, zone: destinationZone };
      }
      const settledState: typeof state = { ...state, cards, combat: null };
      const correlationId = "fab:test:close-combat-chain";
      const onTransitionSettled = vi.fn();
      const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
      const renderTransition = (
        nextState: typeof state,
        animationTransition?: import("./FleshAndBloodTabletop").FabAnimationTransition,
      ) => (
        <HeadlessMantineProvider>
          <FabPresentationTestProvider>
            <FleshAndBloodSimulatorProviders>
              <FleshAndBloodTabletop
                sessionKey="fab:test:close-combat-chain"
                state={nextState}
                animationVersion={animationTransition?.version ?? 0}
                animationTransition={animationTransition}
                viewerId="player-1"
                readOnly
                onTransitionSettled={onTransitionSettled}
              />
            </FleshAndBloodSimulatorProviders>
          </FabPresentationTestProvider>
        </HeadlessMantineProvider>
      );
      const view = render(renderTransition(state));

      view.rerender(
        renderTransition(settledState, {
          version: 1,
          correlationId,
          mode: "enqueue",
          plan: {
            id: "close-combat-chain",
            version: 2,
            steps: combatCards.map((card) => ({
              id: `close:${card.id}`,
              type: "entityTransfer" as const,
              entity: { kind: "entity" as const, id: card.id },
              from: {
                kind: "zone" as const,
                id: `${card.ownerId}:combat-chain`,
                ownerId: card.ownerId,
              },
              to: {
                kind: "zone" as const,
                id: `${card.ownerId}:${destinationZone}`,
                ownerId: card.ownerId,
              },
              sourceFace: "public" as const,
              destinationFace: "public" as const,
              startAtMs: 0,
            })),
          },
        }),
      );

      await waitFor(() => expect(onTransitionSettled).toHaveBeenCalled(), { timeout: 5_000 });
      expect(
        warning.mock.calls.filter(([message]) =>
          String(message).includes("missing-spatial-visual"),
        ),
      ).toEqual([]);
    },
  );

  it("uses pile anchors when multiple graveyard cards animate to banished", async () => {
    vi.stubGlobal("__TCG_TEST_DISABLE_SIMULATOR_MOTION__", false);
    const base = createCombatFixtureState();
    const movingCards = Object.values(base.cards).filter((card) => card.zone === "combat-chain");
    expect(movingCards.length).toBeGreaterThan(1);
    const sourceCards = { ...base.cards };
    const destinationCards = { ...base.cards };
    for (const card of movingCards) {
      sourceCards[card.id] = { ...card, zone: "graveyard" };
      destinationCards[card.id] = { ...card, zone: "banished" };
    }
    const sourceState: typeof base = { ...base, cards: sourceCards, combat: null };
    const destinationState: typeof base = { ...base, cards: destinationCards, combat: null };
    const onTransitionSettled = vi.fn();
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const renderTransition = (
      state: typeof base,
      animationTransition?: import("./FleshAndBloodTabletop").FabAnimationTransition,
    ) => (
      <HeadlessMantineProvider>
        <FabPresentationTestProvider>
          <FleshAndBloodSimulatorProviders>
            <FleshAndBloodTabletop
              sessionKey="fab:test:graveyard-to-banished"
              state={state}
              animationVersion={animationTransition?.version ?? 0}
              animationTransition={animationTransition}
              viewerId="player-1"
              readOnly
              onTransitionSettled={onTransitionSettled}
            />
          </FleshAndBloodSimulatorProviders>
        </FabPresentationTestProvider>
      </HeadlessMantineProvider>
    );
    const view = render(renderTransition(sourceState));

    view.rerender(
      renderTransition(destinationState, {
        version: 1,
        correlationId: "fab:test:pile-transfer",
        mode: "enqueue",
        plan: {
          id: "pile-transfer",
          version: 2,
          steps: movingCards.map((card) => ({
            id: `banish:${card.id}`,
            type: "entityTransfer" as const,
            entity: { kind: "entity" as const, id: card.id },
            from: {
              kind: "zone" as const,
              id: `${card.ownerId}:graveyard`,
              ownerId: card.ownerId,
            },
            to: {
              kind: "zone" as const,
              id: `${card.ownerId}:banished`,
              ownerId: card.ownerId,
            },
            sourceFace: "public" as const,
            destinationFace: "public" as const,
          })),
        },
      }),
    );

    await waitFor(() => expect(onTransitionSettled).toHaveBeenCalled(), { timeout: 5_000 });
    expect(
      warning.mock.calls.filter(([message]) => String(message).includes("missing-spatial-visual")),
    ).toEqual([]);
  });

  it("omits zero-value mobile asset badges", () => {
    const { rerender } = render(
      <MobileAssetPills
        playerId="player-2"
        resourcePoints={0}
        chiPoints={0}
        actionPoints={0}
        owner="Opponent"
      />,
    );

    expect(screen.queryByLabelText("Opponent assets")).toBeNull();

    rerender(
      <MobileAssetPills
        playerId="player-2"
        resourcePoints={0}
        chiPoints={0}
        actionPoints={1}
        owner="Opponent"
      />,
    );

    const assets = screen.getByLabelText("Opponent assets");
    expect(assets.querySelector('[data-asset="chi"]')).toBeNull();
    expect(assets.querySelector('[data-asset="action-points"]')).not.toBeNull();
  });

  it("derives the mobile primary verb from decisions and legal commands", () => {
    const base = {
      sidebarOpen: false,
      readOnly: false,
      terminal: false,
      controlsDisabled: false,
      hasOwnedDecision: false,
      hasPriority: true,
      hasTurn: true,
      hasCardActions: true,
      canOpenActions: true,
      canPass: true,
      canEndTurn: true,
      hasMatchHistory: true,
    } as const;
    const defend: FabLegalCommand = {
      move: "defend",
      label: "Defend with Sink Below",
      payload: { instanceIds: ["sink-below"] },
    };

    expect(deriveFabMobileRailAction({ ...base, legalCommands: [defend] })).toEqual({
      kind: "pass",
      label: "Declare defense",
    });
    expect(
      deriveFabMobileRailAction({ ...base, hasOwnedDecision: true, legalCommands: [defend] }),
    ).toEqual({ kind: "choice", label: "Resolve choice" });
    expect(
      deriveFabMobileRailAction({
        ...base,
        hasOwnedDecision: true,
        hasDirectOwnedDecision: true,
        legalCommands: [defend],
      }),
    ).toEqual({ kind: "status", label: "Choose an outcome above", tone: "waiting" });
    expect(
      deriveFabMobileRailAction({
        ...base,
        hasPriority: false,
        hasTurn: false,
        legalCommands: [],
      }),
    ).toEqual({ kind: "status", label: "Waiting", tone: "waiting" });
  });

  it("composes Dromai's public special chrome in the permanent-card area", () => {
    render(
      <HeroSpecialArea
        heroName="Dromai, Ash Artist"
        permanentIds={["ash-1", "ash-2", "ashwing"]}
        banishedIds={[]}
        cardMetadata={
          new Map([
            ["ash-1", { name: "Ash", type: "token" }],
            ["ash-2", { name: "Ash", type: "token" }],
            ["ashwing", { name: "Aether Ashwing", type: "ally" }],
          ])
        }
        projection={{ statuses: ["Played red this turn"] }}
        side="bottom"
      />,
    );

    const special = screen.getByTestId("fab-hero-special-bottom");
    expect(special.getAttribute("data-hero-special")).toBe("dromai");
    expect(within(special).getByText("Ash")).not.toBeNull();
    expect(within(special).getByText("×2")).not.toBeNull();
    expect(within(special).getByText(/Played red/i)).not.toBeNull();
  });

  it("selects the moniker-specific Prism family instead of the first Prism entry", () => {
    render(
      <HeroSpecialArea
        heroName="Prism, Sculptor of Arc Light"
        permanentIds={[]}
        banishedIds={[]}
        side="bottom"
      />,
    );

    expect(screen.getByTestId("fab-hero-special-bottom").getAttribute("data-hero-special")).toBe(
      "prism-sculptor",
    );
  });

  it("renders a visual-acceptance preview for every cataloged hero family", () => {
    render(<HeroSpecialPreviewGallery />);
    expect(
      screen.getByTestId("fab-hero-special-gallery").querySelectorAll("[data-hero-id]"),
    ).toHaveLength(HERO_SPECIAL_UI_CATALOG.length);
    expect(screen.getByTestId("fab-hero-special-preview-dromai").getAttribute("href")).toBe(
      "/flesh-and-blood/simulator/tests/hero-special-dromai",
    );
  });

  it("renders both seats, equipped zones, populated piles, and an empty combat chain", () => {
    renderTabletop(createOpeningFixtureState());

    const board = screen.getByTestId("fab-board");
    expect(board).not.toBeNull();
    expect(board.getAttribute("data-card-crop")).toBe("art-square");
    expect(board.getAttribute("data-turn-owner")).toBe("self");
    expect(board.getAttribute("data-priority-owner")).toBe("self");
    expect(screen.getByTestId("fab-player-top")).not.toBeNull();
    expect(screen.getByTestId("fab-player-bottom")).not.toBeNull();
    expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-state")).toBe("empty");
    expect(screen.queryByTestId("fab-chain-summary")).toBeNull();

    const bottom = screen.getByTestId("fab-player-bottom");
    expect(board.querySelector(".fab-player-status")).toBeNull();
    expect(within(bottom).getByTestId("fab-asset-life").textContent).toMatch(/\d/);
    expect(within(bottom).getByTestId("fab-asset-resources").textContent).toMatch(/\d/);
    expect(within(bottom).getAllByTestId("fab-icon-life").length).toBeGreaterThan(0);
    expect(bottom.querySelectorAll('[data-testid="fab-icon-resource"]').length).toBeGreaterThan(0);
    expect(bottom.querySelector('[data-zone="deck"]')).not.toBeNull();
    expect(bottom.querySelector('[data-zone="pitch"]')).not.toBeNull();
    expect(bottom.querySelector('[data-zone="graveyard"]')).not.toBeNull();
    expect(bottom.querySelector('[data-zone="banished"]')).not.toBeNull();
    expect(bottom.querySelector('[data-zone="arsenal"]')).not.toBeNull();
    for (const zone of ["pitch", "graveyard", "banished"]) {
      expect(
        bottom.querySelector(`[data-zone="${zone}"] [data-fab-card-frame="tactical"]`),
      ).toBeNull();
    }
    expect(bottom.querySelector('[data-zone="hand"]')).toBeNull();
    expect(bottom.querySelector(".fab-seat-grid")).not.toBeNull();
    const handBottom = screen.getByTestId("fab-hand-bottom");
    expect(handBottom).not.toBeNull();
    expect(handBottom.closest('[data-testid="fab-desktop-hand-area"]')).not.toBeNull();
    const handTop = screen.getByTestId("fab-hand-top");
    expect(handTop.closest('[data-testid="fab-board"]')).not.toBeNull();
    expect(handBottom.querySelector('[data-fan-style="shallow"]')).not.toBeNull();
    const tacticalHandCards = handBottom.querySelectorAll('[data-fab-card-frame="tactical"]');
    expect(tacticalHandCards).toHaveLength(4);
    const firstHandCard = tacticalHandCards[0];
    expect(firstHandCard?.querySelector('[data-decoration-id^="fab-pitch-"]')).not.toBeNull();
    expect(firstHandCard?.querySelector('[data-decoration-id="fab-frame-cost"]')).not.toBeNull();
    expect(firstHandCard?.querySelector('[data-decoration-id="fab-frame-power"]')).not.toBeNull();
    expect(firstHandCard?.querySelector('[data-decoration-id="fab-frame-defense"]')).not.toBeNull();
    const renderedEntityIds = [...handBottom.querySelectorAll("[data-entity-id]")].map((el) =>
      el.getAttribute("data-entity-id"),
    );
    const uniqueEntityIds = new Set(renderedEntityIds);
    const expectedHand = Object.values(createOpeningFixtureState().cards).filter(
      (c) => c.ownerId === "player-1" && c.zone === "hand",
    ).length;
    expect(uniqueEntityIds.size).toBe(expectedHand);
  });

  it("renders engine-evaluated cost, power, and defense on a mobile hand card", () => {
    const state = createOpeningFixtureState();
    const handCard = Object.values(state.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "hand",
    );
    if (!handCard) throw new Error("Missing player hand card");

    state.cards[handCard.id] = {
      ...handCard,
      currentNumeric: { cost: 0, power: 9, defense: 7 },
    };
    renderTabletop(state, { forceMobileLayout: true });

    const renderedCard = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${handCard.id}"]`);
    expect(renderedCard?.querySelector('[data-decoration-id="fab-frame-cost"]')?.textContent).toBe(
      "0",
    );
    expect(renderedCard?.querySelector('[data-decoration-id="fab-frame-power"]')?.textContent).toBe(
      "9",
    );
    expect(
      renderedCard?.querySelector('[data-decoration-id="fab-frame-defense"]')?.textContent,
    ).toBe("7");
  });

  it("keeps a publicly revealed opponent hand card face-up without changing hand count", () => {
    const state = createOpeningFixtureState();
    state.cards["opponent-hidden-1"] = {
      id: "opponent-hidden-1",
      cardId: "face-down",
      ownerId: "player-2",
      zone: "hand",
      face: "down",
    };
    state.cards["opponent-hidden-2"] = {
      id: "opponent-hidden-2",
      cardId: "face-down",
      ownerId: "player-2",
      zone: "hand",
      face: "down",
    };

    renderTabletop(state, {
      handReveals: {
        "player-2": [{ entityId: "revealed-pummel", title: "Pummel" }],
      },
    });

    const opponentHand = screen.getByTestId("fab-hand-top");
    expect(opponentHand.getAttribute("aria-label")).toBe("Opponent hand, 6 cards");
    expect(within(opponentHand).getAllByRole("button")).toHaveLength(6);
    expect(opponentHand.querySelector('[data-entity-id="revealed-pummel"]')).not.toBeNull();
    expect(
      within(opponentHand).getByRole("button", { name: /^Pummel, card, player-2/ }),
    ).not.toBeNull();
    const recall = screen.getByTestId("fab-hand-reveal-recall");
    expect(recall.getAttribute("aria-label")).toBe("Revealed in opponent hand: Pummel");
    expect(within(recall).getByText("Revealed in hand")).not.toBeNull();
    expect(within(recall).getAllByText("Pummel")).not.toHaveLength(0);
    expect(recall.querySelector('[data-revealed-entity-id="revealed-pummel"]')).not.toBeNull();
  });

  it("keeps the desktop sidebar and removes mobile rails at laptop width", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1024,
    });
    renderTabletop(createOpeningFixtureState());

    await Promise.resolve();
    window.dispatchEvent(new Event("resize"));
    await Promise.resolve();

    const tabletop = screen.getByTestId("fab-tabletop");
    expect(tabletop.getAttribute("data-fab-layout")).toBe("desktop");
    expect(tabletop.getAttribute("data-layout")).toBe("desktop");
    expect(screen.getByLabelText("Match panel")).not.toBeNull();
    expect(screen.queryByTestId("fab-mobile-top-rail")).toBeNull();
    expect(screen.queryByTestId("fab-mobile-bottom-rail")).toBeNull();
  });

  it("keeps active rules effects in the horizontal center rail and explains them in context", async () => {
    const state: FabPresentationState = {
      ...createOpeningFixtureState(),
      activeEffects: [
        {
          id: "seismic-surge-discount",
          controllerId: "player-1",
          sourceEntityId: "seismic-surge-token",
          sourceLabel: "Seismic Surge",
          label: "Cost −1",
          detail: "Your next Guardian attack action card costs 1 less. Source: Seismic Surge.",
          tone: "buff",
          durationLabel: "This turn",
          status: "armed",
          remainingUses: 1,
          scopes: [{ kind: "future-object", playerId: "player-1" }],
        },
      ],
    };

    renderTabletop(state);

    const rail = screen.getByTestId("fab-active-effects-rail");
    const source = within(rail).getByTestId("fab-active-effect-source-seismic-surge-discount");
    expect(source.getAttribute("aria-label")).toContain("Seismic Surge: Cost −1");
    expect(within(rail).getByText("You")).not.toBeNull();
    expect(within(rail).getByText("Opponent")).not.toBeNull();
    const selfEffectsButton = within(rail).getByTestId("fab-active-effects-self-button");
    const opponentEffectsButton = within(rail).getByTestId("fab-active-effects-opponent-button");
    expect(selfEffectsButton.getAttribute("aria-label")).toBe(
      "You have 1 active effect. Open active effects",
    );
    expect(opponentEffectsButton.getAttribute("aria-label")).toBe(
      "Opponent has 0 active effects. Open active effects",
    );
    expect(within(rail).queryByRole("button", { name: "Open all 1 active effect" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Active effects" })).toBeNull();

    fireEvent.pointerEnter(source);
    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");
      expect(within(tooltip).getByText("Cost −1")).not.toBeNull();
      expect(
        within(tooltip).getByText(
          "Your next Guardian attack action card costs 1 less. Source: Seismic Surge.",
        ),
      ).not.toBeNull();
    });

    fireEvent.click(selfEffectsButton);

    const inspector = screen.getByTestId("fab-active-effects-inspector");
    expect(within(inspector).getByRole("heading", { name: "Active effects" })).not.toBeNull();
    expect(
      within(inspector).getByText(
        "Your next Guardian attack action card costs 1 less. Source: Seismic Surge.",
      ),
    ).not.toBeNull();
    expect(screen.getByText("1 use remaining")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Close active effects" }));
    expect(screen.queryByTestId("fab-active-effects-inspector")).toBeNull();
  });

  it("opens a readable card preview from an active effect source image", async () => {
    const effect = {
      id: "toughness-defense",
      controllerId: "player-1",
      sourceCanonicalId: "toughness",
      sourceLabel: "Toughness",
      label: "Defense +1",
      detail: "Your next action card gets +1 defense. Source: Toughness.",
      tone: "buff" as const,
      durationLabel: "This combat chain",
      status: "armed" as const,
      remainingUses: 1,
      scopes: [{ kind: "future-object" as const, playerId: "player-1" }],
    };
    const effects = {
      self: [effect],
      opponent: [],
      game: [],
      all: [effect],
      count: 1,
    };

    render(
      <FabCardPreviewProvider>
        <FabActiveEffectsInspector
          open
          mobile
          anchorElement={null}
          effects={effects}
          effectSourceArt={
            new Map([
              [
                effect.id,
                {
                  src: "https://example.test/toughness-board.webp",
                  variant: "no-text",
                  previewEntity: {
                    id: "active-effect-source:toughness-defense",
                    title: "Toughness",
                    subtitle: "Token",
                    kind: "card",
                    ownerId: "player-1",
                    face: "public",
                    states: [],
                    stats: [],
                    traits: [],
                    imageUrl: "https://example.test/toughness.webp",
                    imageAspectRatio: 0.714,
                    dataAttributes: { "data-fab-canonical-id": "toughness" },
                  },
                },
              ],
            ])
          }
          onOpenChange={vi.fn()}
        />
      </FabCardPreviewProvider>,
    );

    const sourcePreview = screen.getByRole("button", { name: "Preview Toughness" });
    fireEvent.mouseEnter(sourcePreview);
    await waitFor(() => {
      expect(screen.getByTestId("fab-card-preview-surface")).not.toBeNull();
    });
  });

  it("shows player effects in the fixed mobile center ledger and opens board-native details", async () => {
    const state: FabPresentationState = {
      ...createOpeningFixtureState(),
      activeEffects: [
        {
          id: "seismic-surge-discount",
          controllerId: "player-1",
          sourceLabel: "Seismic Surge",
          label: "Cost −1",
          detail: "Your next Guardian attack action card costs 1 less. Source: Seismic Surge.",
          tone: "buff",
          durationLabel: "This turn",
          status: "armed",
          remainingUses: 1,
          scopes: [{ kind: "future-object", playerId: "player-1" }],
        },
      ],
    };

    renderTabletop(state, { forceMobileLayout: true });

    const ledger = screen.getByTestId("fab-mobile-effects-ledger");
    expect(ledger.textContent).toContain("OpponentNone");
    expect(ledger.textContent).toContain("YouCost −1");
    expect(screen.queryByTestId("fab-active-effects-your")).toBeNull();
    expect(screen.queryByTestId("fab-active-effects-opponent")).toBeNull();
    expect(
      screen.getByTestId("fab-mobile-bottom-rail").querySelector(".fab-mobile-priority"),
    ).toBeNull();

    fireEvent.click(ledger);

    const inspector = screen.getByTestId("fab-active-effects-inspector");
    expect(within(inspector).getByLabelText("Opponent active effects")).not.toBeNull();
    expect(within(inspector).getByLabelText("You active effects")).not.toBeNull();
    expect(within(inspector).getByLabelText("Game active effects")).not.toBeNull();
    expect(
      screen.getByText(
        "Your next Guardian attack action card costs 1 less. Source: Seismic Surge.",
      ),
    ).not.toBeNull();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByTestId("fab-active-effects-inspector")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(ledger));
  });

  it("opens public desktop piles through the shared zone inspector", () => {
    renderTabletop(createOpeningFixtureState());

    fireEvent.click(
      within(screen.getByTestId("fab-player-bottom")).getByRole("button", {
        name: "Inspect Graveyard, 1 card",
      }),
    );
    const inspector = screen.getByRole("dialog", { name: "Your Graveyard" });
    expect(inspector.getAttribute("aria-modal")).toBeNull();
    expect(
      screen.getByTestId("target-filter-modal-backdrop").getAttribute("data-presentation"),
    ).toBe("nonmodal");
    expect(screen.queryByText("No cards in this zone")).toBeNull();

    const graveyardCard = within(inspector).getByRole("listitem", { name: "Snatch" });
    fireEvent.mouseEnter(graveyardCard);
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
    expect(screen.queryByTestId("card-inspector-popover")).toBeNull();
  });

  it.each([false, true])(
    "keeps the zone drawer open when closing its card preview (mobile: %s)",
    (forceMobileLayout) => {
      renderTabletop(createOpeningFixtureState(), { forceMobileLayout });
      const zoneControl = forceMobileLayout
        ? screen.getByRole("button", { name: "Open Graveyard, 1 card" })
        : within(screen.getByTestId("fab-player-bottom")).getByRole("button", {
            name: "Inspect Graveyard, 1 card",
          });
      fireEvent.click(zoneControl);
      const drawer = screen.getByRole("dialog", { name: "Your Graveyard" });
      fireEvent.mouseEnter(within(drawer).getByRole("listitem", { name: "Snatch" }));
      expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
      fireEvent.mouseLeave(within(drawer).getByTestId("card"));
      expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
      const closePreview = screen.getByRole("button", { name: "Close card preview" });
      fireEvent.pointerDown(closePreview);
      fireEvent.click(closePreview);
      expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBeNull();
      expect(screen.getByRole("dialog", { name: "Your Graveyard" })).toBe(drawer);
      fireEvent.pointerDown(document.body);
      expect(screen.queryByRole("dialog", { name: "Your Graveyard" })).toBeNull();
    },
  );

  it("renders and counts an opponent's face-down banished card without revealing it", () => {
    const state = createOpeningFixtureState();
    const opponentBanishedCard = Object.values(state.cards).find(
      (card) => card.ownerId === "player-2" && card.zone === "banished",
    );
    expect(opponentBanishedCard).toBeDefined();
    if (!opponentBanishedCard) throw new Error("Expected an opponent banished card.");
    state.cards[opponentBanishedCard.id] = {
      ...opponentBanishedCard,
      cardId: "face-down",
      face: "down",
    };

    renderTabletop(state);

    const banishedPile = within(screen.getByTestId("fab-player-top")).getByTestId(
      "player-2:banished-stack",
    );
    expect(banishedPile.getAttribute("data-count")).toBe("1");
    expect(within(banishedPile).getByLabelText("Hidden card").getAttribute("data-face")).toBe(
      "hidden",
    );
    expect(banishedPile.querySelector('img[alt="Hidden card"]')?.getAttribute("src")).toContain(
      "fab-card-back-square.webp",
    );
    fireEvent.click(
      within(screen.getByTestId("fab-player-top")).getByRole("button", {
        name: "Inspect Banished, 1 card",
      }),
    );
    const inspector = screen.getByRole("dialog", { name: "Opponent Banished" });
    expect(within(inspector).getByTestId("target-filter-modal-count").textContent).toBe("1 card");
    const modalCard = within(inspector).getAllByTestId("card")[0]!;
    expect(modalCard.getAttribute("data-face")).toBe("hidden");
    expect(parseCssAspectRatio(modalCard.style.aspectRatio)).toBe(1);
    expect(inspector.querySelector('img[alt="Hidden card"]')?.getAttribute("src")).toContain(
      "fab-card-back-square.webp",
    );
    fireEvent.click(within(inspector).getByRole("button", { name: "Hidden card" }));
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).not.toBe("true");
    expect(screen.queryByTestId("card-inspector-popover")).toBeNull();
  });

  it.each([false, true])(
    "shows each seat's public Blood Debt total on its Banished zone (mobile: %s)",
    async (forceMobileLayout) => {
      const state = createOpeningFixtureState();
      for (const playerId of state.players) {
        const banishedCard = Object.values(state.cards).find(
          (card) => card.ownerId === playerId && card.zone === "banished",
        );
        expect(banishedCard).toBeDefined();
        if (!banishedCard) throw new Error(`Expected a banished card for ${playerId}.`);
        state.cardDefinitions[banishedCard.cardId] = {
          ...state.cardDefinitions[banishedCard.cardId]!,
          isBloodDebt: true,
        };
      }

      renderTabletop(state, { forceMobileLayout });

      await waitFor(() => {
        expect(screen.getByLabelText(/^Your Blood Debt total: 1 public card/)).not.toBeNull();
        expect(screen.getByLabelText(/^Opponent Blood Debt total: 1 public card/)).not.toBeNull();
      });
    },
  );

  it("does not count a face-down Blood Debt card in an opponent's total", async () => {
    const state = createOpeningFixtureState();
    const opponentBanishedCard = Object.values(state.cards).find(
      (card) => card.ownerId === "player-2" && card.zone === "banished",
    );
    expect(opponentBanishedCard).toBeDefined();
    if (!opponentBanishedCard) throw new Error("Expected an opponent banished card.");
    state.cards[opponentBanishedCard.id] = { ...opponentBanishedCard, face: "down" };
    state.cardDefinitions[opponentBanishedCard.cardId] = {
      ...state.cardDefinitions[opponentBanishedCard.cardId]!,
      isBloodDebt: true,
    };

    renderTabletop(state);

    await waitFor(() => {
      expect(screen.queryByLabelText(/^Opponent Blood Debt total:/)).toBeNull();
    });
  });

  it("uses the same square hidden-card treatment in the graveyard pile and inspector", () => {
    const state = createOpeningFixtureState();
    const opponentGraveyardCard = Object.values(state.cards).find(
      (card) => card.ownerId === "player-2" && card.zone === "graveyard",
    );
    expect(opponentGraveyardCard).toBeDefined();
    if (!opponentGraveyardCard) throw new Error("Expected an opponent graveyard card.");
    state.cards[opponentGraveyardCard.id] = {
      ...opponentGraveyardCard,
      face: "down",
    };

    renderTabletop(state);

    const graveyardPile = within(screen.getByTestId("fab-player-top")).getByTestId(
      "player-2:graveyard-stack",
    );
    expect(graveyardPile.querySelector('img[alt="Hidden card"]')?.getAttribute("src")).toContain(
      "fab-card-back-square.webp",
    );

    fireEvent.click(
      within(screen.getByTestId("fab-player-top")).getByRole("button", {
        name: "Inspect Graveyard, 1 card",
      }),
    );
    const inspector = screen.getByRole("dialog", { name: "Opponent Graveyard" });
    expect(within(inspector).getByTestId("card").getAttribute("data-face")).toBe("hidden");
    expect(inspector.querySelector('img[alt="Hidden card"]')?.getAttribute("src")).toContain(
      "fab-card-back-square.webp",
    );
  });

  it("opens the shared zone inspector when the displayed pile card is clicked", () => {
    const state = createOpeningFixtureState();
    const graveyardCard = Object.values(state.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "graveyard",
    );
    expect(graveyardCard).toBeDefined();
    renderTabletop(state);

    const renderedCard = screen
      .getByTestId("fab-player-bottom")
      .querySelector(`[data-entity-id="${graveyardCard!.id}"]`);
    expect(renderedCard).not.toBeNull();
    fireEvent.click(renderedCard!);

    expect(screen.getByRole("dialog", { name: "Your Graveyard" })).not.toBeNull();
    expect(screen.queryByText("No cards in this zone")).toBeNull();
  });

  it.each(["graveyard", "banished"] as const)(
    "lets the %s pile own its displayed card click during a live match",
    (zone) => {
      const state = createOpeningFixtureState();
      const pileCard = Object.values(state.cards).find(
        (card) => card.ownerId === "player-1" && card.zone === zone,
      );
      expect(pileCard).toBeDefined();
      renderTabletop(state, { readOnly: false });

      const renderedCard = screen
        .getByTestId("fab-player-bottom")
        .querySelector(`[data-entity-id="${pileCard!.id}"]`);
      expect(renderedCard).not.toBeNull();
      fireEvent.mouseEnter(renderedCard!.querySelector('[data-testid="card"]') ?? renderedCard!);
      expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
      fireEvent.click(renderedCard!);

      const zoneLabel = zone === "graveyard" ? "Graveyard" : "Banished";
      expect(screen.getByRole("dialog", { name: `Your ${zoneLabel}` })).not.toBeNull();
      expect(screen.queryByTestId("card-inspector-popover")).toBeNull();
    },
  );

  it("opens Banished without playing its top card when several banished cards are actionable", () => {
    const match = getFabEngineScenario("multiple-playable-banished-cards")?.boot();
    if (!match) throw new Error("Missing multiple playable banished cards fixture.");
    const state = presentRuntime(match.runtime, match.player1Id);
    const legalCommands = listLegalCommands(match.runtime, match.player1Id);
    const onLegalCommand = vi.fn();
    renderTabletop(state, {
      readOnly: false,
      viewerId: match.player1Id,
      legalCommands,
      onLegalCommand,
    });

    const banishedCards = Object.values(state.cards).filter(
      (card) => card.ownerId === match.player1Id && card.zone === "banished",
    );
    expect(banishedCards).toHaveLength(3);
    const displayedCard = screen
      .getByTestId(`${match.player1Id}:banished-stack`)
      .querySelector("[data-entity-id]");
    expect(displayedCard).not.toBeNull();

    fireEvent.click(displayedCard!);

    expect(onLegalCommand).not.toHaveBeenCalled();
    const inspector = screen.getByRole("dialog", { name: "Your Banished" });
    expect(inspector.querySelectorAll('[role="listitem"]')).toHaveLength(3);
    expect(
      within(screen.getByTestId("fab-player-bottom")).getByRole("button", {
        name: "Inspect Banished, 3 cards, 3 Blood Debt, 3 available now",
      }),
    ).not.toBeNull();

    fireEvent.click(within(inspector).getByRole("button", { name: /^Vantom Wraith,/ }));

    expect(onLegalCommand).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog", { name: "Your Banished" })).toBeNull();
  });

  it("shows a public equipment counter and lets the equipment zone own an idle click", () => {
    const state = createOpeningFixtureState();
    const opponentTunic = Object.values(state.cards).find(
      (card) => card.ownerId === "player-2" && card.zone === "chest",
    );
    expect(opponentTunic).toBeDefined();
    if (!opponentTunic) throw new Error("Expected opponent chest equipment.");
    state.cards[opponentTunic.id] = {
      ...opponentTunic,
      counters: [{ label: "energy", count: 1 }],
    };

    renderTabletop(state);

    const renderedTunic = screen
      .getByTestId("fab-player-top")
      .querySelector(`[data-entity-id="${opponentTunic.id}"]`);
    expect(renderedTunic?.getAttribute("data-fab-counter-summary")).toBe("energy ×1");
    fireEvent.click(renderedTunic!);

    const inspector = screen.getByRole("dialog", { name: "Opponent Chest" });
    expect(inspector).not.toBeNull();
    expect(within(inspector).getByTestId("card").getAttribute("data-fab-counter-summary")).toBe(
      "energy ×1",
    );
  });

  it("highlights legal cards on the desktop board without exposing hidden opponent cards", () => {
    const state = createOpeningFixtureState();
    const ownHandCard = Object.values(state.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "hand",
    );
    expect(ownHandCard).toBeDefined();

    renderTabletop(state, {
      legalCommands: [
        { move: "begin-play", label: "Play a card", payload: { instanceId: ownHandCard!.id } },
      ],
    });

    const ownCard = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${ownHandCard!.id}"]`)
      ?.closest("button")
      ?.querySelector("[data-card-interaction]");
    expect(ownCard?.getAttribute("data-card-interaction")).toBe("actionable");
    expect(screen.queryByText("1 legal card highlighted")).toBeNull();
    expect(screen.getByTestId("fab-hand-top").querySelector('[data-face="hidden"]')).not.toBeNull();
  });

  it("dispatches one card action directly and uses the board for multiple attack targets", () => {
    const state = createClosedWithPermanentsFixtureState();
    const ownHandCard = Object.values(state.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "hand",
    )!;
    const onLegalCommand = vi.fn();
    const single: FabLegalCommand = {
      move: "begin-play",
      label: "Play card",
      payload: { instanceId: ownHandCard.id },
    };
    const view = renderTabletop(state, {
      readOnly: false,
      legalCommands: [single],
      onLegalCommand,
    });
    const cardButton = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${ownHandCard.id}"]`)
      ?.closest("button");
    fireEvent.click(cardButton!);
    expect(onLegalCommand).toHaveBeenCalledWith(single);

    const opponentTargets = Object.values(state.cards).filter(
      (card) => card.ownerId === "player-2" && card.zone === "permanent",
    );
    expect(opponentTargets.length).toBeGreaterThanOrEqual(2);
    const firstTarget = opponentTargets[0]!;
    const secondTarget = opponentTargets[1]!;
    const firstTargetCommand: FabLegalCommand = {
      move: "begin-play",
      label: "Play at first permanent",
      payload: { instanceId: ownHandCard.id, target: firstTarget.id },
    };
    const secondTargetCommand: FabLegalCommand = {
      move: "begin-play",
      label: "Play at second permanent",
      payload: { instanceId: ownHandCard.id, target: secondTarget.id },
    };
    view.rerender(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          state={state}
          viewerId="player-1"
          legalCommands={[firstTargetCommand, secondTargetCommand]}
          onLegalCommand={onLegalCommand}
        />
      </FleshAndBloodSimulatorProviders>,
    );
    const variantButton = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${ownHandCard.id}"]`)
      ?.closest("button");
    fireEvent.click(variantButton!);
    const cardName = state.cardDefinitions[ownHandCard.cardId]?.name;
    expect(screen.queryByTestId("card-context-menu")).toBeNull();
    expect(screen.getByTestId("interaction-resolution-prompt").textContent).toContain(
      `Choose an attack target for: ${cardName}`,
    );
    for (const target of [firstTarget, secondTarget]) {
      expect(
        document.querySelector(
          `[data-card-interaction="actionable"] [data-sim-entity-id="${target.id}"]`,
        ),
      ).not.toBeNull();
    }
    fireEvent.click(
      document.querySelector(
        `[data-card-interaction="actionable"] [data-sim-entity-id="${secondTarget.id}"]`,
      )!,
    );
    expect(onLegalCommand).toHaveBeenLastCalledWith(secondTargetCommand);
    expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
  });

  it("plays an actionable attack action card from arsenal", () => {
    const base = createOpeningFixtureState();
    const handCard = Object.values(base.cards).find(
      (card) =>
        card.ownerId === "player-1" &&
        card.zone === "hand" &&
        base.cardDefinitions[card.cardId]?.typeLine?.includes("Attack"),
    );
    if (!handCard) throw new Error("expected an Attack card to move from hand to arsenal");
    const arsenalCard = { ...handCard, zone: "arsenal" as const };
    const state = {
      ...base,
      cards: { ...base.cards, [arsenalCard.id]: arsenalCard },
    };
    const onLegalCommand = vi.fn();
    const playFromArsenal: FabLegalCommand = {
      move: "begin-play",
      label: "Play attack from arsenal",
      payload: { instanceId: arsenalCard.id, from: "arsenal" },
    };
    renderTabletop(state, {
      readOnly: false,
      legalCommands: [playFromArsenal],
      onLegalCommand,
    });

    const arsenal = screen.getByTestId("fab-player-bottom").querySelector(".fab-zone-arsenal");
    const arsenalButton = arsenal?.querySelector(`[data-entity-id="${arsenalCard.id}"] button`);
    if (!(arsenalButton instanceof HTMLButtonElement)) {
      throw new Error("expected the Arsenal card to be actionable");
    }

    fireEvent.click(arsenalButton);

    expect(onLegalCommand).toHaveBeenCalledWith(playFromArsenal);
    expect(screen.queryByTestId("card-context-menu")).toBeNull();
  });

  it("closes the desktop hover preview after selecting a card from hand", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(any-hover: hover)",
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }));
    const state = createOpeningFixtureState();
    const ownHandCard = Object.values(state.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "hand",
    )!;
    const stateWithArtwork = {
      ...state,
      cardDefinitions: {
        ...state.cardDefinitions,
        [ownHandCard.cardId]: {
          ...state.cardDefinitions[ownHandCard.cardId],
          imageUrl: "https://example.test/fab-hand-card.webp",
        },
      },
    };
    const command: FabLegalCommand = {
      move: "begin-play",
      label: "Play card",
      payload: { instanceId: ownHandCard.id },
    };
    const onLegalCommand = vi.fn();
    renderTabletop(stateWithArtwork, {
      readOnly: false,
      legalCommands: [command],
      onLegalCommand,
    });

    const handCard = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${ownHandCard.id}"]`);
    const cardButton = handCard?.closest("button");
    const cardFace = cardButton?.querySelector('[data-testid="card"]');
    expect(handCard).not.toBeNull();
    expect(cardButton).not.toBeNull();
    expect(cardFace).not.toBeNull();

    fireEvent.mouseEnter(cardFace!);
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");

    fireEvent.click(cardButton!);

    expect(onLegalCommand).toHaveBeenCalledWith(command);
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).not.toBe("true");
  });

  it("keeps a deliberately selected hover preview open after a card action", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(any-hover: hover)",
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }));
    const state = createOpeningFixtureState();
    const ownHandCards = Object.values(state.cards).filter(
      (card) => card.ownerId === "player-1" && card.zone === "hand",
    );
    const selectedCard = ownHandCards[0]!;
    const inspectedCard = ownHandCards[1]!;
    const command: FabLegalCommand = {
      move: "begin-play",
      label: "Play card",
      payload: { instanceId: selectedCard.id },
    };
    renderTabletop(state, {
      readOnly: false,
      legalCommands: [command],
      onLegalCommand: vi.fn(),
    });

    const selectedCardButton = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${selectedCard.id}"]`)
      ?.closest("button");
    const inspectedCardFace = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${inspectedCard.id}"] [data-testid="card"]`);
    expect(selectedCardButton).not.toBeNull();
    expect(inspectedCardFace).not.toBeNull();

    fireEvent.click(selectedCardButton!);
    fireEvent.mouseEnter(inspectedCardFace!);

    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
  });

  it("keeps the hover preview closed when playing Ravenous Rabble reflows the desktop hand", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(any-hover: hover)",
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }));
    renderFixtureRoute("dual-target-open");
    await screen.findByTestId("fab-practice-page", {}, { timeout: 15_000 });

    const ravenous = screen.getAllByRole("button", {
      name: /^Ravenous Rabble, card, player-1,/,
    })[0]!;
    fireEvent.mouseEnter(ravenous.querySelector('[data-testid="card"]')!);
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");

    fireEvent.click(ravenous);

    await waitFor(() => {
      expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-mode")).toBe(
        "active-link",
      );
      expect(screen.getByTestId("fab-chain-attacker").textContent).toContain("Ravenous Rabble");
      expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).not.toBe("true");
    });
  }, 30_000);

  it("shows announced Wrecker Romp in the stack and routes a hand click to payment", () => {
    const game = FabTestEngine.create({
      player1: {
        heroCardId: catalogIds.rhinar,
        hand: [catalogIds.wreckerRomp, catalogIds.primevalBellow, catalogIds.barragingBeatdown],
        deck: 4,
      },
      player2: { heroCardId: catalogIds.bravo, hand: [], deck: 4 },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    });
    const runtime = game.getRuntime();
    const wrecker = game.findCardInZone("player-1", "hand", catalogIds.wreckerRomp);
    const red = game.findCardInZone("player-1", "hand", catalogIds.primevalBellow);
    expect(
      runtime.dispatch("begin-play", "player-1", {
        instanceId: wrecker,
        target: "player-2",
      }).accepted,
    ).toBe(true);
    const interactionView = projectFabInteraction(runtime, "player-1").view;
    const onSubmitInteraction = vi.fn();

    render(
      <HeadlessMantineProvider>
        <FabPresentationTestProvider>
          <FleshAndBloodSimulatorProviders>
            <FleshAndBloodTabletop
              state={presentRuntime(runtime, "player-1")}
              viewerId="player-1"
              interactionView={interactionView}
              onSubmitInteraction={onSubmitInteraction}
            />
          </FleshAndBloodSimulatorProviders>
        </FabPresentationTestProvider>
      </HeadlessMantineProvider>,
    );

    expect(
      screen.getAllByText(/Pitch a card to pay 2 remaining resources for Wrecker Romp/).length,
    ).toBeGreaterThan(0);
    const paymentPrompt = screen.getByTestId("interaction-resolution-prompt");
    expect(paymentPrompt.dataset.placement).toBe("bottom");
    expect(within(paymentPrompt).queryByRole("button", { name: "Confirm choice" })).toBeNull();
    expect(
      screen.getByTestId("interaction-resolution-prompt").dataset.reserveBottomTargetArea,
    ).toBe("true");
    const redButton = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${red}"]`)
      ?.closest("button");
    expect(redButton).not.toBeNull();
    expect(
      redButton?.querySelector('[data-card-interaction="actionable"]') ??
        redButton?.closest('[data-card-interaction="actionable"]'),
    ).not.toBeNull();
    fireEvent.click(redButton!);
    expect(onSubmitInteraction).toHaveBeenCalledWith(
      expect.objectContaining({
        actionId: "fab:decision:decision-1",
        protocolVersion: 2,
        stateVersion: 1,
        values: { answer: [red] },
      }),
    );
  });

  it("orders simultaneous triggers in the compact desktop row and confirms the selected order", () => {
    const match = getFabEngineScenario("trigger-decision-lab")?.boot();
    if (!match) throw new Error("Missing trigger decision lab scenario.");
    const interactionView = projectFabInteraction(match.runtime, match.player1Id).view;
    const action = interactionView.actions[0]!;
    const input = action.inputs[0];
    if (input?.kind !== "ordering") throw new Error("Expected trigger ordering input.");
    const [drawTriggerId, destroyAuraTriggerId] = input.candidates.map(
      (candidate) => candidate.entity.instanceId,
    );
    const onSubmitInteraction = vi.fn();

    render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          state={presentRuntime(match.runtime, match.player1Id)}
          viewerId={match.player1Id}
          interactionView={interactionView}
          onSubmitInteraction={onSubmitInteraction}
        />
      </FleshAndBloodSimulatorProviders>,
    );

    const panel = screen.getByTestId("fab-trigger-order-panel");
    const prompt = screen.getByTestId("interaction-resolution-prompt");
    expect(prompt.textContent).toContain("Order your simultaneous triggered abilities");
    expect(within(prompt).queryByRole("button", { name: "Confirm order" })).toBeNull();
    expect(within(panel).getByText("Triggers")).toBeTruthy();
    expect(
      within(panel).getByRole("button", { name: /Resolves first: .*destroy-aura/i }),
    ).toBeTruthy();
    const initiallySecond = within(panel).getByRole("button", {
      name: /Resolves 2: .*optional-draw/i,
    });
    const swapOrder = within(panel).getByRole("button", { name: /Swap order/ });
    fireEvent.click(swapOrder);
    expect(
      within(panel).getByRole("button", { name: /Resolves first: .*optional-draw/i }),
    ).toBeTruthy();
    expect(within(panel).getByRole("status").textContent).toContain("now resolves first");
    fireEvent.click(swapOrder);
    expect(
      within(panel).getByRole("button", { name: /Resolves first: .*destroy-aura/i }),
    ).toBeTruthy();
    fireEvent.click(initiallySecond);

    expect(
      within(panel).getByRole("button", { name: /Resolves first: .*optional-draw/i }),
    ).toBeTruthy();
    fireEvent.click(within(panel).getByRole("button", { name: "Confirm order" }));
    expect(onSubmitInteraction).toHaveBeenCalledWith(
      expect.objectContaining({
        values: { answer: [destroyAuraTriggerId, drawTriggerId] },
      }),
    );
  });

  it("reuses the stack and trigger panels in the mobile arena and confirms the visible order", () => {
    const match = getFabEngineScenario("trigger-decision-lab")?.boot();
    if (!match) throw new Error("Missing trigger decision lab scenario.");
    const interactionView = projectFabInteraction(match.runtime, match.player1Id).view;
    const input = interactionView.actions[0]?.inputs[0];
    if (input?.kind !== "ordering") throw new Error("Expected trigger ordering input.");
    const [drawTriggerId, destroyAuraTriggerId] = input.candidates.map(
      (candidate) => candidate.entity.instanceId,
    );
    const onSubmitInteraction = vi.fn();

    renderTabletop(presentRuntime(match.runtime, match.player1Id), {
      forceMobileLayout: true,
      interactionView,
      onSubmitInteraction,
      readOnly: false,
    });

    const resolutionRow = screen.getByTestId("fab-mobile-resolution-row");
    const triggerPanel = within(resolutionRow).getByTestId("fab-trigger-order-panel");
    const prompt = screen.getByTestId("interaction-resolution-prompt");
    expect(prompt.textContent).toContain("Order your simultaneous triggered abilities");
    expect(within(prompt).queryByRole("button", { name: "Confirm order" })).toBeNull();
    expect(within(triggerPanel).getByText("Triggers")).toBeTruthy();

    fireEvent.click(within(triggerPanel).getByRole("button", { name: /Swap order/ }));
    expect(
      within(triggerPanel).getByRole("button", { name: /Resolves first: .*optional-draw/i }),
    ).toBeTruthy();
    fireEvent.click(within(triggerPanel).getByRole("button", { name: "Confirm order" }));

    expect(onSubmitInteraction).toHaveBeenCalledWith(
      expect.objectContaining({
        values: { answer: [destroyAuraTriggerId, drawTriggerId] },
      }),
    );
  });

  it("does not inspect a card when it has no legal primary action", () => {
    const state = createOpeningFixtureState();
    const ownHandCard = Object.values(state.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "hand",
    )!;
    renderTabletop(state, { readOnly: false, legalCommands: [] });
    const cardButton = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${ownHandCard.id}"]`)
      ?.closest("button");

    fireEvent.click(cardButton!);
    expect(screen.queryByTestId("fab-desktop-card-popover")).toBeNull();
    expect(document.querySelector(".card-detail-backdrop")).toBeNull();
  });

  it("does not inspect a card on mobile when it has no legal primary action", () => {
    const state = createOpeningFixtureState();
    const ownHandCard = Object.values(state.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "hand",
    )!;
    renderTabletop(state, { forceMobileLayout: true, readOnly: false, legalCommands: [] });
    const cardButton = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${ownHandCard.id}"]`)
      ?.closest("button");

    fireEvent.click(cardButton!);
    expect(document.querySelector('.choice-detail-sheet[role="dialog"]')).toBeNull();
    expect(screen.queryByTestId("fab-desktop-card-popover")).toBeNull();
  });

  it("renders scannable combat chain from engine-backed defend-with-blocks state", () => {
    renderTabletop(createCombatFixtureState());

    const chain = screen.getByTestId("fab-combat-chain");
    expect(chain.getAttribute("data-chain-state")).toBe("active");
    expect(chain.getAttribute("data-chain-step")).toBe("defend");
    const stepBadge = screen.getByTestId("fab-chain-step");
    expect(stepBadge.textContent).toBe("Defend");
    expect(stepBadge.getAttribute("aria-label")).toBe("Defend step");
    expect(stepBadge.getAttribute("title")).toBe("Defend step");
    expect(stepBadge.querySelector("svg")).not.toBeNull();
    expect(screen.queryByTestId("fab-chain-target")).toBeNull();
    expect(screen.queryByTestId("fab-chain-priority")).toBeNull();
    expect(screen.getByTestId("fab-chain-equation").textContent).toMatch(/damage|Blocked/i);
    const defendProgressItem = screen
      .getByTestId("fab-chain-step-progress")
      .querySelector('[data-step="defend"]');
    expect(defendProgressItem?.getAttribute("data-tooltip")).toMatch(/commit cards to defend/i);
    expect(defendProgressItem?.getAttribute("tabindex")).toBe("0");
    expect(screen.getByTestId("fab-chain-attacker").textContent).toMatch(/Alpha Rampage/i);
    expect(screen.getByTestId("fab-chain-attack-power").textContent).toMatch(/\d/);
    expect(screen.getByTestId("fab-chain-total-defense").textContent).toMatch(/\d/);
    expect(screen.getByTestId("fab-chain-equation")).not.toBeNull();
    // Official power/defense glyphs on the damage equation and readouts.
    expect(screen.getAllByTestId("fab-icon-power").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("fab-icon-defense").length).toBeGreaterThan(0);
    const defendingCards = screen.getByTestId("fab-chain-blocks");
    expect(defendingCards).not.toBeNull();
    const defenderPaintLayers = [...defendingCards.children].map((slot) =>
      Number((slot as HTMLElement).style.zIndex),
    );
    expect(defenderPaintLayers).toEqual([...defenderPaintLayers].sort((a, b) => b - a));
    expect(screen.getByTestId("fab-chain-pass-priority").textContent).toMatch(/Pass Priority/i);
    expect(screen.queryByText(/Break Chain/i)).toBeNull();
    expect(screen.getByTestId("fab-board").getAttribute("data-turn-owner")).toBe("self");
    expect(screen.getByTestId("fab-board").getAttribute("data-priority-owner")).toBe("self");
  });

  it.each([false, true])(
    "renders only non-hero attack targets (mobile=%s)",
    (forceMobileLayout) => {
      const combatState = createCombatFixtureState();
      const activeLink = combatState.combat?.activeLink;
      const arenaState = createClosedWithPermanentsFixtureState();
      const objectTarget = Object.values(arenaState.cards).find(
        (card) => card.zone === "permanent",
      );
      if (!combatState.combat || !activeLink || !objectTarget) {
        throw new Error("expected combat and an authored permanent target");
      }

      const objectTargetDefinition = arenaState.cardDefinitions[objectTarget.cardId];
      renderTabletop(
        {
          ...combatState,
          cards: { ...combatState.cards, [objectTarget.id]: objectTarget },
          cardDefinitions: {
            ...combatState.cardDefinitions,
            ...(objectTargetDefinition ? { [objectTarget.cardId]: objectTargetDefinition } : {}),
          },
          combat: {
            ...combatState.combat,
            activeLink: {
              ...activeLink,
              attackTarget: {
                kind: "object",
                instanceId: objectTarget.id,
                controllerIdAtDeclaration: objectTarget.ownerId,
              },
              additionalAttackTargets: [],
              defendingInstanceIds: [],
              defendingInstanceIdsByTarget: { [objectTarget.id]: [] },
            },
          },
        },
        { forceMobileLayout },
      );

      expect(screen.queryByTestId("fab-chain-defending-hero")).toBeNull();
      expect(screen.getByTestId("fab-chain-link").querySelector('[data-kind="hero"]')).toBeNull();
      const targets = screen.getByTestId("fab-chain-targets");
      expect(targets.querySelector(`[data-chain-card-id="${objectTarget.id}"]`)).not.toBeNull();
    },
  );

  it.each(["desktop", "mobile"] as const)(
    "shows an ally target without offering unavailable defenders on %s",
    async (layout) => {
      const session = renderFabSimulatorScenario({ scenarioId: "ally-attack-target", layout });
      await session.pom.waitForReady();
      expect(screen.getByTestId("fab-chain-targets").textContent).toContain("Target");
      expect(screen.queryByText("Add a defender")).toBeNull();
      const declare = screen.getAllByRole("button", { name: /^Declare no defense$/ });
      fireEvent.click(declare[0]!);
      await waitFor(() => {
        expect(screen.queryAllByRole("button", { name: /^Declare no defense$/ })).toHaveLength(0);
      });
      expect(screen.queryByRole("button", { name: /^Are you sure\?$/ })).toBeNull();
      await waitFor(() => {
        expect(
          within(screen.getByTestId("fab-chain-targets")).getAllByLabelText(/Cintari Sellsword/)
            .length,
        ).toBeGreaterThan(0);
      });
    },
  );

  it("guides mobile defense selection and restores the prompt when a defender is returned", () => {
    const base = createCombatFixtureState();
    const defender = Object.values(base.cards).find(
      (card) => card.ownerId === "player-2" && card.zone === "hand",
    );
    if (!base.combat?.activeLink || !defender) {
      throw new Error("expected an active combat link and a defender in hand");
    }
    renderTabletop(
      {
        ...base,
        priorityPlayerId: null,
        combat: {
          ...base.combat,
          activeLink: {
            ...base.combat.activeLink,
            defendingInstanceIds: [],
            defendingInstanceIdsByTarget: Object.fromEntries(
              Object.keys(base.combat.activeLink.defendingInstanceIdsByTarget).map((targetId) => [
                targetId,
                [],
              ]),
            ),
          },
        },
      },
      {
        forceMobileLayout: true,
        viewerId: "player-2",
        readOnly: false,
        legalCommands: [
          { move: "defend", label: "Defend", payload: { instanceIds: [defender.id] } },
        ],
        onLegalCommand: vi.fn(),
      },
    );

    const actionRail = screen.getByTestId("fab-mobile-bottom-rail");
    expect(actionRail.querySelector(".fab-mobile-priority")).toBeNull();
    expect(actionRail.getAttribute("data-priority-owner")).toBe("closed");
    expect(screen.getByTestId("fab-chain-defense-slot").textContent).toContain("Select a card");
    const handCard = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${defender.id}"]`)
      ?.closest("button");
    if (!(handCard instanceof HTMLButtonElement)) throw new Error("expected a selectable defender");
    fireEvent.click(handCard);
    expect(
      screen.getByTestId("fab-hand-bottom").querySelector(`[data-entity-id="${defender.id}"]`),
    ).not.toBeNull();
    expect(screen.queryByTestId(`fab-chain-card-${defender.id}`)).toBeNull();
    fireEvent.click(handCard);
    expect(screen.getByTestId("fab-chain-defense-slot").textContent).toContain("Add a defender");
  });

  it("selects defenders in hand and submits one matching declaration", () => {
    const base = createCombatFixtureState();
    const defenderHand = Object.values(base.cards).filter(
      (card) => card.ownerId === "player-2" && card.zone === "hand",
    );
    const [first, second, third] = defenderHand;
    const unavailableSource = Object.values(base.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "hand",
    );
    if (!first || !second || !third || !unavailableSource) {
      throw new Error("expected three defending hand cards and a test card source");
    }
    const unavailable = {
      ...unavailableSource,
      id: "fab-unavailable-defense",
      ownerId: "player-2",
      zone: "hand" as const,
    };
    const defendWithThree: FabLegalCommand = {
      move: "defend",
      label: `Defend with ${first.id} + ${second.id} + ${third.id}`,
      payload: { instanceIds: [first.id, second.id, third.id] },
    };
    const onLegalCommand = vi.fn();
    const onPassPriority = vi.fn();

    renderTabletop(
      {
        ...base,
        priorityPlayerId: "player-1",
        cards: { ...base.cards, [unavailable.id]: unavailable },
        combat: base.combat
          ? {
              ...base.combat,
              activeLink: base.combat.activeLink
                ? {
                    ...base.combat.activeLink,
                    defendingInstanceIds: [],
                    defendingInstanceIdsByTarget: Object.fromEntries(
                      Object.keys(base.combat.activeLink.defendingInstanceIdsByTarget).map(
                        (targetId) => [targetId, []],
                      ),
                    ),
                  }
                : null,
            }
          : null,
      },
      {
        viewerId: "player-2",
        readOnly: false,
        legalCommands: [defendWithThree, { move: "pass", label: "Pass", payload: {} }],
        onLegalCommand,
        onPassPriority,
      },
    );

    const sidebarDeclareDefense = screen.getByTestId(
      "fab-action-pass-priority",
    ) as HTMLButtonElement;
    const quickDeclareDefense = screen.getByTestId("fab-quick-pass") as HTMLButtonElement;
    expect(screen.queryByTestId("fab-chain-pass-priority")).toBeNull();
    expect(screen.getByTestId("fab-chain-step").closest(".fab-chain-header-left")).not.toBeNull();
    expect(sidebarDeclareDefense.getAttribute("aria-label")).toBe("Declare defense");
    expect(sidebarDeclareDefense.getAttribute("aria-label")).toBe("Declare defense");
    expect(quickDeclareDefense.getAttribute("aria-label")).toBe("Declare defense");
    expect(quickDeclareDefense.getAttribute("data-primary-action-kind")).toBe("declare-defense");
    expect(quickDeclareDefense.querySelector(".lucide-shield")).not.toBeNull();
    expect(screen.getByTestId("fab-chain-defense-slot").textContent).toContain("Add a defender");
    const hand = screen.getByTestId("fab-hand-bottom");
    const firstButton = hand.querySelector(`[data-entity-id="${first.id}"]`)?.closest("button");
    const secondButton = hand.querySelector(`[data-entity-id="${second.id}"]`)?.closest("button");
    const thirdButton = hand.querySelector(`[data-entity-id="${third.id}"]`)?.closest("button");
    const unavailableButton = hand
      .querySelector(`[data-entity-id="${unavailable.id}"]`)
      ?.closest("button");
    if (
      !(firstButton instanceof HTMLButtonElement) ||
      !(secondButton instanceof HTMLButtonElement) ||
      !(thirdButton instanceof HTMLButtonElement) ||
      !(unavailableButton instanceof HTMLButtonElement)
    ) {
      throw new Error("expected defending cards to be selectable from hand");
    }
    expect(
      firstButton.querySelector('[data-card-interaction-outline="actionable"]'),
    ).not.toBeNull();
    expect(
      unavailableButton.querySelector('[data-card-interaction-outline="actionable"]'),
    ).toBeNull();
    fireEvent.click(sidebarDeclareDefense);
    expect(onLegalCommand).not.toHaveBeenCalled();
    expect(onPassPriority).not.toHaveBeenCalled();
    expect(sidebarDeclareDefense.textContent?.trim()).toBe("Are you sure?");
    expect(quickDeclareDefense.getAttribute("aria-label")).toBe("Are you sure?");
    expect(quickDeclareDefense.getAttribute("data-primary-action-kind")).toBe("confirm-no-defense");
    expect(quickDeclareDefense.querySelector(".lucide-shield-alert")).not.toBeNull();
    fireEvent.click(firstButton);

    expect(hand.querySelector(`[data-entity-id="${first.id}"]`)).not.toBeNull();
    expect(sidebarDeclareDefense.textContent?.trim()).toBe("Declare defense");
    expect(quickDeclareDefense.getAttribute("aria-label")).toMatch(
      /^Declare defense unavailable\./,
    );
    expect(sidebarDeclareDefense.disabled).toBe(true);
    expect(quickDeclareDefense.disabled).toBe(true);
    expect(screen.queryByTestId(`fab-chain-card-${first.id}`)).toBeNull();
    fireEvent.click(firstButton);
    expect(hand.querySelector(`[data-entity-id="${first.id}"]`)).not.toBeNull();
    expect(screen.queryByTestId(`fab-chain-card-${first.id}`)).toBeNull();

    const returnedFirstButton = hand
      .querySelector(`[data-entity-id="${first.id}"]`)
      ?.closest("button");
    if (!(returnedFirstButton instanceof HTMLButtonElement)) {
      throw new Error("expected retracted defender to return to hand");
    }
    fireEvent.click(returnedFirstButton);
    fireEvent.click(secondButton);
    expect(quickDeclareDefense.disabled).toBe(true);
    fireEvent.click(thirdButton);

    const stagedDefense = [first, second, third].reduce(
      (total, card) => total + (card.currentNumeric?.defense ?? 0),
      0,
    );
    const attackPower = base.combat?.activeLink?.attackPower;
    if (attackPower === undefined) {
      throw new Error("expected combat fixture attack power");
    }
    expect(screen.getByTestId("fab-eq-defense").getAttribute("aria-label")).toBe(
      `${stagedDefense} defense`,
    );
    expect(screen.getByTestId("fab-chain-projected-damage").getAttribute("data-damage")).toBe(
      String(Math.max(0, attackPower - stagedDefense)),
    );

    for (const card of [first, second, third]) {
      expect(hand.querySelector(`[data-entity-id="${card.id}"]`)).not.toBeNull();
      expect(screen.queryByTestId(`fab-chain-card-${card.id}`)).toBeNull();
    }
    expect(sidebarDeclareDefense.disabled).toBe(false);
    expect(quickDeclareDefense.disabled).toBe(false);
    fireEvent.click(sidebarDeclareDefense);
    expect(onLegalCommand).toHaveBeenCalledWith(defendWithThree);
    expect(onPassPriority).not.toHaveBeenCalled();
  });

  it("selects a legal Arsenal defender in place instead of opening the inspector", () => {
    const fixture = FAB_VISUAL_FIXTURES.find((entry) => entry.id === "combat");
    if (!fixture) throw new Error("Missing combat fixture");
    // This is a seated-player interaction: use that player's private projection,
    // not a redacted opponent-hand placeholder from the other seat's view.
    const base = presentRuntime(fixture.scenario.boot().runtime, "player-2");
    const arsenalDefender = Object.values(base.cards).find(
      (card) => card.ownerId === "player-2" && card.zone === "hand",
    );
    if (!arsenalDefender) throw new Error("expected a defender to move to Arsenal");

    const defendedFromArsenal = {
      ...arsenalDefender,
      id: "fab-arsenal-ambush-defender",
      zone: "arsenal" as const,
      currentNumeric: { defense: 3 },
    };
    const cards = { ...base.cards };
    for (const [cardId, card] of Object.entries(cards)) {
      if (card.ownerId === "player-2" && card.zone === "hand") {
        cards[cardId] = { ...card, zone: "graveyard" as const };
      }
    }
    cards[defendedFromArsenal.id] = defendedFromArsenal;
    const onLegalCommand = vi.fn();
    renderTabletop(
      {
        ...base,
        priorityPlayerId: "player-1",
        cards,
      },
      {
        viewerId: "player-2",
        readOnly: false,
        legalCommands: [
          {
            move: "defend",
            label: `Defend with ${defendedFromArsenal.id}`,
            payload: { instanceIds: [defendedFromArsenal.id] },
          },
        ],
        onLegalCommand,
      },
    );

    const declareDefense = screen.getByTestId("fab-action-pass-priority");
    fireEvent.click(declareDefense);
    expect(declareDefense.getAttribute("aria-label")).toBe("Are you sure?");
    expect(onLegalCommand).not.toHaveBeenCalled();

    const arsenal = screen.getByLabelText("Your arsenal, 1 card").closest(".fab-zone-arsenal");
    const arsenalButton = arsenal?.querySelector(
      `[data-entity-id="${defendedFromArsenal.id}"] button`,
    );
    if (!(arsenalButton instanceof HTMLButtonElement)) {
      throw new Error("expected the Arsenal defender to be selectable");
    }

    fireEvent.click(arsenalButton);

    expect(declareDefense.getAttribute("aria-label")).toBe("Declare defense");
    expect(arsenal?.querySelector(`[data-entity-id="${defendedFromArsenal.id}"]`)).not.toBeNull();
    expect(screen.queryByTestId(`fab-chain-card-${defendedFromArsenal.id}`)).toBeNull();
    expect(onLegalCommand).not.toHaveBeenCalled();
  });

  it("requires two Space activations before submitting no defenders with cards in hand", () => {
    const base = createCombatFixtureState();
    const defender = Object.values(base.cards).find(
      (card) => card.ownerId === "player-2" && card.zone === "hand",
    );
    if (!defender) throw new Error("expected a defending hand card");
    const onPassPriority = vi.fn();

    renderTabletop(
      { ...base, priorityPlayerId: "player-1" },
      {
        viewerId: "player-2",
        readOnly: false,
        legalCommands: [
          {
            move: "defend",
            label: `Defend with ${defender.id}`,
            payload: { instanceIds: [defender.id] },
          },
          { move: "pass", label: "Pass", payload: {} },
        ],
        onPassPriority,
        onLegalCommand: vi.fn(),
      },
    );

    fireEvent.keyDown(window, { code: "Space", key: " " });

    expect(onPassPriority).not.toHaveBeenCalled();
    expect(screen.queryByTestId("fab-chain-pass-priority")).toBeNull();
    expect(screen.getByTestId("fab-action-pass-priority").getAttribute("aria-label")).toBe(
      "Are you sure?",
    );
    expect(screen.getByTestId("fab-quick-pass").getAttribute("aria-label")).toBe("Are you sure?");

    fireEvent.keyDown(window, { code: "Space", key: " " });

    expect(onPassPriority).toHaveBeenCalledOnce();
  });

  it("uses the shared prompt to continue or explicitly close at Resolution", () => {
    const base = createCombatFixtureState();
    const activeLink = base.combat?.activeLink;
    if (!base.combat || !activeLink) throw new Error("expected active combat link");
    const attack = Object.values(base.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "hand",
    );
    if (!attack) throw new Error("expected an attack in hand");
    const playAttack: FabLegalCommand = {
      move: "begin-play",
      label: "Play next attack",
      payload: { instanceId: attack.id },
    };
    const passPriority: FabLegalCommand = {
      move: "pass",
      label: "Pass priority",
      payload: {},
    };
    const onLegalCommand = vi.fn();
    const onCloseCombatChain = vi.fn();
    const onOpenLegalActions = vi.fn();
    const onSubmitInteraction = vi.fn();
    const interactionView: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "player-1",
      stateVersion: 4,
      status: "ready",
      actions: [
        {
          id: "fab:control:pass",
          requestId: "pass:4",
          intent: "pass",
          text: { key: "Pass priority" },
          enabled: true,
          inputs: [],
        },
      ],
    };
    renderTabletop(
      {
        ...base,
        priorityWindow: { kind: "combat-chain-continuation", role: "attacker" },
        combat: {
          ...base.combat,
          step: "resolution",
          activeLink: { ...activeLink, damageResolved: true, damage: 5, didHit: true },
        },
      },
      {
        readOnly: false,
        legalCommands: [playAttack, passPriority],
        onLegalCommand,
        onPassPriority: onCloseCombatChain,
        onOpenLegalActions,
        interactionView,
        onSubmitInteraction,
      },
    );

    expect(screen.queryByTestId("fab-chain-action-hint")).toBeNull();
    expect(screen.queryByTestId("fab-chain-priority-actions")).toBeNull();
    expect(screen.queryByTestId("fab-chain-pass-priority")).toBeNull();
    expect(screen.queryByTestId("fab-chain-play-activate")).toBeNull();
    expect(screen.queryByTestId("fab-action-pass-priority")).toBeNull();
    expect(screen.queryByTestId("fab-quick-pass")).toBeNull();
    const prompt = screen.getByTestId("interaction-resolution-prompt");
    expect(prompt.textContent).toContain("Resolution step");
    expect(prompt.textContent).toContain("Play another attack");
    const chooseNextAttack = within(prompt).getByRole("button", { name: "Choose next attack" });
    const closeCombatChain = within(prompt).getByRole("button", {
      name: "Close combat chain",
    });
    expect(
      screen.getByTestId("fab-chain-link-tab-1").querySelector('[data-outcome="damage"]'),
    ).not.toBeNull();
    expect(screen.getByTestId("fab-chain-link-tab-1").textContent).toContain("5");
    fireEvent.click(chooseNextAttack);
    fireEvent.click(closeCombatChain);
    expect(onOpenLegalActions).toHaveBeenCalledOnce();
    expect(onSubmitInteraction).toHaveBeenCalledWith(
      expect.objectContaining({ actionId: "fab:control:pass" }),
    );
    expect(onLegalCommand).not.toHaveBeenCalled();
    expect(onCloseCombatChain).not.toHaveBeenCalled();
  });

  it("does not offer the defender a next attack during Resolution", () => {
    const base = createCombatFixtureState();
    const activeLink = base.combat?.activeLink;
    if (!base.combat || !activeLink) throw new Error("expected active combat link");
    const onOpenLegalActions = vi.fn();
    const interactionView: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "player-2",
      stateVersion: 4,
      status: "ready",
      actions: [
        {
          id: "fab:control:pass",
          requestId: "pass:4",
          intent: "pass",
          text: { key: "Pass priority" },
          enabled: true,
          inputs: [],
        },
      ],
    };
    renderTabletop(
      {
        ...base,
        priorityPlayerId: "player-2",
        combat: {
          ...base.combat,
          step: "resolution",
          activeLink: { ...activeLink, damageResolved: true, damage: 5, didHit: true },
        },
      },
      {
        viewerId: "player-2",
        readOnly: false,
        legalCommands: [{ move: "pass", label: "Pass priority", payload: {} }],
        onPassPriority: vi.fn(),
        onOpenLegalActions,
        interactionView,
        onSubmitInteraction: vi.fn(),
      },
    );

    expect(screen.queryByRole("button", { name: "Choose next attack" })).toBeNull();
    expect(onOpenLegalActions).not.toHaveBeenCalled();
  });

  it.each([
    ["desktop", false],
    ["mobile", true],
  ] as const)(
    "labels the defender's Resolution action as passing priority on %s",
    async (_viewport, forceMobileLayout) => {
      const base = createCombatFixtureState();
      const activeLink = base.combat?.activeLink;
      if (!base.combat || !activeLink) throw new Error("expected active combat link");
      const onPassPriority = vi.fn();
      renderTabletop(
        {
          ...base,
          priorityPlayerId: "player-2",
          priorityWindow: { kind: "combat-resolution-response", role: "defender" },
          combat: {
            ...base.combat,
            step: "resolution",
            activeLink: { ...activeLink, damageResolved: true, didHit: true },
          },
        },
        {
          viewerId: "player-2",
          forceMobileLayout,
          readOnly: false,
          onPassPriority,
          legalCommands: [{ move: "pass", label: "Pass priority", payload: {} }],
        },
      );

      const pass = await screen.findByTestId(
        forceMobileLayout ? "fab-chain-pass-priority" : "fab-quick-pass",
      );
      expect(pass.textContent).toMatch(/pass/i);
      expect(pass.getAttribute("aria-label")).toMatch(/pass/i);
      expect(pass.textContent).not.toMatch(/close/i);
      expect(screen.queryByText(/finished attacking/i)).toBeNull();
      fireEvent.click(pass);
      expect(onPassPriority).toHaveBeenCalledTimes(1);
    },
  );

  it("labels the mobile Resolution pass action as closing the combat chain", async () => {
    const base = createCombatFixtureState();
    const activeLink = base.combat?.activeLink;
    if (!base.combat || !activeLink) throw new Error("expected active combat link");
    renderTabletop(
      {
        ...base,
        priorityWindow: { kind: "combat-chain-continuation", role: "attacker" },
        combat: {
          ...base.combat,
          step: "resolution",
          activeLink: { ...activeLink, damageResolved: true, didHit: true },
        },
      },
      {
        forceMobileLayout: true,
        readOnly: false,
        onOpenLegalActions: vi.fn(),
        onPassPriority: vi.fn(),
        legalCommands: [
          {
            move: "begin-play",
            label: "Play next attack",
            payload: { instanceId: "mobile-next-attack" },
          },
          { move: "pass", label: "Pass priority", payload: {} },
        ],
      },
    );

    const closeCombatChain = await screen.findByTestId("fab-chain-pass-priority");
    expect(screen.queryByTestId("fab-chain-play-activate")).toBeNull();
    expect(closeCombatChain.textContent).toMatch(/close chain/i);
    expect(closeCombatChain.getAttribute("aria-label")).toBe("Close combat chain");
  });

  it("keeps turn territory and priority ownership independent", () => {
    const state = createOpeningFixtureState();
    renderTabletop({ ...state, activePlayerId: "player-1", priorityPlayerId: "player-2" });

    const board = screen.getByTestId("fab-board");
    expect(board.getAttribute("data-turn-owner")).toBe("self");
    expect(board.getAttribute("data-priority-owner")).toBe("opponent");
    expect(screen.getByTestId("fab-player-bottom").getAttribute("data-turn")).toBe("true");
    expect(screen.getByTestId("fab-player-bottom").getAttribute("data-priority")).toBeNull();
    expect(screen.getByTestId("fab-player-top").getAttribute("data-turn")).toBeNull();
    expect(screen.getByTestId("fab-player-top").getAttribute("data-priority")).toBe("true");
  });

  it("shows pending defense interaction agency to both players from the same game state", () => {
    const scenario = getFabEngineScenario("defend-open");
    if (!scenario) throw new Error("Missing defend-open scenario");
    const match = scenario.boot();
    const combat = match.runtime.getState().combat;
    if (!combat?.activeLink) throw new Error("Expected an active combat link");
    const attackerId = combat.activeLink.attackingPlayerId;
    const defenderId = combat.activeLink.defendingPlayerId;

    const attackerState = presentRuntime(match.runtime, attackerId);
    expect(attackerState.priorityPlayerId).toBeNull();
    expect(attackerState.combat?.defenseDeclarationPending).toBe(true);
    const attackerRender = renderTabletop(attackerState, {
      viewerId: attackerId,
      readOnly: false,
      interactionView: projectFabInteraction(match.runtime, attackerId).view,
    });

    expect(screen.getByTestId("fab-board").getAttribute("data-agency-owner")).toBe("opponent");
    expect(screen.getByTestId("fab-player-top").getAttribute("data-agency")).toBe("true");
    expect(screen.getByTestId("fab-player-bottom").getAttribute("data-agency")).toBeNull();

    attackerRender.unmount();

    const defenderState = presentRuntime(match.runtime, defenderId);
    const defenderRender = renderTabletop(defenderState, {
      viewerId: defenderId,
      readOnly: false,
      forceMobileLayout: true,
      interactionView: projectFabInteraction(match.runtime, defenderId).view,
    });

    expect(screen.getByTestId("fab-board").getAttribute("data-agency-owner")).toBe("self");
    expect(screen.getByTestId("fab-mobile-bottom-rail").getAttribute("data-agency")).toBe("true");
    expect(screen.getByTestId("fab-combat-announcer").textContent).toContain(
      "No defenders available",
    );

    defenderRender.unmount();

    renderTabletop(attackerState, {
      viewerId: attackerId,
      readOnly: false,
      forceMobileLayout: true,
      interactionView: projectFabInteraction(match.runtime, attackerId).view,
    });

    expect(screen.getByTestId("fab-mobile-top-rail").getAttribute("data-agency")).toBe("true");
    expect(screen.getByTestId("fab-mobile-top-rail").textContent).toContain(
      "Opponent choosing defenders",
    );
    expect(screen.getByTestId("fab-combat-announcer").textContent).toContain(
      "Opponent choosing defenders",
    );
  });

  it.each([
    ["desktop", false],
    ["mobile", true],
  ])(
    "emphasizes the decision actor instead of preserved rules priority on %s",
    (_label, forceMobileLayout) => {
      const state = createOpeningFixtureState();
      renderTabletop(
        { ...state, priorityPlayerId: "player-2" },
        {
          forceMobileLayout,
          interactionView: createDecisionView("player-1"),
          onSubmitInteraction: vi.fn(),
          readOnly: false,
        },
      );

      const board = screen.getByTestId("fab-board");
      expect(board.getAttribute("data-priority-owner")).toBe("opponent");
      expect(board.getAttribute("data-agency-owner")).toBe("self");
      if (forceMobileLayout) {
        expect(screen.getByTestId("fab-mobile-top-rail").getAttribute("data-priority")).toBe(
          "true",
        );
        expect(screen.getByTestId("fab-mobile-top-rail").getAttribute("data-agency")).toBeNull();
        expect(screen.getByTestId("fab-mobile-bottom-rail").getAttribute("data-agency")).toBe(
          "true",
        );
      } else {
        expect(screen.getByTestId("fab-player-top").getAttribute("data-priority")).toBe("true");
        expect(screen.getByTestId("fab-player-top").getAttribute("data-agency")).toBeNull();
        expect(screen.getByTestId("fab-player-bottom").getAttribute("data-agency")).toBe("true");
      }
    },
  );

  it("renders consistent keyword icons for go again and dominate on the combat chain", () => {
    const state = createCombatFixtureState();
    const combat = state.combat;
    if (!combat?.activeLink) throw new Error("expected active combat link");
    const withKeywords: FabPresentationState = {
      ...state,
      combat: {
        ...combat,
        activeLink: {
          ...combat.activeLink,
          keywords: ["go-again", "dominate", "on-hit"],
        },
      },
    };
    renderTabletop(withKeywords);

    expect(screen.getByTestId("fab-chain-keywords")).not.toBeNull();
    expect(screen.getByTestId("fab-keyword-go-again").textContent).toMatch(/go again/i);
    expect(screen.getByTestId("fab-keyword-dominate").textContent).toMatch(/dominate/i);
    expect(screen.getByTestId("fab-keyword-on-hit").textContent).toMatch(/on-hit effect/i);
    expect(screen.getByTestId("fab-keyword-go-again").querySelector("svg")).not.toBeNull();
    expect(screen.getByTestId("fab-keyword-dominate").querySelector("svg")).not.toBeNull();
    // The hint rides the board's attr(data-tooltip) affordance and the chip is
    // keyboard-focusable, matching the combat step items' tooltip contract.
    expect(screen.getByTestId("fab-keyword-go-again").getAttribute("data-tooltip")).toMatch(
      /gain an action point when this chain link resolves/i,
    );
    expect(screen.getByTestId("fab-keyword-dominate").getAttribute("data-tooltip")).toMatch(
      /cannot defend with more than one card from hand/i,
    );
    expect(screen.getByTestId("fab-keyword-on-hit").getAttribute("data-tooltip")).toMatch(
      /applies when it hits the defending hero/i,
    );
    for (const id of ["fab-keyword-go-again", "fab-keyword-dominate", "fab-keyword-on-hit"]) {
      expect(screen.getByTestId(id).getAttribute("tabindex")).toBe("0");
    }
  });

  it("does not render conditional go again unless the active chain link has it", async () => {
    const state = createCombatFixtureState();
    const combat = state.combat;
    const activeLink = combat?.activeLink;
    if (!combat || !activeLink) throw new Error("expected active combat link");

    const attackCard = state.cards[activeLink.attackInstanceId];
    if (!attackCard) throw new Error("expected active attack card");

    const secondStrikeDefinition = toFabCardDefinition(secondStrikeRed);

    const presentationDefinition = engineDefToPresentation(secondStrikeDefinition, testFabArt);
    expect(presentationDefinition.keywords).toContain("Go again");

    const unmetConditionState: FabPresentationState = {
      ...state,
      cards: {
        ...state.cards,
        [attackCard.id]: {
          ...attackCard,
          cardId: secondStrikeRed.canonicalId,
        },
      },
      cardDefinitions: {
        ...state.cardDefinitions,
        [secondStrikeRed.canonicalId]: presentationDefinition,
      },
      combat: {
        ...combat,
        activeLink: {
          ...activeLink,
          keywords: [],
        },
      },
    };

    renderTabletop(unmetConditionState);

    expect(screen.queryByTestId("fab-keyword-go-again")).toBeNull();
  });

  it("renders engine-evaluated go again for a real attack", async () => {
    const scenario = getFabEngineScenario("attack-only-head-jab");
    const match = scenario?.boot();
    if (!scenario || !match) throw new Error("Missing attack-only Head Jab scenario");

    const engineState = match.runtime.getState();
    const headJabInstanceId = engineState.containers.zonesByPlayerId[match.player2Id]?.hand[0];
    const headJabId = headJabInstanceId
      ? engineState.objects[headJabInstanceId]?.canonicalId
      : undefined;
    if (!headJabId) throw new Error("expected Head Jab in the attacking player's hand");

    match.engine.as(catalogIds.bravo).attackWith(headJabId);

    const presentation = presentRuntime(match.runtime, match.player1Id);
    expect(presentation.combat?.activeLink?.keywords).toContain("go-again");

    renderTabletop(presentation);

    expect(screen.getByTestId("fab-keyword-go-again")).not.toBeNull();
  });

  it("renders an updated hand after a presentation draw without a manual Draw control", () => {
    const onAction = vi.fn();
    const state = createCombatFixtureState();
    const { rerender } = render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop state={state} viewerId="player-1" onAction={onAction} />
      </FleshAndBloodSimulatorProviders>,
    );

    const deckBefore = Object.values(state.cards).filter(
      (c) => c.ownerId === "player-1" && c.zone === "deck",
    ).length;
    const handBefore = Object.values(state.cards).filter(
      (c) => c.ownerId === "player-1" && c.zone === "hand",
    ).length;

    expect(screen.queryByTestId("fab-action-draw")).toBeNull();

    const next = reduceFabPresentationState(state, {
      type: "draw",
      ownerId: "player-1",
      count: 1,
    });
    const deckAfter = Object.values(next.cards).filter(
      (c) => c.ownerId === "player-1" && c.zone === "deck",
    ).length;
    const handAfter = Object.values(next.cards).filter(
      (c) => c.ownerId === "player-1" && c.zone === "hand",
    ).length;
    expect(handAfter).toBe(handBefore + 1);
    expect(deckAfter).toBe(deckBefore - 1);

    rerender(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop state={next} viewerId="player-1" onAction={onAction} />
      </FleshAndBloodSimulatorProviders>,
    );
    expect(screen.getByTestId("fab-hand-bottom").getAttribute("aria-label")).toContain(
      String(handAfter),
    );
    expect(screen.queryByTestId("fab-action-draw")).toBeNull();
  });

  it("mounts fixture catalog index without the tabletop board", async () => {
    render(
      <MemoryRouter initialEntries={["/flesh-and-blood/simulator/tests"]}>
        <FleshAndBloodSimulatorProviders>
          <Routes>
            <Route
              path="/flesh-and-blood/simulator/tests"
              element={<FleshAndBloodFixtureIndexPage />}
            />
            <Route
              path="/flesh-and-blood/simulator/tests/:fixtureId"
              element={<FleshAndBloodPracticePage />}
            />
          </Routes>
        </FleshAndBloodSimulatorProviders>
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("fab-fixture-index")).not.toBeNull();
    expect(screen.queryByTestId("fab-board")).toBeNull();
    expect(screen.queryByTestId("fab-practice-page")).toBeNull();
    expect(screen.getByTestId("fab-fixture-link-combat")).not.toBeNull();
    expect(screen.getByTestId("fab-fixture-link-closed-arena")).not.toBeNull();
    expect(screen.getByTestId("fab-fixture-link-hero-special-dromai")).not.toBeNull();
    expect(screen.getByTestId("fab-fixture-link-hero-special-levia")).not.toBeNull();
    expect(screen.getByTestId("fab-fixture-group-hero-special")).not.toBeNull();
    expect(screen.getByTestId("fab-fixture-count").textContent).toMatch(/Showing \d+ of \d+/);
  });

  it("loads hero-special-dromai without a support-row hero-special panel", async () => {
    render(
      <MemoryRouter initialEntries={["/flesh-and-blood/simulator/tests/hero-special-dromai"]}>
        <FleshAndBloodSimulatorProviders>
          <Routes>
            <Route
              path="/flesh-and-blood/simulator/tests/:fixtureId"
              element={<FleshAndBloodPracticePage />}
            />
          </Routes>
        </FleshAndBloodSimulatorProviders>
      </MemoryRouter>,
    );

    const playSurface = await screen.findByTestId("fab-practice-page");
    expect(playSurface.getAttribute("data-fixture")).toBe("hero-special-dromai");
    expect(screen.getByTestId("fab-tabletop")).not.toBeNull();
    expect(screen.queryByTestId("fab-hero-special-bottom")).toBeNull();
  });

  it("loads fixtures through the real practice play surface with local engine", async () => {
    render(
      <MemoryRouter initialEntries={["/flesh-and-blood/simulator/tests/combat"]}>
        <FleshAndBloodSimulatorProviders>
          <Routes>
            <Route
              path="/flesh-and-blood/simulator/tests/:fixtureId"
              element={<FleshAndBloodPracticePage />}
            />
            <Route
              path="/flesh-and-blood/simulator/play/practice"
              element={<FleshAndBloodPracticePage />}
            />
          </Routes>
        </FleshAndBloodSimulatorProviders>
      </MemoryRouter>,
    );

    // Same page chrome as interactive practice — not a separate fixture shell.
    const playSurface = await screen.findByTestId("fab-practice-page");
    expect(playSurface.getAttribute("data-play-surface")).toBe("true");
    expect(playSurface.getAttribute("data-engine")).toBe("local");
    expect(playSurface.getAttribute("data-fixture")).toBe("combat");
    expect(screen.getByTestId("fab-tabletop")).not.toBeNull();
    expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-state")).toBe("active");
    expect(screen.getAllByTestId("fab-match-actions").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("tab", { name: "Now" }));
    expect(screen.getByTestId("fab-legal-moves")).not.toBeNull();
  });

  it("restores the persisted pre-command checkpoint after undo and remount", async () => {
    const fixtureId = "practice-matchup-rhinar-vs-tuffnut";
    const storageKey = `fab-practice:fixture:${fixtureId}:v1`;
    window.sessionStorage.removeItem(storageKey);
    renderFixtureRoute(fixtureId);

    await screen.findByTestId("fab-practice-page", {}, { timeout: 15_000 });
    expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
    const pass = await screen.findByTestId("fab-quick-pass");
    await waitFor(() => expect((pass as HTMLButtonElement).disabled).toBe(false));
    fireEvent.click(pass);
    await waitFor(() => expect(window.sessionStorage.getItem(storageKey)).not.toBeNull());
    const postCommandStateId = (
      JSON.parse(window.sessionStorage.getItem(storageKey)!) as {
        readonly snapshot: { readonly stateID: number };
      }
    ).snapshot.stateID;

    let undo: HTMLElement | undefined;
    await waitFor(() => {
      undo = screen
        .getAllByTestId("fab-action-undo")
        .find((candidate) => !(candidate as HTMLButtonElement).disabled);
      expect(undo).toBeDefined();
    });
    fireEvent.click(undo!);
    await waitFor(() => {
      const saved = JSON.parse(window.sessionStorage.getItem(storageKey)!) as {
        readonly snapshot: { readonly stateID: number };
      };
      expect(saved.snapshot.stateID).toBeLessThan(postCommandStateId);
    });
    const undoneStateId = (
      JSON.parse(window.sessionStorage.getItem(storageKey)!) as {
        readonly snapshot: { readonly stateID: number };
      }
    ).snapshot.stateID;

    cleanup();
    renderFixtureRoute(fixtureId);
    await screen.findByTestId("fab-practice-page", {}, { timeout: 15_000 });
    expect(
      (
        JSON.parse(window.sessionStorage.getItem(storageKey)!) as {
          readonly snapshot: { readonly stateID: number };
        }
      ).snapshot.stateID,
    ).toBe(undoneStateId);
    window.sessionStorage.removeItem(storageKey);
  }, 30_000);

  it("renders mirrored face-to-face videos for the dual-subscriber sideboard fixture", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          heroes: [
            {
              name: "Dorinthea",
              portrait: "portraits/dorinthea.webp",
              background: "backgrounds/solana.webp",
              video: "videos/dorinthea.mp4",
            },
            {
              name: "Rhinar",
              portrait: "portraits/rhinar.webp",
              background: "backgrounds/savage-lands.webp",
              video: "videos/rhinar.mp4",
            },
          ],
        }),
      })),
    );

    renderFixtureRoute("sideboarding-subscribers-mock?opponentHero=rhinar");

    const fixture = await screen.findByTestId("fab-sideboarding-subscribers-mock");
    const selfVideo = await screen.findByTestId("fab-sideboard-hero-video-self");
    const opponentVideo = await screen.findByTestId("fab-sideboard-hero-video-opponent");

    expect(selfVideo.classList.contains("fab-sideboard-hero-video--opponent")).toBe(false);
    expect(opponentVideo.classList.contains("fab-sideboard-hero-video--opponent")).toBe(true);
    expect(selfVideo.querySelector("source")?.getAttribute("src")).toContain(
      "/videos/dorinthea.mp4",
    );
    expect(opponentVideo.querySelector("source")?.getAttribute("src")).toContain(
      "/videos/rhinar.mp4",
    );
    await waitFor(() =>
      expect(
        screen.getByTestId("fab-pregame-sideboard").getAttribute("data-presentation-state"),
      ).toBe("ready"),
    );
    expect(fixture.querySelectorAll('img[data-art-variant="no-text"]').length).toBeGreaterThan(5);
    expect(fixture.querySelectorAll(".supporter-player-name.is-supporter")).toHaveLength(2);
    expect(fixture.querySelector(".supporter-player-name__tier")).toBeNull();
  });

  it("opens the post-game summary component lab in a linkable cards state", async () => {
    renderFixtureRoute("post-game-summary?scope=game&tab=cards&outcome=defeat&premium=none");

    const fixture = await screen.findByTestId("fab-post-game-summary-fixture");
    expect(screen.getByRole("heading", { name: "Defeat" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Cards", pressed: true })).not.toBeNull();
    expect(fixture.querySelectorAll(".fab-summary-card-table tbody tr").length).toBeGreaterThan(10);
    expect(screen.getByTestId("fab-summary-mock-disclosure").textContent).toContain("illustrative");
  });

  it("uses linked supporter identity without labeling free players", async () => {
    renderFixtureRoute("sideboarding-mock");

    const fixture = await screen.findByTestId("fab-sideboarding-mock");
    expect(screen.getByRole("link", { name: "Wazar, Legend profile" }).getAttribute("href")).toBe(
      "https://tcg.online/profile/wazar",
    );
    expect(screen.getByRole("link", { name: "StormRider profile" }).getAttribute("href")).toBe(
      "https://tcg.online/profile/stormrider",
    );
    expect(fixture.textContent).not.toContain("Free account");
    expect(fixture.querySelector(".fab-sideboard-workspace-head")?.textContent).toContain(
      "Starting deck71 cards selected · 60 minimum",
    );
  });

  it("configures both subscription states with a valid opponent hero", async () => {
    renderFixtureRoute("sideboarding-subscribers-mock?playerTier=free&opponentTier=free");

    const fixture = await screen.findByTestId("fab-sideboarding-subscribers-mock");
    expect(screen.getByRole("link", { name: "Wazar profile" })).not.toBeNull();
    expect(screen.getByRole("link", { name: "StormRider profile" })).not.toBeNull();
    await waitFor(() => expect(fixture.textContent).toContain("Rhinar, Reckless Rampage"));
    expect(fixture.querySelector(".supporter-player-name.is-supporter")).toBeNull();
    expect(fixture.querySelector("video")).toBeNull();
    expect(screen.queryByText("Editing deck and loadout")).toBeNull();
    expect(screen.getAllByText("pending")).toHaveLength(2);
  });

  it("shows pending and ready states for both players", () => {
    const player = resolvePracticeDeckSelection(
      "cc-las-vegas-3rd-dorinthea",
      "sideboarding-ready-status",
    );

    render(
      <FleshAndBloodSimulatorProviders>
        <FabPregameSideboard
          pool={player.cardPool}
          player={{ label: "Wazar", heroName: "Dorinthea Ironsong" }}
          opponent={{ label: "StormRider", heroName: "Rhinar, Reckless Rampage" }}
          locked
          opponentReady
          onConfirm={() => undefined}
          onLeave={() => undefined}
        />
      </FleshAndBloodSimulatorProviders>,
    );

    const currentPlayer = screen.getByRole("region", { name: "Current player: Wazar" });
    const opponent = screen.getByRole("region", { name: "Opponent: StormRider" });
    expect(within(currentPlayer).getByText("ready")).not.toBeNull();
    expect(within(opponent).getByText("ready")).not.toBeNull();
    expect(within(currentPlayer).queryByText("Editing deck and loadout")).toBeNull();
  });

  it("shows Jarl's printed identity and Essence access as a legal game preparation", () => {
    const player = resolvePracticeDeckSelection("cc-edinburgh-5th-jarl", "jarl-preboarding");

    render(
      <FleshAndBloodSimulatorProviders>
        <FabPregameSideboard
          pool={player.cardPool}
          player={{ label: "You", heroName: "Jarl Vetreiði" }}
          opponent={{ label: "Practice bot", heroName: "Aurora, Legacy of Tempest" }}
          onConfirm={() => undefined}
          onLeave={() => undefined}
        />
      </FleshAndBloodSimulatorProviders>,
    );

    const access = screen.getByLabelText("Hero deckbuilding access");
    expect(access.textContent).toContain("Guardian Elemental");
    expect(access.textContent).toContain("Essence of Earth and Ice");
    expect(screen.queryByText(/Deck needs attention/)).toBeNull();
    expect(
      (screen.getByRole("button", { name: "Confirm selection" }) as HTMLButtonElement).disabled,
    ).toBe(false);
  });

  it("renders a normalized authored 2H weapon in the pregame sideboard", () => {
    const player = resolvePracticeDeckSelection(
      "cc-las-vegas-3rd-dorinthea",
      "normalized-2h-sideboard",
    );

    render(
      <FleshAndBloodSimulatorProviders>
        <FabPregameSideboard
          pool={player.cardPool}
          player={{ label: "You", heroName: "Dorinthea Ironsong" }}
          opponent={{ label: "Practice bot", heroName: "Rhinar, Reckless Rampage" }}
          onConfirm={() => undefined}
          onLeave={() => undefined}
        />
      </FleshAndBloodSimulatorProviders>,
    );

    expect(screen.getByTestId("fab-pregame-sideboard")).not.toBeNull();
    expect(screen.getByRole("region", { name: "Starting deck and equipment" })).not.toBeNull();
    expect(screen.getByTitle("Dawnblade")).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "Change weapon1 equipment from Dawnblade to empty" }),
    ).not.toBeNull();
  });

  it("protects changed game preparation choices before resetting them", async () => {
    const player = resolvePracticeDeckSelection(
      "cc-las-vegas-3rd-dorinthea",
      "confirm-sideboard-reset",
    );

    render(
      <FleshAndBloodSimulatorProviders>
        <FabPregameSideboard
          pool={player.cardPool}
          player={{ label: "You", heroName: "Dorinthea Ironsong" }}
          opponent={{ label: "Practice bot", heroName: "Rhinar, Reckless Rampage" }}
          onConfirm={() => undefined}
          onLeave={() => undefined}
        />
      </FleshAndBloodSimulatorProviders>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Change weapon1 equipment from Dawnblade to empty",
      }),
    );
    expect(
      screen.getByRole("button", {
        name: "Change weapon1 equipment from Empty weapon1 to Dawnblade",
      }),
    ).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(await screen.findByRole("dialog", { name: "Reset game preparation?" })).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Keep changes" }));
    expect(
      screen.getByRole("button", {
        name: "Change weapon1 equipment from Empty weapon1 to Dawnblade",
      }),
    ).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    fireEvent.click(await screen.findByRole("button", { name: "Reset selection" }));
    expect(
      screen.getByRole("button", {
        name: "Change weapon1 equipment from Dawnblade to empty",
      }),
    ).not.toBeNull();
  });

  it("randomizes the opponent hero when the fixture URL does not configure one", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999_999);
    renderFixtureRoute("sideboarding-mock");

    const fixture = await screen.findByTestId("fab-sideboarding-mock");
    await waitFor(() => expect(fixture.textContent).toContain("Rhinar, Reckless Rampage"));
  });

  it("changes and persists the responsive sideboard grid density", async () => {
    renderFixtureRoute("sideboarding-mock");
    await screen.findByTestId("fab-sideboarding-mock");

    const grid = document.querySelector(".fab-sideboard-grid");
    expect(grid?.classList.contains("fab-sideboard-grid--balanced")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Show 4 columns" }));
    expect(grid?.classList.contains("fab-sideboard-grid--spacious")).toBe(true);
    expect(window.localStorage.getItem("fab-sideboard-grid-density")).toBe("spacious");
    expect(
      screen.getByRole("button", { name: "Show 4 columns" }).getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("defaults to four-column density on a narrow viewport", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 390,
    });
    renderFixtureRoute("sideboarding-mock");
    await screen.findByTestId("fab-sideboarding-mock");

    expect(document.querySelector(".fab-sideboard-grid--spacious")).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "Show 4 columns" }).getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("cycles equipment directly from the collapsed loadout dock", async () => {
    renderFixtureRoute("sideboarding-mock");
    await screen.findByTestId("fab-sideboarding-mock");

    const dawnblade = screen.getByRole("button", {
      name: /Change weapon1 equipment from Dawnblade to empty/i,
    });
    fireEvent.click(dawnblade);

    const emptyWeapon = screen.getByRole("button", {
      name: /Change weapon1 equipment from Empty weapon1 to Dawnblade/i,
    });
    expect(emptyWeapon.querySelector(".fab-sideboard-equipped-empty")).not.toBeNull();
    fireEvent.click(emptyWeapon);
    expect(
      screen.getByRole("button", { name: /Change weapon1 equipment from Dawnblade to empty/i }),
    ).not.toBeNull();
  });

  it("cycles card-face clicks through every available deck quantity", async () => {
    renderFixtureRoute("sideboarding-mock");
    await screen.findByTestId("fab-sideboarding-mock");

    const quantity = screen.getByLabelText("Blade Flurry deck quantity");
    const clickNextQuantity = (next: number) => {
      fireEvent.click(
        screen.getByRole("button", { name: `Set Blade Flurry deck quantity to ${next}` }),
      );
    };

    expect(quantity.textContent).toContain("3/3");
    clickNextQuantity(0);
    expect(quantity.textContent).toContain("0/3");
    clickNextQuantity(1);
    expect(quantity.textContent).toContain("1/3");
    clickNextQuantity(2);
    expect(quantity.textContent).toContain("2/3");
    clickNextQuantity(3);
    expect(quantity.textContent).toContain("3/3");
    clickNextQuantity(0);
    expect(quantity.textContent).toContain("0/3");

    const singleCopy = screen.getByLabelText("Gleam of the Blade deck quantity");
    fireEvent.click(
      screen.getByRole("button", { name: "Set Gleam of the Blade deck quantity to 0" }),
    );
    expect(singleCopy.textContent).toContain("0/1");
    fireEvent.click(
      screen.getByRole("button", { name: "Set Gleam of the Blade deck quantity to 1" }),
    );
    expect(singleCopy.textContent).toContain("1/1");
  });

  it("explains every invalid deck selection and disables confirmation below the format minimum", async () => {
    renderFixtureRoute("sideboarding-subscribers-mock");
    await screen.findByTestId("fab-sideboarding-subscribers-mock");

    for (const cardName of ["Blade Flurry", "Ironsong Response", "Jagged Edge", "Puncture"]) {
      fireEvent.click(screen.getByRole("button", { name: `Set ${cardName} deck quantity to 0` }));
    }

    const reason = "Classic Constructed requires at least 60 starting-deck cards.";
    const confirm = screen.getByRole("button", { name: "Confirm selection" }) as HTMLButtonElement;
    expect(confirm.disabled).toBe(true);
    expect(screen.getByRole("tooltip").textContent).toContain(reason);
    expect(document.querySelector(".fab-sideboard-validation")?.textContent).toContain(reason);
    expect(document.querySelector(".fab-sideboard-footer .is-invalid")?.textContent).toContain(
      "1 rule check needs attention",
    );
  });

  it("uses the existing preview surface for animation-owned permanents", () => {
    renderTabletop(createClosedWithPermanentsFixtureState({ bothPlayers: true }), {
      forceMobileLayout: false,
    });

    const permanent = screen
      .getByRole("list", { name: "Your permanents, 8 cards" })
      .querySelector("[data-entity-id]");
    expect(permanent).not.toBeNull();

    fireEvent.mouseEnter(permanent!);
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
  });

  it("opens the shared card popover for a real card with a payable optional additional cost", async () => {
    const match = getFabEngineScenario("additional-cost-keyword-lab")?.boot();
    if (!match) throw new Error("Missing additional-cost keyword lab scenario.");
    const viewerId = match.player1Id;
    const bellowId = match.engine
      .as(catalogIds.bravo, 1)
      .findCardInZone("hand", FAB_KEYWORD_ANIMATION_FIXTURE_IDS.beatChest);
    const legalCommands = listLegalCommands(match.runtime, viewerId);
    expect(
      legalCommands.filter(
        (command) =>
          command.move === "begin-play" && command.label.startsWith("Play Bonebreaker Bellow"),
      ),
    ).toHaveLength(2);
    renderTabletop(presentRuntime(match.runtime, viewerId), {
      readOnly: false,
      legalCommands,
      onLegalCommand: vi.fn(),
    });

    const bellowButton = screen
      .getByTestId("fab-hand-bottom")
      .querySelector(`[data-entity-id="${bellowId}"]`)
      ?.closest("button");
    expect(bellowButton).not.toBeNull();
    await waitFor(() =>
      expect(
        bellowButton
          ?.querySelector('[data-card-interaction="actionable"]')
          ?.getAttribute("data-action-count"),
      ).toBe("2"),
    );
    fireEvent.click(bellowButton!);

    const popover = await screen.findByTestId("card-context-menu");
    expect(
      within(popover)
        .getAllByRole("menuitem", { hidden: true })
        .map((action) => action.textContent),
    ).toEqual([
      "Play Bonebreaker Bellow",
      "Play Bonebreaker Bellow with Beat Chest with Alpha Rampage",
    ]);
  });

  it("offers and applies the optional Arsenal choice after End turn", async () => {
    renderFixtureRoute("closed-sparse");
    await screen.findByTestId("fab-practice-page");
    fireEvent.click(screen.getByRole("tab", { name: "Now" }));

    const endTurn = screen
      .getAllByTestId("fab-action-end-turn")
      .find((button) => !(button as HTMLButtonElement).disabled);
    expect(endTurn).toBeDefined();
    fireEvent.click(endTurn!);

    const prompt = await screen.findByTestId("interaction-resolution-prompt");
    expect(within(prompt).getAllByText("Arsenal a card").length).toBeGreaterThan(0);
    // Optional single-card Arsenal choice: one click on the card commits it
    // immediately; only declining stays on the prompt's Choose none button.
    expect(within(prompt).queryByRole("button", { name: "Confirm choice" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /^Snatch, card, player-1,/ }));

    await vi.waitFor(() => {
      expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
    });
    expect(await screen.findByLabelText("Inspect Arsenal, 1 card")).not.toBeNull();
  });

  it.each([
    ["desktop", /^Attack: Snatch.*1 action available/i],
    ["mobile", /^Block: No Hero Stands Alone.*1 action available/i],
  ] as const)(
    "highlights combat-chain targets and selects them with one click on %s",
    async (layout, selectedCardName) => {
      const match = getFabEngineScenario("no-hero-stands-alone-defense-target")?.boot();
      if (!match) throw new Error("Missing SUP020 defense-target scenario.");
      const game = FabTestEngine.fromRuntime(match.runtime);
      const Tuffnut = game.as(tuffnut);
      const Dash = game.as(dash);
      const arsenalCopy = Tuffnut.cardIn("arsenal", noHeroStandsAloneYellow);
      Tuffnut.endTurn();
      game.untilIdle({ ordering: "listed" });
      Dash.playAttack(snatchRed);
      Tuffnut.defendWith(arsenalCopy);
      game.untilIdle({ optionals: "accept", entityTargets: "pause", ordering: "listed" });
      const onSubmitInteraction = vi.fn();
      renderTabletop(presentRuntime(match.runtime, match.player2Id), {
        viewerId: match.player2Id,
        forceMobileLayout: layout === "mobile",
        interactionView: projectFabInteraction(match.runtime, match.player2Id).view,
        onSubmitInteraction,
        readOnly: false,
      });

      const prompt = await screen.findByTestId("interaction-resolution-prompt");
      expect(within(prompt).queryByRole("button", { name: "Choose card" })).toBeNull();

      const chain = screen.getByTestId("fab-combat-chain");
      const attack = within(chain).getByRole("button", {
        name: /^Attack: Snatch.*1 action available/i,
      });
      const defender = within(chain).getByRole("button", {
        name: /^Block: No Hero Stands Alone.*1 action available/i,
      });
      expect(attack.querySelector('[data-card-interaction-outline="actionable"]')).not.toBeNull();
      expect(defender.querySelector('[data-card-interaction-outline="actionable"]')).not.toBeNull();

      const selectedCard = within(chain).getByRole("button", { name: selectedCardName });
      fireEvent.click(selectedCard);

      expect(onSubmitInteraction).toHaveBeenCalledTimes(1);
      expect(onSubmitInteraction).toHaveBeenCalledWith(
        expect.objectContaining({
          values: { answer: [selectedCard.getAttribute("data-chain-card-id")] },
        }),
      );
    },
  );

  it.each(["desktop", "mobile"] as const)(
    "opens and submits private deck search with an inspectable preview on %s",
    async (layout) => {
      const session = renderFabSimulatorScenario({ scenarioId: "deck-search", layout });
      await session.pom.waitForReady();

      fireEvent.click(screen.getByRole("button", { name: /^Sand Sketched Plan, card, player-1,/ }));

      let modal = await screen.findByTestId("target-filter-modal");
      expect(within(modal).getByRole("heading", { name: "Search your deck" })).not.toBeNull();
      expect(within(modal).getByText("0/1 selected")).not.toBeNull();

      for (const cardName of ["Alpha Rampage", "Snatch", "Nimblism"]) {
        const card = within(modal).getByRole("listitem", {
          name: new RegExp(`^${cardName}(?:, \\d+ copies)?$`),
        });
        expect(card.querySelector("img")?.getAttribute("src")).toContain(
          "/public/fab/assets/board/",
        );
        expect(
          card.querySelector('[data-card-image-mode="full"]')?.getAttribute("style"),
        ).toContain("aspect-ratio: 1");
        expect(card.querySelector('[data-fab-card-frame="tactical"]')).not.toBeNull();
        expect(card.textContent).toContain(cardName);
      }

      if (layout === "mobile") {
        const summary = within(modal).getByText(/^Preview /, { selector: "summary" });
        const disclosure = summary.closest("details");
        expect(disclosure?.open).toBe(false);
        fireEvent.click(summary);
        expect(disclosure?.open).toBe(true);
        fireEvent.click(within(modal).getByRole("button", { name: "Preview next card" }));
        expect(within(modal).getByText("Preview Snatch", { selector: "summary" })).not.toBeNull();
        expect(
          within(modal).getByTestId("fab-card-preview-surface").querySelector("img")?.alt,
        ).toBe("Snatch");
        expect(within(modal).getByText("0/1 selected")).not.toBeNull();
        fireEvent.mouseEnter(within(modal).getByRole("listitem", { name: /^Nimblism/ }));
        expect(within(modal).getByText("Preview Nimblism", { selector: "summary" })).not.toBeNull();
        expect(
          within(modal).getByTestId("fab-card-preview-surface").querySelector("img")?.alt,
        ).toBe("Nimblism");
        fireEvent.click(within(modal).getByRole("button", { name: "Preview previous card" }));
        expect(within(modal).getByText("Preview Snatch", { selector: "summary" })).not.toBeNull();
        fireEvent.mouseEnter(within(modal).getByRole("listitem", { name: /^Alpha Rampage/ }));
        expect(
          within(modal).getByText("Preview Alpha Rampage", { selector: "summary" }),
        ).not.toBeNull();
        fireEvent.click(summary);
        expect(disclosure?.open).toBe(false);
      } else {
        expect(within(modal).queryByText(/^Preview /, { selector: "summary" })).toBeNull();
      }
      const preview = within(modal).getByTestId("fab-card-preview-surface");
      expect(preview.querySelector("img")?.getAttribute("src")).toContain(
        "/public/fab/assets/full/",
      );

      fireEvent.click(within(modal).getByRole("button", { name: "Minimize Search your deck" }));
      expect(screen.queryByTestId("target-filter-modal")).toBeNull();
      const prompt = screen.getByTestId("interaction-resolution-prompt");
      fireEvent.click(within(prompt).getByRole("button", { name: "Choose card" }));

      modal = await screen.findByTestId("target-filter-modal");
      expect(within(modal).queryByRole("button", { name: "Confirm choice" })).toBeNull();
      const snatch = within(modal).getByRole("listitem", { name: /^Snatch/ });
      fireEvent.click(snatch.querySelector("button")!);

      await waitFor(() => {
        expect(screen.queryByTestId("target-filter-modal")).toBeNull();
      });
    },
    20_000,
  );

  it("loads card art for hosted deck-search candidates omitted from the state definitions", async () => {
    const state = createOpeningFixtureState();
    const slothId = "BMgj68hT9jQHQ6nFqhTDT";
    const greedId = "MT8LQJTF6w8gPqMzNTrkr";
    expect(state.cardDefinitions[slothId]).toBeUndefined();
    expect(state.cardDefinitions[greedId]).toBeUndefined();
    const prompt = "Search your deck";
    const interactionView: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "player-1",
      stateVersion: 9,
      status: "choosing",
      resolution: {
        actingPlayerId: "player-1",
        pendingCount: 1,
        currentEffect: { id: "hosted-deck-search", text: { key: prompt } },
        currentStep: {
          index: 1,
          count: 1,
          text: { key: "Choose a card required by this effect." },
          requirement: {
            kind: "entity-selection",
            text: { key: "Choose a card required by this effect." },
            required: true,
          },
        },
      },
      actions: [
        {
          id: "answer-hosted-deck-search",
          requestId: "answer:9",
          intent: "choose-option",
          text: { key: prompt },
          enabled: true,
          inputs: [
            {
              id: "card",
              kind: "entity-selection",
              role: "target",
              entityKinds: ["card"],
              text: { key: "Choose a card required by this effect." },
              required: true,
              min: 1,
              max: 1,
              ordered: false,
              candidates: [
                { instanceId: "sloth-1", definitionId: slothId, name: "Runechant of Sloth" },
                { instanceId: "greed-1", definitionId: greedId, name: "Runechant of Greed" },
              ].map(({ instanceId, definitionId, name }) => ({
                entity: {
                  kind: "card" as const,
                  instanceId,
                  definitionId,
                  ownerId: "player-1",
                  zoneId: "player-1:deck",
                },
                text: { key: name },
                enabled: true,
              })),
            },
          ],
        },
      ],
    };

    render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          state={state}
          viewerId="player-1"
          readOnly={false}
          interactionView={interactionView}
          onSubmitInteraction={vi.fn()}
        />
      </FleshAndBloodSimulatorProviders>,
    );

    const modal = await screen.findByTestId("target-filter-modal");
    await waitFor(
      () => {
        for (const name of ["Runechant of Sloth", "Runechant of Greed"]) {
          const card = within(modal).getByRole("listitem", { name: new RegExp(`^${name}`) });
          expect(card.querySelector("img")?.getAttribute("src")).toMatch(
            /\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/,
          );
        }
        expect(
          within(modal)
            .getByTestId("fab-card-preview-surface")
            .querySelector("img")
            ?.getAttribute("src"),
        ).toMatch(/\/public\/fab\/assets\/full\/[a-f0-9]{64}\.webp$/);
      },
      { timeout: 15_000 },
    );
  });

  it.each(["desktop", "mobile"] as const)(
    "builds a four-card pitch stack in future draw order and auto-places the last card on %s",
    async (layout) => {
      const session = renderFabSimulatorScenario({ scenarioId: "pitch-stack-four-cards", layout });
      await session.pom.waitForReady();

      const panel = await screen.findByTestId("fab-pitch-order-panel");
      const prompt = screen.getByTestId("interaction-resolution-prompt");
      expect(within(prompt).getByText("Order pitched cards")).not.toBeNull();
      expect(
        within(prompt).getByText(
          "First picked draws first. The last card is placed automatically.",
        ),
      ).not.toBeNull();
      expect(prompt.textContent).not.toContain("select the deepest pitched card first");
      expect(within(prompt).queryByRole("button", { name: "Confirm order" })).toBeNull();
      expect(within(prompt).queryByRole("button", { name: "Choose order" })).toBeNull();
      expect(within(panel).queryByRole("button", { name: /confirm/i })).toBeNull();

      fireEvent.click(
        within(panel).getByRole("button", {
          name: "Choose Snatch as the first pitched card drawn",
        }),
      );
      fireEvent.click(
        within(panel).getByRole("button", {
          name: "Choose Sink Below as the second pitched card drawn",
        }),
      );
      fireEvent.click(
        within(panel).getByRole("button", {
          name: "Choose Disable as the third pitched card drawn",
        }),
      );

      await vi.waitFor(() => {
        expect(screen.queryByTestId("fab-pitch-order-panel")).toBeNull();
      });
      await vi.waitFor(() => {
        expect(
          layout === "mobile"
            ? screen.getByRole("button", { name: "Open Pitch, 0 cards" })
            : within(screen.getByTestId("fab-player-bottom")).getByRole("button", {
                name: "Inspect Pitch, 0 cards",
              }),
        ).not.toBeNull();
      });
    },
  );

  it("resolves saved trigger card names from outside the current match", async () => {
    const storageKey = "matchmaking.flesh-and-blood.opponentTriggerYieldCardIds";
    const previous = window.localStorage.getItem(storageKey);
    const canonicalId = "zCWhR7jRCmH7D7fKDGKcF";
    window.localStorage.setItem(storageKey, JSON.stringify([canonicalId]));
    try {
      const session = renderFabSimulatorScenario({ scenarioId: "pitch-stack-four-cards" });
      await session.pom.waitForReady();
      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Settings" }));
      const settings = within(screen.getByRole("dialog", { name: "Settings" }));
      fireEvent.click(settings.getByRole("tab", { name: "Game" }));
      const savedYields = within(
        settings.getByRole("list", { name: "Saved opponent trigger yields" }),
      );
      expect(await savedYields.findByText("Beaten Trackers")).not.toBeNull();
      expect(savedYields.queryByText(canonicalId)).toBeNull();
      expect(
        savedYields.getByRole("button", { name: "Remove saved trigger yield for Beaten Trackers" }),
      ).not.toBeNull();
    } finally {
      if (previous === null) window.localStorage.removeItem(storageKey);
      else window.localStorage.setItem(storageKey, previous);
    }
  });

  it("resolves fixture id from route param or ?fixture= query", () => {
    expect(resolveFabRouteFixtureId("combat", "")).toBe("combat");
    expect(resolveFabRouteFixtureId(undefined, "?fixture=between-links")).toBe("between-links");
    expect(resolveFabRouteFixtureId(undefined, "")).toBeNull();
  });

  it("loads fixture via practice query override on the real play path", async () => {
    render(
      <MemoryRouter initialEntries={["/flesh-and-blood/simulator/play/practice?fixture=combat"]}>
        <FleshAndBloodSimulatorProviders>
          <Routes>
            <Route
              path="/flesh-and-blood/simulator/play/practice"
              element={<FleshAndBloodPracticePage />}
            />
          </Routes>
        </FleshAndBloodSimulatorProviders>
      </MemoryRouter>,
    );

    const playSurface = await screen.findByTestId("fab-practice-page");
    expect(playSurface.getAttribute("data-fixture")).toBe("combat");
    expect(playSurface.getAttribute("data-engine")).toBe("local");
    expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-state")).toBe("active");
  });

  it("retains attack-reaction history in the damage-step fixture", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "damage-step",
    );
    expect(fixture).toBeDefined();

    const combat = projectCombatChainView(fixture!.create());
    expect(combat.step).toBe("damage");
    expect(combat.reactions.find((reaction) => reaction.entity.title === "Pummel")?.role).toBe(
      "attack-reaction",
    );
  });

  it("gives a pending layer priority over closing the chain during Resolution", async () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "resolution-stack-priority",
    );
    expect(fixture).toBeDefined();
    const fixtureState = fixture!.create();
    expect(fixtureState.combat?.step).toBe("resolution");
    expect(fixtureState.combat?.stackInstanceIds).toHaveLength(1);

    renderFixtureRoute("resolution-stack-priority");
    await screen.findByTestId("fab-practice-page");

    expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-step")).toBe(
      "resolution",
    );
    const prompt = await screen.findByTestId("interaction-resolution-prompt");
    expect(prompt.textContent).toMatch(/Sigil of Solace/i);
    expect(within(prompt).getByRole("button", { name: "Pass priority" })).not.toBeNull();
    expect(within(prompt).queryByRole("button", { name: "Close combat chain" })).toBeNull();
    expect(within(prompt).queryByRole("button", { name: "Choose next attack" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Close (combat )?chain/i })).toBeNull();
  });

  it("previews attack, block, and reaction cards from the combat chain", () => {
    const damageFixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "damage-step",
    );
    const defendFixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "defend-declared",
    );
    expect(damageFixture).toBeDefined();
    expect(defendFixture).toBeDefined();
    const withArtwork = (state: FabPresentationState): FabPresentationState => ({
      ...state,
      cardDefinitions: Object.fromEntries(
        Object.entries(state.cardDefinitions).map(([id, definition]) => [
          id,
          { ...definition, imageUrl: `https://example.test/fab-chain-${id}.webp` },
        ]),
      ),
    });

    const damageState = withArtwork(damageFixture!.create());
    const damageView = renderTabletop(damageState);
    const attack = screen.getByTestId("fab-chain-card-attack");
    const attackLane = screen.getByTestId("fab-chain-attacker");
    const attackReaction = attackLane.querySelector<HTMLElement>(
      '[data-chain-role="attack-reaction"]',
    );
    const reactions = Array.from(
      attackLane.querySelectorAll<HTMLElement>('[data-chain-role$="-reaction"]'),
    );
    expect(attackReaction).not.toBeNull();
    expect(attackReaction?.querySelector(".fab-chain-card-contribution")).toBeNull();
    expect(attackReaction?.querySelector(".fab-chain-role-pill")).toBeNull();
    expect(attack.querySelector(".fab-chain-card-contribution")).not.toBeNull();
    expect(Number(attack.parentElement?.parentElement?.style.zIndex)).toBeGreaterThan(
      Number(attackReaction?.parentElement?.parentElement?.style.zIndex),
    );
    expect(screen.getByTestId("fab-chain-blocks").getAttribute("data-sim-anchor-id")).toBe(
      `fab:${projectCombatChainView(damageState).defendingPlayerId}:defense`,
    );
    expect(attackReaction?.getAttribute("aria-label")).toMatch(/Pummel/);
    expect(attackLane.textContent).not.toContain("Sink Below");
    const sinkBelowCards = Array.from(
      screen.getByTestId("fab-combat-chain").querySelectorAll<HTMLElement>(".fab-chain-card"),
    ).filter((card) => card.getAttribute("aria-label")?.includes("Sink Below"));
    expect(sinkBelowCards).toHaveLength(1);
    expect(screen.getByTestId("fab-chain-blocks").contains(sinkBelowCards[0])).toBe(true);

    for (const card of [attack, ...reactions]) {
      fireEvent.mouseEnter(card);
      expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
      fireEvent.mouseLeave(card);
      expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).not.toBe("true");
    }

    fireEvent.focus(attack);
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
    fireEvent.blur(attack);
    damageView.unmount();

    renderTabletop(withArtwork(defendFixture!.create()));
    const block = document.querySelector<HTMLElement>('[data-chain-role="defend"]');
    expect(block).not.toBeNull();
    fireEvent.mouseEnter(block!);
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
  });

  it("keeps a pending defense reaction in the stack until it resolves", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "damage-step",
    );
    expect(fixture).toBeDefined();
    const state = fixture!.create();
    const activeLink = state.combat?.activeLink;
    expect(activeLink).toBeDefined();
    const pendingReactionId = activeLink!.reactionInstanceIds.find((instanceId) =>
      activeLink!.defendingInstanceIds.includes(instanceId),
    );
    expect(pendingReactionId).toBeDefined();
    expect(activeLink!.defendingInstanceIds).toContain(pendingReactionId);

    renderTabletop({
      ...state,
      stackInstanceIds: [pendingReactionId!],
      combat: {
        ...state.combat!,
        step: "reaction",
        stackInstanceIds: [pendingReactionId!],
      },
    });

    expect(screen.getByTestId("fab-compact-resolution-stack")).not.toBeNull();
    const pendingCardName = state.cardDefinitions[state.cards[pendingReactionId!]!.cardId]!.name;
    const chainCopies = Array.from(
      screen.getByTestId("fab-combat-chain").querySelectorAll<HTMLElement>(".fab-chain-card"),
    ).filter((card) => card.getAttribute("aria-label")?.includes(pendingCardName));
    expect(chainCopies).toHaveLength(0);
  });

  it("projects hit, blocked, and active links in the multi-link history fixture", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "multi-link-history",
    );
    expect(fixture).toBeDefined();

    const combat = projectCombatChainView(fixture!.create());
    expect(combat.linkHistory).toHaveLength(3);
    expect(combat.linkHistory[0]?.damage).toBeGreaterThan(0);
    expect(combat.linkHistory.map((link) => [link.blocked, link.active])).toEqual([
      [false, false],
      [true, false],
      [false, true],
    ]);

    renderTabletop(fixture!.create(), { forceMobileLayout: true });
    expect(screen.queryByTestId("fab-chain-stack")).toBeNull();
    expect(screen.queryByTestId("fab-chain-equation")).toBeNull();
    const linkSelect = screen.getByRole("combobox", { name: "Chain link" });
    expect(screen.queryByTestId("fab-open-permanents")).toBeNull();
    expect(screen.queryByRole("tablist", { name: "Chain link history" })).toBeNull();
    fireEvent.click(linkSelect);
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByRole("option", { name: /Link 2.*Wrecker Romp.*Blocked/i })).not.toBeNull();
    expect(screen.getByRole("option", { name: "Link 3 · Alpha Rampage" })).not.toBeNull();
    expect(screen.getByTestId("fab-chain-mobile-totals").getAttribute("aria-label")).toMatch(
      /^\d+ power, \d+ defense$/i,
    );
    fireEvent.click(screen.getByRole("option", { name: /Link 2.*Wrecker Romp.*Blocked/i }));
    expect(
      screen.getByTestId("fab-chain-resolved-link-detail").getAttribute("data-link-index"),
    ).toBe("2");
    expect(screen.getByTestId("fab-chain-resolved-link-detail").textContent).toMatch(
      /Viewing Link 2.*Blocked/i,
    );
    expect(screen.getByTestId("fab-chain-link").getAttribute("data-inspecting-history")).toBe(
      "true",
    );
    expect(
      screen.getByTestId("fab-chain-attacker").querySelector('[aria-label="Attack: Wrecker Romp"]'),
    ).not.toBeNull();
    expect(screen.getByTestId("fab-chain-defender")).not.toBeNull();
    expect(screen.getByTestId("fab-chain-defender").querySelector('[data-kind="hero"]')).toBeNull();
    fireEvent.click(linkSelect);
    fireEvent.click(screen.getByRole("option", { name: /Link 1.*Snatch/i }));
    expect(
      screen.getByTestId("fab-chain-attacker").querySelector('[aria-label="Attack: Snatch"]'),
    ).not.toBeNull();
    expect(
      screen.getByTestId("fab-chain-blocks").querySelectorAll(".fab-chain-mobile-gallery-card"),
    ).toHaveLength(1);
    fireEvent.click(linkSelect);
    fireEvent.click(screen.getByRole("option", { name: "Link 3 · Alpha Rampage" }));
    expect(
      screen
        .getByTestId("fab-chain-attacker")
        .querySelector('[aria-label="Attack: Alpha Rampage"]'),
    ).not.toBeNull();
    expect(
      screen.getByTestId("fab-chain-blocks").querySelectorAll(".fab-chain-mobile-gallery-card"),
    ).toHaveLength(3);
    expect(screen.getByTestId("fab-chain-link").hasAttribute("data-inspecting-history")).toBe(
      false,
    );
    expect(screen.queryByTestId("fab-chain-resolved-link-detail")).toBeNull();
  });

  it("falls back to the active link when a controlled mobile selection is stale", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "multi-link-history",
    );
    expect(fixture).toBeDefined();
    const combat = projectCombatChainView(fixture!.create());

    render(
      <HeadlessMantineProvider>
        <FabPresentationTestProvider>
          <FabCardPreviewProvider>
            <CombatChain view={combat} density="mobile" selectedLinkIndex={99} />
          </FabCardPreviewProvider>
        </FabPresentationTestProvider>
      </HeadlessMantineProvider>,
    );

    expect(
      (screen.getByRole("combobox", { name: "Chain link" }) as HTMLInputElement).value,
    ).toContain("Link 3");
  });

  it("keeps the pending Layer Step attack in the selectable link navigator", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "multi-link-history",
    );
    expect(fixture).toBeDefined();

    const state = fixture!.create();
    const activeAttackId = state.combat?.activeLink?.attackInstanceId;
    expect(activeAttackId).toBeDefined();

    renderTabletop({
      ...state,
      stackInstanceIds: [activeAttackId!],
      combat: {
        ...state.combat!,
        step: "layer",
        activeLink: null,
        stackInstanceIds: [activeAttackId!],
      },
    });

    const pending = screen.getByRole("tab", {
      name: /Pending chain link 3: .* awaiting resolution in Layer Step/i,
    });
    expect(pending.textContent).toContain("L3");
    expect(pending.getAttribute("data-pending")).toBe("true");
    expect(pending.getAttribute("aria-selected")).toBe("true");

    fireEvent.click(screen.getByTestId("fab-chain-link-tab-1"));
    expect(
      screen.getByTestId("fab-chain-resolved-link-detail").getAttribute("data-link-index"),
    ).toBe("1");

    fireEvent.click(pending);
    expect(screen.queryByTestId("fab-chain-resolved-link-detail")).toBeNull();
    expect(pending.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-mode")).toBe("layer");
  });

  it("shows L2 pending when a new attack is played before the resolved L1 leaves activeLink", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "multi-link-history",
    );
    expect(fixture).toBeDefined();

    const state = fixture!.create();
    const activeLink = state.combat?.activeLink;
    expect(activeLink).toBeDefined();
    expect(activeLink!.defendingInstanceIds.length).toBeGreaterThan(0);
    const priorAttack = state.cards[activeLink!.attackInstanceId];
    expect(priorAttack).toBeDefined();
    const pendingAttackId = `${activeLink!.attackInstanceId}-pending`;

    renderTabletop({
      ...state,
      cards: {
        ...state.cards,
        [pendingAttackId]: {
          ...priorAttack!,
          id: pendingAttackId,
          zone: "stack",
        },
      },
      stackInstanceIds: [pendingAttackId],
      combat: {
        ...state.combat!,
        step: "layer",
        chainLinkNumber: 1,
        resolvedLinks: [],
        activeLink: {
          ...activeLink!,
          damageResolved: true,
          didHit: true,
          damage: 5,
        },
        stackInstanceIds: [pendingAttackId],
      },
    });

    expect(screen.getByTestId("fab-chain-link-tab-1").textContent).toContain("5");
    const pending = screen.getByRole("tab", {
      name: /Pending chain link 2: .* awaiting resolution in Layer Step/i,
    });
    expect(pending.textContent).toContain("L2");
    expect(pending.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-mode")).toBe("layer");
    expect(screen.queryByTestId("fab-chain-blocks")).toBeNull();
    expect(screen.getByTestId("fab-chain-no-blocks")).not.toBeNull();
    expect(screen.getByTestId("fab-chain-total-defense").textContent).toContain("0");
  });

  it("keeps long desktop link history bounded with the newest link visible", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "multi-link-history",
    );
    expect(fixture).toBeDefined();
    const state = fixture!.create();
    const sourceLinks = state.combat!.resolvedLinks!;
    const resolvedLinks = Array.from({ length: 7 }, (_, index) => ({
      ...sourceLinks[index % sourceLinks.length]!,
    }));
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(320);

    renderTabletop({
      ...state,
      combat: {
        ...state.combat!,
        resolvedLinks,
      },
    });

    const history = screen.getByTestId("fab-chain-link-history");
    const scroller = within(history).getByTestId("fab-chain-link-history-scroller");
    expect(within(history).getAllByRole("tab")).toHaveLength(8);
    expect(scroller.scrollTop).toBe(320);
    expect(within(history).getByTestId("fab-chain-link-tab-8").getAttribute("data-active")).toBe(
      "true",
    );
  });

  it("shows every recorded defending card when inspecting desktop link history", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "multi-link-history",
    );
    expect(fixture).toBeDefined();

    const rendered = renderTabletop(fixture!.create());
    const combatChain = rendered.container.querySelector<HTMLElement>(".fab-combat-chain--desktop");
    expect(combatChain).not.toBeNull();
    const chain = within(combatChain!);
    fireEvent.click(chain.getByTestId("fab-chain-link-tab-1"));

    const detail = chain.getByTestId("fab-chain-resolved-link-detail");
    const selectedTab = chain.getByTestId("fab-chain-link-tab-1");
    const defenders = within(detail).getByTestId("fab-chain-blocks");
    expect(defenders.querySelectorAll("[data-chain-card-id]")).toHaveLength(1);
    expect(detail.getAttribute("role")).toBe("tabpanel");
    expect(detail.getAttribute("aria-labelledby")).toBe(selectedTab.id);
    expect(selectedTab.getAttribute("aria-controls")).toBe(detail.id);
    expect(within(detail).getByTestId("fab-chain-attacker")).not.toBeNull();
    expect(within(detail).getByTestId("fab-chain-defender")).not.toBeNull();
    expect(within(detail).getByTestId("fab-chain-reactions")).not.toBeNull();
    expect(within(detail).queryByTestId("fab-keyword-intimidate")).toBeNull();
  });

  it("switches desktop chain-link tabs with arrow, Home, and End keys", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "multi-link-history",
    );
    expect(fixture).toBeDefined();

    const rendered = renderTabletop(fixture!.create());
    const combatChain = rendered.container.querySelector<HTMLElement>(".fab-combat-chain--desktop");
    expect(combatChain).not.toBeNull();
    const chain = within(combatChain!);
    const first = chain.getByTestId("fab-chain-link-tab-1");
    const second = chain.getByTestId("fab-chain-link-tab-2");
    const current = chain.getByTestId("fab-chain-link-tab-3");

    expect(current.getAttribute("aria-selected")).toBe("true");
    expect(current.tabIndex).toBe(0);
    current.focus();
    fireEvent.keyDown(current, { key: "ArrowUp" });
    expect(second.getAttribute("aria-selected")).toBe("true");
    expect(second.tabIndex).toBe(0);
    expect(document.activeElement).toBe(second);
    expect(
      chain.getByTestId("fab-chain-resolved-link-detail").getAttribute("data-link-index"),
    ).toBe("2");

    fireEvent.keyDown(second, { key: "Home" });
    expect(first.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(first, { key: "End" });
    expect(current.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(current);
    expect(chain.queryByTestId("fab-chain-resolved-link-detail")).toBeNull();
  });

  it("opens a single pending effect in the mobile stack popover", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "damage-step",
    );
    expect(fixture).toBeDefined();

    const state = fixture!.create();
    const stackInstanceId = Object.keys(state.cards)[0];
    expect(stackInstanceId).toBeDefined();
    renderTabletop(
      {
        ...state,
        combat: state.combat ? { ...state.combat, stackInstanceIds: [stackInstanceId!] } : null,
      },
      { forceMobileLayout: true },
    );

    fireEvent.click(screen.getByRole("button", { name: "Open stack, 1 pending effect" }));
    const stackPanel = screen.getByRole("dialog", { name: "Stack" });
    expect(within(stackPanel).getAllByRole("listitem")).toHaveLength(1);
    expect(screen.queryByTestId("fab-chain-mobile-footer")).toBeNull();
    expect(screen.queryByTestId("fab-chain-stack")).toBeNull();
    expect(screen.queryByTestId("fab-sidebar-resolution-stack")).toBeNull();
    expect(screen.getByTestId("fab-chain-mobile-totals").getAttribute("aria-label")).toContain(
      "power",
    );
    expect(screen.queryByTestId("fab-chain-equation")).toBeNull();
  });

  it("opens mobile responses in a dismissible stack popover with tappable card previews", async () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "combat-stack-responses",
    );
    expect(fixture).toBeDefined();
    renderTabletop(withDeterministicStackArtwork(fixture!.create()), { forceMobileLayout: true });

    const trigger = screen.getByRole("button", { name: "Open stack, 4 pending effects" });
    expect(screen.getAllByRole("button", { name: "Open stack, 4 pending effects" })).toHaveLength(
      1,
    );
    expect(trigger.closest(".fab-mobile-stack-control")).not.toBeNull();
    expect(screen.queryByRole("dialog", { name: "Stack" })).toBeNull();
    fireEvent.click(trigger);
    const stack = screen.getByRole("dialog", { name: "Stack" });
    expect(within(stack).getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByTestId("fab-chain-mobile-totals")).not.toBeNull();
    expect(screen.queryByTestId("fab-chain-equation")).toBeNull();
    expect(screen.queryByTestId("fab-chain-mobile-footer")).toBeNull();
    fireEvent.click(within(stack).getByRole("button", { name: /Inspect stack layer 4:/ }));
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Close card preview" }));
    expect(screen.getByRole("dialog", { name: "Stack" })).toBe(stack);
    const cardRow = within(stack).getByRole("button", { name: /Inspect stack layer 4:/ });
    fireEvent.click(cardRow);
    fireEvent.keyDown(cardRow, { key: "Escape" });
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBeNull();
    expect(screen.getByRole("dialog", { name: "Stack" })).toBe(stack);
    fireEvent.click(within(stack).getByRole("button", { name: "Close stack" }));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Stack" })).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole("dialog", { name: "Stack" }), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Stack" })).toBeNull());
  });

  it("switches between compact and detailed stack surfaces at four layers", () => {
    const compactFixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "compact-stack-three",
    );
    const detailedFixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "combat-stack-responses",
    );
    expect(compactFixture).toBeDefined();
    expect(detailedFixture).toBeDefined();

    const { unmount } = renderTabletop(withDeterministicStackArtwork(compactFixture!.create()));
    const compactStack = screen.getByTestId("fab-compact-resolution-stack");
    const compactPanel = screen.getByTestId("fab-compact-resolution-panel");
    expect(compactStack.getAttribute("data-stack-count")).toBe("3");
    expect(compactPanel.tagName).toBe("SECTION");
    expect(within(compactPanel).getByRole("heading", { level: 2, name: "Stack" })).not.toBeNull();
    expect(compactStack.parentElement).toBe(compactPanel);
    expect(compactStack.firstElementChild?.tagName).toBe("LI");
    expect(screen.queryByTestId("fab-resolution-stack")).toBeNull();
    expect(screen.queryByTestId("fab-sidebar-resolution-stack")).toBeNull();
    fireEvent.pointerEnter(compactStack);
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
    fireEvent.mouseEnter(screen.getByTestId("fab-compact-resolution-entry-2"));
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
    fireEvent.mouseLeave(screen.getByTestId("fab-compact-resolution-entry-2"));
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBeNull();
    fireEvent.pointerLeave(compactStack);
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).not.toBe("true");

    unmount();
    renderTabletop(detailedFixture!.create());
    expect(screen.queryByTestId("fab-compact-resolution-stack")).toBeNull();
    expect(screen.getByTestId("fab-resolution-stack")).not.toBeNull();
    expect(screen.getByTestId("fab-sidebar-resolution-stack")).not.toBeNull();
  });

  it("minimizes the paired desktop combat chain and compact stack together", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "compact-stack-one",
    );
    expect(fixture).toBeDefined();
    renderTabletop(withDeterministicStackArtwork(fixture!.create()));

    const chain = screen.getByTestId("fab-combat-chain");
    const stack = screen.getByTestId("fab-compact-resolution-panel");
    expect(chain.getAttribute("data-minimized")).toBeNull();
    expect(stack.getAttribute("data-minimized")).toBe("false");
    expect(within(stack).getByRole("list")).not.toBeNull();

    fireEvent.click(within(chain).getByRole("button", { name: "Minimize combat chain" }));
    expect(chain.getAttribute("data-minimized")).toBe("true");
    expect(stack.getAttribute("data-minimized")).toBe("true");
    expect(within(stack).queryByRole("list")).toBeNull();

    fireEvent.click(within(chain).getByRole("button", { name: "Restore combat chain details" }));
    expect(chain.getAttribute("data-minimized")).toBeNull();
    expect(stack.getAttribute("data-minimized")).toBe("false");
    expect(within(stack).getByRole("list")).not.toBeNull();
  });

  it("opens the forced card preview by tapping a mobile stack popover row", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "compact-stack-two",
    );
    expect(fixture).toBeDefined();
    renderTabletop(withDeterministicStackArtwork(fixture!.create()), {
      forceMobileLayout: true,
    });

    fireEvent.click(screen.getByRole("button", { name: "Open stack, 2 pending effects" }));
    const stack = screen.getByRole("dialog", { name: "Stack" });
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).not.toBe("true");
    fireEvent.click(within(stack).getByRole("button", { name: /Inspect stack layer 1:/ }));
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
  });

  it("shows each alternating Sigil response in top-first order during an open combat chain", async () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "combat-stack-responses",
    );
    expect(fixture).toBeDefined();

    const match = fixture!.scenario.boot();

    renderTabletop(presentRuntime(match.runtime, fixture!.scenario.viewerId));

    const stack = screen.getByTestId("fab-chain-stack");
    expect(stack.closest('[data-testid="fab-resolution-stack"]')).not.toBeNull();
    expect(stack.closest('[data-testid="fab-combat-chain"]')).toBeNull();
    expect(stack.getAttribute("data-stack-count")).toBe("4");
    expect(stack.getAttribute("aria-label")).toContain("highest layer resolves next");
    expect(within(stack).getByText("1 / 4 layers")).not.toBeNull();
    expect(
      within(stack).getByLabelText("The top layer resolves first.").getAttribute("data-tooltip"),
    ).toBe("The top layer resolves first.");
    expect(within(stack).queryByText("Sigil of Solace")).toBeNull();
    expect(within(stack).getAllByText(/^(You|Opponent)$/)).toHaveLength(4);
    const resolutionStack = stack.closest('[data-testid="fab-resolution-stack"]');
    expect(resolutionStack?.getAttribute("data-placement")).toBe("center");
    expect(resolutionStack?.getAttribute("data-minimized")).toBe("false");
    expect(within(stack).queryByRole("button", { name: "Move stack to top" })).toBeNull();
    fireEvent.click(within(stack).getByRole("button", { name: "Minimize stack" }));
    expect(resolutionStack?.getAttribute("data-minimized")).toBe("true");
    expect(within(stack).queryByRole("list")).toBeNull();
    fireEvent.click(within(stack).getByRole("button", { name: "Expand stack" }));
    expect(resolutionStack?.getAttribute("data-minimized")).toBe("false");
    expect(within(stack).getByRole("list")).not.toBeNull();
    expect(
      screen.getByTestId("fab-chain-stack-entry-1").querySelector("img")?.getAttribute("src"),
    ).toContain("/fab/assets/board/");
    const topStackEntry = screen.getByTestId("fab-chain-stack-entry-1");
    fireEvent.mouseEnter(topStackEntry);
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
    fireEvent.mouseLeave(topStackEntry);
    expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).not.toBe("true");
    fireEvent.click(topStackEntry);
    expect(document.querySelector('.choice-detail-sheet[role="dialog"]')).toBeNull();
    const sidebarStack = within(screen.getByTestId("fab-sidebar")).getByTestId(
      "fab-sidebar-resolution-stack",
    );
    const sidebarSummary = within(sidebarStack).getByRole("button", {
      name: /resolution stack: sigil of solace, played by opponent, resolves next \(1 of 4\)/i,
    });
    expect(
      sidebarSummary.querySelector(".fab-sidebar-stack-summary-copy > span:last-child"),
    ).toBeNull();
    expect(sidebarSummary.querySelector(".fab-sidebar-stack-thumbnail-owner")?.textContent).toBe(
      "Opponent",
    );
    expect(sidebarSummary.getAttribute("aria-expanded")).toBe("false");
    expect(within(sidebarStack).queryByRole("list")).toBeNull();
    fireEvent.click(sidebarSummary);
    expect(sidebarSummary.getAttribute("aria-expanded")).toBe("true");
    expect(within(sidebarStack).getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByTestId("fab-chain-stack-entry-1").getAttribute("aria-label")).toBe(
      "Stack layer 1, resolves next: Sigil of Solace, owned by Opponent",
    );
    expect(screen.getByTestId("fab-chain-stack-entry-2").getAttribute("aria-label")).toBe(
      "Stack layer 2, resolves after layer 1: Sigil of Solace, owned by You",
    );
    expect(screen.getByTestId("fab-chain-stack-entry-3").getAttribute("aria-label")).toBe(
      "Stack layer 3, resolves after layer 2: Sigil of Solace, owned by Opponent",
    );
    expect(screen.getByTestId("fab-chain-stack-entry-4").getAttribute("aria-label")).toBe(
      "Stack layer 4, resolves after layer 3: Sigil of Solace, owned by You",
    );
    expect(
      screen.getByTestId("fab-chain-card-attack").querySelector("img")?.getAttribute("src"),
    ).toMatch(/\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/);
  });

  it("gates the quick-control countdown to both holding modes", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "combat-stack-responses",
    );
    expect(fixture).toBeDefined();
    const onLegalCommand = vi.fn();
    const onSubmitInteraction = vi.fn();
    const state = withDeterministicStackArtwork(fixture!.create());
    type ActionSpec = EngineInteractionView["actions"][number];
    const passAction = {
      id: "fab:control:pass",
      requestId: "pass:4",
      intent: "pass",
      text: { key: "Pass priority" },
      enabled: true,
      inputs: [],
    } satisfies ActionSpec;
    const modeActions = {
      "auto-pass": {
        id: "mode-auto-pass",
        requestId: "mode:4:auto-pass",
        intent: "custom",
        text: { key: FAB_PRIORITY_MODE_ACTION_LABEL["auto-pass"] },
        enabled: true,
        inputs: [],
      },
      "always-hold": {
        id: "mode-always-hold",
        requestId: "mode:4:always-hold",
        intent: "custom",
        text: { key: FAB_PRIORITY_MODE_ACTION_LABEL["always-hold"] },
        enabled: true,
        inputs: [],
      },
      "play-and-skip": {
        id: "mode-play-and-skip",
        requestId: "mode:4:play-and-skip",
        intent: "custom",
        text: { key: FAB_PRIORITY_MODE_ACTION_LABEL["play-and-skip"] },
        enabled: true,
        inputs: [],
      },
    } satisfies Record<string, ActionSpec>;
    const armAction = {
      id: "arm-hold",
      requestId: "arm:4",
      intent: "custom",
      text: { key: FAB_ARM_PRIORITY_HOLD_LABEL },
      enabled: true,
      inputs: [],
    } satisfies ActionSpec;
    const interactionView: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "player-1",
      stateVersion: 4,
      status: "ready",
      actions: [
        passAction,
        modeActions["auto-pass"],
        modeActions["always-hold"],
        modeActions["play-and-skip"],
        armAction,
      ],
    };

    // play-and-skip on the same pass-only response window: the countdown must
    // arm exactly like always-hold (bluff preservation), never engine-drained.
    renderTabletop(
      {
        ...state,
        priorityPlayerId: "player-1",
        priorityAutomation: "play-and-skip",
        priorityHoldArmed: false,
      },
      {
        readOnly: false,
        legalCommands: [
          { move: "pass", label: "Pass priority", payload: {} },
          {
            move: "set-automation-preferences",
            payload: { mode: "auto-pass" },
            label: modeActions["auto-pass"].text.key,
          },
          {
            move: "set-automation-preferences",
            payload: { mode: "always-hold" },
            label: modeActions["always-hold"].text.key,
          },
          { move: "arm-priority-hold", payload: {}, label: FAB_ARM_PRIORITY_HOLD_LABEL },
        ],
        onLegalCommand,
        interactionView,
        onSubmitInteraction,
      },
    );
    const control = screen.getByTestId("fab-priority-automation-toggle");
    expect(control.getAttribute("data-countdown")).toBe("true");
    // During the countdown the control is exactly the cancel button; the
    // mode radios (and arm) stand aside until the window closes.
    expect(screen.queryByTestId("fab-priority-mode-play-and-skip")).toBeNull();
    // Cancel returns the fixed utility slot to Undo; persistent mode controls
    // live in the unified Game settings tab.
    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });
    expect(screen.queryByTestId("fab-priority-automation-toggle")).toBeNull();
    expect(screen.getByTestId("fab-quick-undo")).not.toBeNull();

    // auto-pass on the same window: never a countdown (engine drains it).
    cleanup();
    renderTabletop(
      { ...state, priorityPlayerId: "player-1", priorityAutomation: "auto-pass" },
      {
        readOnly: false,
        legalCommands: [{ move: "pass", label: "Pass priority", payload: {} }],
        onLegalCommand,
        interactionView,
        onSubmitInteraction,
      },
    );
    expect(screen.queryByTestId("fab-priority-automation-toggle")).toBeNull();
  });

  it("keeps hand-card Instant auto-yield context-only and disables it in always-hold", () => {
    const base = createOpeningFixtureState();
    const source = Object.values(base.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "hand",
    );
    expect(source).toBeDefined();
    const onLegalCommand = vi.fn();
    const legalCommands: FabLegalCommand[] = [
      {
        move: "begin-play",
        payload: { instanceId: source!.id },
        sourceInstanceId: source!.id,
        label: "Play card",
      },
      {
        move: "activate",
        payload: { instanceId: source!.id, ability: "instant-a1" },
        sourceInstanceId: source!.id,
        priorityYield: { kind: "instant-use", canonicalId: source!.cardId },
        label: "Activate card — Instant",
      },
      {
        move: "set-automation-preferences",
        payload: { addInstantYieldCardId: source!.cardId },
        sourceInstanceId: source!.id,
        automation: "player-only",
        label: FAB_AUTOMATION_PREFERENCE_LABELS.instantYieldAdd,
      },
    ];
    const openContext = () => {
      const anchor = document.querySelector<HTMLElement>(`[data-sim-entity-id="${source!.id}"]`);
      expect(anchor).not.toBeNull();
      fireEvent.contextMenu(anchor!);
      return screen.getByRole("menuitem", { name: /Auto-yield this card/i });
    };

    renderTabletop(
      { ...base, priorityAutomation: "always-hold" },
      { readOnly: false, legalCommands, onLegalCommand },
    );
    const disabled = openContext();
    expect(disabled.getAttribute("aria-disabled")).toBe("true");
    expect(disabled.textContent).toContain(
      "Unavailable while Hold every priority window is active.",
    );
    fireEvent.click(disabled);
    expect(onLegalCommand).not.toHaveBeenCalled();

    cleanup();
    renderTabletop(
      { ...base, priorityAutomation: "auto-pass" },
      { readOnly: false, legalCommands, onLegalCommand },
    );
    const enabled = openContext();
    expect(enabled.getAttribute("aria-disabled")).toBe("false");
    expect(enabled.querySelector(".lucide-skip-forward")).not.toBeNull();
    expect(enabled.textContent).toContain(
      "Pass priority when this card's Instant uses are the only remaining actions.",
    );
    expect(within(enabled.closest('[role="menu"]')!).getAllByRole("menuitem")).toHaveLength(3);
    fireEvent.click(enabled);
    expect(onLegalCommand).toHaveBeenCalledWith(legalCommands[2]);

    cleanup();
    const removeYieldCommand: FabLegalCommand = {
      move: "set-automation-preferences",
      payload: { removeInstantYieldCardId: source!.cardId },
      sourceInstanceId: source!.id,
      automation: "player-only",
      label: FAB_AUTOMATION_PREFERENCE_LABELS.instantYieldRemove,
    };
    renderTabletop(
      { ...base, priorityAutomation: "auto-pass" },
      {
        readOnly: false,
        legalCommands: [legalCommands[1]!, removeYieldCommand],
        onLegalCommand,
      },
    );
    const enabledYieldAnchor = document.querySelector<HTMLElement>(
      `[data-sim-entity-id="${source!.id}"]`,
    );
    expect(enabledYieldAnchor).not.toBeNull();
    fireEvent.contextMenu(enabledYieldAnchor!);
    const disableYield = screen.getByRole("menuitem", { name: /Stop auto-yielding this card/i });
    expect(disableYield.querySelector(".lucide-circle-off")).not.toBeNull();

    cleanup();
    const onSingleAction = vi.fn();
    renderTabletop(
      { ...base, priorityAutomation: "auto-pass" },
      {
        readOnly: false,
        legalCommands: [legalCommands[1]!, legalCommands[2]!],
        onLegalCommand: onSingleAction,
      },
    );
    const oneClickAnchor = document.querySelector<HTMLElement>(
      `[data-sim-entity-id="${source!.id}"]`,
    );
    expect(oneClickAnchor).not.toBeNull();
    fireEvent.click(oneClickAnchor!);
    expect(onSingleAction).toHaveBeenCalledWith(legalCommands[1]);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows a board badge for a hero Instant without replacing direct activation", () => {
    const base = createOpeningFixtureState();
    const viewerId = base.players[0]!;
    const hero = Object.values(base.cards).find(
      (card) => card.ownerId === viewerId && card.zone === "hero",
    );
    expect(hero).toBeDefined();
    const heroId = hero!.id;
    const onLegalCommand = vi.fn();
    const activateCommand: FabLegalCommand = {
      move: "activate",
      payload: { instanceId: heroId, ability: "instant-a1" },
      sourceInstanceId: heroId,
      priorityYield: { kind: "instant-use", canonicalId: hero!.cardId },
      label: "Activate hero — Instant",
    };
    const yieldCommand: FabLegalCommand = {
      move: "set-automation-preferences",
      payload: { addInstantYieldCardId: hero!.cardId },
      sourceInstanceId: heroId,
      automation: "player-only",
      label: FAB_AUTOMATION_PREFERENCE_LABELS.instantYieldAdd,
    };

    renderTabletop(
      { ...base, priorityAutomation: "auto-pass" },
      { readOnly: false, legalCommands: [activateCommand, yieldCommand], onLegalCommand },
    );

    const heroAnchor = document.querySelector<HTMLElement>(`[data-sim-entity-id="${heroId}"]`);
    expect(heroAnchor).not.toBeNull();
    fireEvent.click(heroAnchor!);
    expect(onLegalCommand).toHaveBeenCalledWith(activateCommand);

    fireEvent.click(screen.getByRole("button", { name: /Configure Instant auto-yield/ }));
    fireEvent.click(screen.getByRole("button", { name: /Auto-yield this card/ }));
    expect(onLegalCommand).toHaveBeenLastCalledWith(yieldCommand);

    cleanup();
    renderTabletop(
      { ...base, priorityAutomation: "auto-pass" },
      {
        readOnly: false,
        forceMobileLayout: true,
        legalCommands: [activateCommand, yieldCommand],
        onLegalCommand,
      },
    );
    expect(screen.getByRole("button", { name: /Configure Instant auto-yield/ })).not.toBeNull();
  });

  it("submits live-match mode and arm-hold selections through the interaction channel", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.scenario.id === "combat-stack-responses",
    );
    expect(fixture).toBeDefined();
    const onSubmitInteraction = vi.fn();
    const state = withDeterministicStackArtwork(fixture!.create());
    type ActionSpec = EngineInteractionView["actions"][number];
    const modeSpec = (mode: "auto-pass" | "always-hold" | "play-and-skip") =>
      ({
        id: `mode-${mode}`,
        requestId: `mode:4:${mode}`,
        intent: "custom",
        text: { key: FAB_PRIORITY_MODE_ACTION_LABEL[mode] },
        enabled: true,
        inputs: [],
      }) satisfies ActionSpec;
    const interactionView: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "flesh-and-blood",
      actorId: "player-1",
      stateVersion: 4,
      status: "ready",
      actions: [
        {
          id: "fab:control:pass",
          requestId: "pass:4",
          intent: "pass",
          text: { key: "Pass priority" },
          enabled: true,
          inputs: [],
        } satisfies ActionSpec,
        modeSpec("auto-pass"),
        modeSpec("always-hold"),
        modeSpec("play-and-skip"),
        {
          id: "arm-hold",
          requestId: "arm:4",
          intent: "custom",
          text: { key: FAB_ARM_PRIORITY_HOLD_LABEL },
          enabled: true,
          inputs: [],
        } satisfies ActionSpec,
      ],
    };
    const openGameSettings = () => {
      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Settings" }));
      const settingsDialog = within(screen.getByRole("dialog", { name: "Settings" }));
      fireEvent.click(settingsDialog.getByRole("tab", { name: "Game" }));
    };
    // Mirrors LiveMatch.page.tsx: the menu's game tab renders the context panel
    // supplied by the tabletop, with no legal commands on the seat.
    const participantActions = (
      <SimulatorSelfParticipantActions
        gameConfiguration={{
          settings: <FabPriorityAutomationSettingsPanel />,
          onSelect: () => {},
        }}
        support={{ source: "flesh-and-blood-live-participant-menu", gameSlug: "flesh-and-blood" }}
      />
    );

    // Live-match seats list no legal commands (see LiveMatch.page.tsx): mode
    // changes ride the label-keyed custom actions through onSubmitInteraction.
    renderTabletop(
      {
        ...state,
        priorityPlayerId: "player-1",
        priorityAutomation: "always-hold",
        priorityHoldArmed: false,
      },
      {
        readOnly: false,
        legalCommands: [],
        interactionView,
        onSubmitInteraction,
        participantActions,
      },
    );
    openGameSettings();
    fireEvent.click(screen.getByTestId("fab-priority-mode-play-and-skip"));
    expect(onSubmitInteraction).toHaveBeenCalledWith(
      expect.objectContaining({ actionId: "mode-play-and-skip", values: {} }),
    );

    // The one-shot arm takes the same channel once the seat runs play-and-skip.
    cleanup();
    onSubmitInteraction.mockClear();
    renderTabletop(
      {
        ...state,
        priorityPlayerId: "player-1",
        priorityAutomation: "play-and-skip",
        priorityHoldArmed: false,
      },
      {
        readOnly: false,
        legalCommands: [],
        interactionView,
        onSubmitInteraction,
        participantActions,
      },
    );
    openGameSettings();
    fireEvent.click(screen.getByTestId("fab-priority-hold-arm"));
    expect(onSubmitInteraction).toHaveBeenCalledWith(
      expect.objectContaining({ actionId: "arm-hold", values: {} }),
    );
  });

  it("mounts practice setup then starts an engine-backed match", async () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0.63);
    render(
      <MemoryRouter initialEntries={["/flesh-and-blood/simulator/play/practice"]}>
        <FleshAndBloodSimulatorProviders>
          <Routes>
            <Route
              path="/flesh-and-blood/simulator/play/practice"
              element={<FleshAndBloodPracticePage />}
            />
          </Routes>
        </FleshAndBloodSimulatorProviders>
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("fab-practice-setup")).not.toBeNull();
    const yourDeck = screen.getByTestId("fab-practice-your-deck") as HTMLSelectElement;
    expect(yourDeck).not.toBeNull();
    expect(screen.getByTestId("fab-practice-bot-strategy")).not.toBeNull();
    expect(screen.getByTestId("fab-practice-rules-light-disclosure").textContent).toBe(
      "Rules-light local combat practice. Named starter cards, weapons, hero abilities, and many printed effects are not fully modeled.",
    );

    // Tournament samples appear under explicit format optgroups.
    const optionValues = Array.from(yourDeck.querySelectorAll("option")).map(
      (option) => (option as HTMLOptionElement).value,
    );
    expect(optionValues).toContain("cc-edinburgh-1st-gravy-bones");
    expect(optionValues).toContain("sa-edinburgh-1st-briar");
    const groupLabels = Array.from(yourDeck.querySelectorAll("optgroup")).map(
      (group) => (group as HTMLOptGroupElement).label,
    );
    expect(groupLabels).toContain("Classic Constructed");
    expect(groupLabels).toContain("Silver Age");
    expect(groupLabels).not.toContain("Practice starters");

    // Start may be clicked as soon as the setup form is visible. The IDs
    // handed to the sideboard/runtime must be exactly the values shown here.
    const botDeck = screen.getByTestId("fab-practice-bot-deck") as HTMLSelectElement;
    expect(getFabPracticeDeckOption(yourDeck.value)?.formatGroup).toBe("classic-constructed");
    expect(getFabPracticeDeckOption(botDeck.value)?.formatGroup).toBe("classic-constructed");
    expect(yourDeck.value).not.toBe(botDeck.value);
    fireEvent.change(screen.getByTestId("fab-practice-seed"), {
      target: { value: "immediate-starter-seed" },
    });
    fireEvent.click(screen.getByTestId("fab-practice-start"));

    await completePracticeTurnOrder();
    const sideboard = await screen.findByTestId("fab-pregame-sideboard");
    expect(sideboard).not.toBeNull();
    expect(
      within(screen.getByRole("region", { name: "Current player: You" })).getByRole("button"),
    ).not.toBeNull();
    expect(
      within(screen.getByRole("region", { name: "Opponent: Practice bot" })).getByRole("button"),
    ).not.toBeNull();
    expect(screen.queryByText("Unknown hero")).toBeNull();
    expect(screen.queryByText("Match participant")).toBeNull();
    expect(
      Array.from(sideboard.querySelectorAll(".fab-sideboard-footer button")).map((button) =>
        button.textContent?.trim(),
      ),
    ).toEqual(["Reset", "Leave", "Confirm selection"]);
    fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));

    const playSurface = await screen.findByTestId("fab-practice-page");
    expect(playSurface.getAttribute("data-practice-player-deck")).toBe(yourDeck.value);
    expect(playSurface.getAttribute("data-practice-bot-deck")).toBe(botDeck.value);
    expect(playSurface.getAttribute("data-practice-seed")).toBe("immediate-starter-seed");
    expect(screen.getByTestId("fab-board")).not.toBeNull();
    expect(screen.getAllByTestId("fab-match-actions").length).toBeGreaterThan(0);
    expect(screen.getByTestId("fab-quick-pass")).not.toBeNull();
  });

  it("enforces the format deck minimum for authored tournament practice", async () => {
    render(
      <MemoryRouter initialEntries={["/flesh-and-blood/simulator/play/practice"]}>
        <FleshAndBloodSimulatorProviders>
          <Routes>
            <Route
              path="/flesh-and-blood/simulator/play/practice"
              element={<FleshAndBloodPracticePage />}
            />
          </Routes>
        </FleshAndBloodSimulatorProviders>
      </MemoryRouter>,
    );

    const yourDeck = (await screen.findByTestId("fab-practice-your-deck")) as HTMLSelectElement;
    fireEvent.change(yourDeck, { target: { value: "cc-edinburgh-5th-jarl" } });
    fireEvent.click(screen.getByTestId("fab-practice-start"));
    await completePracticeTurnOrder();
    await screen.findByTestId("fab-pregame-sideboard");

    for (const cardName of ["Boulder Drop", "Command and Conquer", "Felling of the Crown"]) {
      fireEvent.click(screen.getByRole("button", { name: `Set ${cardName} deck quantity to 0` }));
    }

    const confirm = screen.getByRole("button", { name: "Confirm selection" }) as HTMLButtonElement;
    expect(confirm.disabled).toBe(true);
    expect(document.querySelector(".fab-sideboard-validation")?.textContent).toContain(
      "Classic Constructed requires at least 60 starting-deck cards.",
    );
  });

  it("keeps catalog-only selected equipment identifiable in the sideboard summary", async () => {
    const scalersCatalogCard = allFleshAndBloodCatalogCards.find(
      (card) => card.name === "Snapdragon Scalers",
    );
    expect(scalersCatalogCard?.printings.some((printing) => Boolean(printing.imageUrl))).toBe(true);

    render(
      <MemoryRouter initialEntries={["/flesh-and-blood/simulator/play/practice"]}>
        <FleshAndBloodSimulatorProviders>
          <Routes>
            <Route
              path="/flesh-and-blood/simulator/play/practice"
              element={<FleshAndBloodPracticePage />}
            />
          </Routes>
        </FleshAndBloodSimulatorProviders>
      </MemoryRouter>,
    );

    fireEvent.change(await screen.findByTestId("fab-practice-your-deck"), {
      target: { value: "cc-2026-08-11-aurora-legacy-of-tempest" },
    });
    fireEvent.click(screen.getByTestId("fab-practice-start"));

    await completePracticeTurnOrder();
    const sideboard = await screen.findByTestId("fab-pregame-sideboard");
    await waitFor(() => expect(sideboard.getAttribute("data-presentation-state")).toBe("ready"));
    expect(imageUrlForFabCard("Snapdragon Scalers")).toBeDefined();
    const equippedCards = within(sideboard).getByLabelText("Equipped cards");
    const scalers = within(equippedCards).getByTitle("Snapdragon Scalers");
    expect(scalers.querySelector("img")?.getAttribute("src")).toMatch(
      /\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/,
    );
  });

  it("starts the mobile practice match with the displayed decks and deterministic seed", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 390,
    });
    render(
      <MemoryRouter initialEntries={["/flesh-and-blood/simulator/play/practice"]}>
        <FleshAndBloodSimulatorProviders>
          <Routes>
            <Route
              path="/flesh-and-blood/simulator/play/practice"
              element={<FleshAndBloodPracticePage />}
            />
          </Routes>
        </FleshAndBloodSimulatorProviders>
      </MemoryRouter>,
    );

    fireEvent.change(await screen.findByTestId("fab-practice-your-deck"), {
      target: { value: "cc-edinburgh-1st-gravy-bones" },
    });
    fireEvent.change(screen.getByTestId("fab-practice-bot-deck"), {
      target: { value: "cc-guilherme-coutinho-rhinar" },
    });
    fireEvent.change(screen.getByTestId("fab-practice-seed"), {
      target: { value: "20260731" },
    });
    // Give the human the choice, then exercise the visible Go first action.
    const random = vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
      if (array instanceof Uint8Array) array.fill(0);
      return array;
    });
    fireEvent.click(screen.getByTestId("fab-practice-start"));

    await completePracticeTurnOrder();
    random.mockRestore();
    expect(await screen.findByTestId("fab-pregame-sideboard")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));

    const playSurface = await screen.findByTestId("fab-practice-page");
    expect(playSurface.getAttribute("data-practice-player-deck")).toBe(
      "cc-edinburgh-1st-gravy-bones",
    );
    expect(playSurface.getAttribute("data-practice-bot-deck")).toBe("cc-guilherme-coutinho-rhinar");
    expect(playSurface.getAttribute("data-practice-seed")).toBe("20260731");
    expect(playSurface.getAttribute("data-engine")).toBe("local");
    expect(screen.getByTestId("fab-tabletop").getAttribute("data-fab-layout")).toBe("mobile");
    const mobileBoard = screen.getByTestId("fab-board");
    const topRail = screen.getByTestId("fab-mobile-top-rail");
    const bottomRail = screen.getByTestId("fab-mobile-bottom-rail");
    expect(topRail).not.toBeNull();
    expect(within(topRail).queryByText("Started second")).toBeNull();
    expect(bottomRail).not.toBeNull();
    expect(mobileBoard.getAttribute("data-turn-owner")).toBe("self");
    expect(mobileBoard.getAttribute("data-priority-owner")).toBe("self");
    expect(topRail.getAttribute("data-turn")).toBeNull();
    expect(topRail.getAttribute("data-priority")).toBeNull();
    expect(bottomRail.getAttribute("data-turn")).toBe("true");
    expect(bottomRail.getAttribute("data-priority-owner")).toBe("self");
    // The rail keeps Pass visible and promotes an engine-legal next verb.
    expect(screen.getByTestId("fab-chain-pass-priority")).not.toBeNull();
    expect(
      Boolean(
        screen.queryByTestId("fab-chain-play-activate") ??
        screen.queryByTestId("fab-mobile-end-turn"),
      ),
    ).toBe(true);
    // Own hand cards are real buttons so tap-to-play can fire onSelect.
    const handButtons = screen.getByTestId("fab-hand-bottom").querySelectorAll("button");
    expect(handButtons.length).toBeGreaterThan(0);
    // The activity panel defaults to history; Now owns current legal actions.
    fireEvent.click(screen.getByLabelText("Open match menu"));
    fireEvent.click(screen.getByRole("tab", { name: "Now" }));
    const legalMoves = await screen.findByTestId("fab-legal-moves");
    expect(legalMoves).not.toBeNull();
    expect(screen.getByTestId("fab-practice-rules-light-disclosure").textContent).toBe(
      "Rules-light local combat practice. Named starter cards, weapons, hero abilities, and many printed effects are not fully modeled.",
    );
    const chooseCard = screen.queryByTestId("fab-action-choose-card");
    const endTurn = screen
      .queryAllByTestId("fab-action-end-turn")
      .find((button) => !(button as HTMLButtonElement).disabled);
    const pass = screen.queryByTestId("fab-action-pass");
    expect(Boolean(chooseCard || endTurn || pass)).toBe(true);
    if (chooseCard) {
      fireEvent.click(chooseCard);
      expect(await screen.findByTestId("fab-action-cards")).not.toBeNull();
    }
  });

  it("collapses combinatorial legal commands for the mobile action-flow UI", () => {
    const pitchOnly: FabLegalCommand = {
      move: "begin-play",
      label: "Play Snatch",
      payload: { instanceId: "card-1" },
    };
    const playWithPayments: FabLegalCommand[] = [
      {
        move: "begin-play",
        label: "Play Primeval Bellow (pitch Snatch)",
        payload: { instanceId: "card-2" },
      },
      {
        move: "begin-play",
        label: "Play Primeval Bellow → hero (pitch Snatch)",
        payload: { instanceId: "card-2", target: "hero" },
      },
    ];

    expect(commandCardKey(pitchOnly)).toBe("card-1");
    expect(commandCardLabel(playWithPayments[0]!)).toBe("Play Primeval Bellow");
    expect(shouldAutoDispatchCardCommands([pitchOnly])).toEqual(pitchOnly);
    expect(shouldAutoDispatchCardCommands(playWithPayments)).toBeNull();
    expect(shouldAutoDispatchCardCommands([playWithPayments[0]!])).toEqual(playWithPayments[0]);
  });

  it("does not schedule the bot from a concession-only escape hatch during a human decision", () => {
    const concede: FabLegalCommand = { move: "concede", label: "Concede", payload: {} };

    expect(
      shouldScheduleFabPracticeBot({
        botId: "player-2",
        decisionActorId: "player-1",
        seatMustAct: false,
        legalCommands: [concede],
      }),
    ).toBe(false);
    expect(
      shouldScheduleFabPracticeBot({
        botId: "player-2",
        decisionActorId: "player-2",
        seatMustAct: true,
        legalCommands: [concede],
      }),
    ).toBe(true);
  });

  it("resolves a hand-card tap to the preferred legal command for that instance", () => {
    const legal: FabLegalCommand[] = [
      { move: "begin-play", label: "Play Snatch", payload: { instanceId: "card-1" } },
      {
        move: "begin-play",
        label: "Play Snatch",
        payload: { instanceId: "card-1" },
      },
      {
        move: "begin-play",
        label: "Play Bellow (pitch Snatch)",
        payload: { instanceId: "card-2" },
      },
      { move: "end-turn", label: "End turn", payload: {} },
    ];

    expect(resolveHandCardTap(legal, "card-1")?.move).toBe("begin-play");
    expect(resolveHandCardTap(legal, "card-1")?.payload.instanceId).toBe("card-1");
    // A card absent from every primary instance slot is not playable by tap.
    expect(resolveHandCardTap(legal, "missing")).toBeNull();
  });

  it.each(["mobile", "desktop"] as const)(
    "labels an ability-only practice menu accurately on %s",
    async (layout) => {
      const session = renderFabSimulatorScenario({ scenarioId: "endgame", layout });
      await session.pom.waitForReady();
      if (layout === "mobile") fireEvent.click(screen.getByRole("button", { name: /^Activate$/ }));
      else fireEvent.click(screen.getByRole("tab", { name: /^Now$/ }));
      const choose = screen.getByTestId("fab-action-choose-card");
      expect(choose.textContent).toBe("Activate an ability");
      fireEvent.click(choose);
      expect(screen.getByTestId("fab-action-cards").textContent).toContain(
        "Activate Helm Of Isen's Peak",
      );
      const bravoAction = within(screen.getByTestId("fab-action-cards")).getByRole("button", {
        name: /^Activate Bravo/,
      });
      expect(bravoAction.textContent).not.toContain("{r}");
      expect(bravoAction.textContent).toMatch(/dominate/i);
      expect(within(bravoAction).getAllByRole("img", { name: "resource" })).toHaveLength(2);
    },
  );

  it.each(["mobile", "desktop"] as const)(
    "keeps an explicitly opened card image after leaving its hand card on %s",
    async (layout) => {
      const session = renderFabSimulatorScenario({ scenarioId: "landscape-meld-preview", layout });
      await session.pom.waitForReady();
      const card = screen.getByRole("button", { name: /^Everbloom(?: \/\/ Life)?, card/ });
      fireEvent.click(card);
      const details = screen.queryByRole("button", { name: "Switch to detailed card view" });
      if (details) fireEvent.click(details);
      const rulesText = screen.getByRole("region", { name: "Card details" }).textContent ?? "";
      expect(rulesText.match(/Choose an action card in a graveyard/g)).toHaveLength(1);
      expect(rulesText).toContain("Gain 1");
      fireEvent.click(screen.getByRole("button", { name: /^Show Everbloom.* card image$/ }));
      const face = within(card).getByTestId("card");
      fireEvent.mouseLeave(face);
      expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).toBe("true");
      fireEvent.click(screen.getByRole("button", { name: "Close card preview" }));
      expect(screen.getByTestId("fab-card-preview").getAttribute("data-visible")).not.toBe("true");
    },
  );

  it("announces one play action without a bundled payment choice", () => {
    const legal: FabLegalCommand[] = [
      {
        move: "begin-play",
        label: "Play Primeval Bellow",
        payload: { instanceId: "bellow" },
      },
    ];

    expect(shouldAutoDispatchCardCommands(legal)).toEqual(legal[0]);
  });

  it("distinguishes same-named mobile card choices by their printed pitch", () => {
    const redCopy: FabLegalCommand = {
      move: "begin-play",
      label: "Play Wrecker Romp (pitch Blue card)",
      payload: { instanceId: "wrecker-red" },
    };
    const blueCopy: FabLegalCommand = {
      move: "begin-play",
      label: "Play Wrecker Romp (pitch Red card)",
      payload: { instanceId: "wrecker-blue" },
    };
    const choices = listFabActionCardChoices([redCopy, blueCopy], {
      cards: {
        "wrecker-red": {
          id: "wrecker-red",
          cardId: "wrecker-red-printing",
          ownerId: "player-1",
          zone: "hand",
          face: "up",
        },
        "wrecker-blue": {
          id: "wrecker-blue",
          cardId: "wrecker-blue-printing",
          ownerId: "player-1",
          zone: "hand",
          face: "up",
        },
      },
      cardDefinitions: {
        "wrecker-red-printing": { name: "Wrecker Romp", cardType: "action", pitchValue: 1 },
        "wrecker-blue-printing": { name: "Wrecker Romp", cardType: "action", pitchValue: 3 },
      },
    });

    expect(choices).toEqual([
      { cardKey: "wrecker-red", command: redCopy, label: "Play Wrecker Romp — red pitch 1" },
      { cardKey: "wrecker-blue", command: blueCopy, label: "Play Wrecker Romp — blue pitch 3" },
    ]);
  });

  it("opening fixture is engine-backed with equipped gear and populated zones", () => {
    const state = createOpeningFixtureState();
    expect(state.players).toEqual(["player-1", "player-2"]);
    expect(state.terminal).toBe(false);
    expect(state.combat).toBeNull();
    const p1Hand = Object.values(state.cards).filter(
      (c) => c.ownerId === "player-1" && c.zone === "hand",
    );
    expect(p1Hand.length).toBe(4);
    expect(state.life["player-1"]).toBe(20);
    for (const zone of ["head", "chest", "arms", "graveyard", "banished", "arsenal"]) {
      expect(
        Object.values(state.cards).some(
          (card) => card.ownerId === "player-1" && card.zone === zone,
        ),
      ).toBe(true);
    }
    expect(Object.keys(state.cardDefinitions).length).toBeGreaterThan(5);
  });

  it("uses full real gear suites with the off-hand and New Horizon dual arsenal", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.id === "weapon-and-double-arsenal",
    );
    expect(fixture).toBeDefined();

    const match = fixture!.scenario.boot();
    const victorView = match.runtime.viewer({ role: "player", actorId: "player-1" });
    const azaleaView = match.runtime.viewer({ role: "player", actorId: "player-2" });
    const victorResources = match.runtime.viewerResources({ role: "player", actorId: "player-1" });
    const azaleaResources = match.runtime.viewerResources({ role: "player", actorId: "player-2" });
    const victor = victorView.players["player-1"]!.zones;
    const azalea = azaleaView.players["player-2"]!.zones;

    expect(victor.weapon1).toHaveLength(1);
    expect(victor.weapon2).toHaveLength(1);
    expect(victor.arsenal).toHaveLength(1);
    expect(victor.head).toHaveLength(1);
    expect(victor.chest).toHaveLength(1);
    expect(victor.arms).toHaveLength(1);
    expect(victor.legs).toHaveLength(1);
    expect(azalea.head).toHaveLength(1);
    expect(azalea.chest).toHaveLength(1);
    expect(azalea.arms).toHaveLength(1);
    expect(azalea.legs).toHaveLength(1);
    expect(azalea.arsenal).toHaveLength(2);

    const nameFor = (instanceId: string, resources: typeof victorResources) =>
      resources.cardDefinitions[resources.cardInstances[instanceId] ?? ""]?.base.names[0];
    expect(nameFor(victor.weapon1[0]!, victorResources)).toBe("Titan's Fist");
    expect(nameFor(victor.weapon2[0]!, victorResources)).toBe("Aurum Aegis");
    expect(nameFor(victor.head[0]!, victorResources)).toBe("Helm Of Isen's Peak");
    expect(nameFor(victor.chest[0]!, victorResources)).toBe("Tectonic Plating");
    expect(nameFor(victor.arms[0]!, victorResources)).toBe("Crater Fist");
    expect(nameFor(victor.legs[0]!, victorResources)).toBe("Craterhoof");
    expect(nameFor(azalea.head[0]!, azaleaResources)).toBe("New Horizon");
    expect(nameFor(azalea.chest[0]!, azaleaResources)).toBe("Trench of Sunken Treasure");
    expect(nameFor(azalea.arms[0]!, azaleaResources)).toBe("Bull's Eye Bracers");
    expect(nameFor(azalea.legs[0]!, azaleaResources)).toBe("Perch Grapplers");
    expect(nameFor(azalea.arsenal[0]!, azaleaResources)).toBe("Red in the Ledger");
    expect(nameFor(azalea.arsenal[1]!, azaleaResources)).toBe("Searing Shot");
    expect(match.engine.objectState(azalea.arsenal[0]!).faceDown).toBe(false);
    expect(match.engine.objectState(azalea.arsenal[1]!).faceDown).toBe(true);
    expect(azaleaView.faceDownInstanceIds).toEqual([azalea.arsenal[1]]);
  });

  it("renders each card in a multi-card arsenal on the desktop board", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.id === "weapon-and-double-arsenal",
    );
    expect(fixture).toBeDefined();

    renderTabletop(fixture!.create(), { viewerId: "player-2" });

    const arsenal = screen.getByLabelText("Inspect Arsenal, 2 cards");
    expect(arsenal.querySelector('[data-zone-layout="row"]')).not.toBeNull();
    expect(within(arsenal).getAllByRole("listitem")).toHaveLength(2);
    expect(within(arsenal).getByRole("listitem", { name: "Red in the Ledger" })).not.toBeNull();
    expect(within(arsenal).getByRole("listitem", { name: "Searing Shot" })).not.toBeNull();

    const faceUp = within(arsenal).getByRole("listitem", { name: "Red in the Ledger" });
    const faceDown = within(arsenal).getByRole("listitem", { name: "Searing Shot" });
    expect(faceUp.querySelector("[data-fab-owner-face-down]")).toBeNull();
    const faceDownCard = faceDown.querySelector<HTMLElement>('[data-fab-owner-face-down="true"]');
    expect(faceDownCard).not.toBeNull();
    expect(faceDownCard?.getAttribute("title")).toBe("Face down — visible only to you");
    for (const decorationId of [
      "fab-pitch-1",
      "fab-frame-cost",
      "fab-frame-power",
      "fab-frame-defense",
    ]) {
      expect(faceDownCard?.querySelector(`[data-decoration-id="${decorationId}"]`)).not.toBeNull();
    }
  });

  it("hides the Pitch resource marker when pitched cards remain but no resources float", () => {
    const fixture = FAB_VISUAL_FIXTURES.find((candidate) => candidate.id === "closed-geared");
    expect(fixture).toBeDefined();

    renderTabletop(fixture!.create(), { viewerId: "player-2" });
    expect(
      screen
        .getByTestId("fab-player-bottom")
        .querySelector('[data-zone="pitch"] .fab-pitch-zone-mark'),
    ).toBeNull();
  });

  it("shows the floating resource total in the desktop Pitch zone", () => {
    const fixtureState = createClosedWithPermanentsFixtureState();
    const state = {
      ...fixtureState,
      resourcePoints: { ...fixtureState.resourcePoints, "player-1": 2 },
    };
    const floatingResources = state.resourcePoints["player-1"];

    renderTabletop(state, { viewerId: "player-1" });

    const pitchZone = screen.getByTestId("fab-player-bottom").querySelector('[data-zone="pitch"]');
    expect(pitchZone?.getAttribute("aria-label")).toContain(
      `${floatingResources} floating resources`,
    );
    expect(
      pitchZone?.querySelector('[data-testid="fab-pitch-floating-resources"] .fab-stat-badge-value')
        ?.textContent,
    ).toBe(String(floatingResources));
    expect(pitchZone?.querySelector('[data-fab-icon="resource"]')).not.toBeNull();
  });

  it("uses a square card back for a hidden opponent arsenal on mobile", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.id === "weapon-and-double-arsenal",
    );
    expect(fixture).toBeDefined();

    renderTabletop(fixture!.create(), { viewerId: "player-2", forceMobileLayout: true });
    expect(
      screen
        .getByTestId("fab-opponent-hero-row")
        .querySelector(".fab-mobile-arsenal-tray .sim-card-face")
        ?.getAttribute("data-card-image-mode"),
    ).toBe("full");
    expect(
      screen
        .getByTestId("fab-opponent-hero-row")
        .querySelector<HTMLImageElement>(".fab-mobile-arsenal-tray .sim-card-face img")?.src,
    ).toBe("https://cdn.tcg.online/public/fab/simulator/card-back/fab-card-back-square.webp");
  });

  it("renders two labeled, independently inspectable cards in the mobile arsenal tray", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.id === "weapon-and-double-arsenal",
    );
    expect(fixture).toBeDefined();

    renderTabletop(fixture!.create(), { viewerId: "player-2", forceMobileLayout: true });

    const tray = screen.getByLabelText("Arsenal, 2 cards");
    expect(tray.querySelector(".fab-mobile-arsenal-tray-label")?.textContent).toBe("Arsenal2");
    expect(within(tray).getAllByRole("listitem")).toHaveLength(2);
    expect(tray.querySelector('[data-fab-owner-face-down="true"]')?.getAttribute("title")).toBe(
      "Face down — visible only to you",
    );

    fireEvent.click(screen.getByRole("button", { name: "Inspect Arsenal: Red in the Ledger" }));
    expect(screen.getByTestId("fab-permanent-inspector")).not.toBeNull();
  });

  it("shows both owned Arsenal cards with art in the mobile zone inspector", async () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.id === "weapon-and-double-arsenal",
    );
    expect(fixture).toBeDefined();

    renderTabletop(fixture!.create(), { viewerId: "player-2", forceMobileLayout: true });

    fireEvent.click(screen.getByRole("button", { name: "Open Arsenal, 2 cards" }));

    const modal = screen.getByTestId("target-filter-modal");
    expect(within(modal).getAllByRole("listitem")).toHaveLength(2);
    expect(within(modal).getByRole("listitem", { name: "Red in the Ledger" })).not.toBeNull();
    expect(within(modal).getByRole("listitem", { name: "Searing Shot" })).not.toBeNull();
    await waitFor(() =>
      expect(
        modal.querySelectorAll('.card-grid [data-card-image-mode="full"]').length,
      ).toBeGreaterThanOrEqual(2),
    );
  });

  it("renders the viewer-safe FAB card back for an opponent arsenal", () => {
    const fixture = FAB_VISUAL_FIXTURES.find(
      (candidate) => candidate.id === "weapon-and-double-arsenal",
    );
    expect(fixture).toBeDefined();

    renderTabletop(fixture!.create(), { viewerId: "player-2" });

    const arsenal = screen.getByLabelText("Inspect Arsenal, 1 card");
    const cardBack = arsenal.querySelector<HTMLImageElement>('[data-face="hidden"] img');
    expect(cardBack).not.toBeNull();
    expect(cardBack?.src).toBe(
      "https://cdn.tcg.online/public/fab/simulator/card-back/fab-card-back-square.webp",
    );
  });

  describe("portrait mobile shared-arena combat states", () => {
    it("closed chain with zero permanents keeps fixed outer topology and hand", () => {
      renderTabletop(createOpeningFixtureState(), { forceMobileLayout: true });

      const board = screen.getByTestId("fab-board");
      expect(board.getAttribute("data-layout")).toBe("portrait-mobile");
      expect(board.getAttribute("data-combat-mode")).toBe("closed");
      expect(board.getAttribute("data-card-crop")).toBe("art-square");
      expect(screen.getByTestId("fab-opponent-hero-row").getAttribute("aria-label")).toBe(
        "Opponent board",
      );
      expect(screen.getByTestId("fab-player-hero-row").getAttribute("aria-label")).toBe(
        "Your board",
      );
      expect(
        screen.getByTestId("fab-player-hero-row").querySelector(".fab-mobile-hero-life"),
      ).toBeNull();
      expect(screen.getAllByLabelText("Life 20").length).toBeGreaterThanOrEqual(2);
      // Occupied public permanents are inspectable; empty slots remain inert.
      expect(screen.getByTestId("fab-player-hero-row").querySelectorAll("button")).toHaveLength(8);
      expect(screen.getByTestId("fab-opponent-zone-inventory")).not.toBeNull();
      expect(screen.getByTestId("fab-shared-arena")).not.toBeNull();
      const playerZoneInventory = screen.getByTestId("fab-player-zone-inventory");
      expect(playerZoneInventory.getAttribute("aria-label")).toBe("Your public zones");
      expect(playerZoneInventory.querySelector('[data-zone="resources"]')).toBeNull();
      const deckCell = playerZoneInventory.querySelector('[data-zone="deck"]');
      expect(deckCell?.tagName).toBe("DIV");
      expect(deckCell?.getAttribute("role")).toBe("group");
      const pitchCell = playerZoneInventory.querySelector('[data-zone="pitch"]');
      expect(pitchCell?.getAttribute("aria-label")).toBe("Open Pitch, 0 cards");
      expect(pitchCell?.querySelector(".fab-mobile-zone-resource-meter")).toBeNull();
      const graveyardCell = playerZoneInventory.querySelector('[data-zone="graveyard"]');
      expect(graveyardCell?.textContent).toMatch(/GY/);
      expect(graveyardCell?.textContent).not.toMatch(/Graveyard/);
      expect(graveyardCell?.getAttribute("aria-label")).toBe("Open Graveyard, 1 card");
      expect(screen.queryByTestId("fab-mobile-hero-action-points")).toBeNull();
      expect(screen.getByTestId("fab-hand-bottom")).not.toBeNull();
      expect(
        screen.getByTestId("fab-hand-bottom").querySelector('[data-fab-card-frame="tactical"]'),
      ).not.toBeNull();
      const renderedHandImages = [
        ...screen.getByTestId("fab-hand-bottom").querySelectorAll<HTMLImageElement>("img"),
      ];
      expect(renderedHandImages).not.toHaveLength(0);
      for (const image of renderedHandImages) {
        expect(image.src).toMatch(
          /^https:\/\/cdn\.tcg\.online\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/,
        );
      }
      expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-mode")).toBe("closed");
      expect(screen.getByTestId("fab-table-center").getAttribute("data-center-mode")).toBe("board");
      expect(screen.getByTestId("fab-permanents-opponent")).not.toBeNull();
      expect(screen.getByTestId("fab-permanents-player")).not.toBeNull();
      expect(screen.queryByTestId("fab-shared-arena-combat")).toBeNull();
    });

    it("omits an empty offhand slot and marks the reflowed weapon lane", () => {
      renderTabletop(createOpeningFixtureState(), { forceMobileLayout: true });

      const opponentHeroRow = screen.getByTestId("fab-opponent-hero-row");
      const playerHeroRow = screen.getByTestId("fab-player-hero-row");

      expect(opponentHeroRow.getAttribute("data-has-offhand")).toBeNull();
      expect(playerHeroRow.getAttribute("data-has-offhand")).toBeNull();
      expect(opponentHeroRow.querySelector('[data-slot="offhand"]')).toBeNull();
      expect(playerHeroRow.querySelector('[data-slot="offhand"]')).toBeNull();
      expect(opponentHeroRow.querySelector('[data-slot="weapon"]')).not.toBeNull();
      expect(playerHeroRow.querySelector('[data-slot="weapon"]')).not.toBeNull();
    });

    it("opens accessible mobile inspection for Rhinar and Romping Club without inventing an activation", () => {
      const base = createOpeningFixtureState();
      const playerHero = Object.values(base.cards).find(
        (card) => card.ownerId === "player-1" && card.zone === "hero",
      );
      const playerWeapon = Object.values(base.cards).find(
        (card) => card.ownerId === "player-1" && card.zone === "weapon",
      );
      expect(playerHero).toBeDefined();
      expect(playerWeapon).toBeDefined();
      if (!playerHero || !playerWeapon) throw new Error("Missing player permanents");

      const state: FabPresentationState = {
        ...base,
        cardDefinitions: {
          ...base.cardDefinitions,
          [playerHero.cardId]: {
            name: "Rhinar",
            cardType: "hero",
            typeLine: "Brute Hero - Young",
            printedText:
              "Whenever you discard a card with 6 or more {p} during your action phase, intimidate.",
          },
          [playerWeapon.cardId]: {
            name: "Romping Club",
            cardType: "weapon",
            typeLine: "Brute Weapon - Club (2H)",
            power: 4,
            printedText:
              "Once per Turn Action - {r}{r}: Attack\n\nOnce per Turn Effect - When you discard a card with 6 or more {p}, Romping Club gains +1{p} until end of turn.",
          },
        },
      };

      renderTabletop(state, { forceMobileLayout: true });

      const rhinarTrigger = screen.getByRole("button", { name: "Inspect Hero: Rhinar" });
      rhinarTrigger.focus();
      fireEvent.click(rhinarTrigger);
      const rhinarDialog = screen.getByTestId("fab-permanent-inspector");
      expect(rhinarDialog.getAttribute("role")).toBe("dialog");
      expect(rhinarDialog.getAttribute("aria-modal")).toBe("true");
      expect(within(rhinarDialog).getByText("Brute Hero - Young")).not.toBeNull();
      expect(within(rhinarDialog).getByText(/whenever you discard/i)).not.toBeNull();
      expect(within(rhinarDialog).getByText(/no direct action is legal now/i)).not.toBeNull();
      const closeRhinar = within(rhinarDialog).getByRole("button", {
        name: "Close Rhinar inspection",
      });
      expect(document.activeElement).toBe(closeRhinar);
      fireEvent.keyDown(rhinarDialog, { key: "Tab" });
      expect(document.activeElement).toBe(closeRhinar);
      fireEvent.click(closeRhinar);
      expect(document.activeElement).toBe(rhinarTrigger);

      fireEvent.click(screen.getByRole("button", { name: "Inspect Weapon: Romping Club" }));
      const clubDialog = screen.getByTestId("fab-permanent-inspector");
      expect(within(clubDialog).getByText("Brute Weapon - Club (2H)")).not.toBeNull();
      expect(within(clubDialog).getByText(/once per turn action/i)).not.toBeNull();
      expect(within(clubDialog).getByText(/will not create a fake action/i)).not.toBeNull();
      expect(
        within(clubDialog).getByRole("button", { name: "Close Romping Club inspection" }),
      ).not.toBeNull();
    });

    it("wraps focus in a permanent inspector with legal actions", () => {
      const onOpenLegalActions = vi.fn();
      const playerHeroId = "player-hero";
      const seat = (playerId: string): FabMobileSeat => ({
        playerId,
        heroCardId: playerId === "player-1" ? playerHeroId : "opponent-hero",
        life: 20,
        resourcePoints: 0,
        actionPoints: 1,
        cardsById: {},
        faceDownIds: [],
        zones: {
          hero: [playerId === "player-1" ? playerHeroId : "opponent-hero"],
          weapon: [],
          head: [],
          chest: [],
          arms: [],
          legs: [],
          permanent: [],
          hand: [],
          arsenal: [],
          pitch: [],
          graveyard: [],
          banished: [],
          deck: [],
        },
      });
      render(
        <FleshAndBloodSimulatorProviders>
          <FabCardPreviewProvider>
            <FabMobileBoard
              opponent={seat("player-2")}
              self={seat("player-1")}
              viewerId="player-1"
              interactionAgencyOwner="none"
              combatView={projectCombatChainView(createOpeningFixtureState())}
              cardMetadata={
                new Map([
                  [playerHeroId, { name: "Rhinar", type: "hero", typeLine: "Brute Hero - Young" }],
                ])
              }
              legalCommands={[
                {
                  move: "begin-play",
                  label: "Play Rhinar",
                  payload: { instanceId: playerHeroId },
                },
              ]}
              interactionStateFor={() => ({ kind: "idle" })}
              onOpenLegalActions={onOpenLegalActions}
              effects={{
                self: [],
                opponent: [],
                game: [],
                count: 0,
                all: [
                  {
                    id: "hero-effect",
                    controllerId: "player-1",
                    sourceLabel: "Test source",
                    label: "Gains dominate",
                    detail: "This hero is modified by a visible object-scoped effect.",
                    tone: "buff",
                    durationLabel: "This turn",
                    status: "applying",
                    remainingUses: null,
                    scopes: [{ kind: "object", instanceId: playerHeroId }],
                  },
                ],
              }}
              onOpenEffects={() => undefined}
            />
          </FabCardPreviewProvider>
        </FleshAndBloodSimulatorProviders>,
      );

      fireEvent.click(screen.getByRole("button", { name: "Inspect Hero: Rhinar" }));
      const dialog = screen.getByTestId("fab-permanent-inspector");
      expect(
        within(dialog).getByText("This hero is modified by a visible object-scoped effect."),
      ).not.toBeNull();
      const close = within(dialog).getByRole("button", { name: "Close Rhinar inspection" });
      const legalActions = within(dialog).getByRole("button", { name: "Open legal actions" });

      legalActions.focus();
      fireEvent.keyDown(dialog, { key: "Tab" });
      expect(document.activeElement).toBe(close);
      fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
      expect(document.activeElement).toBe(legalActions);
    });

    it("renders a closed priority window without assigning it to the opponent", () => {
      renderTabletop(
        {
          ...createOpeningFixtureState(),
          priorityPlayerId: null,
        },
        { forceMobileLayout: true, readOnly: false },
      );

      const bottomRail = screen.getByTestId("fab-mobile-bottom-rail");
      expect(bottomRail.getAttribute("data-priority-owner")).toBe("closed");
      expect(bottomRail.querySelector(".fab-mobile-priority")).toBeNull();
      expect(bottomRail.textContent).not.toContain("Opponent priority");
    });

    it("mobile End turn prefers engine onEndTurn over presentation-only onAction", async () => {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: 390,
      });
      // SimulatorViewportShell uses useActiveLayout; flush post-mount mobile mode.
      window.dispatchEvent(new Event("resize"));

      const onEndTurn = vi.fn();
      const onAction = vi.fn();
      renderTabletop(createOpeningFixtureState(), {
        forceMobileLayout: true,
        readOnly: false,
        onEndTurn,
        onAction,
      });
      // Allow useActiveLayout's post-mount effect to settle on mobile.
      await Promise.resolve();
      window.dispatchEvent(new Event("resize"));
      await Promise.resolve();

      const endTurn = await screen.findByTestId("fab-mobile-end-turn");
      fireEvent.click(endTurn);
      expect(onEndTurn).toHaveBeenCalledTimes(1);
      expect(onAction).not.toHaveBeenCalled();
    });

    it("mobile hides End turn when the engine does not expose it as legal", async () => {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: 390,
      });
      window.dispatchEvent(new Event("resize"));

      const onEndTurn = vi.fn();
      renderTabletop(createOpeningFixtureState(), {
        forceMobileLayout: true,
        readOnly: false,
        onEndTurn,
        canEndTurn: false,
      });
      await Promise.resolve();
      window.dispatchEvent(new Event("resize"));
      await Promise.resolve();

      expect(screen.queryByTestId("fab-mobile-end-turn")).toBeNull();
      expect(screen.getByTestId("fab-mobile-bottom-rail").textContent).toContain("Waiting");
      expect(onEndTurn).not.toHaveBeenCalled();
    });

    it("mobile Play / activate opens the FAB legal-action flow instead of match activity", async () => {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: 390,
      });
      window.dispatchEvent(new Event("resize"));
      const onOpenLegalActions = vi.fn();
      const state = {
        ...createMultiLinkActiveFixtureState(),
        priorityPlayerId: "player-1",
      };
      renderTabletop(state, {
        forceMobileLayout: true,
        readOnly: false,
        onOpenLegalActions,
        legalCommands: [
          {
            move: "begin-play",
            label: "Play a card",
            payload: { instanceId: "mobile-action-card" },
          },
        ],
      });

      await Promise.resolve();
      window.dispatchEvent(new Event("resize"));
      await Promise.resolve();
      fireEvent.click(await screen.findByTestId("fab-chain-play-activate"));
      expect(onOpenLegalActions).toHaveBeenCalledTimes(1);
    });

    it("keeps End turn on the mobile board when card actions are also available", async () => {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: 390,
      });
      window.dispatchEvent(new Event("resize"));
      const onEndTurn = vi.fn();
      const state = {
        ...createMultiLinkActiveFixtureState(),
        priorityPlayerId: "player-1",
      };
      renderTabletop(state, {
        forceMobileLayout: true,
        readOnly: false,
        onEndTurn,
        canEndTurn: true,
        onOpenLegalActions: vi.fn(),
        legalCommands: [
          {
            move: "begin-play",
            label: "Play a card",
            payload: { instanceId: "mobile-action-card" },
          },
          { move: "end-turn", label: "End turn", payload: {} },
        ],
      });

      await Promise.resolve();
      window.dispatchEvent(new Event("resize"));
      await Promise.resolve();

      expect(await screen.findByTestId("fab-chain-play-activate")).not.toBeNull();
      const endTurn = await screen.findByTestId("fab-mobile-end-turn");
      fireEvent.click(endTurn);
      expect(onEndTurn).toHaveBeenCalledTimes(1);
    });

    it("suppresses the combat rail pass while Match activity owns the pass action", async () => {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: 390,
      });
      window.dispatchEvent(new Event("resize"));
      const onPassPriority = vi.fn();
      renderTabletop(createMultiLinkActiveFixtureState(), {
        forceMobileLayout: true,
        readOnly: false,
        onPassPriority,
        matchActions: (
          <button type="button" data-testid="drawer-pass-priority" onClick={onPassPriority}>
            Pass priority
          </button>
        ),
      });

      await Promise.resolve();
      window.dispatchEvent(new Event("resize"));
      await Promise.resolve();
      expect(await screen.findByTestId("fab-chain-pass-priority")).not.toBeNull();

      fireEvent.click(screen.getByLabelText("Open match menu"));
      const drawer = await screen.findByRole("dialog", {
        name: "Flesh and Blood match center",
      });
      expect(
        screen.getByTestId("fab-mobile-bottom-rail").getAttribute("data-match-activity-open"),
      ).toBe("true");
      expect(screen.queryByTestId("fab-chain-pass-priority")).toBeNull();

      fireEvent.click(within(drawer).getByTestId("drawer-pass-priority"));
      expect(onPassPriority).toHaveBeenCalledTimes(1);
    });

    it("closed chain with permanents for both players keeps permanents visible", () => {
      renderTabletop(createClosedWithPermanentsFixtureState({ bothPlayers: true }), {
        forceMobileLayout: true,
      });

      expect(screen.getByTestId("fab-board").getAttribute("data-combat-mode")).toBe("closed");
      expect(
        screen.getByTestId("fab-permanents-opponent").querySelector("[data-entity-id]"),
      ).not.toBeNull();
      expect(
        screen.getByTestId("fab-permanents-player").querySelector("[data-entity-id]"),
      ).not.toBeNull();
      expect(
        screen.getByRole("button", { name: "Scroll opponent permanents right" }),
      ).not.toBeNull();
      expect(screen.getByRole("button", { name: "Scroll your permanents right" })).not.toBeNull();
      expect(screen.getByTestId("fab-hand-bottom")).not.toBeNull();
      expect(screen.getByTestId("fab-opponent-zone-inventory")).not.toBeNull();
      expect(screen.getByTestId("fab-player-zone-inventory")).not.toBeNull();
    });

    it("keeps both permanent rows visible on the desktop playmat", () => {
      renderTabletop(createClosedWithPermanentsFixtureState({ bothPlayers: true }), {
        forceMobileLayout: false,
      });

      expect(screen.getByRole("list", { name: "Opponent permanents, 8 cards" })).not.toBeNull();
      expect(screen.getByRole("list", { name: "Your permanents, 8 cards" })).not.toBeNull();
    });

    it.each(["desktop", "mobile"] as const)(
      "previews and discloses the real bound Auras on %s",
      async (layout) => {
        const session = renderFabSimulatorScenario({
          scenarioId: "mark-bindings-zombie-board",
          layout,
        });
        await session.pom.waitForReady();

        const binding = screen.getByLabelText(/Mark of Ushering is under Restless Looter/);
        const peek = within(binding).getByRole("button", {
          name: "Mark of Ushering, under Restless Looter",
        });
        fireEvent.mouseEnter(peek);
        await waitFor(() => {
          expect(screen.getByTestId("fab-card-preview").dataset.visible).toBe("true");
        });

        fireEvent.click(
          within(binding).getByRole("button", {
            name: "View 1 card under Restless Looter",
          }),
        );
        const disclosure = await screen.findByRole("dialog", {
          name: "Cards under Restless Looter",
        });
        expect(
          within(disclosure).getByRole("button", {
            name: "Preview Mark of Ushering, under Restless Looter",
          }),
        ).not.toBeNull();
      },
    );

    it.each([
      ["attacking player on desktop", "player-1", false],
      ["defending player on mobile", "player-2", true],
    ] as const)(
      "keeps a bound Aura visible on the combat-chain attacker to the %s",
      (_perspective, viewerId, forceMobileLayout) => {
        const scenario = getFabEngineScenario("usurp-preview-mark-of-ushering-blue");
        if (!scenario) throw new Error("Missing Mark of Ushering attack scenario.");
        const match = scenario.boot();
        const game = FabTestEngine.fromRuntime(match.runtime);
        const attacker = game.as(dash);

        attacker.activateAttack(limpitHopALongYellow, { stopAt: "on-attack" });
        game.advanceUntil({ stopAt: "defend" });

        renderTabletop(presentRuntime(match.runtime, viewerId), {
          viewerId,
          forceMobileLayout,
          readOnly: true,
        });

        const chainAttacker = screen.getByTestId("fab-chain-card-attack");
        expect(chainAttacker.getAttribute("aria-label")).toContain(
          "with Mark of Ushering under it",
        );
        const binding = screen.getByLabelText("Mark of Ushering is under Limpit, Hop-a-long");
        expect(
          within(binding).getByRole("button", {
            name: "Mark of Ushering, under Limpit, Hop-a-long",
          }),
        ).not.toBeNull();
        fireEvent.click(
          within(binding).getByRole("button", {
            name: "View 1 card under Limpit, Hop-a-long",
          }),
        );
        expect(
          screen.getByRole("dialog", { name: "Cards under Limpit, Hop-a-long" }),
        ).not.toBeNull();
      },
    );

    it("stacks repeated generated tokens with their instance counts", () => {
      const match = getFabEngineScenario("permanent-token-generation")?.boot();
      if (!match) throw new Error("Missing permanent-token generation scenario.");
      const player = match.engine.as(catalogIds.bravo);
      for (const canonicalId of [
        "Rmm8PgnzKNNfLcnKh86jd",
        "Rmm8PgnzKNNfLcnKh86jd",
        "Rmm8PgnzKNNfLcnKh86jd",
        "RGHRQgGJdBhBPgM9Pfgw7",
        "RGHRQgGJdBhBPgM9Pfgw7",
        "6DkjQLNmzwdBmwhfGWTJG",
        "6DkjQLNmzwdBmwhfGWTJG",
      ]) {
        player.activate(canonicalId, { index: 0 });
        match.engine.helpers.resolveUntilIdle({ ordering: "listed" });
      }
      player.play("kD798qm7kWr9fhCLM9dDm");
      match.engine.helpers.resolveUntilIdle({ ordering: "listed" });

      renderTabletop(presentRuntime(match.runtime, match.player1Id), {
        forceMobileLayout: false,
      });

      expect(screen.getByRole("listitem", { name: "Agility, 3 permanents" })).not.toBeNull();
      expect(screen.getByRole("listitem", { name: "Might, 2 permanents" })).not.toBeNull();
      expect(screen.getByRole("listitem", { name: "Vigor, 2 permanents" })).not.toBeNull();
      expect(screen.getByRole("list", { name: "Your permanents, 8 cards" })).not.toBeNull();
    });

    it("open between links shows resolved outcomes while permanents and hand stay mounted", () => {
      renderTabletop(presentationBetweenLinksState(), {
        forceMobileLayout: true,
        onPassPriority: () => undefined,
      });

      const board = screen.getByTestId("fab-board");
      expect(board.getAttribute("data-combat-mode")).toBe("between-links");
      expect(screen.getByTestId("fab-table-center").getAttribute("data-center-mode")).toBe("board");
      expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-state")).toBe(
        "between-links",
      );
      // Outcomes may appear in compact rail and/or link history tabs.
      const chainText = screen.getByTestId("fab-combat-chain").textContent ?? "";
      expect(chainText).toMatch(/2 damage|Blocked|2 DMG/i);
      expect(screen.getByTestId("fab-chain-pass-priority")).not.toBeNull();
      expect(screen.getByTestId("fab-table-center")).not.toBeNull();
      expect(screen.getByTestId("fab-hand-bottom")).not.toBeNull();
      expect(screen.getByTestId("fab-opponent-zone-inventory")).not.toBeNull();
      expect(screen.getByTestId("fab-player-zone-inventory")).not.toBeNull();
      expect(screen.queryByTestId("fab-shared-arena-combat")).toBeNull();
    });

    it("promotes a pending Layer Step attack into the mobile combat workspace", () => {
      const fixture = FAB_VISUAL_FIXTURES.find(
        (candidate) => candidate.scenario.id === "multi-link-history",
      );
      expect(fixture).toBeDefined();

      const state = fixture!.create();
      const activeAttackId = state.combat?.activeLink?.attackInstanceId;
      expect(activeAttackId).toBeDefined();

      renderTabletop(
        {
          ...state,
          stackInstanceIds: [activeAttackId!],
          combat: {
            ...state.combat!,
            step: "layer",
            activeLink: null,
            stackInstanceIds: [activeAttackId!],
          },
        },
        { forceMobileLayout: true },
      );

      expect(screen.getByTestId("fab-board").getAttribute("data-combat-mode")).toBe(
        "between-links",
      );
      expect(screen.getByTestId("fab-table-center").getAttribute("data-center-mode")).toBe(
        "combat",
      );
      expect(screen.getByTestId("fab-shared-arena-combat")).not.toBeNull();
      expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-mode")).toBe("layer");
      expect(screen.getByTestId("fab-chain-attacker")).not.toBeNull();
      expect(screen.queryByTestId("fab-compact-resolution-stack")).toBeNull();
      expect(screen.queryByTestId("fab-permanents-opponent")).toBeNull();
      expect(screen.queryByTestId("fab-permanents-player")).toBeNull();
    });

    it("shows the ordered stack when a response is above the pending Layer Step attack", () => {
      const fixture = FAB_VISUAL_FIXTURES.find(
        (candidate) => candidate.scenario.id === "multi-link-history",
      );
      expect(fixture).toBeDefined();

      const state = fixture!.create();
      const attackId = state.combat?.activeLink?.attackInstanceId;
      expect(attackId).toBeDefined();
      const attack = state.cards[attackId!];
      expect(attack).toBeDefined();
      const responseId = `${attackId}-response`;

      renderTabletop(
        {
          ...state,
          cards: {
            ...state.cards,
            [responseId]: { ...attack!, id: responseId, zone: "stack" },
          },
          stackInstanceIds: [responseId, attackId!],
          combat: {
            ...state.combat!,
            step: "layer",
            activeLink: null,
            stackInstanceIds: [responseId, attackId!],
          },
        },
        { forceMobileLayout: true },
      );

      expect(screen.getByTestId("fab-chain-attacker")).not.toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Open stack, 2 pending effects" }));
      const stack = screen.getByRole("dialog", { name: "Stack" });
      expect(within(stack).getAllByRole("listitem")).toHaveLength(2);
      expect(
        within(stack).getByRole("button", { name: /Inspect stack layer 1:.*resolves next/ }),
      ).not.toBeNull();
      expect(
        within(stack).getByRole("button", {
          name: /Inspect stack layer 2:.*resolves after layer 1/,
        }),
      ).not.toBeNull();
    });

    it("active multi-block combat keeps hand and shows defenders", () => {
      renderTabletop(createMultiLinkActiveFixtureState(), { forceMobileLayout: true });

      const board = screen.getByTestId("fab-board");
      expect(board.getAttribute("data-combat-mode")).toBe("active-link");
      expect(screen.getByTestId("fab-table-center").getAttribute("data-center-mode")).toBe(
        "combat",
      );
      expect(board.getAttribute("data-card-crop")).toBe("art-square");
      expect(screen.getByTestId("fab-shared-arena-combat")).not.toBeNull();
      expect(screen.queryByTestId("fab-permanents-opponent")).toBeNull();
      expect(screen.queryByTestId("fab-permanents-player")).toBeNull();
      expect(screen.queryByTestId("fab-open-permanents")).toBeNull();
      const progress = screen.getByTestId("fab-chain-step-progress");
      expect(progress).not.toBeNull();
      const completedStep = within(progress).getByRole("button", { name: /Layer: done/i });
      fireEvent.click(completedStep);
      expect(within(progress).getByRole("status").textContent).toMatch(/Layer.*done/i);
      expect(screen.getByTestId("fab-chain-blocks").children.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByTestId("fab-chain-mobile-totals").textContent).not.toMatch(
        /damage|blocked/i,
      );
      expect(screen.queryByTestId("fab-chain-mobile-footer")).toBeNull();
      expect(screen.queryByTestId("fab-chain-equation")).toBeNull();
      expect(screen.getByTestId("fab-hand-bottom")).not.toBeNull();
      expect(screen.getByTestId("fab-player-zone-inventory")).not.toBeNull();
      expect(screen.getByTestId("fab-opponent-hero-row")).not.toBeNull();
      expect(screen.getByTestId("fab-player-hero-row")).not.toBeNull();
      const opponentSlots = [
        ...screen
          .getByTestId("fab-opponent-hero-row")
          .querySelector(".fab-mobile-hero-combat-slots")!.children,
      ].map((child) => child.getAttribute("data-slot"));
      const playerSlots = [
        ...screen.getByTestId("fab-player-hero-row").querySelector(".fab-mobile-hero-combat-slots")!
          .children,
      ].map((child) => child.getAttribute("data-slot"));
      expect(opponentSlots.slice(0, 2)).toEqual(["hero", "weapon"]);
      expect(playerSlots.slice(-2)).toEqual(["weapon", "hero"]);
      expect(board.querySelectorAll(".fab-square-tile").length).toBeGreaterThan(0);
    });

    it("keeps active effects available from the existing combat toolbar", () => {
      const state: FabPresentationState = {
        ...createMultiLinkActiveFixtureState(),
        activeEffects: [
          {
            id: "combat-discount",
            controllerId: "player-1",
            sourceLabel: "Seismic Surge",
            label: "Cost −1",
            detail: "Your next Guardian attack action card costs 1 less. Source: Seismic Surge.",
            tone: "buff",
            durationLabel: "This turn",
            status: "armed",
            remainingUses: 1,
            scopes: [{ kind: "future-object", playerId: "player-1" }],
          },
        ],
      };
      renderTabletop(state, { forceMobileLayout: true });

      const trigger = screen.getByTestId("fab-open-active-effects");
      expect(trigger.textContent).toContain("Effects1");
      expect(screen.getByTestId("fab-table-center").getAttribute("data-center-mode")).toBe(
        "combat",
      );

      fireEvent.click(trigger);

      expect(screen.getByTestId("fab-active-effects-inspector")).not.toBeNull();
      expect(screen.getByText("Cost −1")).not.toBeNull();
    });

    it("opens both permanent zones in one focus-safe drawer during active combat", () => {
      const combat = createMultiLinkActiveFixtureState();
      const permanents = createClosedWithPermanentsFixtureState();
      renderTabletop(
        {
          ...combat,
          priorityPlayerId: "player-2",
          cards: {
            ...combat.cards,
            ...Object.fromEntries(
              Object.entries(permanents.cards).filter(([, card]) => card.zone === "permanent"),
            ),
          },
          cardDefinitions: { ...combat.cardDefinitions, ...permanents.cardDefinitions },
        },
        { forceMobileLayout: true },
      );

      const trigger = screen.getByTestId("fab-open-permanents") as HTMLButtonElement;
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      fireEvent.click(trigger);

      const drawer = screen.getByRole("dialog", { name: "Permanents" });
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(within(drawer).getByTestId("fab-permanents-opponent")).not.toBeNull();
      expect(within(drawer).getByTestId("fab-permanents-player")).not.toBeNull();
      expect(document.activeElement).toBe(
        within(drawer).getByRole("button", { name: "Close permanents" }),
      );

      fireEvent.keyDown(window, { key: "Escape" });
      expect(screen.queryByRole("dialog", { name: "Permanents" })).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });

    it("public targeting retracts active combat to compact rail without removing hand", () => {
      renderTabletop(createMultiLinkActiveFixtureState(), {
        forceMobileLayout: true,
        publicTargeting: true,
      });

      expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-retracted")).toBe(
        "true",
      );
      expect(screen.getByTestId("fab-table-center").getAttribute("data-center-mode")).toBe("board");
      expect(screen.queryByTestId("fab-shared-arena-combat")).toBeNull();
      expect(screen.getByTestId("fab-shared-arena-rail")).not.toBeNull();
      expect(screen.getByTestId("fab-permanents-opponent")).not.toBeNull();
      expect(screen.getByTestId("fab-permanents-player")).not.toBeNull();
      expect(screen.queryByTestId("fab-open-permanents")).toBeNull();
      expect(screen.getByTestId("fab-hand-bottom")).not.toBeNull();
      expect(screen.getByTestId("fab-table-center")).not.toBeNull();
    });

    it("hand and zone inventory remain mounted across closed, between, and active states", async () => {
      const { rerender } = render(
        <FleshAndBloodSimulatorProviders>
          <FleshAndBloodTabletop
            state={createOpeningFixtureState()}
            viewerId="player-1"
            readOnly
            forceMobileLayout
          />
        </FleshAndBloodSimulatorProviders>,
      );
      expect(screen.getByTestId("fab-hand-bottom")).not.toBeNull();
      expect(screen.getByTestId("fab-player-zone-inventory")).not.toBeNull();

      rerender(
        <FleshAndBloodSimulatorProviders>
          <FleshAndBloodTabletop
            state={presentationBetweenLinksState()}
            viewerId="player-1"
            readOnly
            forceMobileLayout
          />
        </FleshAndBloodSimulatorProviders>,
      );
      expect(screen.getByTestId("fab-hand-bottom")).not.toBeNull();
      expect(screen.getByTestId("fab-player-zone-inventory")).not.toBeNull();
      await waitFor(() =>
        expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-mode")).toBe(
          "between-links",
        ),
      );

      rerender(
        <FleshAndBloodSimulatorProviders>
          <FleshAndBloodTabletop
            state={createMultiLinkActiveFixtureState()}
            viewerId="player-1"
            readOnly
            forceMobileLayout
          />
        </FleshAndBloodSimulatorProviders>,
      );
      expect(screen.getByTestId("fab-hand-bottom")).not.toBeNull();
      expect(screen.getByTestId("fab-player-zone-inventory")).not.toBeNull();
      await waitFor(() =>
        expect(screen.getByTestId("fab-combat-chain").getAttribute("data-chain-mode")).toBe(
          "active-link",
        ),
      );
    });

    it("announces combat mode changes and keeps priority ownership in the persistent mobile rail", () => {
      renderTabletop(
        { ...createMultiLinkActiveFixtureState(), priorityPlayerId: "player-2" },
        { forceMobileLayout: true },
      );
      expect(screen.getByTestId("fab-combat-announcer")).not.toBeNull();
      expect(screen.queryByTestId("fab-chain-priority-actions")).toBeNull();
      expect(screen.queryByTestId("fab-chain-priority")).toBeNull();
      expect(screen.getByTestId("fab-board").getAttribute("data-opponent-priority")).toBe("true");
    });
  });
});
