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
      method: "post",
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

const getCustomers = async () => {
  const customers = await fetchJSON('/api/customers');
  if (customers.error) {
    throw customers.error;
  }
  return customers;
};

const addCustomer = async (customer) => {
  const resBody = await postJSON('/api/customers', customer);
  if (resBody.error) {
    throw resBody.error
  }
  return resBody;
};

const listCustomers = customers => {
  const mainElement = document.body.querySelector('.customers-main');
  mainElement.innerHTML = templates.listCustomers({ customers });
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
