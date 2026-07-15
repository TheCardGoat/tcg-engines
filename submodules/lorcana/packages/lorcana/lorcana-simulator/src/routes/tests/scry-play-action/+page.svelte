<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { scryPlayActionFixture as fixture } from "@/features/simulator-devtools/fixtures/scry-play-action.js";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
