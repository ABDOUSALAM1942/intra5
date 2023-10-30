const btnCart = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const btnClose = document.querySelector('#cart-close');
const exp = document.getElementById("boutonwel");
const cont = document.querySelector('.container');
const notif = document.querySelector('.notif');
let cartBasket = document.querySelector('.cart-content');

// Écouteurs d'événements pour le bouton de panier et le bouton de fermeture
btnCart.addEventListener('click', () => {
  // Lorsque le bouton de panier est cliqué, ajoutez la classe 'cart-active' pour afficher le panier
  cart.classList.add('cart-active');
});

btnClose.addEventListener('click', () => {
  // Lorsque le bouton de fermeture du panier est cliqué, supprimez la classe 'cart-active' pour masquer le panier
  cart.classList.remove('cart-active');
});

// // Écouteur d'événement lorsque le contenu de la page est chargé
// document.addEventListener('DOMContentLoaded', loadSnack);

// // Fonction pour charger le contenu initial
// function loadSnack() {
//   loadContent();
// }

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

function addCart() {
  let food = this.parentElement;
  let title = food.querySelector('.food-title').innerHTML;
  let price = food.querySelector('.food-price').innerHTML;
  let imgSrc = food.querySelector('.food-img').src;
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

// updateCartItemCount au chargement de la page pour afficher le nombre d'articles initial :
document.addEventListener('DOMContentLoaded', () => {
  loadCartItems();
  loadContent();
  updateCartItemCount(); // Mettez à jour le compteur au chargement de la page
});

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
// // Au chargement de la page, récupérez les données du localStorage s'il y en a
// window.onload = function () {
//   const storedItems = localStorage.getItem('cartItems');
//   if (storedItems) {
//     itemList = JSON.parse(storedItems);
//     // Mettez à jour le nombre d'articles dans le bouton du panier
//     updateCartItemCount();
//   }
// }

// // Récupère les éléments à filtrer
// var foodItems = document.querySelectorAll('.food-box1, .food-box2, .food-box3, .food-box');
// var searchInput = document.getElementById('example-search-input');
// searchInput.addEventListener('input', function () {
//   var filter = searchInput.value.toLowerCase();
//   // Parcourt tous les éléments de la liste
//   foodItems.forEach(function (item) {
//     var titleElement = item.querySelector('.food-title');
//     var titleText = titleElement.textContent.toLowerCase();
//     // Vérifie si le texte du titre correspond au filtre
//     if (titleText.indexOf(filter) !== -1) {
//       item.style.display = 'block'; // Affiche l'élément
//     } else {
//       item.style.display = 'none'; // Masque l'élément
//     }
//   });
// });

// Supposons que vous avez déjà chargé vos articles depuis un fichier JSON et les avez stockés dans une variable articlesJSON.

// Écoutez l'événement "input" sur l'élément de saisie de recherche

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

const imageContainers = document.querySelectorAll('.pic');

imageContainers.forEach((container) => {
  const stars = container.querySelectorAll('.star');
  const ratingContainer = container.querySelectorAll('.rating');
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


// Sélectionnez tous les éléments des classes "food-box1", "food-box2" et "food-box3"
const foodBoxes = document.querySelectorAll('.pic');

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

let jsonData = [
  {
    "id": 13,
    "nom": "Cobra7",
    prix: 90,
    "image": "./images/cobra7.jpeg",
    "filtres": ["Filtre 8", "Filtre 9"],
    "categorie": "food-box1",
    "rating": 0
  },
  {
    "id": 14,
    "rating": 0,
    "nom": "Reptile4",
    prix: 190,
    "image": "./images/reptile4.jpeg",
    "filtres": ["Filtre 8", "Filtre 9"],
    "categorie": "food-box2"
  },
  {
    "id": 15,
    "rating": 0,
    "nom": "Mangouste4",
    prix: 240,
    "image": "./images/Mangouste4.jpeg",
    "filtres": ["Filtre 10", "Filtre 11"],
    "categorie": "food-box3"
  },
  {
    "id": 16,
    "rating": 0,
    "nom": "Reptile5",
    prix: 140,
    "image": "./images/Reptile5.jpeg",
    "filtres": ["Filtre 8", "Filtre 9"],
    "categorie": "food-box2"
  },
  {
    "id": 17,
    "rating": 0,
    "nom": "Mangouste5",
    prix: 210,
    "image": "./images/Mangouste5.jpeg",
    "filtres": ["Filtre 10", "Filtre 11"],
    "categorie": "food-box3"
  },
  {
    "id": 18,
    "rating": 0,
    "nom": "Reptile6",
    prix: 135,
    "image": "./images/Reptile6.jpeg",
    "filtres": ["Filtre 10", "Filtre 11"],
    "categorie": "food-box2"
  },
  {
    "id": 19,
    "rating": 0,
    "nom": "Mangouste6",
    prix: 300,
    "image": "./images/Mangouste6.jpeg",
    "filtres": ["Filtre 10", "Filtre 11"],
    "categorie": "food-box3"
  },
  {
    "id": 20,
    "rating": 0,
    "nom": "Mangouste7",
    prix: 340,
    "image": "./images/Mangouste7.webp",
    "filtres": ["Filtre 10", "Filtre 11"],
    "categorie": "food-box3"
  },
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
  const shopContent = document.querySelector(".shop-content"); // La div avec la classe .shop-content

  data.forEach((articleData) => {
    const foodBox = createFoodBox(articleData);
    foodBox.classList.add('articles'); // Ajoutez la classe articles pour cacher initialement les éléments
    shopContent.appendChild(foodBox);
  });
}


// Appel de la fonction pour afficher les articles à partir des données JSON
displayArticles(jsonData);

const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
createCartProduct(savedCartItems);

document.addEventListener("DOMContentLoaded", function () {
  // Objet pour stocker les évaluations
  const ratings = {};

  function loadRatingsFromObject() {
    const articleElements = document.querySelectorAll(".food-box1, .food-box2, .food-box3");

    articleElements.forEach((articleElement) => {
      const articleId = articleElement.getAttribute("data-article-id");

      // Vérifie si une évaluation existe pour cet article dans le localStorage
      const storedRatings = JSON.parse(localStorage.getItem('ratings'));
      const rating = storedRatings && storedRatings[articleId] !== undefined
        ? storedRatings[articleId]
        : 0; // Utilise 0 comme valeur par défaut si l'évaluation n'existe pas

      // Mettre à jour l'évaluation depuis l'objet ratings
      const stars = articleElement.querySelectorAll(".star");
      stars.forEach((star, index) => {
        star.classList.toggle("rated", index < rating);
      });

      // Enregistrer l'évaluation dans l'objet ratings
      ratings[articleId] = rating;
    });
  }

  // Appel de la fonction pour charger les évaluations depuis le `localStorage`
  loadRatingsFromObject();

  // Gestionnaire d'événements pour les évaluations (étoiles)
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("star")) {
      const articleElement = event.target.closest(".food-box1, .food-box2, .food-box3");
      if (articleElement) {
        const articleId = articleElement.getAttribute("data-article-id");
        const rating = parseInt(event.target.getAttribute("data-rating"), 10);

        // Mettre à jour l'interface utilisateur
        const stars = articleElement.querySelectorAll(".star");
        stars.forEach((star, index) => {
          star.classList.toggle("rated", index < rating);
        });

        // Enregistrer l'évaluation dans l'objet ratings
        ratings[articleId] = rating;

        // Mettre à jour le localStorage avec les évaluations
        localStorage.setItem('ratings', JSON.stringify(ratings));
      }
    }
  });

});



