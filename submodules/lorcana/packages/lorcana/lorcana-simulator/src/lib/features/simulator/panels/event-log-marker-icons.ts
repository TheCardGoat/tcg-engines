import {
  Droplets,
  Eye,
  Flag,
  Footprints,
  Hand,
  MapPinned,
  SkipForward,
  Sparkles,
  Swords,
  Zap,
} from "@lucide/svelte";
import type { Component } from "svelte";
import type { EventLogMarkerId } from "@/features/simulator/model/event-log-formatting.js";

export type EventLogMarkerIconComponent = Component<{ class?: string }>;

const markerIconById = {
  ability: Zap,
  challenge: Swords,
  ink: Droplets,
  move: MapPinned,
  pass: SkipForward,
  play: Sparkles,
  quest: Footprints,
  scry: Eye,
  setup: Hand,
  turn: Flag,
} satisfies Record<EventLogMarkerId, EventLogMarkerIconComponent>;

export function getEventLogMarkerIcon(marker: EventLogMarkerId): EventLogMarkerIconComponent {
  return markerIconById[marker] ?? Sparkles;
}
