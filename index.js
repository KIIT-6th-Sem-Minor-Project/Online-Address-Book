// regular expression for validation
const strRegex = /^[a-zA-Z\s]*$/; // containing only letters
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
/* supports following number formats - (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 */
const digitRegex = /^\d+$/;

// -------------------------------------------------- //

const countryList = document.getElementById("country-list");
const fullscreenDiv = document.getElementById("fullscreen-div");
const modal = document.getElementById("modal");
const addBtn = document.getElementById("add-btn");
const closeBtn = document.getElementById("close-btn");
const modalBtns = document.getElementById("modal-btns");
const form = document.getElementById("modal");
const addrBookList = document.querySelector("#addr-book-list tbody");


// -------------------------------------------------- //
// let addrName =
//   (firstName =
//     lastName =
//     email =
//     phone =
//     streetAddr =
//     postCode =
//     city =
//     country =
//     labels =
//     "");

// // Address class
// class Address {
//   constructor(
//     id,
//     addrName,
//     firstName,
//     lastName,
//     email,
//     phone,
//     streetAddr,
//     postCode,
//     city,
//     country,
//     labels
//   ) {
//     this.id = id;
//     this.addrName = addrName;
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.email = email;
//     this.phone = phone;
//     this.streetAddr = streetAddr;
//     this.postCode = postCode;
//     this.city = city;
//     this.country = country;
//     this.labels = labels;
//   }

//   static getAddresses() {
//     // from local storage
//     let addresses;
//     if (localStorage.getItem("addresses") == null) {
//       addresses = [];
//     } else {
//       addresses = JSON.parse(localStorage.getItem("addresses"));
//     }
//     return addresses;
//   }

//   static addAddress(address) {
//     const addresses = Address.getAddresses();
//     addresses.push(address);
//     localStorage.setItem("addresses", JSON.stringify(addresses));
//   }

//   static deleteAddress(id) {
//     const addresses = Address.getAddresses();
//     addresses.forEach((address, index) => {
//       if (address.id == id) {
//         addresses.splice(index, 1);
//       }
//     });
//     localStorage.setItem("addresses", JSON.stringify(addresses));
//     form.reset();
//     UI.closeModal();
//     addrBookList.innerHTML = "";
//     UI.showAddressList();
//   }

//   static updateAddress(item) {
//     const addresses = Address.getAddresses();
//     addresses.forEach((address) => {
//       if (address.id == item.id) {
//         address.addrName = item.addrName;
//         address.firstName = item.firstName;
//         address.lastName = item.lastName;
//         address.email = item.email;
//         address.phone = item.phone;
//         address.streetAddr = item.streetAddr;
//         address.postCode = item.postCode;
//         address.city = item.city;
//         address.country = item.country;
//         address.labels = item.labels;
//       }
//     });
//     localStorage.setItem("addresses", JSON.stringify(addresses));
//     addrBookList.innerHTML = "";
//     UI.showAddressList();
//   }
// }

// UI class
class UI {
  static showAddressList() {
    fetch("http://localhost:5000/addresses")
      .then((response) => response.json())
      .then((addresses) => {
        addrBookList.innerHTML = "";
        addresses.forEach((address) => this.addToAddressList(address));
      })
      .catch((error) => console.error("Error fetching addresses:", error));
  }

  static addToAddressList(address) {
    const tableRow = document.createElement("tr");
    tableRow.setAttribute("data-id", address._id); // Use _id from backend
    tableRow.innerHTML = `
      <td>${address._id}</td>
      <td>
        <span class="addressing-name">${address.addrIngName}</span><br>
        <span class="address">${address.streetAddr} ${address.postalCode} ${address.city} ${address.country}</span>
      </td>
      <td><span>${address.labels.join(", ")}</span></td>
      <td>${address.firstName} ${address.lastName}</td>
      <td>${address.phone}</td>
    `;
    addrBookList.appendChild(tableRow);
  }

  static updateAddressInRow(updatedAddress, row) {
    // Access individual cells for clarity and maintainability
    const cells = row.querySelectorAll('td');
    cells[0].textContent = updatedAddress._id;
    cells[1].querySelector('.addressing-name').textContent = updatedAddress.addrIngName;
    cells[1].querySelector('.address').textContent = `${updatedAddress.streetAddr} ${updatedAddress.postalCode} ${updatedAddress.city} ${updatedAddress.country}`;
    cells[2].querySelector('span').textContent = updatedAddress.labels.join(', ');
    cells[3].textContent = `${updatedAddress.firstName} ${updatedAddress.lastName}`;
    cells[4].textContent = updatedAddress.phone;
  }

