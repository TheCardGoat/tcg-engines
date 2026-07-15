import { expect as baseExpect, test, type Locator, type Page } from "@playwright/test";
import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import type { LorcanaSimulatorView } from "../../src/lib/features/simulator/model/contracts";
import { lorcanaMatchers } from "./lorcana-matchers.js";

export const expect = baseExpect.extend(lorcanaMatchers);
export { test };

export {
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../src/lib/features/simulator-devtools/harness/browser-harness.js";
export { LorcanaSimulatorPom, LorcanaSimulatorSeatPom } from "./lorcana-simulator-pom.js";

type RegressionZone = "hand" | "play" | "discard" | "deck";

export function buildRegressionFixturePath(
  fixtureId: string,
  options: { view?: LorcanaSimulatorView } = {},
): string {
  const baseUrl = process.env.LORCANA_E2E_BASE_URL?.replace(/\/$/, "") ?? "";
  const params = new URLSearchParams();

  if (options.view) {
    params.set("view", options.view);
  }

  const query = params.toString();
  return `${baseUrl}/tests/regressions/${fixtureId}${query ? `?${query}` : ""}`;
}

export function cardByName(page: Page, name: string): Locator {
  return page.getByLabel(new RegExp(`^${escapeRegExp(name)}, cost`, "i")).first();
}

export function findCardIdByLabel(
  board: LorcanaProjectedBoardView,
  playerId: string,
  zone: RegressionZone,
  label: string,
): string {
  const cardId = board.players[playerId]?.[zone].find(
    (candidate) => board.cards[candidate]?.fullName === label,
  );

  if (!cardId) {
    throw new Error(`Card "${label}" not found in ${zone} for ${playerId}.`);
  }

  return String(cardId);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
