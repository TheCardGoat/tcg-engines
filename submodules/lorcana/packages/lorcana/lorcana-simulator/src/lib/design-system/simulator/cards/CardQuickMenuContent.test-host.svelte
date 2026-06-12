<script lang="ts">
  import type { ComponentProps } from "svelte";
  import CardQuickMenuContent from "./CardQuickMenuContent.svelte";

  let props: ComponentProps<typeof CardQuickMenuContent> = $props();
</script>

<CardQuickMenuContent {...props} />
