import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // This plugin provides browser-compatible versions of Node.js
    // built-in modules like 'events', 'util', 'buffer', etc.
    nodePolyfills({
      // We must include the 'global' polyfill for simple-peer.
      globals: {
        global: true,
      },
    }),
  ],
})