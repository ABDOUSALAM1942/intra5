const btnCart = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const btnClose = document.querySelector('#cart-close');
const exp = document.getElementById("boutonwel");
const cont = document.querySelector('.container');
const notif = document.querySelector('.notif');
let cartBasket = document.querySelector('.cart-content');

// Écouteurs d'événements pour le bouton de panier et le bouton de fermeture
btnCart.addEventListener('click', () => {
  cart.classList.add('cart-active');
});

btnClose.addEventListener('click', () => {
  cart.classList.remove('cart-active');
});

// Fonction pour charger le contenu
function loadContent() {
  // Ajout d'écouteurs d'événements pour supprimer des éléments du panier
  let btnRemove = document.querySelectorAll('.cart-remove');
  btnRemove.forEach((btn) => {
    btn.addEventListener('click', removeItem);
    updateCartTotal()
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
  // Mettre à jour le montant total du panier
  updateTotal();
  // Appeler la fonction showNotification ici si nécessaire
}

function removeItem() {
  let title = this.parentElement.querySelector('.cart-food-title').innerHTML;
  this.parentElement.remove();
  itemList = itemList.filter((el) => el.title !== title);
  localStorage.setItem('cartItems', JSON.stringify(itemList));
  updateCartItemCount();
  showNotification('Suppression', `"${title}" a été supprimé du panier.`);
  updateTotal();
}
// Fonction pour changer la quantité d'un article dans le panier
function changeQty() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  // Mettez à jour le nombre d'articles dans le bouton du panier
  updateCartItemCount();
  updateTotal();
  loadContent();
}

// Tableau pour stocker les articles du panier
let itemList = [];

// Gestionnaire d'événements pour le bouton "addCart" des articles JSON
document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('add-cart')) {
    event.stopPropagation(); // Empêcher la propagation de l'événement
    const articleId = target.closest('.food-box1, .food-box2, .food-box3').dataset.articleId;
    addCart(articleId);
  }
});
function addCart(articleId) {
  let article = jsonData.find((item) => item.id === parseInt(articleId));
  if (!article) {
    return; // Quitter la fonction si l'article n'est pas trouvé
  }

  let title = article.nom;
  let price = article.prix + " $";
  let imgSrc = article.image;
  let newProduct = { title, price, imgSrc, quantity: 1 }; // Ajoutez la propriété quantity
  let existingProduct = itemList.find((item) => item.title === title);

  if (existingProduct) {
    // Si l'article existe déjà, incrémente simplement la quantité
    existingProduct.quantity += 1;
    showNotification('Quantité mise à jour', `"${title}" a été ajouté au panier. La quantité est maintenant de ${existingProduct.quantity}.`);
  } else {
    // Si l'article n'existe pas, ajoutez-le au panier
    itemList.push(newProduct);
    showNotification('Article ajouté', `"${title}" a été ajouté au panier.`);
  }

  // Mettre à jour le panier dans le localStorage
  localStorage.setItem('cartItems', JSON.stringify(itemList));
  updateCartItemCount();
  createCartProduct(itemList); // Mettez à jour l'affichage du panier
  updateTotal();
  loadContent();
}





// Fonction pour charger les articles du panier depuis le localStorage
function loadCartItems() {
  const savedCartItems = localStorage.getItem('cartItems');
  if (savedCartItems) {
    itemList = JSON.parse(savedCartItems);
    updateCartItemCount(); // Mettez à jour le compteur au chargement de la page
  }
}

// // updateCartItemCount au chargement de la page pour afficher le nombre d'articles initial :
// document.addEventListener('DOMContentLoaded', () => {
//   loadCartItems();
//   loadContent();
//   updateCartItemCount(); // Mettez à jour le compteur au chargement de la page
// });

