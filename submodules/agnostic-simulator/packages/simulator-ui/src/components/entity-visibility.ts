import type { SimulatorEntity } from "@tcg/simulator-contract";

export type SimulatorEntityFace = "public" | "hidden";

/**
 * Produce the only entity shape that card renderers may use.
 *
 * Hidden entities are deliberately stripped of every identity-bearing field,
 * including image URLs and custom data attributes. This is a security
 * boundary, not a visual convenience: callers may accidentally pass a fully
 * populated private entity, but hidden card components must never put that
 * information into the DOM, accessibility tree, or network request queue.
 */
export function projectSimulatorEntityForFace(
  entity: SimulatorEntity,
  face: SimulatorEntityFace = entity.face === "hidden" ? "hidden" : "public",
): SimulatorEntity {
  if (face === "public") {
    return { ...entity, face: "public" };
  }

  return {
    id: "hidden-card",
    title: "Hidden card",
    subtitle: "Private information",
    kind: "card",
    ownerId: "hidden",
    face: "hidden",
    states: [],
    backImageUrl: entity.backImageUrl,
    stats: [],
    traits: [],
  };
}
