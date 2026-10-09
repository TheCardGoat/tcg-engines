import type { Side, PlayerIdentityInfo } from "./engine/sides";
import { cyberpunkSeatPlaymat, type ResolvedCyberpunkPlaymat } from "./playmats";
import { cyberpunkCardBackUrl, type CyberpunkVisualSelection } from "./visualAppearance";

export interface CyberpunkSeatVisuals {
  playmat: ResolvedCyberpunkPlaymat;
  cardBackUrl: string;
}

/** Account changes update this viewer now; match snapshots update everyone next match. */
export function resolveCyberpunkSeatVisuals(args: {
  side: Side;
  humanSide: Side;
  identity?: PlayerIdentityInfo;
  liveMatch: boolean;
  localPlayerId?: string;
  localVisual: CyberpunkVisualSelection;
  localSubscriptionTier?: string | null;
  fixturePlaymatId?: string | null;
}): CyberpunkSeatVisuals {
  const useLocal = args.liveMatch
    ? Boolean(args.localPlayerId && args.identity?.id === args.localPlayerId)
    : args.side === args.humanSide;
  const playmatId = useLocal ? args.localVisual.playmatId : args.identity?.playmatId;
  const cardBackId = useLocal ? args.localVisual.cardBackId : args.identity?.cardBackId;
  const subscriptionTier = useLocal
    ? (args.localSubscriptionTier ?? args.identity?.subscriptionTier)
    : args.identity?.subscriptionTier;
  return {
    playmat: cyberpunkSeatPlaymat({
      playmatId,
      subscriptionTier,
      fixturePlaymatId: args.fixturePlaymatId,
    }),
    cardBackUrl: cyberpunkCardBackUrl(cardBackId),
  };
}
