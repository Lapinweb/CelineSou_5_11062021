//Récupérer les données du localStorage
let totalPrice = JSON.parse(localStorage.getItem("totalPrice")); //parse convertie le json en javascript
let orderId = JSON.parse(localStorage.getItem("orderId"));


//Afficher les valeurs dans le HTML
document.getElementById("order-id").textContent = "Commande n° : " + orderId;
document.getElementById("total-price").textContent = "Prix Total : " + totalPrice.toFixed(2) + "€";


//Vider le localStorage
localStorage.clear("basketContent"); //vide le panier
localStorage.clear("orderId"); //supprime l'ID de commande
localStorage.clear("totalPrice"); //supprime le prix total