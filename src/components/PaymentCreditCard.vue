<template>
  <form>
    <div class="mb-3">
      <label for="card-details" class="form-label fw-bold"
        >Card Number <span class="asterik">*</span></label
      >
      <input
        type="card-details"
        class="form-control"
        :class="{ cardNumberError: cardNumberError }"
        id="card-details"
        v-model="cardNumber"
        required
        @input="setCardIssuer"
      />
    </div>
    <div class="mb-3 d-flex">
      <div class="expiration-date me-3">
        <label for="expiration-date" class="form-label fw-bold"
          >Expiration Date <span class="asterik">*</span></label
        >
        <div
          class="exp-date d-flex align-items-center"
          :class="{ expirationDateError: expirationDateError }"
        >
          <input
            type="expiration-date"
            class="form-control text-center"
            :class="{ monthError: monthError }"
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
          :class="{ zipCodeError: zipCodeError }"
          id="zipcode"
          v-model="zipcode"
          required
        />
      </div>
    </div>
    <div class="mb-3">
      <label for="zipcode" class="form-label fw-bold">Valid Card Types</label>
      <div class="card-types d-flex align-items-center">
        <div class="card-icons me-5">
          <img
            v-for="card in cardIssuers"
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

const cardNumberError = ref(false);
const monthError = ref(false);
const yearError = ref(false);
const zipCodeError = ref(false);
const expirationDateError = ref(false);

defineExpose({
  cardNumber,
  expirationDate,
  zipcode,
  issuer,
  month,
  year,
  cardNumberError,
  monthError,
  yearError,
  zipCodeError,
  expirationDateError,
});

function getImageUrl(name) {
  return new URL(`../../public/icons/${name}`, import.meta.url).href;
}

function setCardIssuer() {
  const cardMapper = { 3: "Amex", 4: "Visa", 5: "Master", 6: "Discover" };
  issuer.value = cardMapper[cardNumber.value[0]] || "";
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

.cardNumberError,
.monthError,
.zipCodeError,
.expirationDateError {
  border: 1px solid red;
}
</style>
