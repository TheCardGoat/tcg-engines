import type { SimulatorSeat } from "@tcg/simulator-contract";

/** Fixture labels describe seats; resolve them again when the viewer changes. */
export function grandArchivePlayerLabel(seat: SimulatorSeat): string {
  return /^(?:p\d+|you|opponent)$/i.test(seat.label)
    ? seat.perspective === "bottom"
      ? "You"
      : "Opponent"
    : seat.label;
}
