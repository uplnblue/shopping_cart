(function() {
  // add on-click functions to nav-links to change active link and url
  // and render the correc html
  $('.nav-link').click(function (e) {
    // for the Browse and Checkout links, change the url
    // and render the approrpiate html
    if ($(this).attr('id') !== 'total') {
      $('.nav-item').removeClass('active');
      $(this).parent().addClass('active');
      // show the right "page"
      showPage($(this).attr('href'));
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
      displayCart();
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

  // set up cart... executed once when the page loads
  $.get('../../components/cart.html', function(response) {
    $('.cart').html(response);
    // TODO: ??
    $('th').addClass('border-bot');
  });

  function displayCart() {
    // init total
    let total = 0;
    // reset cart to nothing
    $('tbody').html('');
    // make a table row for each item
    for (let item in cart) {
      // quantity, name, subtotal, rem-from-cart
      let s_html = `<tr><td>${cart[item].quantity}</td>`;
      s_html += `<td>${cart[item].name}</td>`;
      s_html += `<td>${cart[item].subtotal}</td>`;
      s_html += `<td><button id=${cart[item].id} class="btn btn-danger rem-from-cart">X</button></td></tr>`

      $('tbody').append(s_html);
      // increment total
      total += parseFloat(cart[item].subtotal,10);
    }
      // bottom borders...
      $('td').addClass('border-bot');
      // update table foot and nav bar display of Total Price
      $('.total').html(`Total Price: $${total.toFixed(2)}`);
      // add on=click functions for the rem-from-carts
      // they decrement quantity of that item by 1 and call displayCart
      $('.rem-from-cart').click(function(e) {
        let btn_id = $(this).attr('id');
        for (let i in cart) {
          if (cart[i].id == btn_id) {
            cart[i].quantity--;
            if (cart[i].quantity <= 0) {
              // remove that item because none left
              cart.splice(i,1);
            }
          };
        };
        displayCart();
      });
  }

  function showPage(url) {
    if (url == '#checkout') {
      // show big cart
      console.log($('#browse'));
      $('#browse').addClass('hidden');
      $('#checkout').removeClass('hidden');
    } else if (url == '#browse') {
      // show products + small cart
      $('#checkout').addClass('hidden');
      $('#browse').removeClass('hidden')
    }
  }
})();
