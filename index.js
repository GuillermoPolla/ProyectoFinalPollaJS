// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Carga los productos desde el archivo JSON
        const productos = await cargarProductos();

        // Agrega los talles de zapatos al select correspondiente
        const tallesZapatosSelect = document.getElementById('talles-zapatos');
        cargarTalles(tallesZapatosSelect, 'Zapatos', productos);

        // Agrega los talles de remeras al select correspondiente
        const tallesRemerasSelect = document.getElementById('talle-Remeras');
        cargarTalles(tallesRemerasSelect, 'Remeras', productos);

        // Agrega los talles de shorts al select correspondiente
        const tallesShortsSelect = document.getElementById('talle-Shorts');
        cargarTalles(tallesShortsSelect, 'Shorts', productos);

        // Agrega los talles de gorras al select correspondiente
        const tallesGorrasSelect = document.getElementById('talle-Gorras');
        cargarTalles(tallesGorrasSelect, 'Gorras', productos);

        // Muestra los productos en la interfaz
        mostrarProductos(productos);
    } catch (error) {
        // Maneja cualquier error al cargar los productos
        console.error('Error al cargar los productos:', error);
    }
    function cargarTalles(select, nombreProducto, productos) {
        // Busca el producto en el array de productos
        const producto = productos.find(producto => producto.nombre === nombreProducto);

        // Verifica si se encontró el producto
        if (producto) {
            // Obtiene los talles del producto y los agrega al select
            for (const talle of producto.talles) {
                const option = document.createElement('option');
                option.value = talle;
                option.text = talle;
                select.add(option);
            }
        }
    }

    // Selecciona el botón de carrito y el contenedor de productos del carrito
    const btnCart = document.querySelector('.container-cart-icon');
    const containerCartProducts = document.querySelector('.container-cart-products');

    // Añade un escucha de eventos al botón de carrito para mostrar/ocultar el carrito
    btnCart.addEventListener('click', () => {
        containerCartProducts.classList.toggle('hidden-cart');
    });

    // Selecciona elementos del carrito
    const rowProduct = document.querySelector('.row-product');

    // Lista de todos los contenedores de productos
    const productsList = document.querySelector('.galeria');

    // Variable de array de productos
    let allProducts = [];

    // Selecciona elementos relacionados con el total y la cantidad de productos
    const valorTotal = document.querySelector('.total-pagar');
    const countProducts = document.querySelector('#contador-productos');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartTotal = document.querySelector('.cart-total');
    const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');


    //EVENTOS

    // Añade un escucha de eventos de clic al contenedor de productos
    productsList.addEventListener('click', e => {
        // Verifica si el elemento clicado tiene la clase 'boton'
        if (e.target.classList.contains('boton')) {
            // Obtiene la información del producto desde su elemento padre
            const product = e.target.closest('.imagen');
            // Obtiene el selector de talle correspondiente al producto
            const sizeSelector = product.querySelector('select');
            // Crea un objeto con la información del pr oducto
            const infoProduct = {
                quantity: 1,
                title: product.querySelector('h2').textContent,
                price: product.querySelector('.price').textContent.replace('Precio: $', '$'),
                size: sizeSelector ? sizeSelector.value : 'No especificado',
            };

            // Busca el índice del producto existente en el carrito
            const existingProductIndex = allProducts.findIndex(
                product => product.title === infoProduct.title && product.size === infoProduct.size
            );

            // Si el producto ya existe en el carrito, actualiza la cantidad
            if (existingProductIndex !== -1) {
                allProducts[existingProductIndex].quantity++;
            } else {
                // Si el producto no existe en el array, lo agrega al array allProducts
                allProducts = [...allProducts, infoProduct];
            }

            // Llama a la función showHTML solo si no es una adición automática
            if (!e.target.classList.contains('auto-add')) {
                showHTML();
            }
        }
    });

    // Añade un escucha de eventos de clic al contenedor de productos en el carrito
    rowProduct.addEventListener('click', e => {
        // Verifica si el elemento clicado tiene la clase 'icon-close'
        if (e.target.classList.contains('icon-close')) {
            // Obtiene el elemento del producto desde el cual se hizo clic
            const product = e.target.closest('.cart-product');
            // Busca el índice del producto dentro del contenedor de productos
            const productIndex = Array.from(rowProduct.children).indexOf(product);

            // Elimina el producto del array allProducts usando el índice
            allProducts.splice(productIndex, 1);

            // Llama a la función showHTML para actualizar la interfaz de usuario
            showHTML();
        }
    });


    btnFinalizarCompra.addEventListener('click', () => {
        // Muestra un cuadro de diálogo SweetAlert2 personalizado
        Swal.fire({
            title: '¡Compra finalizada!',
            text: 'Gracias por tu compra.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    
        // Resetea el array de productos al vacío
        allProducts = [];
    
        // Llama a la función showHTML para actualizar la interfaz de usuario
        showHTML();
    });

      // Función para mostrar el HTML del carrito
    const showHTML = () => {
        // Verifica si el array allProducts está vacío
        if (!allProducts.length) {
            // Si el carrito está vacío, muestra el mensaje de carrito vacío y oculta los elementos de productos y total
            cartEmpty.classList.remove('hidden');
            rowProduct.classList.add('hidden');
            cartTotal.classList.add('hidden');
        } else {
            // Si hay productos en el carrito, oculta el mensaje de carrito vacío y muestra los elementos de productos y total
            cartEmpty.classList.add('hidden');
            rowProduct.classList.remove('hidden');
            cartTotal.classList.remove('hidden');
        }

        // Limpia el contenido HTML dentro del elemento con la clase 'row-product'
        rowProduct.innerHTML = '';

        // Inicializa variables para el cálculo del total y la cantidad total de productos
        let total = 0;
        let totalOfProducts = 0;

        // Recorre cada producto en el array allProducts
        allProducts.forEach(product => {
            const containerProduct = document.createElement('div');
            containerProduct.classList.add('cart-product');

            containerProduct.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${product.quantity}</span>
                    <p class="titulo-producto-carrito">${product.title} - Talle: ${product.size}</p>
                    <span class="precio-producto-carrito">${product.price}</span>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="icon-close"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            `;

            rowProduct.append(containerProduct);

            total = total + parseInt(product.quantity * product.price.slice(1));
            totalOfProducts = totalOfProducts + product.quantity;
        });

        // Actualiza el texto del elemento con la clase 'total-pagar' con el total calculado
        valorTotal.innerText = `$${total}`;
        // Actualiza el texto del elemento con el id 'contador-productos' con la cantidad total de productos
        countProducts.innerText = totalOfProducts;
    };
});

async function cargarProductos() {
    try {
        const response = await fetch('./productos.json');
        const data = await response.json();
        return data.productos;
    } catch (error) {
        // Maneja cualquier error al cargar los productos
        throw new Error('Error al cargar los productos:', error);
    }
}