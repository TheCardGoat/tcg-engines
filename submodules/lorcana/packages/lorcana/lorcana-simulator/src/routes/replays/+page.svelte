<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(() => {
    void goto("/matchmaking/replays", { replaceState: true });
  });
</script>
