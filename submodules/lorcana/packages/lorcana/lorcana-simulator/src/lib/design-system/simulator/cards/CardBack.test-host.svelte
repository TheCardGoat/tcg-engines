<script lang="ts">
  import type { ComponentProps } from "svelte";
  import CardBack from "./CardBack.svelte";

  let props: ComponentProps<typeof CardBack> = $props();
</script>

<CardBack {...props} />
