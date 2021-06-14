//Récupérer la chaine de l'id dans l'URL
const param = window.location.search;
console.log("window.location.search :", param);

const id = param.replace("?id=", ""); //enlève les caractères inutilisés
console.log("id :" , id);

const urlId = "http://localhost:3000/api/teddies/" + id;
console.log("URL :", urlId);


//Créer le contenu de l'élément avec les infos du produit
createItemElement();

async function createItemElement(){
    const item = await getItem();
    displayItemInfo(item);
    for (color of item.colors)
    addCustomOption(color);
}


//Récupérer les données du produit grâce à son ID avec une requête GET
function getItem(){
    return fetch("http://localhost:3000/api/teddies/" + id)
        .then(function(res){
            if(res.ok) {
                return res.json();
            }
        })
        .then(function(item){
            console.log(item);
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
    let optionMenu = document.getElementById("colors");
    optionMenu.appendChild(newOption);

    //Modifier le contenu de "option"
    newOption.textContent = option;
    newOption.setAttribute("value", option.toLowerCase())
}