<script lang="ts">
import { Badge } from "$lib/design-system/primitives/badge";
import { Button } from "$lib/design-system/primitives/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "$lib/design-system/primitives/card";
import { Select } from "$lib/design-system/primitives/select";
import { Separator } from "$lib/design-system/primitives/separator";
import {
	AUTOMATED_ACTION_STRATEGIES,
	getSafeAutomatedActionStrategyOption,
} from "@tcg/lorcana-engine";
import { DECK_FIXTURES } from "../deck-fixtures/index.js";
import {
	loadAutomatedMatchConfig,
	replaceDeckTextWithFixture,
	saveAutomatedMatchConfig,
	simulateAutomatedMatch,
	type AutomatedMatchStorage,
	type AutomatedMatchConfig,
	type AutomatedMatchValidationErrors,
} from "./index.js";

interface AutomatedMatchSetupPageProps {
	onNavigateToViewer?: (path: string) => Promise<void> | void;
	storage?: AutomatedMatchStorage;
	viewerPath?: string;
}

const DECK_EDITOR_CLASS =
	"min-h-72 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm leading-6 text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/30";

let {
	onNavigateToViewer = () => undefined,
	storage,
	viewerPath = "/sandbox/simulator/ai-match/viewer",
}: AutomatedMatchSetupPageProps = $props();

let config = $state<AutomatedMatchConfig>(loadAutomatedMatchConfig());
let hasLoadedStorageConfig = $state(false);
let validationErrors = $state<AutomatedMatchValidationErrors>({});

$effect.pre(() => {
	if (hasLoadedStorageConfig) {
		return;
	}

	config = loadAutomatedMatchConfig(storage);
	hasLoadedStorageConfig = true;
});

function persistConfig(nextConfig: AutomatedMatchConfig): void {
	config = nextConfig;
	saveAutomatedMatchConfig(nextConfig, storage);
}

function updateDeckText(side: "playerOne" | "playerTwo", value: string): void {
	validationErrors = {
		...validationErrors,
		...(side === "playerOne"
			? { playerOneDeckText: undefined }
			: { playerTwoDeckText: undefined }),
	};

	if (side === "playerOne") {
		persistConfig({
			...config,
			playerOneDeckText: value,
			playerOneFixtureId: undefined,
		});
		return;
	}

	persistConfig({
		...config,
		playerTwoDeckText: value,
		playerTwoFixtureId: undefined,
	});
}

function updateFixture(
	side: "playerOne" | "playerTwo",
	fixtureId: string,
): void {
	validationErrors = {
		...validationErrors,
		...(side === "playerOne"
			? { playerOneDeckText: undefined }
			: { playerTwoDeckText: undefined }),
	};
	persistConfig(replaceDeckTextWithFixture(config, side, fixtureId));
}

function updateStrategy(side: "playerOne" | "playerTwo", strategyId: string): void {
	persistConfig(
		side === "playerOne"
			? {
					...config,
					playerOneStrategyId: strategyId,
				}
			: {
					...config,
					playerTwoStrategyId: strategyId,
				},
	);
}

function getStrategyDescription(strategyId: string): string {
	return getSafeAutomatedActionStrategyOption(strategyId).description;
}

function countDeckCards(deckText: string): number {
	return deckText
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0)
		.reduce((total, line) => {
			const [quantityToken] = line.split(/\s+/, 1);
			const quantity = Number.parseInt(quantityToken ?? "", 10);
			return Number.isNaN(quantity) ? total + 1 : total + quantity;
		}, 0);
}

async function simulateMatch(): Promise<void> {
	const result = await simulateAutomatedMatch({
		config,
		navigate: onNavigateToViewer,
		storage,
		viewerPath,
	});

	validationErrors = result.errors;
	if (!result.nextConfig) {
		return;
	}

	config = result.nextConfig;
}
</script>

