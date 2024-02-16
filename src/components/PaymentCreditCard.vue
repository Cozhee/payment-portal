<template>
  <form>
    <div class="mb-3">
      <label for="card-details" class="form-label fw-bold"
        >Card Number <span class="asterik">*</span></label
      >
      <input
        type="card-details"
        class="form-control"
        id="card-details"
        v-model="cardNumber"
        required
      />
    </div>
    <div class="mb-3 d-flex">
      <div class="expiration-date me-3">
        <label for="expiration-date" class="form-label fw-bold"
          >Expiration Date <span class="asterik">*</span></label
        >
        <div class="exp-date d-flex align-items-center">
          <input
            type="expiration-date"
            class="form-control text-center"
            id="expiration-date"
            placeholder="MM"
            v-model="month"
            maxlength="2"
            required
          />
          <span class="exp-separator">/</span>
          <input
            type="expiration-date"
            class="form-control text-center"
            id="expiration-date"
            placeholder="YYYY"
            v-model="year"
            maxlength="4"
            required
          />
        </div>
      </div>
      <div class="zipcode">
        <label for="zipcode" class="form-label fw-bold"
          >Zip Code <span class="asterik">*</span></label
        >
        <input
          type="text"
          class="form-control"
          id="zipcode"
          v-model="zipcode"
          required
        />
      </div>
    </div>
    <div class="mb-3">
      <label for="zipcode" class="form-label fw-bold"
        >Select Card Type <span class="asterik">*</span></label
      >
      <div class="card-types d-flex align-items-center">
        <div class="card-icons me-5">
          <img
            v-for="card in cardIssuers"
            @click="setCardIssuer(card.type)"
            class="credit-card-issuer me-2"
            :src="getImageUrl(card.img)"
            alt="credit-card"
          />
        </div>
        <div class="card-selected">
          <span class="fw-bold">{{ issuer }}</span>
        </div>
      </div>
    </div>
  </form>
</template>
<script setup>
import { defineExpose, ref, computed } from "vue";

const cardNumber = ref("");
const month = ref("");
const year = ref("");
const zipcode = ref("");
const issuer = ref("");
const cardIssuers = [
  { type: "Amex", img: "amex.svg" },
  { type: "Discover", img: "discover.svg" },
  { type: "Master", img: "mastercard.svg" },
  { type: "Visa", img: "visa.svg" },
];

const expirationDate = computed(() => {
  return month.value + "/" + year.value;
});

defineExpose({
  cardNumber,
  expirationDate,
  zipcode,
  issuer,
});

function getImageUrl(name) {
  return new URL(`../../public/icons/${name}`, import.meta.url).href;
}

function setCardIssuer(type) {
  issuer.value = type;
}
</script>
<style scoped>
.credit-card-issuer {
  height: 45px;
  width: 45px;
}

.credit-card-issuer:hover {
  scale: 1.1;
  cursor: pointer;
}

.exp-date {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  width: 150px;
}
.exp-date input {
  border: 0;
}

.exp-separator {
  font-size: 20px;
}
</style>
