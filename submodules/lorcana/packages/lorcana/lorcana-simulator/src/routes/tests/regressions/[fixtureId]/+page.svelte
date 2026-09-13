<script lang="ts">
  import { page } from "$app/state";
  import type { PageData } from "./$types";
  import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
  import { LORCANA_REGRESSION_FIXTURES } from "@/features/simulator-devtools/fixtures/regressions";
  import { normalizeView } from "@/features/simulator-devtools/harness/browser-route";
  import type { AuthoritativeCommandStatus } from "@tcg/lorcana-engine";

  let { data }: { data: PageData } = $props();

  const fixture = $derived(LORCANA_REGRESSION_FIXTURES[data.fixtureId]);
  const routeView = $derived(normalizeView(page.url.searchParams.get("view")));
  const commandStatusOverride = $derived.by((): AuthoritativeCommandStatus | null => {
    const phase = page.url.searchParams.get("commandStatus");
    if (!phase) return null;
    const pending = {
      moveId: "passTurn",
      commandID: "regression-command",
      startedAt: Date.now(),
    };
    if (phase === "submitting") return { phase, ...pending };
    if (phase === "recovering-stale") {
      return { phase: "recovering", recoveryCause: "stale_state", ...pending };
    }
    if (phase === "recovering-unknown") {
      return { phase: "recovering", recoveryCause: "delivery_unknown", ...pending };
    }
    if (phase === "failed") {
      return { phase: "recovery_failed", recoveryCause: "stale_state", ...pending };
    }
    return null;
  });
  const staleRecoveryCompletionCountOverride = $derived(
    page.url.searchParams.get("recovered") === "1" ? 1 : null,
  );
  const enableMatchChat = $derived(page.url.searchParams.get("chat") === "1");
</script>

<LorcanaBrowserHarnessView
  {fixture}
  view={routeView}
  aiBot={false}
  {commandStatusOverride}
  {staleRecoveryCompletionCountOverride}
  {enableMatchChat}
/>
