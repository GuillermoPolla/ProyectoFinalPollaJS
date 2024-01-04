document.addEventListener("DOMContentLoaded", async function () {
    try {
        const productos = await cargarProductos();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }

    // Seleccionamos el botón de carrito y el contenedor de productos del carrito
    const btnCart = document.querySelector('.container-cart-icon');
    const containerCartProducts = document.querySelector('.container-cart-products');

    // Añadimos un escucha de eventos al botón de carrito
    btnCart.addEventListener('click', () => {
        containerCartProducts.classList.toggle('hidden-cart');
    });

    // Seleccionamos elementos del carrito
    const rowProduct = document.querySelector('.row-product');

    // Lista de todos los contenedores de productos
    const productsList = document.querySelector('.galeria');

    // Variable de array de productos
    let allProducts = [];

    const valorTotal = document.querySelector('.total-pagar');
    const countProducts = document.querySelector('#contador-productos');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartTotal = document.querySelector('.cart-total');

    // Añadimos un escucha de eventos de clic al contenedor de productos
    productsList.addEventListener('click', e => {
        // Verificamos si el elemento clicado tiene la clase 'boton'
        if (e.target.classList.contains('boton')) {
            // Obtenemos la información del producto desde su elemento padre
            const product = e.target.closest('.imagen');
            // Obtenemos el selector de talle correspondiente al producto
            const sizeSelector = product.querySelector('select');
            // Creamos un objeto con la información del producto
            const infoProduct = {
                quantity: 1,
                title: product.querySelector('h2').textContent,
                price: product.querySelector('.price').textContent,
                size: sizeSelector ? sizeSelector.value : 'No especificado',
            };

            const existingProductIndex = allProducts.findIndex(
                product => product.title === infoProduct.title && product.size === infoProduct.size
            );

            if (existingProductIndex !== -1) {
                // Si el producto ya existe en el carrito, actualizamos la cantidad
                allProducts[existingProductIndex].quantity++;
            } else {
                // Si el producto no existe en el array, lo agregamos al array allProducts
                allProducts = [...allProducts, infoProduct];
            }

            // Llamamos a la función showHTML solo si no es una adición automática
            if (!e.target.classList.contains('auto-add')) {
                showHTML();
            }
        }
    });

    // Añadimos un escucha de eventos de clic al contenedor de productos en el carrito
    rowProduct.addEventListener('click', e => {
        // Verificamos si el elemento clicado tiene la clase 'icon-close'
        if (e.target.classList.contains('icon-close')) {
            // Obtenemos el elemento del producto desde el cual se hizo clic
            const product = e.target.closest('.cart-product');
            // Obtenemos el título y el talle del producto desde el párrafo dentro del elemento del producto
            const title = product.querySelector('.titulo-producto-carrito').textContent;
            const size = product.querySelector('.titulo-producto-carrito').textContent;
            // Filtramos el array allProducts para eliminar el producto con el título y talle correspondiente
            allProducts = allProducts.filter(
                product => product.title !== title || product.size !== size
            );
            // Llamamos a la función showHTML para actualizar la interfaz de usuario
            showHTML();
        }
    });

    // Añadimos un escucha de eventos de cambio a los selectores de talle
    productsList.addEventListener('change', e => {
        if (e.target.tagName === 'SELECT' && e.target.value !== '') {
            // Lógica adicional para el cambio de talle si es necesario
            // ...

            // Removemos la clase después de procesar la adición automática
            e.target.classList.remove('auto-add');
        }
    });

    // Función para mostrar el HTML del carrito
    const showHTML = () => {
        // Verificamos si el array allProducts está vacío
        if (!allProducts.length) {
            // Si el carrito está vacío, mostramos el mensaje de carrito vacío y ocultamos los elementos de productos y total
            cartEmpty.classList.remove('hidden');
            rowProduct.classList.add('hidden');
            cartTotal.classList.add('hidden');
        } else {
            // Si hay productos en el carrito, ocultamos el mensaje de carrito vacío y mostramos los elementos de productos y total
            cartEmpty.classList.add('hidden');
            rowProduct.classList.remove('hidden');
            cartTotal.classList.remove('hidden');
        }

        // Limpiamos el contenido HTML dentro del elemento con la clase 'row-product'
        rowProduct.innerHTML = '';

        // Inicializamos variables para el cálculo del total y la cantidad total de productos
        let total = 0;
        let totalOfProducts = 0;

        // Recorremos cada producto en el array allProducts
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

        // Actualizamos el texto del elemento con la clase 'total-pagar' con el total calculado
        valorTotal.innerText = `$${total}`;
        // Actualizamos el texto del elemento con el id 'contador-productos' con la cantidad total de productos
        countProducts.innerText = totalOfProducts;
    };
});

async function cargarProductos() {
    try {
        const response = await fetch('ruta/del/productos.json');
        const data = await response.json();
        return data.productos;
    } catch (error) {
        throw new Error('Error al cargar los productos:', error);
    }
}