"use strict";
//SEE: https://javascript.info/strict-mode

function jsonParse(response) {
  if (response.ok)
    if (response.headers.get("Content-Type") === "application/json")
      return response.json();
    else throw new Error("Wrong Content Type");
  else throw new Error("Non HTTP OK response");
}

//GET on URL and decode response body as json
async function jsonFetch(url) {
  const response = await fetch(url);
  return jsonParse(response);
}

//POST on url with data as json data in body, and expecting json in response body
async function jsonPost(url = "", data = {}) {
  const options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  };
  const response = await fetch(url, options);
  return jsonParse(response);
}

console.log("JS er klar!");

//Some example tests of server's API
/*
jsonPost("test", {name:"Mickey"}).then(status=>{
  console.log("Status="); console.log(status);
}).catch(e=>console.log("SERVER-SIDE VAlidation: FAIL "+e.message));

//expect validation error as this orderID does not exist
jsonFetch("coffee-orders/117").then(status=>{
  console.log("Status="); console.log(status);
}).catch(e=>console.log("SERVER-SIDE VAlidation: PASS "+e.message));
*/

/* In this app we don't use the browsers form submission, but the API defined by the server,
   Hence we extract the values of the input fields of the form and store them in an object, that is
   sent to the server as part of a POST to insert a new record (alse sends updated record back) 
*/

async function requestCoffeeStatus(event) {
  event.preventDefault(); //we handle the interaction with the server rather than browsers form submission
  const statusElem = document.getElementById("status_id");
  const form = document.getElementById("coffeeStatusForm_id");
  const submitButton = document.getElementById("submitStatusBtn_id");
  submitButton.disabled = true; //prevent double submission
  const formData = new FormData(form);
  let data = {};
  formData.forEach((value, key) => (data[key] = value));
  console.log(formData.get("orderID"));
  try {
    // GET on coffee-orders/orderID
    let status = await jsonFetch(form.action + "/" + data.orderID);
    console.log(`Status=${status}`);
    statusElem.textContent = `Hi ${status.name}! Your order was received at ${status.orderTime}. Your order is ${status.isReady ? "" : "not"} ready !`;
    statusElem.style.visibility = "visible";
  } catch (e) {
    console.log("Ooops " + e.message);
    alert("Encountered Error:" + e.message + "\nPlease retry!");
  } finally {
    submitButton.disabled = false;
  }
}

async function orderCoffee(event) {
  event.preventDefault(); //we handle the interaction with the server rather than browsers form submission
  const statusElem = document.getElementById("orderSuccess_id");
  const form = document.getElementById("coffeeOrderForm_id");
  const submitButton = document.getElementById("submitOrderBtn_id");
  submitButton.disabled = true; //prevent double submission
  const formData = new FormData(form);
  let data = {};
  formData.forEach((value, key) => (data[key] = value));
  try {
    //POST on coffee-orders/orderID
    const status = await jsonPost(form.action + "/", data);
    console.log(`Status=${status}`);
    statusElem.textContent = `Hi ${status.name}! Your order was received at ${status.orderTime}. Your order is ${status.isReady ? "" : "not"} ready !`;
    statusElem.style.visibility = "visible";
  } catch (e) {
    console.log("Ooops " + e.message);
    alert("Encountered Error:" + e.message + "\nPlease retry!");
  } finally {
    submitButton.disabled = false;
  }
}

document
  .getElementById("coffeeStatusForm_id")
  .addEventListener("submit", requestCoffeeStatus);

document
  .getElementById("coffeeOrderForm_id")
  .addEventListener("submit", orderCoffee);
