// Sélection des éléments du DOM
const btnCart = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const btnClose = document.querySelector('#cart-close');
const exp = document.getElementById("boutonwel");
const cont = document.querySelector('.container');
const notif = document.querySelector('.notif');

// Écouteurs d'événements pour le bouton de panier et le bouton de fermeture
btnCart.addEventListener('click', () => {
  // Lorsque le bouton de panier est cliqué, ajoute la classe 'cart-active' pour afficher le panier
  cart.classList.add('cart-active');
});


btnClose.addEventListener('click', () => {
  // Lorsque le bouton de fermeture du panier est cliqué, supprime la classe 'cart-active' pour masquer le panier
  cart.classList.remove('cart-active');
});

// Écouteur d'événement lorsque le contenu de la page est chargé
document.addEventListener('DOMContentLoaded', loadFood);

// Fonction pour charger le contenu initial
function loadFood() {
  loadContent();
}

// Fonction pour charger le contenu
function loadContent() {
  // Ajout d'écouteurs d'événements pour supprimer des éléments du panier
  let btnRemove = document.querySelectorAll('.cart-remove');
  btnRemove.forEach((btn) => {
    btn.addEventListener('click', removeItem);
  });

  // Ajout d'écouteurs d'événements pour changer la quantité des articles dans le panier
  let qtyElements = document.querySelectorAll('.cart-quantity');
  qtyElements.forEach((input) => {
    input.addEventListener('change', changeQty);
  });

  // Ajout d'écouteurs d'événements pour ajouter des articles au panier
  let cartBtns = document.querySelectorAll('.add-cart');
  cartBtns.forEach((btn) => {
    btn.addEventListener('click', addCart);
    

  });

  // Met à jour le montant total du panier
  updateTotal();
}

// Fonction pour supprimer un article du panier
function removeItem() {
  let title = this.parentElement.querySelector('.cart-food-title').innerHTML;
  itemList = itemList.filter((el) => el.title != title);
  this.parentElement.remove();
  loadContent();
}

// Fonction pour changer la quantité d'un article dans le panier
function changeQty() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  loadContent();
}

// Tableau pour stocker les articles du panier
let itemList = [];

// Fonction pour ajouter un article au panier
function addCart() {
  let food = this.parentElement;
  let title = food.querySelector('.food-title').innerHTML;
  let price = food.querySelector('.food-price').innerHTML;
  let imgSrc = food.querySelector('.food-img').src;

  let newProduct = { title, price, imgSrc };

// Définissez la condition pour contrôler quand vous voulez arrêter d'ajouter des produits
let continueAddingProducts = true;

// Utilisez une boucle while pour ajouter des produits tant que la condition est vraie
while (continueAddingProducts) {
  // Vérifiez si le produit est déjà dans le panier
  if (itemList.find((el) => el.title === newProduct.title)) {
    continueAddingProducts = false; // Arrêtez la boucle si le produit est déjà dans le panier
  } else {
    itemList.push(newProduct);
    // Afficher une notification pour indiquer que l'article a été ajouté au panier
    showNotification(`"${newProduct.title}" a été ajouté au panier.`);
  }
}


  let newProductElement = createCartProduct(title, price, imgSrc);
  let element = document.createElement('div');
  element.innerHTML = newProductElement;
  let cartBasket = document.querySelector('.cart-content');
  cartBasket.append(element);
  loadContent();
}

// Fonction pour créer la structure HTML d'un article dans le panier
function createCartProduct(title, price, imgSrc) {
  return `
    <div class="cart-box">
      <img src="${imgSrc}" class="cart-img">
      <div class="detail-box">
        <div class="cart-food-title">${title}</div>
        <div class="price-box">
          <div class="cart-price">${price}</div>
          <div class="cart-amt">${price}</div>
        </div>
        <input type="number" value="1" class="cart-quantity">
      </div>
      <ion-icon name="trash" class="cart-remove"></ion-icon>
    </div>
  `;
}

// Fonction pour mettre à jour le montant total du panier
function updateTotal() {
  const cartItems = document.querySelectorAll('.cart-box');
  const totalValue = document.querySelector('.total-price');

  let total = 0;

  cartItems.forEach((product) => {
    let priceElement = product.querySelector('.cart-price');
    let price = parseFloat(priceElement.innerHTML.replace("$", ""));
    let qty = product.querySelector('.cart-quantity').value;
    total += price * qty;
    product.querySelector('.cart-amt').innerText = "$" + price * qty;
  });

  totalValue.innerHTML = total + '$';

  // Met à jour le nombre de produits dans l'icône du panier
  const cartCount = document.querySelector('.cart-count');
  let count = itemList.length;
  cartCount.innerHTML = count;

  if (count == 0) {
    cartCount.style.display = 'none';
  } else {
    cartCount.style.display = 'block';
  }
}

// Récupère les éléments à filtrer
var foodItems = document.querySelectorAll('.food-box1, .food-box2, .food-box3');

// Récupère l'élément champ de recherche
var searchInput = document.getElementById('example-search-input');

