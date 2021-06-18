const { get } = require("http");

createBasketList();

//Générer le contenu de la page dynamiquement
async function createBasketList() {
    let basketContent = await getBasketContent();
    console.log("basketContent :", basketContent)

    //si le panier est vide, on affiche un message et on cache le formulaire
    if (basketContent.length === 0) {
        displayEmptyBasket();
        hideForm();

    //sinon on affiche la liste des produits avec le prix total
    }else{       
        for (let item of basketContent) {
            displayBasketItem(item);
        }

        let totalPrice = calculateTotalPrice(basketContent);
        displayTotalPrice(totalPrice);
        
        //La fonction est ajouté après que les boutons soient créé pour être fonctionnelle
        buttonRemoveItem(basketContent);
    }
}

//---------------------------------------------------- Afficher la liste des produits dans le panier et son prix total ---------------------------------------------------------------//

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




//------------------------------------------------------------------- Retirer les produits du panier ------------------------------------------------------------------------//

//Bouton supprimer un article, la fonction doit être appelé après la création des boutons pour être fonctionnelle 
function buttonRemoveItem(basketContent) {
    //Récupérer le tableau de tous les éléments des boutons
    let removeButtons = document.getElementsByClassName("btn-remove");

    //une boucle pour écouter tous les événements de click du boutons
    for (let i = 0; i < removeButtons.length; i++) { //i = indice du produit dans le tableau removeButtons mais aussi basketContent
        removeButtons[i].addEventListener("click", function(event){
            //Enlever l'objet du tableau, avec i qui nous donne l'indice
            basketContent.splice(i, 1);

            //Renvoyer le tableau à localStorage
            localStorage.setItem("basketContent", JSON.stringify(basketContent)); 

            //Actualiser la page
            location.reload();

            //Message article supprimé
            alert("L'article a été supprimé.")
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


//-------------------------------------------------- Formulaire de contact -----------------------------------------------------------------------------------------------//

//Cacher le formulaire si le panier est vide
function hideForm(){
    const form = document.getElementById("form");
    form.classList.add("d-none");
}


//Vérifier les données du formulaire

//Valeurs correspondant aux éléments input
const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAddress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputEmail = document.getElementById("email");

const formInputs = [inputFirstName, inputLastName, inputAddress, inputCity, inputEmail];


//La valeur validateForm est true par défaut et devient false dès qu'une valeur d'input est erroné;
let validateForm = true;


//Fonction pour vérifier la valeur de input avec une regex
function checkInputValue(input, regex) {
    input.addEventListener("input", function(){
        if (regex.test(input.value) === false) {
            validateForm = false;
            console.log("validateForm checkInputValue:", validateForm);

            //changer l'apparence de l'input pour montrer un champ erroné
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
        }else{
            validateForm = true;
            console.log("validateForm checkInputValue:", validateForm);

            //changer l'apparence de l'input pour montrer un champ correctement remplie
            input.classList.add("is-valid");
            input.classList.remove("is-invalid");
        }
    })
}

//Appeler la fonction avec le input et le regex correspondant
checkInputValue(inputFirstName, /^[a-zA-ZéèêôîïÉÈÊ\s-]{2,20}$/);
checkInputValue(inputLastName, /^[a-zA-ZéèêôîïÉÈÊ\s-]{2,20}$/);
checkInputValue(inputAddress, /^[a-zA-Z0-9éèêôîïÉÈÊ\s-]{3,20}$/);
checkInputValue(inputCity, /^[a-zA-ZéèêôîïÉÈÊ\s-]{3,20}$/);
checkInputValue(inputEmail, /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/);


//Envoyer les données du formulaire

//Au click du bouton, on vérifie si le formulaire est valide
document.getElementById("form-btn").addEventListener("click", function(event){
    event.preventDefault(); //le comportement par défaut du bouton est désactivé

    //signaler si les champs ne sont pas remplies
    for (let input of formInputs) {
        //si au moins un champ n'est pas rempli, le formulaire n'est pas valide, validateForm = false
        if (!input.value) {
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
            validateForm = false;
            console.log("validateForm champs vide :", validateForm);
        }
    }

    console.log("validateForm final :", validateForm);

    //le formulaire est validé si validateForm = true
    if (validateForm === true) {
        //envoyer les données au serveur
        sendToServer();

    }else{
        //si le formulaire n'est pas valide, on affiche une alerte
        alert("Les champs ne sont pas valides.");
    }
});

//Envoyer Les donnée aux serveur
async function sendToServer() {
        //récupérer les valeurs du formulaire dans l'objet contact
        let contact = await getFormValues();
        console.log("contact :")

        //récupérer le tableau de produits
        let products = getItemId();

        //faire une requête POST

}

//Récupérer les valeurs du formulaire dans un objet
function getFormValues(contact) {
    contact = {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAddress.value,
        city: inputCity.value,
        email: input.value
    }
    return contact
}

//Récupérer le tableau de produits
async function getItemId(){
    //on récupère la liste de produits du localStorage
    let basketContent = await getBasketContent();
    let itemsId = [];
    for (item of basketContent) {
        itemsId.push(item._id)
    }
    return itemsId;
}