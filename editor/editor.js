/**
 * editor/editor.js: the main code that runs what is referred to as the "editor"
 * in the documentation
 */

api = apiVersions[LATEST_API_VERSION]



/***
 * Fonctions d'assistance
 ***/

/* Renvoie la chaîne HTML pour la page */
function getHTML(data) {
  // Générer une page HTML à partir du contenu de chaque <textarea>
  var pageData =
`
<!DOCTYPE html>
<head>
<style>
${data["css"]}
</style>
<script type="text/javascript">
${data["js"]}
</scr` +
// Cela doit être rompu car sinon il est reconnu comme
// la balise de script final du document principal
`ipt>
</head>
<body>
${data["html"]}
</body>
`;

  return pageData;
}


/***
 * Fonctions d'appui du bouton
 ***/


/* Réglez le champ Tinyurl Form caché 'url' sur l'URL de la vue */
function setViewUrl() {
  var data = {
    "css" : document.getElementById("css").value,
    "js" : document.getElementById("javascript").value,
    "html" : document.getElementById("html").value
  };

  var html = getHTML(data);

	// Mettez à jour l'URL du bouton "Court lien"
  document.getElementById("url").value = api.getViewLink(html);
}


/* Réglez le champ Tinyurl Form caché 'url' sur le champ de l'URL du code */
function setCodeUrl() {
  document.getElementById("url").value = window.location.href;
}


/* Afficher une invite avec les données de la page HTML afin que l'utilisateur puisse copier le code */
function showCopyCodePrompt() {
  var data = {
    "css" : document.getElementById("css").value,
    "js" : document.getElementById("javascript").value,
    "html" : document.getElementById("html").value
  };

  var html = getHTML(data);

  window.prompt("Copy to clipboard: ", html)
}


/* Masquer et afficher les boutons basés sur l'état de la case à cocher */
function hideButtons(box) {
  let buttons = document.querySelectorAll("button");
  if (box.checked) {
    buttons.forEach((button) => button.style.display = "none");
  } else {
    buttons.forEach((button) => button.style.display = "block");
  }
}



/***
 * Fonctions de procédure principales
 ***/

/* Exécutez une fois lorsque la page est chargée */
function initialize() {
  // Obtenez les données de la page de l'URL et chargez-la dans les boîtes de codes
  if (window.location.hash) {
    var encoded = window.location.hash.slice(1);
    var json = b64.decode(encoded);
    var data = JSON.parse(json);

    document.getElementById("css").value = data["css"];
    document.getElementById("javascript").value = data["js"];
    document.getElementById("html").value = data["html"];
  }

  update();
}


/* Exécutez chaque fois qu'une touche est enfoncée sur une zone de texte dans les boîtes */
function update() {
  var data = {
    "css" : document.getElementById("css").value,
    "js" : document.getElementById("javascript").value,
    "html" : document.getElementById("html").value
  };

  var html = getHTML(data);

  // Enregistrer les données de la page codée sur l'URL
  window.location.hash = "#" + b64.encode(JSON.stringify(data));

  // Mettez à jour l'URL du bouton "Obtenir le lien"
  document.getElementById("getLinkLink").href = api.getViewLink(html);

  // Mettre à jour le lien de téléchargement
  document.getElementById("downloadLink").href = `data:text/html,${html}`

  // Mettez à jour l'<iframe> pour afficher la page générée
  window.frames[0].location.replace(`data:text/html;charset=utf-8;base64,${b64.encode(html)}`);
}

