<script lang="js">
  import SvelteWidget from './lib/SvelteWidget.svelte';
  import SvelteRoutes from './routes/SvelteRoutes.svelte';

  let currentView = 'widget';

  const sampleItems = [
    { id: 1, name: 'Task 1', status: 'active', description: 'Complete project setup' },
    { id: 2, name: 'Task 2', status: 'pending', description: 'Implement authentication' },
    { id: 3, name: 'Task 3', status: 'inactive', description: 'Deploy to production' },
  ];

  function handleSubmit(event) {
    console.log('Form submitted:', event.detail);
  }

  function handleCancel() {
    console.log('Form cancelled');
  }
</script>

<main class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-4xl mx-auto px-4">
    <header class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Svelte Provider MFE</h1>
      <p class="text-gray-600">Standalone Svelte application for Module Federation</p>
    </header>

    <nav class="flex justify-center space-x-4 mb-8">
      <button
        class="btn {currentView === 'widget' ? 'btn-primary' : 'btn-outline'}"
        on:click={() => currentView = 'widget'}
      >
        Widget Demo
      </button>
      <button
        class="btn {currentView === 'routes' ? 'btn-primary' : 'btn-outline'}"
        on:click={() => currentView = 'routes'}
      >
        Routes Demo
      </button>
    </nav>

    <div class="space-y-8">
      {#if currentView === 'widget'}
        <div class="grid md:grid-cols-2 gap-8">
          <SvelteWidget
            title="Basic Widget"
            items={sampleItems}
            config={{ theme: 'light', showHeader: true, allowEdit: true }}
            on:submit={handleSubmit}
            on:cancel={handleCancel}
          />

          <SvelteWidget
            title="Compact Widget"
            items={sampleItems.slice(0, 2)}
            config={{ theme: 'light', showHeader: false, allowEdit: false }}
            on:submit={handleSubmit}
            on:cancel={handleCancel}
          />
        </div>
      {:else if currentView === 'routes'}
        <SvelteRoutes basePath="/svelte" />
      {/if}
    </div>
  </div>
</main>
