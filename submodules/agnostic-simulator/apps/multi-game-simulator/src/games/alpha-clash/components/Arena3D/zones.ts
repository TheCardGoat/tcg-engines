import type { AcSeat, LiveBoardState } from "../board-types";

export type ArenaZoneName =
  | "clash"
  | "accessory"
  | "resource"
  | "contender"
  | "clashground"
  | "deck"
  | "oblivion"
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
    const sign = own ? -1 : 1;
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
        compact ? 145 : 132,
        clashWidth,
        compact ? 246 : 214,
        compact ? 278 : 247,
      ),
      add(
        "accessory",
        "Accessories",
        compact ? -160 : -310,
        compact ? 294 : 296,
        compact ? 220 : 254,
        compact ? 44 : 112,
        compact ? 294 : own ? 340 : 362,
        false,
        compact,
      ),
      add(
        "resource",
        "Resources",
        160,
        compact ? 294 : 296,
        compact ? 220 : 424,
        compact ? 44 : 112,
        compact ? 294 : own ? 340 : 362,
        false,
        true,
      ),
      add("contender", "Contender", -730, 140, 160, 216, own ? 310 : 276, true),
      add("clashground", "Clashground", 730, 140, 120, 158, 242, true),
      add("deck", "Deck", 650, compact ? 272 : 300, 120, 52, compact ? 272 : 300, true, true),
      add(
        "oblivion",
        "Oblivion",
        810,
        compact ? 272 : 300,
        120,
        52,
        compact ? 272 : 300,
        true,
        true,
      ),
    ];
    if (!own)
      zones.push(
        add(
          "hand",
          "Hand",
          0,
          compact ? 393 : 458,
          Math.max(120, Math.min(8, board.players[seat].handSize) * 36 + 40),
          84,
          compact ? 337 : 399,
        ),
      );
    return zones;
  });
}
