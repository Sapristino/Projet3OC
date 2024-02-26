const form = document.querySelector('form');

// Soumission du formulaire //
form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
            email: email,
            password: password
        };

        // Envoi des données à l'API //
    try {
        const resp = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!resp.ok) {
            throw new Error("Erreur lors de la requête API");
        }

        const respData = await resp.json ();
        console.log(respData);

        const token = respData.token;

        if (token) {
            localStorage.setItem("token", token);
            window.location.href = "index.html";
        }
        //Gestion erreur //
    } catch (error) {
        console.error(error);
        MsgErreur("Erreur dans l’identifiant ou le mot de passe");
    }
});

function MsgErreur(ErreurMessage) {
    const Erreur = document.getElementById("Erreur");
    Erreur.textContent = ErreurMessage;
}