// Fonction pour créer la structure HTML d'un article dans le panier
function createCartProduct(array) {
  cartBasket.innerHTML = "";
  if (array.length > 0) {
    array.forEach((el) => {
      cartBasket.innerHTML += `
        <div class="cart-box">
          <img src="${el.imgSrc}" class="cart-img">
          <div class="detail-box">
            <div class="cart-food-title">${el.title}</div>
            <div class="price-box">
              <div class="cart-price">${el.price}</div>
              <div class="cart-amt">$${(parseFloat(el.price.replace('$', '')) * el.quantity).toFixed(2)}</div>
            </div>
            <input type="number" value="${el.quantity}" class="cart-quantity">
          </div>
          <ion-icon name="trash" class="cart-remove"></ion-icon>
        </div>
      `;
    });

    // Mettez à jour le montant total du panier
    updateTotal();
  }
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
  totalValue.innerHTML = "$" + total.toFixed(2); // Utilisez toFixed pour afficher deux décimales
  updateCartItemCount();
}

// Fonction pour mettre à jour le nombre d'articles dans le bouton du panier
function updateCartItemCount() {
  const cartCount = document.querySelector('#cart-count');
  let itemCount = 0;
  console.log(updateCartItemCount);
  // Parcourir la liste d'articles dans le panier et additionner les quantités
  itemList.forEach((item) => {
    itemCount += item.quantity;
  });
  // Mettre à jour le contenu du bouton du panier avec le nombre d'articles
  cartCount.textContent = itemCount;
  // Afficher ou masquer le compteur en fonction du nombre d'articles
  if (itemCount > 0) {
    cartCount.style.display = 'block';
  } else {
    cartCount.style.display = 'none';
  }

  updateCartTotal();
}
// Fonction pour mettre à jour le total dans le bouton du panier
function updateCartTotal() {
  const cartTotal = document.querySelector('#cart-total');
  let total = 0;
  // Parcourir la liste d'articles dans le panier et additionner les montants
  itemList.forEach((item) => {
    total += parseFloat(item.price.replace('$', '')) * item.quantity;
  });
  // Mettre à jour le contenu du total dans le bouton du panier
  cartTotal.textContent = total.toFixed(2); // Arrondi à 2 décimales
}

const inputRecherche = document.getElementById("example-search-input");
inputRecherche.addEventListener("input", function () {
  // Récupérez la valeur saisie par l'utilisateur
  const recherche = inputRecherche.value.toLowerCase();

  // Filtrer les articles HTML
  const articlesHTML = document.querySelectorAll(".food-box1, .food-box2, .food-box3");
  articlesHTML.forEach(function (article) {
    const titre = article.querySelector(".food-title").textContent.toLowerCase();
    if (titre.includes(recherche)) {
      article.style.display = "block"; // Afficher l'article s'il correspond à la recherche
    } else {
      article.style.display = "none"; // Masquer l'article s'il ne correspond pas
    }
  });

  // Filtrer les articles JSON
  const articlesFiltres = articlesJSON.filter(function (article) {
    const titre = article.title.toLowerCase();
    return titre.includes(recherche);
  });

  // Mettez à jour votre interface utilisateur avec les résultats JSON (vous pouvez le personnaliser selon vos besoins)
  const resultatJSON = document.getElementById("resultat-json");
  resultatJSON.innerHTML = ""; // Effacez les résultats précédents
  articlesFiltres.forEach(function (article) {
    const articleDiv = document.createElement("div");
    articleDiv.textContent = article.title;
    resultatJSON.appendChild(articleDiv); // Ajoutez les résultats à votre interface utilisateur
  });
});


document.addEventListener("DOMContentLoaded", function () {
  loadCartItems();
  loadContent();
  updateCartItemCount(); // Mettez à jour le compteur au chargement de la page
  const allButton = document.getElementById("art1");
  const cobraButton = document.getElementById("art2");
  const reptileButton = document.getElementById("art3");
  const mangousteButton = document.getElementById("art4");

  const articles = document.querySelectorAll(".food-box1, .food-box2, .food-box3");
  function filterArticles(category) {
    articles.forEach((article) => {
      const articleCategory = article.classList.contains("food-box1")
        ? "food-box1"
        : article.classList.contains("food-box2")
          ? "food-box2"
          : "food-box3";
      const matchesCategory = category === "all" || articleCategory === category;
      article.style.display = matchesCategory ? "block" : "none";
    });

    // Filtrer également les éléments JSON
    jsonData.forEach((item) => {
      const itemElement = document.querySelector(`[data-article-id="${item.id}"]`);
      if (itemElement) {
        const matchesCategory = category === "all" || item.categorie === category;
        itemElement.style.display = matchesCategory ? "block" : "none";
      }
    });
  }

  allButton.addEventListener("click", () => filterArticles("all"));
  cobraButton.addEventListener("click", () => filterArticles("food-box1"));
  reptileButton.addEventListener("click", () => filterArticles("food-box2"));
  mangousteButton.addEventListener("click", () => filterArticles("food-box3"));

  filterArticles("all");
});


