<script lang="ts">
  import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
  import PlayerInfo from "../src/lib/features/simulator/panels/PlayerInfo.svelte";
  import MobilePlayerMenubar from "../src/lib/features/simulator/panels/MobilePlayerMenubar.svelte";
  let { onSupportClick, mobile = false, reminderOpen = false }: { onSupportClick: () => void; mobile?: boolean; reminderOpen?: boolean } = $props();
</script>
<Tooltip.Provider>
  {#if mobile}
    <MobilePlayerMenubar seat="top" player={{ label: "You", side: "playerOne", summary: null, isActive: true, isTurnPlayer: true, hasPriority: true }}
      onOpenSupport={onSupportClick} supportReminderText="Report a problem with this game." supportReminderOpen={reminderOpen} />
  {:else}
  <PlayerInfo name="You" side="playerOne" lore={0} deckCount={53} handCount={7}
    discardCount={0} inkwellCount={0} showSupport={true}
    supportReminderText="Report a problem with this game."
    supportReminderOpen={reminderOpen} {onSupportClick} />
  {/if}
</Tooltip.Provider>
