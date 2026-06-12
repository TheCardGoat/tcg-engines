<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/design-system/primitives/card";
  import { Button } from "$lib/design-system/primitives/button";
  import { LorcanaTabletopSimulator } from "$lib";
  import { onMount, onDestroy, untrack } from "svelte";
  import {
    HumanVsAiOrchestrator,
    type HumanVsAiStateChangeCallback,
  } from "./human-vs-ai-orchestrator.svelte.js";
  import { readStoredHumanVsAiConfig, type HumanVsAiStorage } from "./storage.js";
  import { createHumanVsAiContext } from "./context.js";
  import { createAutomatedMatchSeed } from "../ai-match/config.js";
  import { VsAiOnboardingState } from "./onboarding.svelte.js";
  import VsAiOnboardingOverlay from "./VsAiOnboardingOverlay.svelte";

  interface HumanVsAiMatchPageProps {
    onNavigateToSetup?: (path: string) => Promise<void> | void;
    setupPath?: string;
    storage?: HumanVsAiStorage;
    onStateChange?: HumanVsAiStateChangeCallback;
    /** Server-assigned game ID (UUID) for post-game/replay lookups. Overrides local seed when set. */
    serverGameId?: string | null;
  }

  let {
    onNavigateToSetup = () => undefined,
    setupPath = "/sandbox/simulator/vs-ai",
    storage,
    onStateChange,
    serverGameId = null,
  }: HumanVsAiMatchPageProps = $props();

  const getStorage = (): HumanVsAiStorage | undefined => storage;

  const storedConfig = readStoredHumanVsAiConfig(getStorage());

  let loadError = $state<string | null>(null);
  let shouldRedirect = $state(!storedConfig);
  const onboarding = new VsAiOnboardingState();

  let orchestrator = $state<HumanVsAiOrchestrator | null>(null);

  if (storedConfig) {
    const _onStateChange = untrack(() => onStateChange);
    void HumanVsAiOrchestrator.create(
      { ...storedConfig, seed: createAutomatedMatchSeed() },
      _onStateChange ? { onStateChange: _onStateChange } : undefined,
    ).then((result) => {
      orchestrator = result;
    }).catch((error) => {
      loadError = error instanceof Error ? error.message : "Unable to initialize match.";
    });
  }

  const scopedReadModel = $derived.by(() => {
    const current = orchestrator;
    if (!current) {
      return undefined;
    }

    return {
      getMoveLog: (limit?: number) =>
        current.readModel.getMoveLog(limit, current.state.currentPerspective),
      subscribeStateUpdates:
        "subscribeStateUpdates" in current.readModel
          ? current.readModel.subscribeStateUpdates?.bind(current.readModel)
          : undefined,
    };
  });

  const orchestratorStore = createHumanVsAiContext(null);
  $effect(() => {
    orchestratorStore.set(orchestrator);
  });

  onMount(() => {
    if (shouldRedirect) {
      void onNavigateToSetup(setupPath);
    }
  });

  onDestroy(() => {
    orchestrator?.dispose();
  });
</script>

<main class="immersive-app-shell relative text-slate-100">
  {#if loadError}
      <div class="mx-auto flex h-full max-w-3xl items-center justify-center px-4 py-8">
      <Card class="w-full border-rose-400/20 bg-slate-950/88 text-slate-100">
        <CardHeader>
          <CardTitle>Match failed to load</CardTitle>
          <CardDescription class="text-rose-200">{loadError}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onclick={() => onNavigateToSetup(setupPath)}>Back to setup</Button>
        </CardContent>
      </Card>
    </div>
  {:else if orchestrator}
    {#key orchestrator.sessionRevision}
      <LorcanaTabletopSimulator
        engine={orchestrator.currentEngine}
        readModel={scopedReadModel}
        postGameGameId={serverGameId ?? orchestrator.gameId}
      />
    {/key}

    <VsAiOnboardingOverlay {onboarding} />
  {:else}
      <div class="grid h-full place-items-center px-4 text-slate-400">
      Loading match...
    </div>
  {/if}
</main>
