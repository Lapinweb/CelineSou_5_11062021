//Récupérer le contenu du panier dans le localStorage et le stocker dans une valeur
let basketContent = getBasketContent();

function getBasketContent() {
    if (!localStorage.getItem("basketContent")) {
        return []; //si le panier est vide, on retourne un tableau vide
    }else{
        let basketContent = JSON.parse(localStorage.getItem("basketContent"));

        return basketContent;
    }
}

//------------------------------------------------------------------- Afficher la liste des produits dans le panier --------------------------------------------------------------

//Générer le contenu de la page dynamiquement
createBasketList();

function createBasketList() {

    //si le panier est vide, on affiche un message et on cache le formulaire
    if (basketContent.length === 0) {
        displayEmptyBasket();
        hideForm();

    //sinon on affiche la liste des produits avec le prix total
    }else{       
        for (let item of basketContent) {
            displayBasketItem(item);
        }

        //La fonction des boutons pour supprimer l'article est ajouté après que les boutons sont créés pour être fonctionnelle
        buttonRemoveItem(basketContent);
    }
}

//Afficher un message si le panier est vide
function displayEmptyBasket() {
    const messageTemplate = document.getElementById("message-emptybasket");
    const messageClone = document.importNode(messageTemplate.content, true);

    document.getElementById("message-empty").appendChild(messageClone);
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


//------------------------------------------------------------------------Afficher le prix total du panier-------------------------------------------------------------------------

//Calculer le prix total
calculateTotalPrice(basketContent);

function calculateTotalPrice(listOfItems) {
    let totalPrice = 0
    for (item of listOfItems) {
        totalPrice += item.price
    }
    totalPrice /= 100;
    
    //Afficher le prix total sur la page
    document.getElementById("total-price").textContent = "Prix total : " + totalPrice.toFixed(2) + "€";

    //Srocker la valeur dans le localStorage
    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
}


//------------------------------------------------------------------- Retirer les produits du panier ------------------------------------------------------------------------

//Bouton supprimer un article, la fonction est appelé après la création des boutons pour être fonctionnelle 
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
            window.location.reload();

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
    window.location.reload();

    //Message panier vide
    alert("Le panier a été vidé.");
})


//--------------------------------------------------------------------- Formulaire de contact -----------------------------------------------------------------------------------------------

//Cacher le formulaire, la fonction est appelé lors de l'affichage des produits si le panier est vide
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

//Valeurs des regex
const regexFirstName = /^[a-zA-ZéèêôîïÉÈÊ\s-]{2,30}$/;
const regexLastName = /^[a-zA-ZéèêôîïÉÈÊ\s-]{2,30}$/;
const regexAddress = /^[a-zA-Z0-9éèêôîïÉÈÊ\s-]{3,}$/;
const regexCity = /^[a-zA-ZéèêôîïÉÈÊ\s-]{3,100}$/;
const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const inputRegex = [regexFirstName, regexLastName, regexAddress, regexCity, regexEmail];

//Fonction pour vérifier la valeur des input avec une regex et changer le style de manière dynamique
function changeInputStyle(input, regex) {
    input.addEventListener("input", function(){
        if (regex.test(input.value) === false) {
            //changer l'apparence de l'input pour montrer un champ erroné
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
        }else{
            //changer l'apparence de l'input pour montrer un champ correctement remplie
            input.classList.add("is-valid");
            input.classList.remove("is-invalid");
        }
    })
}

for (i = 0; i < formInputs.length; i++) {
    changeInputStyle(formInputs[i], inputRegex[i])
}


//Fonction pour valider la valeur de input
function validateInput(input, regex){
    if (regex.test(input.value) === true) {
        return true
    }else{
        return false
    }
}


//Envoyer les données du formulaire

//Au click du bouton, on vérifie si le formulaire est valide
document.getElementById("form-btn").addEventListener("click", function(event){
    event.preventDefault(); //le comportement par défaut du bouton est désactivé

    //on vérifie si au moment d'appuyer sur le bouton, les champs sont validés
    let validateFirstName = validateInput(inputFirstName, regexFirstName);
    let validateLastName = validateInput(inputLastName, regexLastName);
    let validateAddress = validateInput(inputAddress, regexAddress);
    let validateCity = validateInput(inputCity, regexCity);
    let validateEmail = validateInput(inputEmail, regexEmail);

    //le formulaire est validé si tous les champs sont validés
    if (validateFirstName && validateLastName && validateAddress && validateCity && validateEmail) {
        //récupérer les valeurs du formulaire dans l'objet contact
        let contact = getFormValues(); 
        
        //récupérer le tableau de produits
        let products = getItemId();
        
        //envoyer les données au serveur
        fetch("http://localhost:3000/api/teddies/order", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({contact, products}) //convertie les données au format json
        })
        .then(function(res){ //le serveur nous renvoie l'ID de commande et ce qu'on lui a envoyé
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(res){
            //on envoie l'ID de commande dans le localStorage
            localStorage.setItem("orderId", JSON.stringify(res.orderId));

            //on envoie l'utilisateur vers la page de confirmation
            window.location.assign("confirmation.html");
        })
        .catch(function(err){
            alert(error);
        })

    }else{
        //si un champ n'est pas rempli, on change son style
        for (let input of formInputs) {
            if (!input.value) {
                input.classList.add("is-invalid");
                input.classList.remove("is-valid");
            }
        }
        //si le formulaire n'est pas valide, on affiche une alerte
        alert("Tous les champs ne sont pas valides.");
    }
});

//Récupérer les valeurs du formulaire dans un objet
function getFormValues(contact) {
    contact = {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAddress.value,
        city: inputCity.value,
        email: inputEmail.value
    }
    return contact
}

//Récupérer les ID des produits et les mettre dans un tableau
function getItemId(){
    let itemsId = [];
    for (item of basketContent) {
        itemsId.push(item._id)
    }
    return itemsId;
}