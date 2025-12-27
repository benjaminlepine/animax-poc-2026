<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

const tokensCount = ref<number | null>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const snap = await getDocs(collection(db, 'tokens'))
    tokensCount.value = snap.size
  } catch (e) {
    error.value = 'Firestore error'
    console.error(e)
  }
})
</script>

<template>
  <router-view />
</template>
