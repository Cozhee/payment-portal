<template>
  <h3 class="text-center mb-3">User Details</h3>
  <div class="card p-4">
    <div class="mb-3">
      <label for="first-name" class="form-label fw-bold"
        >First Name <span class="asterik">*</span></label
      >
      <input
        type="name"
        class="form-control"
        id="first-name"
        placeholder="Enter first name"
        v-model="firstName"
      />
    </div>
    <div class="mb-3">
      <label for="last-name" class="form-label fw-bold"
        >Last Name <span class="asterik">*</span></label
      >
      <input
        type="name"
        class="form-control"
        id="last-name"
        placeholder="Enter last name"
        v-model="lastName"
      />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label fw-bold"
        >Email <span class="asterik">*</span></label
      >
      <input
        type="email"
        class="form-control"
        id="email"
        placeholder="example@gmail.com"
        v-model="email"
      />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label fw-bold"
        >Amount <span class="asterik">*</span></label
      >
      <input
        type="text"
        class="form-control"
        id="amount"
        placeholder="$"
        v-model="amount"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, defineExpose } from "vue";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const amount = ref("");

defineExpose({
  firstName,
  lastName,
  email,
  amount,
});
</script>
<style scoped></style>
