import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '타닥 — 한글 타자 연습',
        short_name: '타닥',
        description: '모바일 한글 타자 연습 & 지역 경쟁 앱',
        theme_color: '#D5613F',
        background_color: '#FAF7F3',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/tadak-icon.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
          },
          {
            urlPattern: /^http:\/\/localhost:8080\/api\/.*/i,
            handler: 'NetworkFirst',
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
      '/ws': { target: 'http://localhost:8080', ws: true }
    }
  }
})
