<template>
  <form>
    <div class="mb-3">
      <label for="bank-name" class="form-label fw-bold">Bank Name</label>
      <input
        type="bank-name"
        class="form-control"
        id="bank-name"
        aria-describedby="bank-name"
      />
    </div>
    <div class="mb-3">
      <label for="routing-number" class="form-label fw-bold"
        >Routing Number</label
      >
      <input type="routing-number" class="form-control" id="routing-number" />
    </div>
    <div class="mb-3">
      <label for="account-number" class="form-label fw-bold"
        >Account Number</label
      >
      <input type="account-number" class="form-control" id="account-number" />
    </div>
    <div class="mb-3">
      <label for="payment-amount" class="form-label fw-bold"
        >Payment Amount</label
      >
      <input
        type="payment-amount"
        class="form-control w-50"
        id="payment-amount"
      />
    </div>
  </form>
</template>
<script setup></script>
<style scoped></style>
