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
        <!-- <div
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
        </div> -->
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
  <div
    class="alert alert-danger w-25 mx-auto mt-5"
    role="alert"
    v-if="formErrors.length"
  >
    <h6 class="mb-0">Please correct the errors</h6>
  </div>
  <div
    v-if="paymentAccepted"
    class="alert alert-success mt-5 w-50 mx-auto"
    role="alert"
  >
    Success! Your payment has been accepted.
  </div>
</template>

<script setup>
import PaymentCreditCard from "./PaymentCreditCard.vue";
import PaymentBankAccount from "./PaymentBankAccount.vue";
import PaymentUserDetails from "./PaymentUserDetails.vue";
import { fetchApi } from "../api/utils/fetchApi.js";
import { ref } from "vue";

const paymentCreditCard = ref(true);
const paymentBankAccount = ref(false);
const formErrors = ref([]);
const paymentAccepted = ref(false);

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
  // regex for Visa, Mastercard, Discover, and Amex
  var RegEx =
    /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
  return RegEx.test(creditCardChild.value.cardNumber);
}

async function checkForExistingCardAccount(customerId) {
  const accounts = await fetchApi(
    `/customer/${customerId}/creditcardaccounts`,
    "GET"
  );
  const lastFourDigits = creditCardChild.value.cardNumber.slice(-4);
  const account = accounts.filter(
    (account) => account.CreditCardNumber.slice(-4) === lastFourDigits
  );
  if (account.length) {
    makePayment(account[0].Id);
    return true;
  }
  return false;
}

async function makePayment(accountId) {
  const payment = {
    Amount: userDetailsChild.value.amount,
    AccountId: accountId,
  };
  await fetchApi("/collect-payment", "POST", payment);
}

function userAndCardDetailValidation() {
  // reset user details form class errors
  userDetailsChild.value.firstNameError = false;
  userDetailsChild.value.lastNameError = false;
  userDetailsChild.value.emailError = false;
  userDetailsChild.value.amountError = false;

  // reset credit card form class errors
  creditCardChild.value.cardNumberError = false;
  creditCardChild.value.zipCodeError = false;
  creditCardChild.value.expirationDateError = false;

  formErrors.value = [];
  const { cardNumber, month, year, zipcode, issuer } = creditCardChild.value;
  const { firstName, lastName, email, amount } = userDetailsChild.value;

  const inputValidationArr = [
    { value: cardNumber, text: "cardNumber", component: creditCardChild },
    {
      value: month,
      text: "expirationDate",
      component: creditCardChild,
    },
    {
      value: year,
      text: "expirationDate",
      component: creditCardChild,
    },
    { value: zipcode, text: "zipCode", component: creditCardChild },
    { value: issuer, text: "issuer", component: creditCardChild },
    { value: firstName, text: "firstName", component: userDetailsChild },
    { value: lastName, text: "lastName", component: userDetailsChild },
    { value: email, text: "email", component: userDetailsChild },
    { value: amount, text: "amount", component: userDetailsChild },
  ];

  inputValidationArr.forEach((input) => {
    if (!input.value) {
      const child = input.component;
      const field = input.text;
      formErrors.value.push("Please enter your " + input.errorText);
      child.value[field + "Error"] = true;
    }
  });
}

function paymentAlert() {
  paymentAccepted.value = true;
  setTimeout(() => {
    paymentAccepted.value = false;
  }, "6000");
}

function clearForms() {
  userDetailsChild.value.firstName = "";
  userDetailsChild.value.lastName = "";
  userDetailsChild.value.email = "";
  userDetailsChild.value.amount = "";
  creditCardChild.value.cardNumber = "";
  creditCardChild.value.month = "";
  creditCardChild.value.year = "";
  creditCardChild.value.zipcode = "";
  creditCardChild.value.issuer = "";
}

async function createOrFindCustomer() {
  // creates formErrors if any
  userAndCardDetailValidation();
  if (!cardNumberValidation() || formErrors.value.length) {
    return false;
  }
  const email = userDetailsChild.value.email;

  const customers = await fetchApi("/customer", "GET");
  const customer = customers.filter((customer) => customer.Email === email);

  // find existing user by email and pay with default cc
  if (customer.length) {
    const customerId = customer[0].Id;

    const cardCheck = await checkForExistingCardAccount(customerId);
    // if customer has card saved in account return
    if (cardCheck) {
      paymentAlert();
      clearForms();
      return;
    }

    // add new card to customer
    const cardDetails = {
      CreditCardNumber: creditCardChild.value.cardNumber,
      ExpirationDate: creditCardChild.value.expirationDate,
      Issuer: creditCardChild.value.issuer,
      BillingZipCode: creditCardChild.value.zipcode,
      CustomerId: customerId,
    };

    const newCardAccount = await fetchApi("/add-card", "POST", cardDetails);
    const { Id: accountId } = newCardAccount;

    await makePayment(accountId);
    paymentAlert();
    clearForms();
    return;
  }

  // create a new user with an inital card
  const customerDetails = {
    FirstName: userDetailsChild.value.firstName,
    LastName: userDetailsChild.value.lastName,
    Email: userDetailsChild.value.email,
  };

  const createdCustomer = await fetchApi("/customer", "POST", customerDetails);

  const { Id } = createdCustomer;

  const cardDetails = {
    CreditCardNumber: creditCardChild.value.cardNumber,
    ExpirationDate: creditCardChild.value.expirationDate,
    Issuer: creditCardChild.value.issuer,
    BillingZipCode: creditCardChild.value.zipcode,
    CustomerId: Id,
  };

  const createdAccount = await fetchApi("/add-card", "POST", cardDetails);

  const { Id: accountId } = createdAccount;

  await makePayment(accountId);
  paymentAlert();
  clearForms();
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
