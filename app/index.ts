import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap-social/bootstrap-social.css';

import 'bootstrap';

import * as templates from './templates.ts';

// make fetching and converting JSON a bit simpler
const fetchJSON = async (url, method = 'GET') => {
  try {
    const response = await fetch(url, { method, credentials: 'same-origin' });
    return response.json();
  } catch (error) {
    return { error };
  }
};

const postJSON = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    return { error };
  }
};

const deleteFetchID = async (url, id) => {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ _id: id })
    });
    return response.json();
  } catch (error) {
    return { error };
  }
};

const getCustomers = async () => {
  const customers = await fetchJSON('/api/customers');
  if (customers.error) {
    throw customers.error;
  }
  return customers;
};

const showAlert = (message, type = 'danger') => {
  const alertsElement = document.body.querySelector('.customer-alerts');
  const html = templates.alert({ type, message });
  alertsElement.insertAdjacentHTML('beforeend', html);
};

const addCustomer = async (customer) => {
  const resBody = await postJSON('/api/customers', customer);
  if (resBody.error) {
    throw resBody.error
  }
  showAlert(`Customer "${customer.title} ${customer.firstname} ${customer.lastname}" created!`, 'success');
  return resBody;
};

const deleteCustomer = async (customerID) => {
  const resBody = await deleteFetchID('/api/customers/', customerID);
  if (resBody.error) {
    throw resBody.error
  }
  showAlert(`Customer "${customerID}" deleted!`, 'danger');
  return resBody;
};


const listCustomers = async (customers) => {
  const mainElement = document.body.querySelector('.customers-main');
  mainElement.innerHTML = templates.listCustomers({ customers });

  const deleteButtons = mainElement.querySelectorAll('button.delete');
  for (let i = 0; i < deleteButtons.length; i++) {
    const deleteButton = deleteButtons[i];
    deleteButton.addEventListener('click', event => {
      deleteCustomer(deleteButton.getAttribute('customer-id'));
      const tr = deleteButton.parentNode.parentNode;
      tr.parentNode.removeChild(tr);
    });
  }
};

const showCustomerForm = () => {
  const mainElement = document.body.querySelector('.customers-main');
  mainElement.innerHTML = templates.addCustomerForm();

  const form = mainElement.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();

    let state = (document.getElementById("state")) as HTMLSelectElement;
    let selectedState = state.selectedIndex;
    let opt = state.options[selectedState];
    let stateVal = (<HTMLOptionElement>opt).value;


    const customerData = {
      title: (<HTMLInputElement>form.querySelector('input[name = "title"]:checked')).value,
      firstname: (<HTMLInputElement>form.querySelector('#firstname')).value,
      lastname: (<HTMLInputElement>form.querySelector('#lastname')).value,
      street: (<HTMLInputElement>form.querySelector('#street')).value,
      city: (<HTMLInputElement>form.querySelector('#city')).value,
      state: stateVal,
      zip: (<HTMLInputElement>form.querySelector('#zip')).value,
      email: (<HTMLInputElement>form.querySelector('#email')).value,
      phone: (<HTMLInputElement>form.querySelector('#phone')).value,
      contactAny: (<HTMLInputElement>form.querySelector('#contactAny')).checked ? true : false,
      contactMail: (<HTMLInputElement>form.querySelector('#contactMail')).checked ? true : false,
      contactPhone: (<HTMLInputElement>form.querySelector('#contactPhone')).checked ? true : false,
      contactEmail: (<HTMLInputElement>form.querySelector('#contactEmail')).checked ? true : false,
    }
    addCustomer(customerData);
  });
}

const showView = async () => {
  const mainElement = document.body.querySelector('.customers-main');
  const [view, ...params] = window.location.hash.split('/');

  switch (view) {
    case '#customers':
      try {
        const customers = await getCustomers();
        listCustomers(customers);
      } catch (err) {
        console.log(err);
      }
      break;
    case '#add-customer':
      showCustomerForm();
      break;
    default:
      // Unrecognized view.
      throw Error(`Unrecognized view: ${view}`);
  }
};


// initial setup
(async () => {
  document.body.innerHTML = templates.main();
  window.addEventListener('hashchange', showView);
  showView().catch(err => window.location.hash = '#customers');
})();
