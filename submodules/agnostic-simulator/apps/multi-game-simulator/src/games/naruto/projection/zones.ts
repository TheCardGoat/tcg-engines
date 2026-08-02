/**
 * Engine zones -> SimulatorZone projection (design doc section 3 zone table).
 * Ids are `<player>-<zone>`; the viewer's seat is rendered bottom, the
 * opponent top by the board components (perspective is a render concern).
 */

import { leaderUid } from "@tcg-engines/naruto-engine";
import type { GameState, PlayerId } from "@tcg-engines/naruto-engine";
import type { SimulatorZone, ZoneRole, ZoneVisibility } from "@tcg/simulator-contract";

function zone(
  id: string,
  label: string,
  role: ZoneRole,
  ownerId: PlayerId,
  visibility: ZoneVisibility,
  entityIds: string[],
  hint: string,
  extra: Partial<SimulatorZone> = {},
): SimulatorZone {
  return { id, label, role, ownerId, visibility, entityIds, hint, ...extra };
}

/** All zones for one seat, in board order. */
export function seatZones(state: GameState, owner: PlayerId, viewer: PlayerId): SimulatorZone[] {
  const player = state.players[owner];
  const isViewer = owner === viewer;
  const topTrash = player.trash[player.trash.length - 1];
  return [
    zone(
      `${owner}-leader`,
      "Leader",
      "leader",
      owner,
      "public",
      [leaderUid(owner)],
      "Leader and life total",
    ),
    zone(
      `${owner}-chakra`,
      "Chakra",
      "resource",
      owner,
      "public",
      player.chakra.map((c) => c.uid),
      "Face-up chakra pays for support cards",
      { layoutHint: "row", count: player.chakra.filter((c) => c.faceUp).length },
    ),
    zone(
      `${owner}-characters`,
      "Characters",
      "battlefield",
      owner,
      "public",
      player.characters.flatMap((c) => (c ? [c.uid] : [])),
      "Up to 5 character slots",
      { layoutHint: "grid" },
    ),
    zone(
      `${owner}-supports`,
      "Supports",
      "support",
      owner,
      isViewer ? "owner" : "public",
      player.supports.flatMap((s) => (s ? [s.uid] : [])),
      "Set supports stay face-down until revealed",
      { layoutHint: "grid" },
    ),
    zone(`${owner}-deck`, "Deck", "deck", owner, "secret", [], `${player.deck.length} cards`, {
      layoutHint: "stack",
      count: player.deck.length,
    }),
    zone(
      `${owner}-trash`,
      "Trash",
      "discard",
      owner,
      "public",
      topTrash ? [topTrash.uid] : [],
      `${player.trash.length} cards`,
      { layoutHint: "stack", count: player.trash.length },
    ),
    zone(
      `${owner}-hand`,
      "Hand",
      "hand",
      owner,
      isViewer ? "private" : "secret",
      player.hand.map((c) => c.uid),
      `${player.hand.length} cards`,
      { layoutHint: "fan", count: player.hand.length },
    ),
    zone(
      `${owner}-ex`,
      "EX",
      "custom",
      owner,
      "public",
      player.exPile.map((c) => c.uid),
      "EX pile",
      { layoutHint: "stack", count: player.exPile.length },
    ),
  ];
}

export function projectZones(state: GameState, viewer: PlayerId): SimulatorZone[] {
  return [...seatZones(state, "p1", viewer), ...seatZones(state, "p2", viewer)];
}
