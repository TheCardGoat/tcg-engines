import { createFixture } from "./fixture-factory.js";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";

export const emptyBoardFixture: LorcanaSimulatorFixture = createFixture({
  id: "empty-board",
  name: "Empty Board",
  description: "Empty board with no cards in play.",
  playerOne: {},
  playerTwo: {},
  seed: "",
});
