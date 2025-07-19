import type { LorcanaMove } from "./types";
import { toLorcanaCoreOps } from "./types";

export const exertCard: LorcanaMove = (
  { G, coreOps, playerID },
  params: { card: string; exerted: boolean },
) => {
  try {
    const { card } = params;
    const lorcanaOps = toLorcanaCoreOps(coreOps);

    // Handle exerted state
    if (params.exerted) {
      lorcanaOps.exertCard(card);
    } else {
      lorcanaOps.readyCard(card);
    }

    return G;
  } catch (error) {
    return G; // Just return state on error
  }
};
