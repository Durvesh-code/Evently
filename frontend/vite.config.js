import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This rule handles all your API calls (like login, create event)
      '/api': {
        target: 'http://localhost:8081', // your backend server
        changeOrigin: true,
      },
      
      // --- ADD THIS NEW RULE ---
      // This new rule handles all your image requests
      '/uploads': {
        target: 'http://localhost:8081', // your backend server
        changeOrigin: true,
      }
      // --- END OF NEW RULE ---
    }
  }
})