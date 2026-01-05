<template>
  <div class="row">
    <div class="kpi">
      <div class="label">Answered</div>
      <div class="value">{{ answered }}/{{ total }}</div>
    </div>
    <div class="kpi">
      <div class="label">Correct</div>
      <div class="value">{{ correct }}</div>
    </div>
    <div class="kpi">
      <div class="label">Accuracy</div>
      <div class="value">{{ Math.round(accuracy * 100) }}%</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  total: { type: Number, required: true },
  answered: { type: Number, required: true },
  correct: { type: Number, required: true },
  accuracy: { type: Number, required: true },
})
</script>
