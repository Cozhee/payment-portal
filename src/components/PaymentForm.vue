<template>
  <form
    @submit.prevent="createOrFindCustomer()"
    class="mt-5 payment-form d-flex justify-content-center"
  >
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
          <button type="submit" class="btn btn-primary w-100">Submit</button>
        </div>
      </div>
    </div>
  </form>
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

function cardNumberValidation() {
  var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  console.log(visaRegEx.test(creditCardChild.value.cardNumber));
}

async function createOrFindCustomer() {
  const email = userDetailsChild.value.email;
  const results = await fetch(import.meta.env.VITE_APP_HOST + "/customer", {
    method: "GET",
  });
  const customers = await results.json();
  const customer = customers.filter((customer) => customer.Email === email);

  // find existing user by email and pay with default cc
  if (customer.length) {
    const customerId = customer[0].Id;
    const paymentResults = await fetch(
      import.meta.env.VITE_APP_HOST + `/default-payment/${customerId}`,
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
    const makePayment = await fetch(
      import.meta.env.VITE_APP_HOST + "/collect-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payment),
      }
    );
    return;
  }

  // create a new user and add card details to account
  const customerDetails = {
    FirstName: userDetailsChild.value.firstName,
    LastName: userDetailsChild.value.lastName,
    Email: userDetailsChild.value.email,
  };

  const createCustomer = await fetch(
    import.meta.env.VITE_APP_HOST + "/customer",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerDetails),
    }
  );

  const createdCustomer = await createCustomer.json();
  const { Id } = createdCustomer;

  const cardDetails = {
    CreditCardNumber: creditCardChild.value.cardNumber,
    ExpirationDate: creditCardChild.value.expirationDate,
    Issuer: creditCardChild.value.issuer,
    BillingZipCode: creditCardChild.value.zipcode,
    CustomerId: Id,
  };

  const createCardAccount = await fetch(
    import.meta.env.VITE_APP_HOST + "/add-card",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardDetails),
    }
  );

  const createdAccount = await createCardAccount.json();
  const { Id: accountId } = createdAccount;

  const paymentDetails = {
    Amount: Number(userDetailsChild.value.amount),
    AccountId: accountId,
  };

  const makePayment = await fetch(
    import.meta.env.VITE_APP_HOST + "/collect-payment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentDetails),
    }
  );
}
</script>

<style scoped>
.payment-details {
  width: 600px;
}

.user-details {
  width: 400px;
}
</style>
