<script lang="ts">
  import { page } from "$app/state";
  import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
  import type { LorcanaSimulatorView } from "$lib";
  import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
  import { resolveBrowserRouteState } from "@/features/simulator-devtools/harness/browser-route";
  import type { LorcanaBrowserHarness } from "@/features/simulator-devtools/harness/browser-harness";
  import type { AiPlayMode } from "@/features/simulator-devtools/vs-ai/types.js";

  const routeState = $derived.by(() => resolveBrowserRouteState(page.url));
  const aiPlayMode = $derived<AiPlayMode>(
    page.url.searchParams.get("aiPlayMode") === "step" ? "step" : "auto",
  );
  const visualSetup = $derived.by(() =>
    page.url.searchParams.get("visual") === "hades-target-clarity"
      ? setupHadesOpponentChoice
      : false,
  );

  type FixtureZone = "hand" | "play";

  function findCardIdByLabel(
    board: LorcanaProjectedBoardView,
    playerId: string,
    zone: FixtureZone,
    label: string,
  ): string {
    const cardId = board.players[playerId]?.[zone].find(
      (candidate) => board.cards[candidate]?.fullName === label,
    );

    if (!cardId) {
      throw new Error(`${label} not found in ${zone} for ${playerId}`);
    }

    return String(cardId);
  }

  function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitForStateChange(
    harness: LorcanaBrowserHarness,
    view: LorcanaSimulatorView,
    previousStateId: number,
  ): Promise<LorcanaProjectedBoardView> {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const board = await harness.getBoard(view);
      if (board.stateID !== previousStateId) {
        return board;
      }

      await wait(100);
    }

    return harness.getBoard(view);
  }

  async function setupHadesOpponentChoice(harness: LorcanaBrowserHarness): Promise<void> {
    const initialBoard = await harness.getBoard("authoritative");
    const hadesId = findCardIdByLabel(
      initialBoard,
      "player_one",
      "hand",
      "Hades - Looking for a Deal",
    );
    const simbaId = findCardIdByLabel(
      initialBoard,
      "player_two",
      "play",
      "Simba - Protective Cub",
    );

    const playerTwoBeforePlay = await harness.getBoard("playerTwo");
    const playResult = await harness.execute("playerOne", "playCard", { cardId: hadesId });
    if (!playResult.success) {
      throw new Error(`playCard failed: ${playResult.reason ?? playResult.code ?? "unknown"}`);
    }

    await waitForStateChange(harness, "playerTwo", playerTwoBeforePlay.stateID);
    const boardAfterPlay = await harness.getBoard("authoritative");
    const bagEffect = boardAfterPlay.bagEffects[0];
    if (!bagEffect) {
      throw new Error("Hades bag effect was not available after playing Hades");
    }

    const playerTwoBeforeResolve = await harness.getBoard("playerTwo");
    const resolveResult = await harness.execute("playerOne", "resolveBag", {
      bagId: bagEffect.id,
      params: {
        resolveOptional: true,
        targets: [simbaId],
      },
    });
    if (!resolveResult.success) {
      throw new Error(`resolveBag failed: ${resolveResult.reason ?? resolveResult.code ?? "unknown"}`);
    }

    await waitForStateChange(harness, "playerTwo", playerTwoBeforeResolve.stateID);
  }
</script>

<LorcanaBrowserHarnessView
  browserTransport={routeState.browserTransport}
  fixture={routeState.fixture}
  fixtureId={routeState.fixtureId}
  view={routeState.view}
  aiBot={{ initialPlayMode: aiPlayMode }}
  {visualSetup}
/>
