import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()

    const firebaseConfig: any = {
        apiKey: config.public.FB_API_KEY,
        authDomain: config.public.FB_AUTH_DOMAIN,
        databaseURL: config.public.FB_DATABASE_URL,
        projectId: config.public.FB_PROJECT_ID,
        storageBucket: config.public.FB_STORAGE_BUCKET,
        messagingSenderId: config.public.FB_MESSAGING_SENDER_ID,
        appId: config.public.FB_APP_ID
    };

    const app = initializeApp(firebaseConfig)

    const database = getDatabase(app);

    nuxtApp.vueApp.provide('firebaseDB', database)
    nuxtApp.provide('firebaseDB', database)
})
