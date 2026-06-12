/**
 * Repro + regression guard for the 2026-05-06 daily digest cluster of
 * "Confirm button greyed out" reports against forced-opponent-banish effects:
 *   - Sid Phillips, Toy Surgeon (set 012 / #126) — 14 reports.
 *   - Be King Undisputed (set 004 / #129, set 009 / #133) — 3 reports.
 *   - Sid Phillips edict-discard variant — 1 report (#39).
 *   - Madam Mim Dinky / Dinky, Has the Brains — likely same pattern.
 *
 * Symptom from players: opponent of the source-card controller is shown the
 * forced-banish prompt; they CAN tap a target on the board, but the
 * Confirm button never enables, so they time out and lose.
 *
 * Root cause (fixed alongside this test): `cardMatchesSelectionTargetDsl`
 * interpreted `target.owner: "opponent"` from the *chooser's* perspective.
 * The engine emits it from the *source-card-controller's* perspective.
 * They diverge for `chosenBy: "opponent"` effects, where the controller
 * forces the opponent to pick from THEIR OWN characters: every legal
 * selection failed the owner gate, `canConfirmResolutionSelection` returned
 * false, and Confirm stayed disabled. The fix passes the source card's
 * controller side as `referenceSide` instead of the chooser's side.
 *
 * The board-snapshot stub used here is critical to reproducing the bug:
 * without it, `getSideForOwnerId` returns null, the owner gate is short-
 * circuited, and the test passes vacuously (the symptom we lived with on
 * commits 0011cd4c0..68d33dbef before the codex P2 review surfaced the gap).
 */
import { describe, expect, it } from "bun:test";
import type {
  CardInstanceId,
  LorcanaProjectedBoardView,
  PlayerId,
  TargetResolutionSelectionContext,
} from "@tcg/lorcana-engine";
import "../../../../testing/public-env";
import {
  LorcanaSidebarPresenter,
  type LorcanaGameContextValue,
} from "@/features/simulator/context/game-context.svelte.js";
import { DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS } from "@/features/simulator/model/player-visual-settings.js";
import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
import type { CardSnapshotMap } from "@/features/simulator/model/board-utils.js";

const PLAYER_ONE = "player-1" as PlayerId;
const PLAYER_TWO = "player-2" as PlayerId;

function asCardId(value: string): CardInstanceId {
  return value as CardInstanceId;
}

function createCardSnapshot(overrides: Partial<LorcanaCardSnapshot> = {}): LorcanaCardSnapshot {
  return {
    cardId: overrides.cardId ?? asCardId("card-1"),
    definitionId: overrides.definitionId ?? "card-1",
    ownerId: overrides.ownerId ?? PLAYER_ONE,
    ownerSide: overrides.ownerSide ?? "playerOne",
    zoneId: overrides.zoneId ?? "play",
    label: overrides.label ?? "Goofy - Musketeer",
    isMasked: overrides.isMasked ?? false,
    facePresentation: overrides.facePresentation ?? "faceUp",
    cardType: overrides.cardType ?? "character",
    readyState: overrides.readyState ?? "ready",
    isDrying: overrides.isDrying ?? false,
    textEntries: overrides.textEntries ?? [],
    ...overrides,
  } as LorcanaCardSnapshot;
}

