<template>
  <form>
    <div class="mb-3">
      <label for="card-details" class="form-label fw-bold">Card Number</label>
      <input
        type="card-details"
        class="form-control"
        id="card-details"
        v-model="cardNumber"
      />
    </div>
    <div class="mb-3 d-flex">
      <div class="expiration-date me-3">
        <label for="expiration-date" class="form-label fw-bold"
          >Expiration Date</label
        >
        <input
          type="expiration-date"
          class="form-control"
          id="expiration-date"
          placeholder="MM/YYYY"
          v-model="expirationDate"
        />
      </div>
      <div class="cvv me-3">
        <label for="cvv" class="form-label fw-bold">CVV</label>
        <input type="cvv" class="form-control" id="cvv" v-model="cvv" />
      </div>
      <div class="cvv">
        <label for="zipcode" class="form-label fw-bold">Zip Code</label>
        <input
          type="text"
          class="form-control"
          id="zipcode"
          v-model="zipcode"
        />
      </div>
    </div>
  </form>
</template>
<script setup>
import { defineExpose, ref } from "vue";

const cardNumber = ref("");
const expirationDate = ref("");
const cvv = ref("");
const zipcode = ref("");

defineExpose({
  cardNumber,
  expirationDate,
  cvv,
});
</script>
<style scoped></style>
