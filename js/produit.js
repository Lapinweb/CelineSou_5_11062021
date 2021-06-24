//Créer une valeur qui contient l'ID du produit
const id = getId();

///Récupérer la chaine de l'id dans l'URL
function getId(){
    const param = window.location.search;

    return param.replace("?id=", ""); //enlève les caractères inutilisés devant l'id
}


//----------------------------------------------------Afficher de manière dynamique l'élément sélectionné-------------------------------------------------------

//Créer le contenu de l'élément avec les infos du produit et les options de personnalisation
createItemElement();

async function createItemElement(){
    const item = await getOneItem();

    displayItemInfo(item);

    for (color of item.colors) //boucle pour chaque options de personnalisation
    addCustomOption(color);
}

//Récupérer les données du produit grâce à son ID avec une requête GET
function getOneItem(){
    return fetch("http://localhost:3000/api/teddies/" + id)
        .then(function(res){
            if(res.ok) {
                return res.json();
            }
        })
        .then(function(item){
            return item;
        })
        .catch(function(err){
            alert(error);
        })
}

//Ajouter des éléments aux HTML pour afficher les infos du produits
function displayItemInfo(item){
    const imageUrl = item.imageUrl;
    const name = item.name;
    const price = item.price/100; //convertie le prix en euros
    const description = item.description;

    const image = document.getElementById("image");
    image.setAttribute("src", imageUrl);
    document.getElementById("name").textContent = name;
    document.getElementById("price").textContent = price.toFixed(2) + "€"; //rajoute 2 décimales qui représentent les centimes
    document.getElementById("description").textContent = description;
}

//Ajouter une option de personnalisation dans le menu déroulant
function addCustomOption(option){
    //Créer un nouvel élément "option" rajouté au menu "select"
    const newOption = document.createElement("option");
    let optionMenu = document.getElementById("option-produit");
    optionMenu.appendChild(newOption);

    //Modifier le contenu de "option"
    newOption.textContent = option;
    newOption.setAttribute("value", option)
}




//---------------------------------------------------------Ajouter le produit au panier-------------------------------------------------------------------------


//Au click du bouton, le produit est ajouté au panier
const basketButton = document.getElementById("btn-basket");

basketButton.addEventListener("click", function(event){
    addToBasket();

    //afficher un message pour prévenir l'utilisateur
    alert("Le produit a été ajouté au panier."); 

});


async function addToBasket() {
    //requête GET du produit, l'objet est stocké dans la valeur item
    const item = await getOneItem();

    //Rajouter l'option de personnalisation sélectionné à l'objet item
    addSelectedOption(item);

    //on vérifie si le array basketContent existe déjà dans le localStorage
    if(!localStorage.getItem("basketContent")){
        createNewBasketContent(item);

    }else{
        getBasketContent(item);
    }

}

//Rajouter l'option de personnalisation à l'objet
function addSelectedOption(object){
    const selectionMenu = document.getElementById("option-produit");

    object.selectedOption = selectionMenu.value;
}

//Créer un array basketContent auquel on ajoute le produit
function createNewBasketContent(newItem){
    let basketContent = [newItem];

    //Envoyer vers le localStorage
    localStorage.setItem("basketContent", JSON.stringify(basketContent));
}

//Récupérer le array basketContent déjà existant pour rajouter un autre produit
function getBasketContent(newItem){
    let basketContent = JSON.parse(localStorage.getItem("basketContent"));
    basketContent.push(newItem);
    
    //Envoyer vers le localStorage
    localStorage.setItem("basketContent", JSON.stringify(basketContent));
}
