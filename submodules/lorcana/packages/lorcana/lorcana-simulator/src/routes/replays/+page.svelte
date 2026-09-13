<script lang="ts">
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { resolvePlatformMatchmakingReturnUrl } from "$lib/navigation/platform-matchmaking-url.js";

  onMount(() => {
    window.location.assign(
      resolvePlatformMatchmakingReturnUrl(
        new URL(window.location.href),
        env.PUBLIC_PLATFORM_MATCHMAKING_URL,
        "replays",
      ),
    );
  });
</script>
