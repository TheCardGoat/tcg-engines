<script lang="ts">
  import { theme } from "$lib/theme.svelte";

  let isModalOpen = $state(false);
  let activeTab = $state<"overview" | "forms" | "data">("overview");
</script>

<div class="min-h-screen bg-base-200 text-base-content">
  <div class="max-w-5xl mx-auto p-6 space-y-8">
    <header class="flex items-start justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl font-bold">daisyUI Showcase</h1>
        <p class="text-sm text-base-content/70">
          Components are styled via daisyUI classes and themed via
          <span class="font-mono">data-theme</span>.
        </p>
      </div>
      <button class="btn btn-ghost" onclick={() => theme.toggle()}>
        Theme: {theme.current}
      </button>
    </header>

    <section class="grid gap-4 md:grid-cols-2">
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Buttons</h2>
          <div class="flex flex-wrap gap-2">
            <button class="btn">Default</button>
            <button class="btn btn-primary">Primary</button>
            <button class="btn btn-secondary">Secondary</button>
            <button class="btn btn-accent">Accent</button>
            <button class="btn btn-ghost">Ghost</button>
            <button class="btn btn-outline">Outline</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="btn btn-sm">Small</button>
            <button class="btn">Medium</button>
            <button class="btn btn-lg">Large</button>
            <button class="btn btn-square" aria-label="Square">
              <span class="text-lg">★</span>
            </button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Alerts & Badges</h2>
          <div class="space-y-2">
            <div class="alert">
              <span>Default alert using base colors.</span>
            </div>
            <div class="alert alert-info"><span>Info alert</span></div>
            <div class="alert alert-success"><span>Success alert</span></div>
            <div class="alert alert-warning"><span>Warning alert</span></div>
            <div class="alert alert-error"><span>Error alert</span></div>
          </div>
          <div class="flex flex-wrap gap-2 pt-2">
            <span class="badge">badge</span>
            <span class="badge badge-primary">primary</span>
            <span class="badge badge-secondary">secondary</span>
            <span class="badge badge-accent">accent</span>
            <span class="badge badge-outline">outline</span>
          </div>
        </div>
      </div>
    </section>

    <section class="card bg-base-100 shadow">
      <div class="card-body">
        <h2 class="card-title">Navigation</h2>
        <div class="tabs tabs-bordered">
          <button
            class={"tab " + (activeTab === "overview" ? "tab-active" : "")}
            onclick={() => (activeTab = "overview")}
          >
            Overview
          </button>
          <button
            class={"tab " + (activeTab === "forms" ? "tab-active" : "")}
            onclick={() => (activeTab = "forms")}
          >
            Forms
          </button>
          <button
            class={"tab " + (activeTab === "data" ? "tab-active" : "")}
            onclick={() => (activeTab = "data")}
          >
            Data
          </button>
        </div>
        <div class="pt-3 text-sm text-base-content/70">
          {#if activeTab === "overview"}
            Tabs use <span class="font-mono">tabs</span> +
            <span class="font-mono">tab</span>.
          {:else if activeTab === "forms"}
            Form controls use <span class="font-mono">input</span>, <span
              class="font-mono"
              >select</span
            >, <span class="font-mono">toggle</span>.
          {:else}
            Tables and stats use <span class="font-mono">table</span>, <span
              class="font-mono"
              >stat</span
            >.
          {/if}
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2">
      <div class="card bg-base-100 shadow">
        <div class="card-body space-y-4">
          <h2 class="card-title">Forms</h2>
          <label class="form-control w-full">
            <div class="label"><span class="label-text">Email</span></div>
            <input
              class="input input-bordered w-full"
              placeholder="you@example.com"
            >
          </label>
          <label class="form-control w-full">
            <div class="label"><span class="label-text">Role</span></div>
            <select class="select select-bordered w-full">
              <option>Admin</option>
              <option>User</option>
              <option>Guest</option>
            </select>
          </label>
          <div class="flex items-center justify-between">
            <span class="text-sm">Enable notifications</span>
            <input class="toggle" type="checkbox" checked>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-primary">Save</button>
            <button class="btn btn-ghost">Cancel</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body space-y-4">
          <h2 class="card-title">Dropdown & Modal</h2>
          <div class="flex flex-wrap items-center gap-3">
            <div class="dropdown">
              <button type="button" class="btn">
              <ul
              </button>
              <div class="dropdown-content bg-base-100 rounded-box z-10 w-52 p-2 shadow">
                <ul class="menu p-0" role="menu">
                  <li><button type="button" role="menuitem">Item 1</button></li>
                  <li><button type="button" role="menuitem">Item 2</button></li>
                  <li><button type="button" role="menuitem">Item 3</button></li>
                </ul>
              </div>
              class="btn btn-secondary"
              onclick={() => (isModalOpen = true)}
            >
              Open modal
            </button>

          {#if isModalOpen}
            <dialog class="modal" open>
              <div class="modal-box">
                <h3 class="font-bold text-lg">Modal</h3>
                <p class="py-4 text-base-content/70">
                  This uses the <span class="font-mono">modal</span> component.
                </p>
                <div class="modal-action">
                  <button class="btn" onclick={() => (isModalOpen = false)}>
                    Close
                  </button>
                </div>
              </div>
              <form method="dialog" class="modal-backdrop">
                <button onclick={() => (isModalOpen = false)}>close</button>
              </form>
            </dialog>
          {/if}
        </div>
      </div>
    </section>

    <section class="card bg-base-100 shadow">
      <div class="card-body space-y-4">
        <h2 class="card-title">Data Display</h2>
        <div class="stats stats-vertical lg:stats-horizontal shadow">
          <div class="stat">
            <div class="stat-title">Active windows</div>
            <div class="stat-value">3</div>
            <div class="stat-desc">Example stat block</div>
          </div>
          <div class="stat">
            <div class="stat-title">CPU</div>
            <div class="stat-value text-primary">12%</div>
            <div class="stat-desc">Example metric</div>
          </div>
          <div class="stat">
            <div class="stat-title">Errors</div>
            <div class="stat-value text-error">0</div>
            <div class="stat-desc">All clear</div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Browser</td>
                <td><span class="badge badge-success">Running</span></td>
                <td>System</td>
              </tr>
              <tr>
                <td>Hello</td>
                <td><span class="badge">Idle</span></td>
                <td>User</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="space-y-2">
          <div class="text-sm font-semibold">Progress</div>
          <progress
            class="progress progress-primary"
            value="40"
            max="100"
          ></progress>
        </div>
      </div>
    </section>

    <footer class="text-xs text-base-content/60 pb-4">
      Tip: set the active theme by changing
      <span class="font-mono">document.documentElement.dataset.theme</span>.
    </footer>
  </div>
</div>
