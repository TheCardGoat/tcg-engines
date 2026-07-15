<script lang="ts">
import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
import { bibbidiBobbidiBooFixture as fixture } from "@/features/simulator-devtools/fixtures/bibbidi-bobbidi-boo.js";
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
