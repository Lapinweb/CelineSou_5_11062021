createListOfItems()


async function createListOfItems(){
    const items = await getItems();
    for (item of items){
        displayItem(item)
    }
}

function getItems() {
    return fetch("http://localhost:3000/api/teddies")
        .then(function(res){
            if (res.ok){
                return res.json();
            }
        })
        .then(function(items){
            return items;
        })
        .catch(function(error){
            alert(error)
        })
}


function displayItem(item){
    const imageUrl = item.imageUrl;
    const name = item.name;
    const price = item.price/100;
    const description = item.description;

    const itemTemplate = document.getElementById("item-card");
    const itemClone = document.importNode(itemTemplate.content, true);

    const image = itemClone.getElementById("image");
    image.setAttribute("src", imageUrl);
    itemClone.getElementById("name").textContent = name;
    itemClone.getElementById("price").textContent = price.toFixed(2);
    itemClone.getElementById("description").textContent = description;

    document.getElementById("items-list").appendChild(itemClone);
}