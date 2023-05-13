<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" href="favicon.ico">
    <link rel="stylesheet" type="text/css" href="./css/main.css">
    
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<?php

if (!file_exists("./data/menu.json")) {
    file_put_contents("./data/menu.json", "");
}

?>
<body>
    <div class="wrapper">
        <div class="container">
            <script>
                document.write('<a href="' + document.referrer + '">zurück</a>');
            </script>

            <h2>Menü-Kategorie:</h2>
            <select id="category"></select>
            <p id="recipe_title"><b>Rezept auswählen:</b></p>
            <select id="recipes">

            </select>
            <ul>
            </ul>
            <div class="content">

            </div>

        </div>
        
    </div>
    <script src="./js/functions.js"></script>
    <script src="./js/getJsonData.js"></script>

    <script src="./js/menu.js"></script>

</body>
</html>