function createGameContextStub(
  overrides: Partial<LorcanaGameContextValue> = {},
): LorcanaGameContextValue {
  const executableMovesFn = overrides.executableMoves ?? (() => []);
  const cardSnapshotsByIdFn = overrides.cardSnapshotsById ?? (() => ({}));

  return {
    boardSnapshot: () => null,
    cardSnapshotsById: cardSnapshotsByIdFn,
    resolveCardSnapshot:
      overrides.resolveCardSnapshot ??
      ((cardId: string) => (cardSnapshotsByIdFn() as CardSnapshotMap)[cardId] ?? null),
    resolveCardName: overrides.resolveCardName ?? (() => null),
    resolveCardInkable: overrides.resolveCardInkable ?? (() => null),
    resolvePlayerName: () => null,
    isPlayerMobile: () => false,
    getPlayerSummary: () => null,
    executableMoves: executableMovesFn,
    moveCategorySummaries: () => [],
    moveCategoryCount: () => 0,
    expandCardMoves: () => [],
    expandCardActionCategoryMoves: () => [],
    expandCategoryMoves: (categoryId: string) =>
      executableMovesFn().filter((move) => move.presentation.categoryId === categoryId),
    challengeReadyCardIds: () => [],
    moveLogEntries: () => [],
    pendingResolutionMoves: () => [],
    playableHandCardIds: () => [],
    validChallengeTargetIds: () => [],
    invalidChallengeTargetReasons: () => ({}),
    ownerSide: () => null,
    pregameActiveSide: () => null,
    pregamePhase: () => null,
    canActInPregame: () => false,
    statusMessage: () => "",
    selectedCardId: () => null,
    selectedMulliganCardIds: () => [],
    pendingErrorReason: () => null,
    pendingMoveError: () => null,
    pendingResolutionAutoOpenStateId: () => null,
    isOptimisticMovePending: () => false,
    challengeSourceCardId: () => null,
    challengeMode: () => false,
    animations: () => [],
    questAnimations: () => [],
    challengeAnimations: () => [],
    overlayAnnouncements: () => [],
    cardEffectAnimations: () => [],
    animationSpeed: () => "normal",
    setAnimationSpeed: () => {},
    soundVolume: () => 50,
    setSoundVolume: () => {},
    showZoneCounters: () => false,
    setShowZoneCounters: () => {},
    previewChallenge: () => null,
    executeMove: () => false,
    playCard: () => false,
    ink: () => false,
    canMoveCharacterToLocation: () => false,
    canDropHandCardIntoZone: () => false,
    handleBoardAnchorsChange: () => {},
    getOwnerIdForSide: () => null,
    getPlayerVisualSettings: () => DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS,
    getPlayerVisualSettingsByOwnerId: () => DEFAULT_LORCANA_PLAYER_VISUAL_SETTINGS,
    setSelectedCardId: () => {},
    setSelectedMulliganCardIds: () => {},
    setChallengeSourceCardId: () => {},
    setPendingError: () => {},
    setStatusMessage: () => {},
    handleLocaleChanged: () => {},
    runAnimation: () => false,
    runQuestAnimation: () => false,
    runChallengeAnimation: () => false,
    ...overrides,
  } as LorcanaGameContextValue;
}

/**
 * Captured executeMove call. Used by tests that assert the presenter
 * forwarded the right `resolveEffect` payload to the engine.
 */
interface ExecutedMove {
  moveId: string;
  params: Record<string, unknown>;
}

/**
 * Mirrors `createPendingResolutionMove` from
 * `game-context.mobile-actions.test.ts`. Returns a `PendingResolutionMoveEntry`
 * shape (not the broader `ExecutableMoveEntry`) because that is what
 * `startResolutionSelectionSession` accepts — the engine only resolves
 * effects/bags here, not the wider move set.
 */
function createPendingResolutionMove(): {
  id: string;
  moveId: "resolveEffect";
  params: { effectId: string };
} {
  return {
    id: "resolve-effect-1",
    moveId: "resolveEffect",
    params: { effectId: "effect-1" },
  };
}

/**
 * Minimal board snapshot the presenter only needs for `getSideForOwnerId` —
 * used by `canConfirmResolutionSelection` to map `context.chooserId` and the
 * source card's controller to a `LorcanaPlayerSide` so target-DSL owner gates
 * can run.
 *
 * Without a board snapshot, `chooserSide` collapses to `null` and the owner
 * gate in `cardMatchesSelectionTargetDsl` is short-circuited — masking the
 * production "Confirm greyed out" symptom (codex P2 review on PR #1315).
 */
function createBoardSnapshotForOwnership(): LorcanaProjectedBoardView {
  return {
    gameID: "game-1",
    matchID: "match-1",
    stateID: 1,
    playerOrder: [PLAYER_ONE, PLAYER_TWO],
    turnPlayer: PLAYER_ONE,
    priorityPlayer: PLAYER_ONE,
    turnNumber: 1,
    zones: {
      player_one: { deck: [], hand: [], play: [], inkwell: [], discard: [] },
      player_two: { deck: [], hand: [], play: [], inkwell: [], discard: [] },
    },
    cards: {},
    activeEffects: [],
    pendingEffects: [],
    bagEffects: [],
  } as unknown as LorcanaProjectedBoardView;
}

/**
 * The forced-banish-on-opponent prompt context as the engine publishes it for
 * Sid Phillips' "If you do, each opponent chooses and banishes one of their
 * characters" and Be King Undisputed's "Each opponent chooses and banishes one
 * of their characters". Mirrors the shape of the snapshot used by
 * be-king-undisputed.test.ts and 126-sid-phillips-toy-surgeon.test.ts.
 */
function createForceOpponentBanishContext(args: {
  sourceCardId: string;
  chooserId: PlayerId;
  cardCandidateIds: readonly string[];
}): TargetResolutionSelectionContext {
  return {
    origin: "pending-effect",
    requestId: "effect-1",
    kind: "target-selection",
    sourceCardId: asCardId(args.sourceCardId),
    chooserId: args.chooserId,
    currentSelection: {},
    submitField: "targets",
    // The DSL the engine emits for "each opponent chooses one of THEIR
    // characters" — `owner: "opponent"` is relative to the source's controller,
    // so it resolves to the chooser's own characters. Same shape both Sid and
    // Be King produce.
    targetDsl: [
      {
        selector: "chosen",
        owner: "opponent",
        zones: ["play"],
        cardTypes: ["character"],
        count: 1,
      },
    ],
    cardCandidateIds: args.cardCandidateIds.map(asCardId),
    playerCandidateIds: [],
    allowedZones: ["play"],
    minSelections: 1,
    maxSelections: 1,
    ordered: false,
    autoRejected: false,
  } as TargetResolutionSelectionContext;
}

