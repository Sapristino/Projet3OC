//!
//?
//TODO
//

// Intégration des travaux via fetch //

const gallery = document.getElementById("gallery")

/// fonction - Appel API avec fetch et intégration HTML ///
// Appel API works avec fetch
const getWorks = async () => {
    const res = await fetch("http://localhost:5678/api/works");
    const data = await res.json();
    gallery.innerHTML = "";

// Fonction - Ajout HTML selon data dans page accueil

    data.forEach(photo => {
        let conteneur = document.createElement("div");
        conteneur.classList.add("photo-conteneur");
        conteneur.classList.add("active");
        conteneur.dataset.category = photo.categoryId;

        let image = document.createElement("img");
        image.src = photo.imageUrl;

        let titre = document.createElement("p");
        titre.textContent = photo.title;

        conteneur.appendChild(image);
        conteneur.appendChild(titre);
        gallery.appendChild(conteneur);
    });
};

getWorks()
// Création d'un filtre dynamique selon code catégorie récupéré //
let filtres = document.querySelectorAll("#filtres div");

// Identification de la catégorie par l'ID
for(let filtre of filtres){
    filtre.addEventListener("click", function(){
        let tag = this.getAttribute("data-category");

        let figures = document.querySelectorAll("#gallery .photo-conteneur");

        for(let figure of figures){
            figure.classList.replace("active", "inactive");

            if(tag === figure.dataset.category || tag ==="0"){
                figure.classList.replace("inactive", "active");
            };
        };
    });
};

// fonction bouton actif
const boutonsFiltres = document.querySelectorAll('#filtres button');

    boutonsFiltres.forEach(bouton => {
        bouton.addEventListener('click', function() {
            // Supprimer la classe "filtre-actif" de tous les boutons
            boutonsFiltres.forEach(b => {
                b.classList.remove('filtre-actif');
                b.classList.add('filtre-inactif');
            });

            // Ajouter la classe "filtre-actif" uniquement au bouton cliqué
            this.classList.remove('filtre-inactif');
            this.classList.add('filtre-actif');
        });
    });


// Changements quand user connecté //
const token = localStorage.getItem('token');

// Masquer la div Filtre //
function MasquerFiltres() {
    if (token) {
        const divFiltres = document.querySelector('#filtres');
        const divBandeau = document.querySelector('.bandeau-edition');
        const divModal = document.querySelector('#modal')

        if (divFiltres) {
            divFiltres.classList.add('inactive');
            }
        if (divBandeau) {
            divBandeau.classList.remove('inactive');
            }
        if (divModal) {
            divModal.classList.remove('inactive')
        }
        }
    }
MasquerFiltres();

// Changement sur le nav "Login / Logout" //
function LogOut () {

    if (token) {
    const Log = document.querySelector(".Log");

        if(Log) {
            Log.textContent = "logout";

            Log.removeAttribute("href");

            Log.addEventListener("click", function () {
                localStorage.removeItem("token")
                location.reload();
                })

        }
    }
}
LogOut ();

// Appel des modales //
// Appel API works pour modale //

const modalGallery = document.getElementById("modal-gallery");
const confirmationModal = document.getElementById("confirmation-modal");
const previewImageDelete = document.getElementById("preview-img-supp");

const getModalWorks = async () => {
    try {
        const res = await fetch("http://localhost:5678/api/works");
        const data = await res.json();
        modalGallery.innerHTML = "";
        data.forEach(photoData => {
            modalGallery.innerHTML += `
                <figure data-${photoData.categoryId} class="active">
                    <img src=${photoData.imageUrl} alt=${photoData.title}>
                    <span class="js-delete" data-id="${photoData.id}"><i class="fa-solid fa-trash-can"></i></span>
                </figure>`;
        });

        document.querySelectorAll('.js-delete').forEach(span => {
            span.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                console.log(id)
                const photoData = data.find(photo => photo.id.toString() === id);
                if (photoData) {
                    openConfirmationModal(id, photoData);
                } else {
                    console.error("Données de l'image non trouvées.");
                }
            });
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
// Suppression //

const openConfirmationModal = (id, photoData) => {
    const confirmButton = confirmationModal.querySelector(".confirm");
    const cancelButton = confirmationModal.querySelector(".cancel");
    confirmButton.setAttribute("data-id", id);
    confirmationModal.style.display = "block";

    confirmButton.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        confirmDelete(id);
        getModalWorks();
        getWorks();
    });

    cancelButton.addEventListener('click', function () {
        previewImageDelete.innerHTML = '';
        confirmationModal.style.display = "none";
    });

    previewImageDelete.innerHTML += `
        <img src=${photoData.imageUrl} alt=${photoData.title}>
        <p class="title">Titre:</p>
        <p class="contenu-title">${photoData.title}</p> 
        <p class="category">Catégorie:</p>
        <p class="contenu-category">${photoData.category.name}</p>`;
};

const confirmDelete = (id) => {
    confirmationModal.style.display = "none";
    deleteWork(id);
};

