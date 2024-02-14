<template>
  <div class="mt-5 payment-form d-flex justify-content-center">
    <div class="user-details me-5">
      <PaymentUserDetails ref="userDetailsChild" />
    </div>
    <div class="payment-details">
      <h3 class="text-center mb-3">Payment Details</h3>
      <div class="card">
        <div
          class="card-header d-flex align-items-center justify-content-center"
        >
          <div class="btn-group">
            <input
              @click="setPaymentMethod('card')"
              type="radio"
              class="btn-check"
              name="btnradio"
              id="card-method"
              autocomplete="off"
              checked
            />
            <label class="btn btn-outline-primary shadow-none" for="card-method"
              >Credit Card</label
            >

            <input
              @click="setPaymentMethod('bank')"
              type="radio"
              class="btn-check"
              name="btnradio"
              id="bank-method"
              autocomplete="off"
            />
            <label class="btn btn-outline-primary shadow-none" for="bank-method"
              >ACH / Bank Payment</label
            >
          </div>
        </div>
        <div class="card-body">
          <div v-if="paymentCreditCard">
            <PaymentCreditCard ref="creditCardChild" />
          </div>
          <div v-if="paymentBankAccount">
            <PaymentBankAccount ref="bankAccountChild" />
          </div>
        </div>
        <div class="card-footer">
          <button
            @click="createOrFindCustomer()"
            type="submit"
            class="btn btn-primary w-100"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PaymentCreditCard from "./PaymentCreditCard.vue";
import PaymentBankAccount from "./PaymentBankAccount.vue";
import PaymentUserDetails from "./PaymentUserDetails.vue";
import { ref } from "vue";

const paymentCreditCard = ref(true);
const paymentBankAccount = ref(false);

// child refs
const creditCardChild = ref(null);
const bankAccountChild = ref(null);
const userDetailsChild = ref(null);

function setPaymentMethod(type) {
  paymentCreditCard.value = false;
  paymentBankAccount.value = false;

  if (type === "card") {
    paymentCreditCard.value = true;
    return;
  }

  paymentBankAccount.value = true;
  return;
}

async function createOrFindCustomer() {
  const email = userDetailsChild.value.email;
  const results = await fetch("http://localhost:8080/customer", {
    method: "GET",
  });
  const customers = await results.json();
  const customer = customers.filter((customer) => customer.Email === email);
  if (customer) {
    const customerId = customer[0].Id;
    const paymentResults = await fetch(
      `http://localhost:8080/default-payment/${customerId}`,
      {
        method: "GET",
      }
    );
    const defaultPayment = await paymentResults.json();
    const paymentAccountId = defaultPayment.Id;
    const payment = {
      Amount: Number(userDetailsChild.value.amount),
      AccountId: paymentAccountId,
    };
    const makePayment = await fetch(`http://localhost:8080/collect-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payment),
    });
  }
}
</script>

<style scoped>
.payment-details {
  min-width: 600px;
}

.user-details {
  width: 400px;
}

.card {
  background-color: #efefef;
}
</style>
