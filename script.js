/* ===============================
   SCROLL REVEAL ANIMATION
================================ */

function revealOnScroll() {

    const reveals = document.querySelectorAll(".reveal");

    reveals.forEach(function(item){

        const windowHeight = window.innerHeight;
        const elementTop = item.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            item.classList.add("active");
        }

    });

}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);



/* ===============================
   PRODUCT FILTER SYSTEM
================================ */

const subCategories = {

    CNC: ["All","Controller","Relay"],

    Conventional: ["All","Fan","Lamp","Relay"],

    Industrial: ["All","Dust","Fan","Lamp"]

};



/* UPDATE SUB CATEGORY */

function updateSubCategory(){

    const main = document.getElementById("mainCategory").value;
    const sub = document.getElementById("subCategory");

    sub.innerHTML = "";

    /* If ALL selected */

    if(main === "all"){

        const option = document.createElement("option");
        option.value = "all";
        option.text = "All";

        sub.appendChild(option);

        filterProducts();
        return;
    }

    /* Load sub categories */

    subCategories[main].forEach(function(item){

        const option = document.createElement("option");

        option.value = item;
        option.text = item;

        sub.appendChild(option);

    });

    filterProducts();
}



/* FILTER PRODUCTS */

function filterProducts(){

    const main = document.getElementById("mainCategory").value;
    const sub = document.getElementById("subCategory").value;

    const products = document.querySelectorAll(".product-card");

    products.forEach(function(card){

        const productMain = card.getAttribute("data-main");
        const productSub = card.getAttribute("data-sub");

        if(
            (main === "all" || productMain === main) &&
            (sub === "all" || sub === "All" || productSub === sub)
        ){
            card.style.display = "block";
        }
        else{
            card.style.display = "none";
        }

    });

}