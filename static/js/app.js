(function() {
  // add on-click functions to nav-links to change active link and url
  // and render the correc html
  $('.nav-link').click(function (e) {
    // for the Browse and Checkout links, change the url
    // and render the approrpiate html
    if ($(this).attr('id') !== 'total') {
      $('.nav-item').removeClass('active');
      $(this).parent().addClass('active');
      // TODO: call render function
    } else {
      // don't do anything if someone clicks on the total "nav-item"
      e.preventDefault();
    }
  });
  // store products in the scope of page
  let products = [];
  // store cart in the scope of page
  let cart = [];

  // should be called only once on page load
  function populateProducts(res) {
    // store products in the scope of page
    products = res;
    let s_html = '';
    for (let i in res) {
      // create a card to display each product
      s_html += `<div class="card">`;
      // add a picture for each product
      s_html += `<img src="${res[i].img_url}" class="img-fluid"></img>`
      // add the card-body
      s_html += '<div class="card-body">'
      // add card-title
      s_html += `<div class="card-title">${res[i].name}</div>`
      // add price TODO: should this be a class really?
      s_html += `<p class="price">${res[i].price.toFixed(2)}</p>`
      // add description
      s_html += `<p class="desc">${res[i].description}</p>`
      // add "add to cart" button
      s_html += `<button class="btn btn-success add-to-cart" id=${res[i].id}>Add To Cart</button>`;
      //close card-body
      s_html += '</div>'
      // close card div
      s_html += '</div>'
    }
    $('.products').html(s_html);

    // add on-click functions to the add to cart buttons
    $('.add-to-cart').click(function(e) {
      e.preventDefault();
      let found = false;
      let button_id = $(this).attr('id')

      // loop through cart, if we already have that products
      // increment quantity by one
      for (let prod in cart) {
        if (cart[prod].id == button_id) {
          cart[prod].quantity++;
          cart[prod].subtotal = (cart[prod].quantity * cart[prod].price).toFixed(2);
          found = true;
        };
      };
      if (!found) {
        // add prod to cart with quantity = 1
        let temp = getProduct(button_id);
        temp.quantity = 1;
        temp.subtotal = temp.price.toFixed(2);
        cart.push(temp);
      }
    });
  }
  // executed only once on page load
  $.get('./products.json', populateProducts);

  function getProduct(id) {
    for (let prod in products) {
      if (products[prod].id == id) {
        return products[prod];
      }
    }
  }

  // set up cart...
$.get('../../components/cart.html', function(response) {
  $('.cart').html(response);
  console.log($('tr, td, th'));
  // TODO this isn't working how I want
  $('tr, td, th, thead').addClass('border-bot');

});



})();