// Ajoute un gestionnaire d'événement pour le champ de recherche
searchInput.addEventListener('input', function () {
  var filter = searchInput.value.toLowerCase();

  // Parcourt tous les éléments de la liste
  foodItems.forEach(function (item) {
    var titleElement = item.querySelector('.food-title');
    var titleText = titleElement.textContent.toLowerCase();

    // Vérifie si le texte du titre correspond au filtre
    if (titleText.indexOf(filter) !== -1) {
      item.style.display = 'block'; // Affiche l'élément
    } else {
      item.style.display = 'none'; // Masque l'élément
    }
  });
});

// Récupère les boutons de catégorie
var btnAll = document.getElementById('art1');
var btnCobra = document.getElementById('art2');
var btnReptile = document.getElementById('art3');
var btnMangouste = document.getElementById('art4');

// Ajoute un gestionnaire d'événement pour le bouton "Tout"
btnAll.addEventListener('click', function () {
  foodItems.forEach(function (item) {
    item.style.display = 'block';
  });
});

// Ajoute un gestionnaire d'événement pour le bouton "Cobra"
btnCobra.addEventListener('click', function () {
  foodItems.forEach(function (item) {
    if (item.classList.contains('food-box1')) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
});

// Ajoute un gestionnaire d'événement pour le bouton "Reptile"
btnReptile.addEventListener('click', function () {
  foodItems.forEach(function (item) {
    if (item.classList.contains('food-box2')) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
});

// Ajoute un gestionnaire d'événement pour le bouton "Mangouste"
btnMangouste.addEventListener('click', function () {
  foodItems.forEach(function (item) {
    if (item.classList.contains('food-box3')) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
});

// Liste des éléments déjà saisis
const elementsSaisis = ["élément1", "élément2", "élément3"]; // Remplacez par vos propres éléments saisis

// Fonction pour remplir la liste déroulante (datalist)
function remplirDatalist() {
    const datalist = document.getElementById('saisis');
    datalist.innerHTML = ''; // Effacez la liste déroulante actuelle

    // Ajoutez chaque élément saisi à la liste déroulante
    elementsSaisis.forEach(function(element) {
        const option = document.createElement('option');
        option.value = element;
        datalist.appendChild(option);
    });
}
const imageContainers = document.querySelectorAll('.pic');

imageContainers.forEach((container) => {
    const stars = container.querySelectorAll('.star');
    const ratingContainer = container.querySelector('.rating .rating');
    let selectedRating = 0;

    stars.forEach((star) => {
        star.addEventListener('mouseover', () => {
            const rating = star.getAttribute('data-rating');
            highlightStars(stars, rating);
        });

        star.addEventListener('click', () => {
            selectedRating = star.getAttribute('data-rating');
            ratingContainer.textContent = selectedRating;
        });

        star.addEventListener('mouseout', () => {
            highlightStars(stars, selectedRating);
        });
    });

    function highlightStars(stars, rating) {
        stars.forEach((star) => {
            if (star.getAttribute('data-rating') <= rating) {
                star.style.color = 'gold';
            } else {
                star.style.color = 'gray';
            }
        });
    }
});
// notification.js
// notification.js

// Fonction pour afficher la fenêtre modale de notification
function showNotification(message) {
  const modal = document.querySelector('.modal');
  const notificationMessage = document.getElementById('notification-message');

  notificationMessage.textContent = message;
  modal.style.display = 'block';

  // Définir un délai de 5 secondes (5000 millisecondes) pour masquer la fenêtre modale
  setTimeout(() => {
    modal.style.display = 'none';
  }, 3000);
}

// Sélectionnez tous les éléments des classes "food-box1", "food-box2" et "food-box3"
const foodBoxes = document.querySelectorAll('.food-box1, .food-box2, .food-box3');

// Sélectionnez la modal et ses éléments
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close2');
const prevImageBtn = document.getElementById('prev-image');
const nextImageBtn = document.getElementById('next-image');
let currentIndex = 0; // Indice de l'image actuelle

// Ajoutez un gestionnaire d'événements à chaque élément des classes "food-box1", "food-box2" et "food-box3"
foodBoxes.forEach((foodBox, index) => {
  foodBox.addEventListener('click', () => {
    currentIndex = index; // Définissez l'indice de l'image actuelle
    showImageAtIndex(currentIndex);
    modal.style.display = 'block'; // Affichez la modal
  });
});

// Fonction pour afficher l'image à un indice donné
function showImageAtIndex(index) {
  // Récupérez l'image à l'indice spécifié
  const foodImage = foodBoxes[index].querySelector('.food-img');
  const imageSrc = foodImage.src;

  // Définissez la source de l'image dans la modal
  modalImage.src = imageSrc;
}

// Gestionnaire d'événements pour le bouton "Précédent"
prevImageBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showImageAtIndex(currentIndex);
  }
});

// Gestionnaire d'événements pour le bouton "Suivant"
nextImageBtn.addEventListener('click', () => {
  if (currentIndex < foodBoxes.length - 1) {
    currentIndex++;
    showImageAtIndex(currentIndex);
  }
});

// Ajoutez un gestionnaire d'événements pour fermer la modal
modalClose.addEventListener('click', () => {
  modal.style.display = 'none'; // Fermez la modal en la masquant
});





