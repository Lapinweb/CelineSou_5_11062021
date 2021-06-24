createListOfItems()

//Créer la liste des produits automatiquement
async function createListOfItems(){
    const items = await getItems();
    for (item of items){
        displayItem(item)
    }
}

//Récupérer le tableau contenant toutes les données des produit grâce à une requête GET
function getItems() {
    return fetch("http://localhost:3000/api/teddies")
        .then(function(res){
            if (res.ok){
                return res.json(); //le json est converti en Javascript
            }
        })
        .then(function(items){
            return items;
        })
        .catch(function(error){
            alert(error)
        })
}

//Ajouter des éléments aux HTML pour créer une carte avec toutes les infos du produit
function displayItem(item){
    const imageUrl = item.imageUrl;
    const name = item.name;
    const price = item.price/100; //convertie le prix en euros
    const description = item.description;
    const id = item._id;

    //Récupérer la template dans le HTML
    const itemTemplate = document.getElementById("item-card");
    const itemClone = document.importNode(itemTemplate.content, true);

    //Modifier la template avec des variables
    const image = itemClone.getElementById("image");
    image.setAttribute("src", imageUrl);
    itemClone.getElementById("name").textContent = name;
    itemClone.getElementById("price").textContent = price.toFixed(2) + "€"; //affiche 2 décimales qui représentent les centimes
    itemClone.getElementById("description").textContent = description;
    itemClone.getElementById("item-link").setAttribute("href", "produit.html?id=" + id); //rajoute le paramètre id derrière l'URL vers la page produit

    //Ajouter un élément en utilisant la template
    document.getElementById("items-list").appendChild(itemClone);
}