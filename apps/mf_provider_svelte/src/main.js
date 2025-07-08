import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';

const targetElement = document.getElementById('app');

if (!targetElement) {
    console.error("Error: The target element with ID 'app' was not found in the DOM.");
    throw new Error("Failed to mount Svelte application: Target element 'app' not found.");
}

const app = mount(App, { target: targetElement });

export default app;

