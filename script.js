const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];


cartBtn.addEventListener("click", function() {
  updateCartModal();
  cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function(event) {
  if(event.target === cartModal){
    cartModal.style.display = "none"
  }
})

closeModalBtn.addEventListener("click", function(){
  cartModal.style.display = "none"
})


menu.addEventListener("click", function(event) {
  // console.log(event.target)
  let parentButton = event.target.closest(".add-to-cart-btn")
  if(parentButton){
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))

  // adicionar no carrinho
    addToCart(name, price)
  }
})

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name)

  if(existingItem){
    existingItem.quantity += 1;
  }else{
    cart.push({
      name,
      price,
      quantity: 1,
    })
  }
  updateCartModal()
}

function updateCartModal(){
  cartItemsContainer.innerHTML = ""
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
    
    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-bold ">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-bold mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        <button class="text-red-600 remove-btn" data-name="${item.name}">
        Remover
        </button>
        
      </div>
      <hr class="mt-2" />
    `
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCount.innerHTML = cart.length;
    
}

// Função remove item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
  if(event.target.classList.contains("remove-btn")){
    const name = event.target.getAttribute("data-name")

    removeItemCart(name);
  }


})

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name);

  if(index !== -1){
    const item = cart[index];

    if(item.quantity > 1){
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function(event){
  let inputValue = event.target.value;

  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }


})

// Finalizar pedido
checkoutBtn.addEventListener("click", function(){
  const isOpen = checkLanchoneteOpen();
  if(!isOpen){
    Toastify({
      text: "Ops!!! A Lanchonete está fechada.",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #ff0000, #ff8000)",
      },
    }).showToast();

    return;
  }

  if(cart.length === 0) return;
  if(addressInput.value === ""){
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500")
    return;
  }

  //Enviar o pedido para api do WhatsApp Web
  const cartItems = cart.map((item) => {
    return (
      ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
    )
  }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "+5548991938543"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();

})

// Veririfcar a hora e manipular o card horário
function  checkLanchoneteOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 23;
  // true = Lanchonete está aberta 
}

const spanItem = document.getElementById("date-span")
const isOpen = checkLanchoneteOpen();

if(isOpen){
  spanItem.classList.remove("br-red-500")
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}