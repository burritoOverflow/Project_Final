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

const getCustomers = async () => {
  const customers = await fetchJSON('/api/customers');
  if (customers.error) {
    throw customers.error;
  }
  return customers;
};


const listCustomers = customers => {
  const mainElement = document.body.querySelector('.customers-main');
  mainElement.innerHTML = templates.listCustomers({ customers });
};

const showCustomerForm = () => {
  const mainElement = document.body.querySelector('.customers-main');
  mainElement.innerHTML = templates.addCustomerForm();
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
