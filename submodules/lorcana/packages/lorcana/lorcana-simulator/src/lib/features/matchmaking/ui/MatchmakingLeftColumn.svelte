<script lang="ts">
  import LiveMatchesTable from "./LiveMatchesTable.svelte";
  import EngagementEventCard from "./EngagementEventCard.svelte";
  import { getMatchmakingLobbyContext } from "./useMatchmakingLobbyController.svelte.js";
  import { SURFACE_CARD_CLASS } from "./matchmaking-lobby.constants.js";
  import {Card, CardContent, CardHeader} from "$lib/design-system/primitives/card";

  const controller = getMatchmakingLobbyContext();

  function handleSpectateInline(matchId: string, gameId: string): void {
    controller.openSpectatorDialog(matchId, gameId);
  }
</script>

<EngagementEventCard initialState={controller.playerContext.context?.engagement ?? null} />
<Card class={SURFACE_CARD_CLASS}>
  <CardContent>
    <LiveMatchesTable
      store={controller.liveMatchesStore}
      onSpectateInline={handleSpectateInline}
    />
  </CardContent>
</Card>