// Liste des éléments déjà saisis
const elementsSaisis = ["élément1", "élément2", "élément3"]; // Remplacez par vos propres éléments saisis

// Fonction pour remplir la liste déroulante (datalist)
function remplirDatalist() {
  const datalist = document.getElementById('saisis');
  datalist.innerHTML = ''; // Effacez la liste déroulante actuelle

  // Ajoutez chaque élément saisi à la liste déroulante
  elementsSaisis.forEach(function (element) {
    const option = document.createElement('option');
    option.value = element;
    datalist.appendChild(option);
  });
}

// notification.js

// Fonction pour afficher la fenêtre modale de notification
function showNotification(title, message) {
  const modal = document.getElementById('modaal');
  const notificationTitle = document.getElementById('notification-title');
  const notificationMessage = document.getElementById('notification-message');

  notificationTitle.textContent = title;
  notificationMessage.textContent = message;
  modal.style.display = 'block';

  // Définir un délai de 3 secondes (3000 millisecondes) pour masquer la fenêtre modale
  setTimeout(() => {
    modal.style.display = 'none';
  }, 2000);
}

// // Sélectionnez tous les éléments des classes "food-box1", "food-box2" et "food-box3"
// const foodBoxes = document.querySelectorAll('.pic');

// // Sélectionnez la modal et ses éléments
// const modal = document.getElementById('image-modal');
// const modalImage = document.getElementById('modal-image');
// const modalClose = document.getElementById('modal-close2');
// const prevImageBtn = document.getElementById('prev-image');
// const nextImageBtn = document.getElementById('next-image');
// let currentIndex = 0; // Indice de l'image actuelle

// // Ajoutez un gestionnaire d'événements à chaque élément des classes "food-box1", "food-box2" et "food-box3"
// foodBoxes.forEach((foodBox, index) => {
//   foodBox.addEventListener('click', () => {
//     currentIndex = index; // Définissez l'indice de l'image actuelle
//     showImageAtIndex(currentIndex);
//     modal.style.display = 'block'; // Affichez la modal
//   });
// });

// // Fonction pour afficher l'image à un indice donné
// function showImageAtIndex(index) {
//   // Récupérez l'image à l'indice spécifié
//   const foodImage = foodBoxes[index].querySelector('.food-img');
//   const imageSrc = foodImage.src;
//   // Définissez la source de l'image dans la modal
//   modalImage.src = imageSrc;
// }

// Sélectionnez tous les éléments des classes "food-box1", "food-box2" et "food-box3"
const foodBoxes = document.querySelectorAll('.pic');

// Sélectionnez la modal et ses éléments
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close2');
const prevImageBtn = document.getElementById('prev-image');
const nextImageBtn = document.getElementById('next-image');
let currentIndex = 0; // Indice de l'image actuelle

// // Ajoutez un gestionnaire d'événements à chaque élément des classes "food-box1", "food-box2" et "food-box3"
// foodBoxes.forEach((foodBox, index) => {
//   // Modifiez le sélecteur pour cibler directement ".food-img"
//   const foodImage = foodBox.querySelector('.food-img');

//   foodImage.addEventListener('click', () => {
//     currentIndex = index; // Définissez l'indice de l'image actuelle
//     showImageAtIndex(currentIndex);
//     modal.style.display = 'block'; // Affichez la modal
//   });
// });

