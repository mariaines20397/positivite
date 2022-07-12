// Obtener referencia al input y a la imagen
const $seleccionar = document.querySelector("#seleccionar"),
$imagenActual = document.querySelector(" #imagenActual");
// Agregamos el evento mágico
$seleccionar.addEventListener("change", (e) => {
    // (Los archivos seleccionados, pueden ser muchos o uno)
    const archivos = $seleccionar.files;
// Si no hay archivos salimos de la función y quitamos la imagen
if (!archivos || !archivos.length) {
    $imagenActual.src = "/img/<%=product.image%>";
 
 return  location.reload();
 
}
// Ahora tomamos el primer archivo, el cual vamos a previsualizar
const primerArchivo = archivos[0];
// Lo convertimos a un objeto de tipo objectURL
const objectURL = URL.createObjectURL(primerArchivo);
// Y a la fuente de la imagen le ponemos el objectURL
$imagenActual.src = objectURL;

} );

