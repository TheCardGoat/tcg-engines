<script lang="ts">
  import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
  import type { ComponentProps } from "svelte";
  import MatchmakingQueueCard from "./MatchmakingQueueCard.svelte";

  let props: ComponentProps<typeof MatchmakingQueueCard> = $props();
</script>

<Tooltip.Provider>
  <MatchmakingQueueCard {...props} />
</Tooltip.Provider>
