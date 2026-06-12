import { useCallback, useState } from "react";

import { useBoardProjection, useViewerId } from "../../game/index.ts";
import { HandZone } from "../ui/playerSeat/HandZone.tsx";
import type { GameCardData } from "../ui/types.ts";
import { mapZone, resolveOpponentId, toGameCardData, zoneCount } from "./mappers.ts";

export function OpponentHandZoneContainer() {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const opponentId = resolveOpponentId(view, viewerId) ?? viewerId;
  const [isTucked, setIsTucked] = useState(false);

  const hand: GameCardData[] = mapZone(view, "hand", opponentId).map((c) =>
    toGameCardData(view, c),
  );
  const handCount = zoneCount(view, "hand", opponentId);

  const onToggleTucked = useCallback(() => setIsTucked((t) => !t), []);

  return (
    <HandZone
      hand={hand}
      handCount={handCount}
      isOpponent
      zoneId={`hand:${opponentId}`}
      isTucked={isTucked}
      onToggleTucked={onToggleTucked}
    />
  );
}
