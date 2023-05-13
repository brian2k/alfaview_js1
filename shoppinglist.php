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

<body>
    <div class="wrapper">
        <div class="container">
            <script>
                document.write('<a href="' + document.referrer + '">zurück</a>');
            </script>

            <h2>Einkaufsliste für</h2> 
            <select id="category"></select>
            <ul class="shoppinglist">
            </ul>
            <fieldset>
                <legend>Neuen Einkauf hinzufügen</legend>       

                <div class="inputform">
                    <input type="text" id="item" placeholder="Artikelname">
                    <input id="amount" type="number" min="1" max="999" value="1" />
                </div>

                <button type="submit" id="addItem">Einkauf hinzufügen</button>
                <button type="submit" class="hidden save" id="save">Änderungen Speichern</button>
            </fieldset>
        </div>
        
    </div>
    <script src="./js/getJsonData.js"></script>
    <script src="./js/shoppinglist.js"></script>

</body>
</html>