  static showModalData(id) {
    fetch(`http://localhost:5000/addresses/${id}`) // Corrected template literal
      .then((response) => response.json())
      .then((address) => {
        // Fill form fields with address data
        form.addr_ing_name.value = address.addrIngName;
        form.first_name.value = address.firstName; // Added missing semicolon
        form.last_name.value = address.lastName;
        form.email.value = address.email;
        form.phone.value = address.phone;
        form.street_addr.value = address.streetAddr;
        form.postal_code.value = address.postalCode; // Added missing semicolon
        form.city.value = address.city;
        form.country.value = address.country;
        form.labels.value = address.labels; // Corrected comma placement

        document.getElementById("modal-title").innerHTML = "Change Address Details";
        document.getElementById("modal-btns").innerHTML = `
          <button type="submit" id="update-btn" data-id="${id}">Update</button>
          <button type="button" id="delete-btn" data-id="${id}">Delete</button>
        `;
      })
      .catch((error) => console.error("Error fetching address:", error));
  }


  static showModal() {
    modal.style.display = "block";
    fullscreenDiv.style.display = "block";
  }

  static closeModal() {
    modal.style.display = "none";
    fullscreenDiv.style.display = "none";
  }
}

// DOM Content Loaded
window.addEventListener("DOMContentLoaded", () => {
  loadJSON(); // loading country list from json file
  eventListeners();
  UI.showAddressList();
});

// event listeners
function eventListeners() {
  // show add item modal
  addBtn.addEventListener("click", () => {
    form.reset();
    document.getElementById("modal-title").innerHTML = "Add Address";
    UI.showModal();
    document.getElementById("modal-btns").innerHTML = `
            <button type = "submit" id = "save-btn"> Save </button>
        `;
  });

  // close add item modal
  closeBtn.addEventListener("click", UI.closeModal);

  // add an address item
  modalBtns.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target.id == "save-btn") {
      let isFormValid = getFormData();
      if (!isFormValid) {
        return;
      }
      try {
        fetch("http://localhost:5000/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            {
              user: "65b116e5a721ed3f2c1a0b8d",
              addrIngName: form.addr_ing_name.value,
              firstName: form.first_name.value,
              lastName: form.last_name.value,
              email: form.email.value,
              phone: form.phone.value,
              streetAddr: form.street_addr.value,
              postalCode: form.postal_code.value,
              city: form.city.value,
              country: form.country.value,
              labels: form.labels.value
            })
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error creating address");
            }
            return response.json();
          })
          .then((newAddress) => {
            UI.addToAddressList(newAddress);
            UI.closeModal();
            alert("Address added successfully!");
          })
          .catch((error) => {
            console.error("Error creating address:", error);
            alert("Failed to add address. Please try again.");
          });
      } catch (error) {
        console.error("Error:", error);
      }
    } else if (event.target.id === "update-btn") {
      const id = event.target.getAttribute("data-id");
      try {
        fetch(`http://localhost:5000/addresses/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: "65b116e5a721ed3f2c1a0b8d",
            addrIngName: form.addr_ing_name.value,
            firstName: form.first_name.value,
            lastName: form.last_name.value,
            email: form.email.value,
            phone: form.phone.value,
            streetAddr: form.street_addr.value,
            postalCode: form.postal_code.value,
            city: form.city.value,
            country: form.country.value,
            labels: form.labels.value
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Error updating address: ${response.statusText}`); // Provide more context in error message
            }
            return response.json();
          })
          .then((updatedAddress) => {
            // Update address in UI list
            const row = addrBookList.querySelector(`tr[data-id="${id}"]`);
            UI.updateAddressInRow(updatedAddress, row);
            UI.closeModal();
            alert("Address updated successfully!");
          })
          .catch((error) => {
            console.error(error); // Log error to console
            alert("Failed to update address. Please try again.");
          });
      } catch (error) {
        console.error(error); // Log error to console
      }
    } else if (event.target.id === "delete-btn") {
      const id = event.target.getAttribute("data-id");

      if (confirm("Are you sure you want to delete this address?")) {
        try {
          const id = event.target.getAttribute("data-id"); // Extract ID from target element

          fetch(`http://localhost:5000/addresses/${id}`, { method: "DELETE" })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Error deleting address: ${response.statusText}`); // Provide more context in error message
              }

              // Remove address from UI list
              const row = addrBookList.querySelector(`tr[data-id="${id}"]`);
              row.remove();

              UI.closeModal();
              alert("Address deleted successfully!");
            })
            .catch((error) => {
              console.error(error); // Log error to console
              alert("Failed to delete address. Please try again.");
            });
        } catch (error) {
          console.error(error); // Log error to console
        }
      }
    }
  });

  // table row items
  addrBookList.addEventListener("click", (event) => {
    UI.showModal();
    let trElement;
    if (event.target.parentElement.tagName == "TD") {
      trElement = event.target.parentElement.parentElement;
    }

    if (event.target.parentElement.tagName == "TR") {
      trElement = event.target.parentElement;
    }

    let viewID = trElement.dataset.id;
    // try {
    //   const address = fetch(`http://localhost:5000/addresses/${viewID}`)
    //     .then((response) => response.json())
    //     .then();

    //   // Fill modal fields with address details
    // } catch (error) {
    //   console.error("Error fetching address details:", error);
    //   // Handle the error gracefully, e.g., display an error message to the user
    // }
    UI.showModalData(viewID)
  });

  // delete an address item
  // modalBtns.addEventListener("click", (event) => {
  //   if (event.target.id == "delete-btn") {
  //     Address.deleteAddress(event.target.dataset.id);
  //   }
  // });

  // // update an address item
  // modalBtns.addEventListener("click", (event) => {
  //   event.preventDefault();
  //   if (event.target.id == "update-btn") {
  //     let id = event.target.dataset.id;
  //     let isFormValid = getFormData();
  //     if (!isFormValid) {
  //       form.querySelectorAll("input").forEach((input) => {
  //         setTimeout(() => {
  //           input.classList.remove("errorMsg");
  //         }, 1500);
  //       });
  //     } else {
  //       const addressItem = new Address(
  //         id,
  //         addrName,
  //         firstName,
  //         lastName,
  //         email,
  //         phone,
  //         streetAddr,
  //         postCode,
  //         city,
  //         country,
  //         labels
  //       );
  //       Address.updateAddress(addressItem);
  //       UI.closeModal();
  //       form.reset();
  //     }
  //   }
  // });
}

