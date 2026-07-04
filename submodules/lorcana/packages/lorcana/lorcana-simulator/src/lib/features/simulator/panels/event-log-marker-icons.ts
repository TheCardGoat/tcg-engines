import Droplets from "@lucide/svelte/icons/droplets";
import Eye from "@lucide/svelte/icons/eye";
import Flag from "@lucide/svelte/icons/flag";
import Footprints from "@lucide/svelte/icons/footprints";
import Hand from "@lucide/svelte/icons/hand";
import MapPinned from "@lucide/svelte/icons/map-pinned";
import SkipForward from "@lucide/svelte/icons/skip-forward";
import Sparkles from "@lucide/svelte/icons/sparkles";
import Swords from "@lucide/svelte/icons/swords";
import Zap from "@lucide/svelte/icons/zap";
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
