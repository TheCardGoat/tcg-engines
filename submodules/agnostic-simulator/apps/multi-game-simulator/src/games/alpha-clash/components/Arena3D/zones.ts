import type { AcSeat, LiveBoardState } from "../board-types";
import { CARD_RATIO, fieldCardHeight, arenaRows, supportRails } from "./layout";

export type ArenaZoneName =
  | "clash"
  | "accessory"
  | "resource"
  | "contender"
  | "clashground"
  | "deck"
  | "oblivion"
  | "banished"
  | "hand";
export interface ArenaZone {
  id: string;
  seat: AcSeat;
  zone: ArenaZoneName;
  name: string;
  count: number;
  ready?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  captionY: number;
  scaleX: boolean;
  counter: boolean;
}
export const zoneId = (seat: string, zone: string) => `${seat}:${zone}`;

/** Public zone counts and world positions; never infer concealed card identities. */
export function arenaZones(
  board: LiveBoardState,
  viewer: AcSeat,
  compact: boolean,
  clashWidth: number,
): ArenaZone[] {
  const rival: AcSeat = viewer === "player-one" ? "player-two" : "player-one";
  return [rival, viewer].flatMap((seat) => {
    const own = seat === viewer;
    const rails = supportRails(board, seat, clashWidth);
    const sign = own ? -1 : 1;
    const rows = arenaRows(compact, own);
    const add = (
      zone: ArenaZoneName,
      name: string,
      x: number,
      y: number,
      width: number,
      height: number,
      captionY: number,
      scaleX = false,
      counter = false,
    ): ArenaZone => {
      const cards = board.cards.filter((c) => c.controller === seat && c.zone === zone);
      return {
        id: zoneId(seat, zone),
        seat,
        zone,
        name,
        x,
        y: sign * y,
        width,
        height,
        captionY: sign * captionY,
        scaleX,
        counter,
        count:
          zone === "deck"
            ? board.players[seat].deckSize
            : zone === "hand"
              ? board.players[seat].handSize
              : cards.length,
        ready: zone === "resource" ? cards.filter((c) => c.ready).length : undefined,
      };
    };
    const zones = [
      add(
        "clash",
        "Clash zone",
        0,
        rows.fieldCenter,
        clashWidth,
        fieldCardHeight(compact),
        rows.separator,
      ),
      add(
        "accessory",
        "Accessories",
        rails.accessory.center,
        rows.railCenter,
        rails.accessory.width,
        rows.railHeight,
        rows.railCenter,
        false,
        compact,
      ),
      add(
        "resource",
        "Resources",
        rails.resource.center,
        rows.railCenter,
        rails.resource.width,
        rows.railHeight,
        rows.railCenter,
        false,
        true,
      ),
      add(
        "contender",
        "Contender",
        -730,
        rows.fieldCenter,
        fieldCardHeight(compact) * CARD_RATIO,
        fieldCardHeight(compact),
        own ? 310 : 276,
        true,
      ),
      add(
        "clashground",
        "Clashground",
        730,
        rows.fieldCenter,
        fieldCardHeight(compact) * CARD_RATIO,
        fieldCardHeight(compact),
        265,
        true,
      ),
      add("deck", "Deck", -860, rows.railCenter, 120, 52, rows.railCenter, true, true),
      add("oblivion", "Oblivion", -730, rows.railCenter, 120, 52, rows.railCenter, true, true),
      add("banished", "Banished", -600, rows.railCenter, 120, 52, rows.railCenter, true, true),
    ];
    zones.push(
      add(
        "hand",
        "Hand",
        0,
        own ? (compact ? 425 : 475) : compact ? 393 : 458,
        own
          ? clashWidth * 0.75
          : Math.max(120, Math.min(8, board.players[seat].handSize) * 36 + 40),
        own ? 120 : 84,
        compact ? 337 : 399,
      ),
    );
    return zones;
  });
}
