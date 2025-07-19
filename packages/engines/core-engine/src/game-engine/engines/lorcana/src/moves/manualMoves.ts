import type { LorcanaMove } from "./types";

export const exertCard: LorcanaMove = (
  { G, playerID, coreOps, gameOps },
  params: { card: string; exerted: boolean },
) => {
  const newG = { ...G };
  const { card, exerted } = params;

  gameOps.exertCard({ card, exerted });

  return newG;
};