function showImageAtIndex(index) {
  const article = jsonData.find((item) => item.id === index);
  const imageSrc = article.image;
  modalImage.src = imageSrc;
}

// Gestionnaire d'événements pour le bouton "Précédent"
prevImageBtn.addEventListener('click', () => {
  const prevIndex = findPrevIndex(currentIndex);
  if (prevIndex !== null) {
    currentIndex = prevIndex;
    showImageAtIndex(currentIndex);
  }
});

// Fonction pour trouver l'indice précédent dans les articles JSON
function findPrevIndex(currentIndex) {
  const currentIndexInArray = jsonData.findIndex((item) => item.id === currentIndex);
  if (currentIndexInArray > 0) {
    return jsonData[currentIndexInArray - 1].id;
  }
  return null;
}
// Gestionnaire d'événements pour le bouton "Suivant"
nextImageBtn.addEventListener('click', () => {
  const nextIndex = findNextIndex(currentIndex);
  if (nextIndex !== null) {
    currentIndex = nextIndex;
    showImageAtIndex(currentIndex);
  }
});

// Fonction pour trouver l'indice suivant dans les articles JSON
function findNextIndex(currentIndex) {
  const currentIndexInArray = jsonData.findIndex((item) => item.id === currentIndex);
  if (currentIndexInArray < jsonData.length - 1) {
    return jsonData[currentIndexInArray + 1].id;
  }
  return null;
}
// Ajoutez un gestionnaire d'événements pour fermer la modal
modalClose.addEventListener('click', () => {
  modal.style.display = 'none'; // Fermez la modal en la masquant
});


let jsonData = [
  {
    "id": 1,
    "nom": "Cobra7",
    prix: 90,
    "image": "./images/cobra7.jpeg",
    "filtres": ["Filtre 8", "Filtre 9"],
    "categorie": "food-box1",
    "rating": 0
  },
  {
    "id": 2,
    "rating": 0,
    "nom": "Reptile4",
    prix: 190,
    "image": "./images/reptile4.jpeg",
    "filtres": ["Filtre 8", "Filtre 9"],
    "categorie": "food-box2"
  },
  {
    "id": 3,
    "rating": 0,
    "nom": "Mangouste4",
    prix: 240,
    "image": "./images/Mangouste4.jpeg",
    "filtres": ["Filtre 10", "Filtre 11"],
    "categorie": "food-box3"
  },
  {
    "id": 4,
    "rating": 0,
    "nom": "Reptile5",
    prix: 140,
    "image": "./images/Reptile5.jpeg",
    "filtres": ["Filtre 8", "Filtre 9"],
    "categorie": "food-box2"
  },
  {
    "id": 5,
    "rating": 0,
    "nom": "Mangouste5",
    prix: 210,
    "image": "./images/Mangouste5.jpeg",
    "filtres": ["Filtre 10", "Filtre 11"],
    "categorie": "food-box3"
  },
  {
    "id": 6,
    "rating": 0,
    "nom": "Reptile6",
    prix: 135,
    "image": "./images/Reptile6.jpeg",
    "filtres": ["Filtre 10", "Filtre 11"],
    "categorie": "food-box2"
  },
  {
    "id": 7,
    "rating": 0,
    "nom": "Mangouste6",
    prix: 300,
    "image": "./images/Mangouste6.jpeg",
    "filtres": ["Filtre 10", "Filtre 11"],
    "categorie": "food-box3"
  },
  {
    "id": 8,
    "rating": 0,
    "nom": "Mangouste7",
    prix: 340,
    "image": "./images/Mangouste7.webp",
    "filtres": ["Filtre 10", "Filtre 11"],
    "categorie": "food-box3"
  },
  {
    "id": 9,
    "nom": "Cobra2",
    prix: 90,
    "image": "./images/cobra7.jpeg",
    "filtres": ["Filtre 8", "Filtre 9"],
    "categorie": "food-box1",
    "rating": 0
  }
]

