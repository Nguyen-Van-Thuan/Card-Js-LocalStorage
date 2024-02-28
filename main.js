// Hàm lấy dữ liệu từ localStorage
const getCartFromLocalStorage = () => {
  const cartItems = localStorage.getItem('cartItems');
  return cartItems ? JSON.parse(cartItems) : [];
}

// Hàm lưu dữ liệu vào localStorage
const saveCartToLocalStorage = (cartItems) => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

const cartModalOverlay = document.querySelector('.cart-modal-overlay');
const cart = document.querySelector('.cart-btn');
const close = document.querySelector('#close-btn');

// Xử lý dataLocalStorage
let cartItems = getCartFromLocalStorage();

cart.addEventListener('click', () => {
  cartModalOverlay.style.transform = "translateX(0)";
});
close.addEventListener('click', () => {
  cartModalOverlay.style.transform = "translateX(-200%)";
});
cartModalOverlay.addEventListener('click', (event) => {
  if (event.target.classList.contains('cart-modal-overlay') === true) {
    cartModalOverlay.style.transform = "translateX(-200%)";
  }
});

const addToCart = document.querySelectorAll('.add-to-cart');

addToCart.forEach((item) => {
  item.addEventListener('click', () => addToCartClicked(item));
})

const addToCartClicked = (event) => {
  let cartItem = event.parentElement;
  let price = cartItem.querySelector('.product-price').innerHTML;
  let imageSrc = cartItem.querySelector('.product-image').src;

  cartModalOverlay.style.transform = "translateX(0)";

  // Add Array New
  let isDuplicate = false;
  cartItems.forEach((item) => {
    if (item.price === price && item.imageSrc === imageSrc) {
      isDuplicate = true;
      alert("Sản phẩm đã tồn tại trong giỏ hàng");
    }
  })

  if (!isDuplicate) {
    cartItems.push({
      price: price,
      imageSrc: imageSrc,
      quantity: 1
    });

    // Save localStorage
    saveCartToLocalStorage(cartItems);
  }
  addItemToCart(cartItems);
}

const addItemToCart = (cartItems) => {
  // Access the element
  // const cartImage = document.querySelectorAll('.cart-image');

  const productRows = document.querySelector('.product-rows');
  productRows.innerHTML = '';

  cartItems.forEach((item) => {
    let productRow = document.createElement('div');
    productRow.classList.add('product-row');
    // let isAdd = false;
    // cartImage.forEach((val) => {
    //   if (val.src == imageSrc) {
    //     alert('San pham da co trong gio hang');
    //     isAdd = true;
    //     return;
    //   }
    // })
    // if (isAdd) {
    //   return
    // }

    productRow.innerHTML = `
      <img class="cart-image" src="${item.imageSrc}" alt="">
      <span class ="cart-price">${item.price}</span>
      <input class="product-quantity" type="number" value="${item.quantity}">
      <button class="remove-btn">Remove</button>
    `;

    productRows.append(productRow);
  });

  const btnRemove = document.querySelectorAll('.remove-btn');
  btnRemove.forEach((item) => {
    let imageSrc = item.parentElement.querySelector('.cart-image').src;

    item.addEventListener('click', () => {
      item.parentElement.remove();

      // Update localStorage
      cartItems = cartItems.filter(item => item.imageSrc !== imageSrc);
      saveCartToLocalStorage(cartItems);
      updatePrice(cartItems);
    })
  });

  // Change item
  const inputQuality = document.querySelectorAll('.product-quantity');
  inputQuality.forEach((item, index) => {
    item.addEventListener('change', () => {
      if (isNaN(item.value) || (item.value <= 1)) {
        item.value = 1;
      }

      // Cập nhật số lượng mới vào mảng cartItems
      cartItems[index].quantity = item.value;

      // Lưu lại giỏ hàng vào localStorage
      saveCartToLocalStorage(cartItems);

      updatePrice();
    })
  });

  updatePrice();
}

// Cap nhat gia tien
const updatePrice = () => {
  // const productRowEle = document.querySelectorAll('.product-row');
  let total = 0;
  // productRowEle.forEach((item) => {
  //   const priceEl = item.querySelector('.cart-price');
  //   const price = parseFloat(priceEl.innerHTML.replace('$', ' '));
  //   const quantity = item.querySelector('.product-quantity').value;

  //   total = total + (price * quantity)
  // })

  // Lặp qua mỗi sản phẩm trong giỏ hàng
  cartItems.forEach((item) => {
    const price = parseFloat(item.price.replace('$', ' '));
    const quantity = parseInt(item.quantity);

    // Tính toán tổng giá tiền cho từng sản phẩm
    total += price * quantity;
  });

  document.querySelector('.total-price').innerHTML = total;
  document.querySelector('.cart-quantity').innerHTML = cartItems.length;
}

window.addEventListener('DOMContentLoaded', () => {
  const cartItems = getCartFromLocalStorage();
  addItemToCart(cartItems);
});