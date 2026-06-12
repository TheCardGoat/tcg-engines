<script lang="ts">
  import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
  import MatchmakingQueueCard from "./MatchmakingQueueCard.svelte";

  let props = $props();
</script>

<Tooltip.Provider>
  <MatchmakingQueueCard {...props} />
</Tooltip.Provider>