function createFoodBox(article) {
  const foodBox = document.createElement("div");
  foodBox.classList.add("food-box1", "articles");
  foodBox.setAttribute("data-article-id", article.id);

  const picDiv = document.createElement("div");
  picDiv.classList.add("pic");

  const image = document.createElement("img");
  image.src = article.image;
  image.classList.add("food-img");

  const rating = document.createElement("div");
  rating.classList.add("rating");

  let selectedRating = 0; // Variable pour stocker le vote sélectionné
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.classList.add("star");
    star.setAttribute("data-rating", i);
    star.innerHTML = "&#9733"; // Utilisez innerHTML pour ajouter le symbole étoile sans le point-virgule

    star.addEventListener("click", (event) => {
      event.stopPropagation(); // Empêcher la propagation de l'événement
      // Gérer le clic sur une étoile
      selectedRating = parseInt(event.target.getAttribute("data-rating"));

      // Mettez à jour le style des étoiles pour refléter le vote
      updateRatingStars(rating, selectedRating);

      // Vous pouvez également effectuer d'autres actions ici en fonction du vote
      // Par exemple, envoyer le vote au serveur.
    });

    rating.appendChild(star);
  }
  const baima = document.createElement("div");
  baima.classList.add("baima", "d-flex", "my-3");

  const title = document.createElement("h2");
  title.classList.add("food-title");
  title.textContent = article.nom;

  const price = document.createElement("span");
  price.classList.add("food-price");
  price.textContent = article.prix + " $";

  const ionIcon = document.createElement("ion-icon");
  ionIcon.name = "cart";
  ionIcon.classList.add("add-cart");

  baima.appendChild(title);
  baima.appendChild(price);

  picDiv.appendChild(image);
  picDiv.appendChild(rating);

  foodBox.appendChild(picDiv);
  foodBox.appendChild(baima);
  foodBox.appendChild(ionIcon);

  // Ajoutez un gestionnaire d'événements à l'élément foodBox créé dynamiquement
  foodBox.addEventListener('click', () => {
    currentIndex = article.id; // Utilisez l'identifiant unique de l'article comme indice
    showImageAtIndex(currentIndex);
    modal.style.display = 'block';
  });

  return foodBox;
}

// Fonction pour mettre à jour le style des étoiles de notation
function updateRatingStars(ratingElement, selectedRating) {
  const stars = ratingElement.querySelectorAll(".star");
  stars.forEach((star, index) => {
    if (index < selectedRating) {
      star.classList.add("selected");
    } else {
      star.classList.remove("selected");
    }
  });
}

// Fonction pour créer et afficher les articles à partir des données JSON
function displayArticles(data) {
  const shopContent = document.querySelector(".shop-content");
  data.forEach((articleData) => {
    const foodBox = createFoodBox(articleData);
    shopContent.appendChild(foodBox);

    // Ajoutez un gestionnaire d'événements au bouton "Ajouter au panier" de chaque article
    const ionIcon = foodBox.querySelector('.add-cart');
    ionIcon.addEventListener('click', (event) => {
      event.stopPropagation(); // Empêchez la propagation de l'événement au conteneur parent
      addCart(articleData.id);
    });
  });
}

// Appel de la fonction pour afficher les articles à partir des données JSON
displayArticles(jsonData);
const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
createCartProduct(savedCartItems);

const ratingEtoi = document.querySelectorAll('.rating');
ratingEtoi.forEach((ratingElement, articleIndex) => {
  const stars = [...ratingElement.children].filter(child => child.className === "star");
  stars.forEach((star, starIndex) => {
    star.addEventListener('click', () => {
      stars.forEach((s, index) => {
        starIndex >= index ? s.classList.add('selected') : s.classList.remove('selected');
      });
      // Enregistrez les étoiles dans le localStorage pour chaque article
      const ratingData = Array.from(stars).map(s => s.classList.contains('selected'));
      localStorage.setItem(`userRating-${articleIndex}`, JSON.stringify(ratingData));
    });
    // Récupérez et initialisez les étoiles depuis le localStorage
    const userRatingData = JSON.parse(localStorage.getItem(`userRating-${articleIndex}`));
    if (userRatingData && userRatingData.length === stars.length) {
      if (userRatingData[starIndex]) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    }
  });
});

