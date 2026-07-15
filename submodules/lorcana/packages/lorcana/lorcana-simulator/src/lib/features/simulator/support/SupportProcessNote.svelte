<script lang="ts">
  import { onMount } from "svelte";
  import { m } from "$lib/i18n/messages.js";

  function formatDailyCollectionTime(): string {
    const now = new Date();
    const collectionTime = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 10, 0, 0),
    );

    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(collectionTime);
  }

  let localCollectionTime = $state("10:00 UTC");

  onMount(() => {
    localCollectionTime = formatDailyCollectionTime();
  });
</script>

<p class="support-process-note">
  {m["sim.support.processDescription"]({ collectionTime: localCollectionTime })}
</p>

<style>
  .support-process-note {
    margin: 0;
    border-radius: 0.7rem;
    border: 1px solid rgba(125, 211, 252, 0.16);
    background: rgba(15, 23, 42, 0.5);
    color: rgba(219, 234, 254, 0.82);
    font-size: 0.78rem;
    line-height: 1.5;
    padding: 0.65rem 0.75rem;
  }
</style>
