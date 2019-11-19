import * as Handlebars from '../node_modules/handlebars/dist/handlebars.js';

export const main = Handlebars.compile(`
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed"
            data-toggle="collapse" data-target=".navbar-collapse"
            aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav navbar-right">
          <li class="nav-item">
            <a class="nav-link"href="#customers">All Customers</a>
          </li>
          <li class="nav-item">
            <a class="nav-link"href="#add-customer">Add Customer</a>
          </li>
        </ul>
      </div>
    </div><!-- /.container-fluid -->
  </nav>
  <div class="container">
    <div class="customer-alerts"></div>
    <div class="customers-main"></div>
  </div>
`);

export const alert = Handlebars.compile(`
  <div class="alert alert-{{type}} alert-dismissible fade in" role="alert">
    <button class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    {{message}}
  </div>
`);

export const listCustomers = Handlebars.compile(`
  <div class="panel panel-default">
    <div class="panel-heading">Customers</div>
    {{#if customers.length}}
      <table class="table">
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>E-Mail Address</th>
          <th>Phone Number</th>
        </tr>
        {{#each customers}}
        <tr>
          <td>
            {{firstname}}
            {{lastname}}
          </td>
          <td>
          {{street}}
          {{city}}
          {{zip}}
          </td>
          <td>
            {{email}}
          </td>
          <td>
            {{phone}}
          </td>
          <td>
            <button type="button" class="btn btn-danger delete" customer-id="{{_id}}">Delete</button>
            <button type="button" class="btn btn-warning edit" customer-id="{{_id}}">Edit</button>
          </td>
        </tr>
        {{/each}}
      </table>
    {{else}}
      <div class="panel-body">
        <p>None yet!</p>
      </div>
    {{/if}}
  </div>
`);

export const addCustomerForm = Handlebars.compile(`
<div>
  <form autocomplete="off">

    <div class="col-sm-10">
      <legend class="col-form-legend col-sm-2">Title</legend>
        <div class="form-check">
          <input class="form-check-input radio-inline" type="radio" name="title" value="Mr." id="radio1" checked>
          <label class="form-check-label" for="radio1">
            Mr.
          </label>
          <input class="form-check-input radio-inline" type="radio" name="title" value="Mrs." id="radio2" checked>
          <label class="form-check-label" for="radio2">
            Mrs.
          </label>
          <input class="form-check-input radio-inline" type="radio" name="title" value="Ms." id="radio3" checked>
          <label class="form-check-label" for="radio3">
            Ms.
          </label>
          <input class="form-check-input radio-inline" type="radio" name="title" value="Dr." id="radio4" checked>
          <label class="form-check-label" for="radio4">
            Dr.
          </label>
        </div>
      </div>

      <div class="form-group col-md-6">
        <label for="firstname">First name: </label>
        <input type="text" class="form-control" name="firstname" id="firstname" autofocus placeholder="Hank" required maxlength="25">
      </div>

      <div class="form-group col-md-6">
        <label for="lastname">Last name: </label>
        <input type="text" class="form-control" name="lastname" id="lastname" placeholder="Moody" required maxlength="30">
      </div>

    <div class="form-group col-lg-12">
        <label for="street">Street: </label>
        <input type="text" name="street" id="street" class="form-control" placeholder="26 Brooks Ave" required>
    </div>

    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="city">City: </label>
        <input type="text" id="city" name="city" class="form-control" placeholder="Venice" required>
      </div>

      <div class="form-group col-md-4">
        <label for="state">State</label>
        <select id="state" class="form-control">
          <option value="NJ">NJ</option>
          <option value="NY">NY</option>
          <option value="PA">PA</option>
          <option value="CT">CT</option>
        </select>
      </div>

      <div class="form-group col-md-2">
        <label for="zip">Zip: </label>
        <input type="text" id="zip" name="zip" class="form-control" placeholder="90291" pattern="[0-9]{5}" title="five digit zip code" required>
      </div>

      <div class="form-group col-md-6">
          <label for="phone">Phone: </label>
          <input type="tel" id="phone" name="phone" class="form-control" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required placeholder="303-867-5309"
              title="ten digit phone number">
      </div>
      <div class="form-group col-md-6">
          <label for="email">Email: </label>
          <input type="email" id="email" name="email" class="form-control" placeholder="Hello@Wor.ld" required>
      </div>

    <div class="form-group row">
    <div class="col-sm-2">Contact method: </div>
      <div class="col-sm-10">
            <div class="form-check">
                <input type="checkbox" class="form-check-input" id="contactPhone" name="contactPhone" />
                <label for="contactPhone" class="form-check-label">Phone</label>
            </div>
            <div class="form-check">
                <input type="checkbox" class="form-check-input" id="contactMail" name="contactMail" />
                <label for="contactMail" class="form-check-label">Mail</label>
            </div>
            <div class="form-check">
                <input type="checkbox" class="form-check-input" id="contactEmail" name="contactEmail" />
                <label for="contactEmail" class="form-check-label">E-mail</label>
            </div>
            <div class="form-check">
                <input type="checkbox" class="form-check-input" id="contactAny" name="contactAny" checked>
                <label for="contactAny" class="form-check-label">Any</label>
            </div>
        </div>
      </div>

    <div class="offset-sm-2 col-sm-10">
      <button type="submit" class="btn btn-primary">Add Customer</button>
    </div>

  </form>
</div>
`);
