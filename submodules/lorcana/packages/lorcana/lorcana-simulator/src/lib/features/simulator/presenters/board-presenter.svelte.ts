import type {
  ChallengePreviewResult,
  LorcanaCardTarget,
  LorcanaProjectedBoardView,
} from "@tcg/lorcana-engine";

import {
  getActiveSide,
  getPlayableFromUnderCardIds,
  getTurnSide,
  getZoneCardCount,
  isZoneMasked as isBoardZoneMasked,
  type LorcanaCardSnapshot,
  type LorcanaPlayerSide,
  type LorcanaPlayerSummary,
  type LorcanaTableSeat,
  type LorcanaZoneId,
} from "@/features/simulator/model/contracts.js";
import { type CardSnapshotMap, getCardsForZone } from "@/features/simulator/model/board-utils.js";
import type { LorcanaResolvedPlayerVisualSettings } from "@/features/simulator/model/player-visual-settings.js";
import type {
  BoardAnchorSnapshot,
  ResolvedBoardMoveAnimation,
} from "@/features/simulator/animations/board-move-animations.js";
import type { BoardAnimationPlaceholder } from "@/features/simulator/animations/animation-orchestrator.svelte.js";
import type { ResolvedQuestAnimation } from "@/features/simulator/animations/quest-animations.js";
import type { ResolvedChallengeAnimation } from "@/features/simulator/animations/challenge-animations.js";
import type { ResolvedActionAnimation } from "@/features/simulator/animations/action-animations.js";
import type { ResolvedOverlayAnnouncement } from "@/features/simulator/animations/overlay-announcement-animations.js";
import type { ResolvedCardEffectAnimation } from "@/features/simulator/animations/card-effect-animations.js";
import type {
  AnimationSpeed,
  LorcanaGameContextValue,
} from "@/features/simulator/context/game-context.svelte.js";
import { QUEST_ROTATION_DURATION_MS } from "@/features/simulator/context/game-context.svelte.js";

export class LorcanaBoardPresenter {
  readonly #game: LorcanaGameContextValue;

  isDiscardDialogOpen = $state(false);
  discardTarget = $state<LorcanaCardTarget>({
    selector: "all",
    owner: "any",
    zones: ["discard"],
  });
  discardDialogSide = $state<LorcanaPlayerSide | null>(null);

  isInkwellDialogOpen = $state(false);
  inkwellTarget = $state<LorcanaCardTarget>({
    selector: "all",
    owner: "any",
    zones: ["inkwell"],
  });
  inkwellDialogSide = $state<LorcanaPlayerSide | null>(null);

  readonly topSeat: LorcanaTableSeat = "top";
  readonly bottomSeat: LorcanaTableSeat = "bottom";

  constructor(game: LorcanaGameContextValue) {
    this.#game = game;
  }

  handleBoardAnchorsChange(anchors: BoardAnchorSnapshot): void {
    this.#game.handleBoardAnchorsChange(anchors);
  }

  onBoardAnimationFinished(animationId: string): void {
    this.#game.onBoardAnimationFinished(animationId);
  }

  onQuestAnimationFinished(animationId: string): void {
    this.#game.onQuestAnimationFinished(animationId);
  }

  onChallengeAnimationFinished(animationId: string): void {
    this.#game.onChallengeAnimationFinished(animationId);
  }

  onActionAnimationFinished(animationId: string): void {
    this.#game.onActionAnimationFinished(animationId);
  }

  onCardEffectAnimationFinished(animationId: string): void {
    this.#game.onCardEffectAnimationFinished(animationId);
  }

  onOverlayAnnouncementFinished(animationId: string): void {
    this.#game.onOverlayAnnouncementFinished(animationId);
  }

  activePlayerEffectTargets(): ReadonlySet<LorcanaPlayerSide> {
    return this.#game.activePlayerEffectTargets();
  }

  get boardSnapshot(): LorcanaProjectedBoardView | null {
    return this.#game.boardSnapshot();
  }

  get cardSnapshotsById(): CardSnapshotMap {
    return this.#game.cardSnapshotsById();
  }

  get animations(): ResolvedBoardMoveAnimation[] {
    return this.#game.animations();
  }

  get questAnimations(): ResolvedQuestAnimation[] {
    return this.#game.questAnimations();
  }

