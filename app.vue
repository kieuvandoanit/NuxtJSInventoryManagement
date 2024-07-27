<script setup lang="ts">
  function recoverFromError(error: any) {
    error.value = null;
  }
</script>

<template>
  <NuxtLayout>
    <NuxtErrorBoundary>
      <!-- error boundary: When an error occurs, the internal component is re-rendered / receives the error thrown
       and renders the error slot if there is an error value, and renders the default slot if there is no error value. -->
       <NuxtLoadingIndicator color="#1a8bcd"/>
       <NuxtPage />

       <template #error="{ error }">
        <div>
          <h1>{{ error.value.statusCode }}</h1>
          <p>{{ error.value.statusMessage }}</p>
          <button 
            type="button"
            @click="recoverFromError(error)"
          >
            Revert
          </button>
        </div>
      </template>
    </NuxtErrorBoundary>
  </NuxtLayout>
</template>

<!-- // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-tR7Jh0770m3uNztc8KCvvpZ2P3uDnxk",
  authDomain: "starter-realtime-database.firebaseapp.com",
  projectId: "starter-realtime-database",
  storageBucket: "starter-realtime-database.appspot.com",
  messagingSenderId: "16117444026",
  appId: "1:16117444026:web:c2a862fa21648239860183"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); -->
