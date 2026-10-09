import { describe, expect, test } from "vite-plus/test";
import { resolveCyberpunkSeatVisuals } from "./seatVisuals";

describe("Cyberpunk match cosmetics", () => {
  const localVisual = { playmatId: "night-market", cardBackId: "goat-celestial" } as const;
  const currentMatchSeat = {
    id: "seat-1",
    displayName: "Player",
    subscriptionTier: "tier2",
    playmatId: "maelstrom",
    cardBackId: "goat-classic",
  };

  test("updates the local seat now and leaves the opponent on the match snapshot", () => {
    const own = resolveCyberpunkSeatVisuals({
      side: "player",
      humanSide: "player",
      identity: currentMatchSeat,
      liveMatch: true,
      localPlayerId: "seat-1",
      localVisual,
      localSubscriptionTier: "tier2",
    });
    const rival = resolveCyberpunkSeatVisuals({
      side: "opponent",
      humanSide: "player",
      identity: currentMatchSeat,
      liveMatch: true,
      localPlayerId: "seat-2",
      localVisual,
      localSubscriptionTier: "tier2",
    });

    expect(own.playmat.id).toBe("night-market");
    expect(own.cardBackUrl).toContain("/v3/card-back-400.webp");
    expect(rival.playmat.id).toBe("maelstrom");
    expect(rival.cardBackUrl).toContain("/v1/card-back-400.webp");
  });

  test("does not paint supporter playmats for a free seat", () => {
    const visual = resolveCyberpunkSeatVisuals({
      side: "player",
      humanSide: "player",
      identity: { ...currentMatchSeat, subscriptionTier: "free" },
      liveMatch: true,
      localPlayerId: "seat-1",
      localVisual,
      localSubscriptionTier: "free",
    });
    expect(visual.playmat.id).toBe("default");
  });
});
