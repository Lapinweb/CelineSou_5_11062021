
createBasketList();

//Créer la liste des éléments du panier automatiquement
async function createBasketList() {
    let basketContent = await getBasketContent();
    console.log("basketContent :", basketContent)

    if (basketContent.length === 0) {
        displayEmptyBasket();
        hideForm();

    }else{       
        for (let item of basketContent) {
            displayBasketItem(item);
        }

        let totalPrice = calculateTotalPrice(basketContent);
        displayTotalPrice(totalPrice);
        
        //La fonction est ajouté après que les boutons un article soient créé pour être fonctionnelle
        buttonRemoveItem(basketContent);
    }
}

/////////////////////////////////////////////// Afficher la liste des produits dans le panier et son prix total /////////////////////////////////////////////////////////////////////

//Afficher un message si le panier est vide
function displayEmptyBasket() {
    const messageTemplate = document.getElementById("message-emptybasket");
    const messageClone = document.importNode(messageTemplate.content, true);

    document.getElementById("message-empty").appendChild(messageClone);
}

//Récupérer le contenu du panier dans le localStorage
function getBasketContent() {
    if (!localStorage.getItem("basketContent")) {
        return [];
    }else{
        let basketContent = JSON.parse(localStorage.getItem("basketContent"));

        console.log("basketContent :", basketContent)

        return basketContent;
    }
}

//Ajouter des éléments HTML pour créer une carte avec les détails du produit
function displayBasketItem(item) {
    const imageUrl = item.imageUrl;
    const name = item.name;
    const price = item.price/100; //convertie le prix en euros
    const option = item.selectedOption;

    //Récupérer la template dans le code HTML
    const basketTemplate = document.getElementById("basket-template");
    const basketClone = document.importNode(basketTemplate.content, true);

    //Modifier la template avec des variables
    const image = basketClone.getElementById("image");
    image.setAttribute("src", imageUrl);
    basketClone.getElementById("name").textContent = name;
    basketClone.getElementById("price").textContent = price.toFixed(2) + "€"; //Affiche 2 décimales (les centimes)
    basketClone.getElementById("option").textContent = "Option : " + option;

    //Ajouter un élément en utilisant la template
    document.getElementById("basket-list").appendChild(basketClone);
}

//Calculer le prix total
function calculateTotalPrice(listOfItems) {
    let totalPrice = 0
    for (item of listOfItems) {
        totalPrice += item.price
    }
    totalPrice /= 100;
    console.log("prix total =", totalPrice.toFixed(2), "€")
    return totalPrice
}

//Afficher le prix total
function displayTotalPrice(price) {
    document.getElementById("total-price").textContent = "Prix total : " + price.toFixed(2) + "€";
}




///////////////////////////////////////////////////////////// Retirer les produits du panier /////////////////////////////////////////////////////////////////////////////

//Bouton supprimer un article, la fonction doit être appelé après la création des boutons pour être fonctionnelle 
function buttonRemoveItem(basketContent) {
    //Récupérer le tableau de tout les éléments des boutons
    const removeButtons = document.getElementsByClassName("btn-remove"); 

    //une boucle pour écouter tous les événements de click du boutons
    for (let i = 0; i < removeButtons.length; i++) { //i = indice du produit dans le tableau removeButtons mais aussi basketContent
        removeButtons[i].addEventListener("click", function(event){
            //Enlever l'objet du tableau, avec i qui nous donne l'indice
            basketContent.splice(i, 1);

            //Renvoyer le tableau à localStorage
            localStorage.setItem("basketContent", JSON.stringify(basketContent)); 

            //Actualiser la page
            location.reload();
        })
    }    
}

//Bouton vider le panier
document.getElementById("btn-emptybasket").addEventListener("click", function(){
    //Vider le localStorage
    localStorage.clear("basketContent");

    //Actualiser la page
    location.reload();

    //Message panier vide
    alert("Le panier a été vidé.");
})


///////////////////////////////////////////////////////////////////// Formulaire de contact ///////////////////////////////////////////////////////////////////////////////////////

//Cacher le formulaire si le panier est vide
function hideForm(){
    const form = document.getElementById("form");
    form.classList.add("d-none");
}