// load countries list
function loadJSON() {
  fetch("countries.json")
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      data.forEach((country) => {
        html += `
                <option> ${country.country} </option>
            `;
      });
      countryList.innerHTML = html;
    });
}

// get form data
function getFormData() {
  let inputValidStatus = [];
  // console.log(form.addr_ing_name.value, form.first_name.value, form.last_name.value, form.email.value, form.phone.value, form.street_addr.value, form.postal_code.value, form.city.value, form.country.value, form.labels.value);

  if (
    !strRegex.test(form.addr_ing_name.value) ||
    form.addr_ing_name.value.trim().length == 0
  ) {
    addErrMsg(form.addr_ing_name);
    inputValidStatus[0] = false;
  } else {
    addrName = form.addr_ing_name.value;
    inputValidStatus[0] = true;
  }

  if (
    !strRegex.test(form.first_name.value) ||
    form.first_name.value.trim().length == 0
  ) {
    addErrMsg(form.first_name);
    inputValidStatus[1] = false;
  } else {
    firstName = form.first_name.value;
    inputValidStatus[1] = true;
  }

  if (
    !strRegex.test(form.last_name.value) ||
    form.last_name.value.trim().length == 0
  ) {
    addErrMsg(form.last_name);
    inputValidStatus[2] = false;
  } else {
    lastName = form.last_name.value;
    inputValidStatus[2] = true;
  }

  if (!emailRegex.test(form.email.value)) {
    addErrMsg(form.email);
    inputValidStatus[3] = false;
  } else {
    email = form.email.value;
    inputValidStatus[3] = true;
  }

  if (!phoneRegex.test(form.phone.value)) {
    addErrMsg(form.phone);
    inputValidStatus[4] = false;
  } else {
    phone = form.phone.value;
    inputValidStatus[4] = true;
  }

  if (!(form.street_addr.value.trim().length > 0)) {
    addErrMsg(form.street_addr);
    inputValidStatus[5] = false;
  } else {
    streetAddr = form.street_addr.value;
    inputValidStatus[5] = true;
  }

  if (!digitRegex.test(form.postal_code.value)) {
    addErrMsg(form.postal_code);
    inputValidStatus[6] = false;
  } else {
    postCode = form.postal_code.value;
    inputValidStatus[6] = true;
  }

  if (!strRegex.test(form.city.value) || form.city.value.trim().length == 0) {
    addErrMsg(form.city);
    inputValidStatus[7] = false;
  } else {
    city = form.city.value;
    inputValidStatus[7] = true;
  }
  country = form.country.value;
  labels = form.labels.value;
  return inputValidStatus.includes(false) ? false : true;
}

function addErrMsg(inputBox) {
  inputBox.classList.add("errorMsg");
}

const switchers = [...document.querySelectorAll(".switcher")];

switchers.forEach((item) => {
  item.addEventListener("click", function () {
    switchers.forEach((item) =>
      item.parentElement.classList.remove("is-active")
    );
    this.parentElement.classList.add("is-active");
  });
});