const deleteWork = async (id) => {
    try {
        const res = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (res.ok) {
            console.log("Photo supprimée");
        } else {
            console.error("Erreur lors de la suppression");
        }
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
    }
};

getModalWorks()
// Ouverture et Fermeture Modale galerie via modifier //

const appelModal = document.getElementById("modal")
const modalGestion = document.querySelector(".modal-gestion")
const overlay = document.querySelector(".overlay")

appelModal.addEventListener("click", function() {
    modalGestion.classList.replace("inactive", "active");
    overlay.classList.replace("inactive", "active");
})

const fermetureModalGestion = document.querySelector(".gestion-xmark");

fermetureModalGestion.addEventListener("click", function () {
    modalGestion.classList.replace("active", "inactive")
    overlay.classList.replace("active", "inactive")
})

// Ouverture et Fermeture Modale ajout photo //

const appelAjoutPhoto = document.querySelector(".to-modalAjout")
const modalAjout = document.querySelector(".modal-ajout")
const Arrow = document.querySelector(".arrow")

appelAjoutPhoto.addEventListener("click", function () {
    modalAjout.classList.replace("inactive", "active");
    modalGestion.classList.replace("active", "inactive");
})

Arrow.addEventListener("click", function() {
    modalAjout.classList.replace("active", "inactive");
    modalGestion.classList.replace("inactive", "active")
})
const fermetureModalAjout = document.querySelector(".ajout-xmark");
fermetureModalAjout.addEventListener("click", function() {
    modalAjout.classList.replace("active", "inactive")
    overlay.classList.replace("active", "inactive")
})

// Ajout photo dans l'API //


const photoInput = document.getElementById("photoInput");
const previewImage = document.getElementById("previewImage");
const photoTitle = document.getElementById("photoTitle");
const photoCategory = document.getElementById("photoCategory");
const OpenFileButton = document.querySelector(".add-photo")
const valider = document.querySelector(".valider")
const img = document.querySelector(".img")
const jsSpe = document.querySelector(".js-spe")
const circleXmark = document.querySelector(".circleXmark")


OpenFileButton.addEventListener("click", function () {
    photoInput.click();
});

photoInput.addEventListener("change", function () {
    const file = this.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            previewImage.src = event.target.result;
            previewImage.classList.replace("inactive", "active");
        }
        reader.readAsDataURL(file);

    }
    circleXmark.classList.replace("inactive", "active");
    img.classList.replace("active", "inactive");
    jsSpe.classList.replace("active", "inactive");
    OpenFileButton.classList.replace("active", "inactive")
});

photoTitle.addEventListener("input", checkFields);
photoCategory.addEventListener("change", checkFields);
previewImage.addEventListener("load", checkFields);

function checkFields(){
    if (photoTitle.value.trim() !== "" && photoCategory.value.trim() !== "" && previewImage.classList.contains("active")) {
        valider.setAttribute("id", "green");
    } else {
        valider.removeAttribute("id", "green");
    }
}

valider.addEventListener("click", async function(event) {
    event.preventDefault();

    if(photoTitle.value.trim() === ""){
        alert("Veuillez entrer un titre pour la photo");
        return;
    }
    if (photoCategory.value.trim() === "" || photoCategory.value.trim() === "0") {
        alert("Veuillez sélectionner une catégorie pour la photo");
        return;
    }
    

    const formData = new FormData();
    formData.append("image", photoInput.files[0]);
    formData.append("title", photoTitle.value.trim());
    formData.append("category", photoCategory.value.trim());

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erreur HTTP, statut" + response.status);
        }

        const data = await response.json();
        console.log("Réponse de API", data);

        await getWorks();
        await getModalWorks();

    } catch (error) {
        console.error("Erreur lors de l envoi de la requête", error);
    }


    photoInput.value = "";
    previewImage.src = "#"
    previewImage.classList.replace("active", "inactive");
    img.classList.replace("inactive", "active")
    jsSpe.classList.replace("inactive", "active")
    OpenFileButton.classList.replace("inactive", "active")
    photoTitle.value = "";
    photoCategory.value = "";
    circleXmark.classList.replace("active", "inactive")

});

circleXmark.addEventListener("click", function(){
    previewImage.classList.replace("active", "inactive");
    img.classList.replace("inactive", "active");
    jsSpe.classList.replace("inactive", "active");
    OpenFileButton.classList.replace("inactive", "active");
    circleXmark.classList.replace("active", "inactive");

    photoInput.value = "";
    previewImage.src = "";
});

//fermeture modales sur click overlay //


// Fermeture de la modal gestion lorsque l'overlay est cliqué
overlay.addEventListener("click", function(event) {
    if (event.target === overlay) {
        modalGestion.classList.replace("active", "inactive");
        overlay.classList.replace("active", "inactive");
    }
});

// Fermeture de la modal ajout lorsque l'overlay est cliqué
overlay.addEventListener("click", function(event) {
    if (event.target === overlay) {
        modalAjout.classList.replace("active", "inactive");
        overlay.classList.replace("active", "inactive");
    }
});