<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import HumanVsAiMatchPage from "@/features/simulator-devtools/vs-ai/HumanVsAiMatchPage.svelte";
  import {
    HUMAN_VS_AI_STORAGE_KEY,
    type HumanVsAiStorage,
  } from "@/features/simulator-devtools/vs-ai/storage.js";
  import type { HumanVsAiMatchConfig } from "@/features/simulator-devtools/vs-ai/types.js";
  import type { QuickMatchPlayData } from "./+page.server.js";

  let { data }: { data: QuickMatchPlayData } = $props();

  function createUrlDrivenStorage(config: HumanVsAiMatchConfig): HumanVsAiStorage {
    const stored = JSON.stringify(config);
    return {
      getItem: (key) => (key === HUMAN_VS_AI_STORAGE_KEY ? stored : null),
      setItem: () => undefined,
      removeItem: () => undefined,
    };
  }

  // This derived wrapper is intentionally safe to recreate because it only
  // closes over the latest config and never registers listeners/subscriptions.
  const storage = $derived(createUrlDrivenStorage(data.config));

  onMount(() => {
    const fallbackDescription =
      import.meta.env.DEV && data.fallbackReason
        ? `Fell back after ${data.fallbackReason}`
        : "API was unavailable — no server tracking";

    console.warn("[quick-match] Running in local-only mode (no server match)", {
      fallbackReason: data.fallbackReason,
      unknownCards: data.unknownCards,
    });

    if (import.meta.env.DEV) {
      toast.info("Local-only mode", {
        description: fallbackDescription,
        duration: 5000,
      });
    }

    if (data.unknownCards.length > 0) {
      console.warn("[quick-match] Unrecognized cards skipped:", data.unknownCards);
      toast.warning("Some cards were not recognized and were skipped", {
        description: data.unknownCards.join(", "),
        duration: 8000,
      });
    }
  });
</script>

<HumanVsAiMatchPage {storage} setupPath="/sandbox/simulator/vs-ai" serverGameId={data.serverGameId} />