describe("Forced-opponent banish prompt | confirm flow", () => {
  // Source card belongs to PLAYER_ONE (the player who played Sid / Be King).
  // The PROMPT is delivered to PLAYER_TWO (the opponent / chooser).
  // Player two must be able to click their own character and have Confirm enable.

  const sidPhillips = createCardSnapshot({
    cardId: "sid-phillips-instance",
    label: "Sid Phillips - Toy Surgeon",
    ownerId: PLAYER_ONE,
    ownerSide: "playerOne",
    cardType: "character",
  });

  const opponentCharA = createCardSnapshot({
    cardId: "opp-char-a",
    label: "Rival Cub",
    ownerId: PLAYER_TWO,
    ownerSide: "playerTwo",
    cardType: "character",
  });

  const opponentCharB = createCardSnapshot({
    cardId: "opp-char-b",
    label: "Rival Lion",
    ownerId: PLAYER_TWO,
    ownerSide: "playerTwo",
    cardType: "character",
  });

  it("enables Confirm after the opponent (chooser) selects one of their own characters", () => {
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => createBoardSnapshotForOwnership(),
        cardSnapshotsById: () => ({
          [sidPhillips.cardId]: sidPhillips,
          [opponentCharA.cardId]: opponentCharA,
          [opponentCharB.cardId]: opponentCharB,
        }),
      }),
    );
    // Force the manual-confirm path so the assertion targets the
    // canConfirmResolutionSelection signal rather than auto-submit, which
    // calls executeMove (stub returns false) and would mask the symptom.
    presenter.skipActionConfirmation = false;

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createForceOpponentBanishContext({
          sourceCardId: sidPhillips.cardId,
          chooserId: PLAYER_TWO,
          cardCandidateIds: [opponentCharA.cardId, opponentCharB.cardId],
        }),
      ),
    ).toBe(true);

    // Initial state: no selection yet, Confirm disabled.
    expect(presenter.canConfirmResolutionSelection).toBe(false);

    // Opponent (player_two) clicks their own character on the board.
    expect(presenter.handleAvailableMovesSelectionCard(opponentCharA.cardId)).toBe(true);
    expect(presenter.resolutionSelectionSession?.selectedTargets).toEqual([opponentCharA.cardId]);

    // The user-visible bug from the reports: Confirm stays greyed out.
    // This assertion mirrors the 17 production reports of forced-banish
    // prompts where the chooser cannot advance past the target picker.
    expect(presenter.canConfirmResolutionSelection).toBe(true);
    expect(presenter.availableMovesSelectionState).toMatchObject({
      mode: "resolution-target",
      canConfirm: true,
      selectedTargetLabels: [opponentCharA.label],
    });
  });

  it("submits the chosen target id when the opponent confirms", () => {
    const executed: ExecutedMove[] = [];
    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => createBoardSnapshotForOwnership(),
        cardSnapshotsById: () => ({
          [sidPhillips.cardId]: sidPhillips,
          [opponentCharA.cardId]: opponentCharA,
          [opponentCharB.cardId]: opponentCharB,
        }),
        executeMove: (moveId, params) => {
          executed.push({ moveId, params: params as Record<string, unknown> });
          return true;
        },
      }),
    );
    presenter.skipActionConfirmation = false;

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createForceOpponentBanishContext({
          sourceCardId: sidPhillips.cardId,
          chooserId: PLAYER_TWO,
          cardCandidateIds: [opponentCharA.cardId, opponentCharB.cardId],
        }),
      ),
    ).toBe(true);

    expect(presenter.handleAvailableMovesSelectionCard(opponentCharB.cardId)).toBe(true);
    expect(presenter.confirmResolutionSelection()).toBe(true);

    expect(executed).toEqual([
      {
        moveId: "resolveEffect",
        params: {
          effectId: "effect-1",
          params: {
            targets: [opponentCharB.cardId],
          },
        },
      },
    ]);
  });

  it("ignores clicks on the controller's own characters (regression guard for BUG-15)", () => {
    // The controller's character cannot leak into the chooser's candidate list.
    // The presenter should refuse the click; canConfirm should stay false.
    const controllerOwnCharacter = createCardSnapshot({
      cardId: "controller-own-char",
      label: "Controller Ally",
      ownerId: PLAYER_ONE,
      ownerSide: "playerOne",
      cardType: "character",
    });

    const presenter = new LorcanaSidebarPresenter(
      createGameContextStub({
        boardSnapshot: () => createBoardSnapshotForOwnership(),
        cardSnapshotsById: () => ({
          [sidPhillips.cardId]: sidPhillips,
          [opponentCharA.cardId]: opponentCharA,
          [controllerOwnCharacter.cardId]: controllerOwnCharacter,
        }),
      }),
    );

    presenter.skipActionConfirmation = false;

    expect(
      presenter.startResolutionSelectionSession(
        createPendingResolutionMove(),
        createForceOpponentBanishContext({
          sourceCardId: sidPhillips.cardId,
          chooserId: PLAYER_TWO,
          // Engine restricts the candidate list — controller's char must not be here.
          cardCandidateIds: [opponentCharA.cardId],
        }),
      ),
    ).toBe(true);

    // Click controller's own char should NOT advance the prompt.
    // The presenter must report the click as unhandled (returns false) so a
    // future regression that silently accepts the click — but leaves
    // canConfirmResolutionSelection false for unrelated reasons — would still
    // be caught here.
    expect(presenter.handleAvailableMovesSelectionCard(controllerOwnCharacter.cardId)).toBe(false);
    expect(presenter.resolutionSelectionSession?.selectedTargets).toEqual([]);
    expect(presenter.canConfirmResolutionSelection).toBe(false);
  });

  it(
    "enables Confirm when the source card is hidden from the chooser's view " +
      "(limbo / not-projected zone) — digest-2026-05-08 #14 reproduction",
    () => {
      // Production scenario from gameId mggXgny0UumOSRY-6TCxg_B turn 13:
      //   Player_one sang Marching Off to Battle via Powerline — World's
      //   Greatest Rock Star, which scryed the top 4 and let player_one play
      //   Be King Undisputed for free. The played Be King sits in
      //   `limbo:player_one` while its banish-target pending effect waits on
      //   player_two. The chooser's projected board does NOT include
      //   `limbo:player_one`, so `cardSnapshotsById[sourceCardId]` returns
      //   undefined for the chooser. Before the fix, `canConfirmResolutionSelection`
      //   fell back to the chooser side as `referenceSide`, every candidate
      //   failed `cardMatchesSelectionTargetDsl` (target.owner === "opponent"
      //   and card.ownerSide === referenceSide because the chooser's chars
      //   ARE on the chooser's side), and Confirm stayed greyed out. The fix
      //   reads the source card's controller from the pending effect's
      //   `payload.controllerId`.

      // Note: NO source-card snapshot is added to cardSnapshotsById — that's
      // exactly what reproduces the production state.
      const presenter = new LorcanaSidebarPresenter(
        createGameContextStub({
          boardSnapshot: () => {
            const board = createBoardSnapshotForOwnership();
            // The pending effect carries the source card's controllerId in
            // payload — required for the fallback that the fix introduces.
            (board as unknown as { pendingEffects: unknown[] }).pendingEffects = [
              {
                id: "effect-1",
                type: "action-effect",
                source: "game",
                sourceId: "be-king-undisputed-instance",
                payload: {
                  id: "effect-1",
                  type: "action-effect",
                  kind: "target-selection",
                  sourceId: "be-king-undisputed-instance",
                  sourceCardId: "be-king-undisputed-instance",
                  controllerId: PLAYER_ONE,
                  chooserId: PLAYER_TWO,
                  effect: {
                    type: "banish",
                    chosenBy: "opponent",
                    target: {
                      selector: "chosen",
                      count: 1,
                      owner: "opponent",
                      zones: ["play"],
                      cardTypes: ["character"],
                    },
                  },
                },
              },
            ];
            return board;
          },
          cardSnapshotsById: () => ({
            // Only opponent's character is visible to the chooser. Be King
            // (sourceCard) is in player_one's limbo and not projected.
            [opponentCharA.cardId]: opponentCharA,
            [opponentCharB.cardId]: opponentCharB,
          }),
        }),
      );
      presenter.skipActionConfirmation = false;

      expect(
        presenter.startResolutionSelectionSession(
          createPendingResolutionMove(),
          createForceOpponentBanishContext({
            sourceCardId: "be-king-undisputed-instance",
            chooserId: PLAYER_TWO,
            cardCandidateIds: [opponentCharA.cardId],
          }),
        ),
      ).toBe(true);

      // Opponent (player_two) clicks their own character on the board.
      expect(presenter.handleAvailableMovesSelectionCard(opponentCharA.cardId)).toBe(true);

      // Without the controllerId fallback, this would be `false` and the
      // player would time out — exactly the symptom in the 11+ Be King reports.
      expect(presenter.canConfirmResolutionSelection).toBe(true);
    },
  );
});