  get challengeAnimations(): ResolvedChallengeAnimation[] {
    return this.#game.challengeAnimations();
  }

  get actionAnimations(): ResolvedActionAnimation[] {
    return this.#game.actionAnimations();
  }

  get overlayAnnouncements(): ResolvedOverlayAnnouncement[] {
    return this.#game.overlayAnnouncements();
  }

  get cardEffectAnimations(): ResolvedCardEffectAnimation[] {
    return this.#game.cardEffectAnimations();
  }

  get boardAnimationPlaceholders(): BoardAnimationPlaceholder[] {
    return this.#game.boardAnimationPlaceholders();
  }

  get inFlightCardIds(): ReadonlySet<string> {
    return this.#game.inFlightCardIds();
  }

  get animationSpeed(): AnimationSpeed {
    return this.#game.animationSpeed();
  }

  get showZoneCounters(): boolean {
    return this.#game.showZoneCounters();
  }

  get questRotationDurationMs(): number {
    return QUEST_ROTATION_DURATION_MS[this.animationSpeed];
  }

  previewChallenge(attackerId: string, defenderId: string): ChallengePreviewResult | null {
    return this.#game.previewChallenge(attackerId, defenderId);
  }

  get selectedCardId(): string | null {
    return this.#game.selectedCardId();
  }

  get selectedCardIds(): string[] {
    return this.#game.selectedMulliganCardIds();
  }

  get ownerSide(): LorcanaPlayerSide | null {
    return this.#game.ownerSide();
  }

  get challengeMode(): boolean {
    return this.#game.challengeMode();
  }

  get validChallengeTargetIds(): string[] {
    return this.#game.validChallengeTargetIds();
  }

  get invalidChallengeTargetReasons(): Record<string, string> {
    return this.#game.invalidChallengeTargetReasons();
  }

  get playableHandCardIds(): string[] {
    return this.#game.playableHandCardIds();
  }

  get invalidChallengeTargetIds(): string[] {
    return Object.keys(this.invalidChallengeTargetReasons);
  }

  get bottomSide(): LorcanaPlayerSide {
    return this.ownerSide ?? "playerOne";
  }

  get topSide(): LorcanaPlayerSide {
    return this.bottomSide === "playerOne" ? "playerTwo" : "playerOne";
  }

  get hasOwnedView(): boolean {
    return this.ownerSide !== null;
  }

  get opponentSide(): LorcanaPlayerSide | null {
    return this.ownerSide === "playerOne"
      ? "playerTwo"
      : this.ownerSide === "playerTwo"
        ? "playerOne"
        : null;
  }

  get topZoneChallengeMode(): boolean {
    return this.challengeMode && this.opponentSide === this.topSide;
  }

  get bottomZoneChallengeMode(): boolean {
    return this.challengeMode && this.opponentSide === this.bottomSide;
  }

  get discardCards(): LorcanaCardSnapshot[] {
    return this.discardDialogSide ? this.getZoneCards(this.discardDialogSide, "discard") : [];
  }

  get inkwellCards(): LorcanaCardSnapshot[] {
    return this.inkwellDialogSide ? this.getZoneCards(this.inkwellDialogSide, "inkwell") : [];
  }

  get prioritySide(): LorcanaPlayerSide | null {
    return this.boardSnapshot ? getActiveSide(this.boardSnapshot) : null;
  }

  get turnSide(): LorcanaPlayerSide | null {
    return this.boardSnapshot ? getTurnSide(this.boardSnapshot) : null;
  }

  get topHasPriority(): boolean {
    return this.prioritySide === this.topSide;
  }

  get bottomHasPriority(): boolean {
    return this.prioritySide === this.bottomSide;
  }

  get topIsTurnPlayer(): boolean {
    return this.turnSide === this.topSide;
  }

  get bottomIsTurnPlayer(): boolean {
    return this.turnSide === this.bottomSide;
  }

  getZoneCards(playerSide: LorcanaPlayerSide, zoneId: LorcanaZoneId): LorcanaCardSnapshot[] {
    if (!this.boardSnapshot) {
      return [];
    }
    return getCardsForZone(this.cardSnapshotsById, this.boardSnapshot, playerSide, zoneId);
  }

