<script lang="ts">
  import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
  import type { ComponentProps } from "svelte";
  import CardFace from "./CardFace.svelte";

  let props: ComponentProps<typeof CardFace> = $props();
</script>

<Tooltip.Provider>
  <CardFace {...props} />
</Tooltip.Provider>