<main class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_52%,#020617_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
    <section class="grid gap-4 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_32px_96px_-64px_rgba(15,23,42,0.95)] backdrop-blur md:grid-cols-[minmax(0,1fr)_16rem] md:items-end">
      <div class="space-y-3">
        <Badge variant="secondary" class="w-fit rounded-full border border-sky-400/20 bg-sky-400/10 text-sky-100">
          Simulator Devtools
        </Badge>
        <h1 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Automated AI match viewer
        </h1>
        <p class="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          Build a two-AI Lorcana match from real decklists, choose the automation strategy, and
          watch the live simulator play itself one action at a time or in auto mode.
        </p>
      </div>

      <div class="grid gap-3 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Player one</p>
          <p class="mt-2 text-2xl font-semibold text-white">{countDeckCards(config.playerOneDeckText)}</p>
          <p class="text-xs text-slate-400">cards loaded</p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Player two</p>
          <p class="mt-2 text-2xl font-semibold text-white">{countDeckCards(config.playerTwoDeckText)}</p>
          <p class="text-xs text-slate-400">cards loaded</p>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_18rem]">
      <Card class="border-white/10 bg-slate-950/78 text-slate-100">
        <CardHeader>
          <CardTitle>Player one deck</CardTitle>
          <CardDescription class="text-slate-400">
            Start from a fixture or paste a decklist directly.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400" for="player-one-fixture">
              Player one default fixture
            </label>
            <Select
              id="player-one-fixture"
              aria-label="Player one default fixture"
              value={config.playerOneFixtureId ?? ""}
              onchange={(event) =>
                updateFixture("playerOne", (event.currentTarget as HTMLSelectElement).value)}
            >
              {#each DECK_FIXTURES as fixture}
                <option value={fixture.id}>{fixture.name}</option>
              {/each}
            </Select>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400" for="player-one-deck">
              Player one deck list
            </label>
            <textarea
              id="player-one-deck"
              class={DECK_EDITOR_CLASS}
              aria-invalid={validationErrors.playerOneDeckText ? "true" : "false"}
              value={config.playerOneDeckText}
              oninput={(event) =>
                updateDeckText("playerOne", (event.currentTarget as HTMLTextAreaElement).value)}
            ></textarea>
            {#if validationErrors.playerOneDeckText}
              <p class="text-sm text-rose-300">{validationErrors.playerOneDeckText}</p>
            {/if}
          </div>
        </CardContent>
      </Card>

      <Card class="border-white/10 bg-slate-950/78 text-slate-100">
        <CardHeader>
          <CardTitle>Player two deck</CardTitle>
          <CardDescription class="text-slate-400">
            Start from a fixture or paste a decklist directly.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400" for="player-two-fixture">
              Player two default fixture
            </label>
            <Select
              id="player-two-fixture"
              aria-label="Player two default fixture"
              value={config.playerTwoFixtureId ?? ""}
              onchange={(event) =>
                updateFixture("playerTwo", (event.currentTarget as HTMLSelectElement).value)}
            >
              {#each DECK_FIXTURES as fixture}
                <option value={fixture.id}>{fixture.name}</option>
              {/each}
            </Select>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400" for="player-two-deck">
              Player two deck list
            </label>
            <textarea
              id="player-two-deck"
              class={DECK_EDITOR_CLASS}
              aria-invalid={validationErrors.playerTwoDeckText ? "true" : "false"}
              value={config.playerTwoDeckText}
              oninput={(event) =>
                updateDeckText("playerTwo", (event.currentTarget as HTMLTextAreaElement).value)}
            ></textarea>
            {#if validationErrors.playerTwoDeckText}
              <p class="text-sm text-rose-300">{validationErrors.playerTwoDeckText}</p>
            {/if}
          </div>
        </CardContent>
      </Card>

      <Card class="border-white/10 bg-slate-950/78 text-slate-100">
        <CardHeader>
          <CardTitle>Match settings</CardTitle>
          <CardDescription class="text-slate-400">
            Strategy and simulation handoff live here.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-5">
          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400" for="player-one-strategy-select">
              Player one strategy
            </label>
            <Select
              id="player-one-strategy-select"
              value={config.playerOneStrategyId}
              onchange={(event) =>
                updateStrategy("playerOne", (event.currentTarget as HTMLSelectElement).value)}
            >
              {#each AUTOMATED_ACTION_STRATEGIES as strategyOption}
                <option value={strategyOption.id}>{strategyOption.label}</option>
              {/each}
            </Select>
            <p class="text-sm leading-6 text-slate-400">
              {getStrategyDescription(config.playerOneStrategyId)}
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400" for="player-two-strategy-select">
              Player two strategy
            </label>
            <Select
              id="player-two-strategy-select"
              value={config.playerTwoStrategyId}
              onchange={(event) =>
                updateStrategy("playerTwo", (event.currentTarget as HTMLSelectElement).value)}
            >
              {#each AUTOMATED_ACTION_STRATEGIES as strategyOption}
                <option value={strategyOption.id}>{strategyOption.label}</option>
              {/each}
            </Select>
            <p class="text-sm leading-6 text-slate-400">
              {getStrategyDescription(config.playerTwoStrategyId)}
            </p>
          </div>

          <Separator class="bg-white/10" />

        </CardContent>
        <CardFooter class="flex flex-col gap-3">
          <Button  class="w-full cursor-pointer" onclick={simulateMatch}>
            Simulate match
          </Button>
          <p class="text-center text-xs text-slate-500">
            Viewer refreshes reproduce the same match until you simulate again.
          </p>
        </CardFooter>
      </Card>
    </section>
  </div>
</main>
