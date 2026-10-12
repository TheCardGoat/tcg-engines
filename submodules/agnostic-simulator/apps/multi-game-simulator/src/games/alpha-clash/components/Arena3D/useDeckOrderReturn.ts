import { useLayoutEffect, useRef, useState } from "react";
import { EntityPartitionValue, type EngineInteractionView } from "@tcg/protocol";
import type { useInteractionSurface } from "@tcg/simulator-ui";
import type { AcSeat, LiveBoardState } from "../board-types";
import type { ZoneAnchor } from "./Scene";
import type { PickExitFlight } from "./TransferFlights";
import { arenaAssets } from "./assets";
import { zoneId } from "./zones";
import type { PlacedCard } from "./layout";

type Snapshot = {
  viewer: AcSeat;
  version: number;
  actionId: string;
  flights: PickExitFlight[];
  board: LiveBoardState;
  cards: PlacedCard[];
};

/** Remember only this viewer's permitted cards and draft geometry. Play after
 * the native choice disappears on a newer version, never on an outbound click.
 * No opponent order is inferred from deck counts, IDs, or prior reveals. */
export function useDeckOrderReturn({
  surface,
  view,
  board,
  viewer,
  zones,
  reducedMotion,
  cards,
}: {
  surface: ReturnType<typeof useInteractionSurface>;
  view: EngineInteractionView;
  board: LiveBoardState;
  viewer: AcSeat;
  zones: readonly ZoneAnchor[];
  reducedMotion: boolean;
  cards: PlacedCard[];
}) {
  const pending = useRef<Snapshot | null>(null);
  const sequence = useRef(0);
  const [playback, setPlayback] = useState<Snapshot | null>(null);
  const previous = useRef({ viewer, version: view.stateVersion });
  useLayoutEffect(() => {
    const reset =
      previous.current.viewer !== viewer || view.stateVersion < previous.current.version;
    previous.current = { viewer, version: view.stateVersion };
    if (reset) {
      pending.current = null;
      setPlayback(null);
      return;
    }
    if (surface.rejected) {
      pending.current = null;
      return;
    }
    const old = pending.current;
    if (old && view.stateVersion > old.version) {
      pending.current = null;
      if (!view.actions.some((action) => action.id === old.actionId)) setPlayback(old);
    }
    const input = surface.input;
    if (input?.kind !== "entity-partition" || input.id !== "deckOrder" || !surface.action) return;
    if (!surface.canConfirm) {
      pending.current = null;
      return;
    }
    const parsed = EntityPartitionValue.safeParse(surface.values[input.id]);
    if (!parsed.success) return;
    const faces = new Map(
      [...document.querySelectorAll<HTMLElement>("[data-order-card]")].map((node) => [
        node.dataset.orderCard,
        node,
      ]),
    );
    const flights: PickExitFlight[] = [];
    for (const route of input.routes) {
      const ids = parsed.data[route.id] ?? [];
      // Top cards land deepest first so the next draw lands last. Bottom cards
      // slide under the pile in draw order. This affects visuals only.
      const landingOrder = route.id === "top" ? [...ids].reverse() : ids;
      for (const id of landingOrder) {
        if (!input.candidates.some((candidate) => candidate.entity.instanceId === id)) continue;
        const card = board.cards.find((entry) => entry.instanceId === id);
        if (!card || card.zone !== "deck") continue;
        const to = zones.find((zone) => zone.id === zoneId(card.controller, "deck"));
        const node = faces.get(id);
        if (!to || !node) continue;
        const rect = node.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const imageUrl =
          card.definitionId && !card.faceDown
            ? (node.querySelector("img")?.getAttribute("src") ?? undefined)
            : undefined;
        flights.push({
          id: ++sequence.current,
          kind: "return",
          from: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
          to,
          imageUrl: imageUrl ?? arenaAssets.back,
          flipToBack: Boolean(imageUrl),
          backImageUrl: arenaAssets.back,
          endScale: Math.min(1, Math.max(0.25, Math.min(to.width * 0.8, 104) / rect.width)),
          label: "",
          delayMs: reducedMotion ? 0 : flights.length * 110,
          durationMs: reducedMotion ? 160 : 680,
          reducedMotion,
        });
      }
    }
    pending.current = {
      viewer,
      version: view.stateVersion,
      actionId: surface.action.id,
      flights,
      board,
      cards,
    };
  }, [surface, view, board, viewer, zones, reducedMotion, cards]);
  const accepted =
    pending.current &&
    !surface.rejected &&
    !view.actions.some((action) => action.id === pending.current?.actionId)
      ? pending.current
      : null;
  const active = accepted ?? playback;
  const visible =
    active?.viewer === viewer && view.stateVersion > active.version && active.flights.length > 0;
  return {
    flights: visible ? active.flights : [],
    // Hold only the visual board. Authoritative state and submission stay untouched.
    board: visible ? active.board : board,
    cards: visible ? active.cards : cards,
    finish: (id: number) =>
      setPlayback((current) => {
        if (!current) return null;
        const flights = current.flights.filter((flight) => flight.id !== id);
        return flights.length ? { ...current, flights } : null;
      }),
  };
}
