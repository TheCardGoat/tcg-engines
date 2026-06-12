export interface PendingEffectsPopoverStateSnapshot {
  itemCount: number;
  bagCount: number;
  pendingCount: number;
  hasOpponentItems: boolean;
  actionableSignature: string;
  previousItemCount: number;
  previousActionableSignature: string;
  localPlayerIsActive: boolean;
  hasActiveOverlay?: boolean;
}

export function shouldDefaultPendingEffectsCollapsed({
  itemCount,
  hasOpponentItems,
  hasActiveOverlay,
}: Pick<
  PendingEffectsPopoverStateSnapshot,
  "itemCount" | "hasOpponentItems" | "hasActiveOverlay"
>): boolean {
  if (hasActiveOverlay) return true;
  if (hasOpponentItems) return false;
  return itemCount === 1;
}

export function shouldAutoOpenPendingEffects(
  snapshot: PendingEffectsPopoverStateSnapshot,
): boolean {
  const { itemCount, actionableSignature, previousItemCount, previousActionableSignature } =
    snapshot;

  if (itemCount === 0) {
    return false;
  }

  if (shouldDefaultPendingEffectsCollapsed(snapshot)) {
    return false;
  }

  if (snapshot.localPlayerIsActive) {
    return false;
  }

  return (
    previousItemCount === 0 ||
    (actionableSignature.length > 0 && actionableSignature !== previousActionableSignature)
  );
}
