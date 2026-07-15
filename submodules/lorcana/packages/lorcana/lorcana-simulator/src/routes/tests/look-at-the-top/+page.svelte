<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { lookAtTheTopFixture as fixture } from "@/features/simulator-devtools/fixtures/look-at-the-top.js";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
