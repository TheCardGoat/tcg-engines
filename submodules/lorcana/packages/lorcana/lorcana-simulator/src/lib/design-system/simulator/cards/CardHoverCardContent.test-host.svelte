<script lang="ts">
  import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
  import type { ComponentProps } from "svelte";
  import CardHoverCardContent from "./CardHoverCardContent.svelte";

  let props: ComponentProps<typeof CardHoverCardContent> = $props();
</script>

<Tooltip.Provider>
  <CardHoverCardContent {...props} />
</Tooltip.Provider>
