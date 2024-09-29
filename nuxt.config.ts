import dotenv from "dotenv";
dotenv.config();

export default defineNuxtConfig({
  target: "static",
  router: {
    base: 'InventoryManagement'
  },
  ssr: false,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    'assets/styles/normalize.css',
    'assets/styles/common.scss',
  ],
  plugins: [
    { src: 'plugins/firebase.client.ts', mode: 'client' },
    { src: 'plugins/toast.client.ts', mode: 'client' }
  ],
  runtimeConfig: {
    public: {
      FB_API_KEY: process.env.FB_API_KEY,
      FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
      FB_DATABASE_URL: process.env.FB_DATABASE_URL,
      FB_PROJECT_ID: process.env.FB_PROJECT_ID,
      FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
      FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
      FB_APP_ID: process.env.FB_APP_ID,
    },
  },
});
