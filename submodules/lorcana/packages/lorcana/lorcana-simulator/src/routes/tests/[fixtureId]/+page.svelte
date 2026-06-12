<script lang="ts">
  import { page } from "$app/state";
  import type { PageData } from "./$types";
  import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
  import { LORCANA_SIMULATOR_FIXTURES } from "@/features/simulator-devtools/fixtures";
  import { normalizeView } from "@/features/simulator-devtools/harness/browser-route";

  let { data }: { data: PageData } = $props();

  const fixture = $derived(LORCANA_SIMULATOR_FIXTURES[data.fixtureId]);
  const routeView = $derived(normalizeView(page.url.searchParams.get("view")));
</script>

<LorcanaBrowserHarnessView {fixture} view={routeView} aiBot={false} />