  getPlayableFromUnderCards(playerSide: LorcanaPlayerSide): LorcanaCardSnapshot[] {
    if (!this.boardSnapshot) {
      return [];
    }
    const cardIds = getPlayableFromUnderCardIds(this.boardSnapshot, playerSide);
    return cardIds
      .map((cardId) => {
        const snapshot = this.cardSnapshotsById[cardId];
        if (!snapshot) return null;
        return { ...snapshot, isFromUnder: true } as LorcanaCardSnapshot;
      })
      .filter((card): card is LorcanaCardSnapshot => card !== null);
  }

  getPlayerSummary(playerSide: LorcanaPlayerSide): LorcanaPlayerSummary | null {
    return this.#game.getPlayerSummary(playerSide);
  }

  getZoneTotalCards(playerSide: LorcanaPlayerSide, zoneId: LorcanaZoneId): number {
    if (zoneId === "inkwell") {
      return this.getPlayerSummary(playerSide)?.inkwellCount ?? 0;
    }
    if (!this.boardSnapshot) {
      return 0;
    }
    return getZoneCardCount(this.boardSnapshot, playerSide, zoneId);
  }

  getDeckCount(playerSide: LorcanaPlayerSide): number {
    if (!this.boardSnapshot) {
      return 0;
    }
    return getZoneCardCount(this.boardSnapshot, playerSide, "deck");
  }

  getRevealedDeckTopCard(playerSide: LorcanaPlayerSide): LorcanaCardSnapshot | null {
    const ownerId = this.getOwnerIdForSide(playerSide);
    if (!ownerId || !this.boardSnapshot) {
      return null;
    }
    const deckTopId = this.boardSnapshot.players[ownerId]?.deckTop;
    if (!deckTopId) {
      return null;
    }
    return this.cardSnapshotsById[deckTopId] ?? null;
  }

  getRevealedDeckBottomCard(playerSide: LorcanaPlayerSide): LorcanaCardSnapshot | null {
    const ownerId = this.getOwnerIdForSide(playerSide);
    if (!ownerId || !this.boardSnapshot) {
      return null;
    }
    const deckBottomId = this.boardSnapshot.players[ownerId]?.deckBottom;
    if (!deckBottomId) {
      return null;
    }
    return this.cardSnapshotsById[deckBottomId] ?? null;
  }

  getOwnerIdForSide(playerSide: LorcanaPlayerSide): string | null {
    return this.#game.getOwnerIdForSide(playerSide);
  }

  getAvailableInk(playerSide: LorcanaPlayerSide): number | null {
    return this.getPlayerSummary(playerSide)?.availableInk ?? null;
  }

  getPlayerVisualSettings(playerSide: LorcanaPlayerSide): LorcanaResolvedPlayerVisualSettings {
    return this.#game.getPlayerVisualSettings(playerSide);
  }

  getPlayerVisualSettingsByOwnerId(
    ownerId: string | null | undefined,
  ): LorcanaResolvedPlayerVisualSettings {
    return this.#game.getPlayerVisualSettingsByOwnerId(ownerId);
  }

  isZoneMasked(playerSide: LorcanaPlayerSide, zoneId: LorcanaZoneId): boolean {
    if (!this.boardSnapshot) {
      return true;
    }
    return isBoardZoneMasked(this.boardSnapshot, playerSide, zoneId);
  }

  handleDiscardClick = (side: LorcanaPlayerSide): void => {
    this.discardDialogSide = side;
    this.discardTarget = {
      selector: "all",
      zones: ["discard"],
      owner: this.ownerSide ? (side === this.ownerSide ? "you" : "opponent") : "any",
    };
    this.isDiscardDialogOpen = true;
  };

  setDiscardDialogOpen = (open: boolean): void => {
    this.isDiscardDialogOpen = open;
    if (!open) {
      this.discardDialogSide = null;
    }
  };

  handleInkwellClick = (side: LorcanaPlayerSide): void => {
    this.inkwellDialogSide = side;
    this.inkwellTarget = {
      selector: "all",
      zones: ["inkwell"],
      owner: this.ownerSide ? (side === this.ownerSide ? "you" : "opponent") : "any",
    };
    this.isInkwellDialogOpen = true;
  };

  setInkwellDialogOpen = (open: boolean): void => {
    this.isInkwellDialogOpen = open;
    if (!open) {
      this.inkwellDialogSide = null;
    }
  };
}
