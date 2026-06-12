<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/design-system/primitives/card";
  import type { QuickMatchErrorData } from "./+page.server.js";

  let { data }: { data: QuickMatchErrorData } = $props();
</script>

<div class="grid h-full place-items-center p-8">
  <Card class="w-full max-w-md border-rose-400/20 bg-slate-950/88 text-slate-100">
    <CardHeader>
      <CardTitle>{data.reason === "missing" ? "Missing deck" : "Invalid deck encoding"}</CardTitle>
      <CardDescription class="text-rose-200">
        {#if data.reason === "missing"}
          A <code>deck</code> URL parameter is required to start a quick match.
        {:else}
          The <code>deck</code> parameter could not be decoded. It must be base64url encoded.
        {/if}
      </CardDescription>
    </CardHeader>
    <CardContent class="text-sm text-slate-400">
      <p>Encode your deck list with:</p>
      <pre class="mt-1 rounded bg-slate-900 p-2 text-xs">btoa(deckText).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")</pre>
      <p class="mt-3">Optional parameters:</p>
      <ul class="mt-1 list-disc pl-4 text-xs">
        <li><code>opponentFixtureId</code> — one of the preset deck IDs</li>
        <li><code>strategyId</code> — bot strategy ID</li>
      </ul>
    </CardContent>
  </Card>
</div>
