document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Cargar la lista de productos desde un archivo JSON
        const productos = await cargarProductos();

        // Obtener los selectores de talle y cargar los talles para cada producto
        const tallesZapatosSelect = document.getElementById('talles-zapatos');
        cargarTalles(tallesZapatosSelect, 'Zapatos', productos);

        const tallesRemerasSelect = document.getElementById('talle-remeras');
        cargarTalles(tallesRemerasSelect, 'Remeras', productos);

        const tallesShortsSelect = document.getElementById('talle-shorts');
        cargarTalles(tallesShortsSelect, 'Shorts', productos);

        const tallesGorrasSelect = document.getElementById('talle-gorras');
        cargarTalles(tallesGorrasSelect, 'Gorras', productos);

        // Mostrar la galería de productos inicialmente
        mostrarProductos(productos);

        // Seleccionar elementos del carrito y establecer eventos
        const btnCart = document.querySelector('.container-cart-icon');
        const containerCartProducts = document.querySelector('.container-cart-products');

        // Añade un escucha de eventos al botón de carrito para mostrar/ocultar el carrito
        btnCart.addEventListener('click', () => {
            containerCartProducts.classList.toggle('hidden-cart');
        });

        // Seleccionar elementos relacionados con el carrito
        const rowProduct = document.querySelector('.row-product');
        const productsList = document.querySelector('.galeria');
        let allProducts = [];

        const valorTotal = document.querySelector('.total-pagar');
        const countProducts = document.querySelector('#contador-productos');
        const cartEmpty = document.querySelector('.cart-empty');
        const cartTotal = document.querySelector('.cart-total');
        const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');


        // Añade un escucha de eventos de clic al contenedor de productos
        productsList.addEventListener('click', e => {
            // Verifica si el elemento clicado tiene la clase 'boton'
            if (e.target.classList.contains('boton')) {
                // Obtiene la información del producto desde su elemento padre
                const product = e.target.closest('.imagen');
                // Obtiene el selector de talle correspondiente al producto
                const sizeSelector = product.querySelector('select');
                // Crea un objeto con la información del producto
                const infoProduct = {
                    quantity: 1,
                    title: product.querySelector('h2').textContent,
                    price: product.querySelector('.price').textContent,
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



        // Función para cargar los talles en el select correspondiente
        function cargarTalles(select, nombreProducto, productos) {
            const producto = productos.find(producto => producto.nombre === nombreProducto);

            if (producto) {
                for (const talle of producto.talles) {
                    const option = document.createElement('option');
                    option.value = talle;
                    option.text = talle;
                    select.add(option);
                }
            }
        }

        // Añadir un escucha de eventos de cambio a los selectores de talle
        productsList.addEventListener('change', e => {
            if (e.target.tagName === 'SELECT') {
                // Obtener el tamaño seleccionado y actualizar el carrito
                const selectedSize = e.target.value;
                const product = e.target.closest('.imagen');
                const priceElement = product.querySelector('.price');
                const price = productos.find(item => item.nombre === product.querySelector('h2').textContent)
                    .precios[selectedSize];

                const infoProduct = allProducts.find(p => p.title === product.querySelector('h2').textContent);
                infoProduct.price = parseFloat(price);

                e.target.classList.remove('auto-add');

                // Actualizar la interfaz del carrito
                showHTML();
            }
        });



        // Añade un evento de clic al botón btnFinalizarCompra para manejar la acción de finalizar la compra con SweetAlert2
        btnFinalizarCompra.addEventListener('click', () => {
            // Muestra un cuadro de diálogo SweetAlert2 personalizado
            Swal.fire({
                title: '¡Compra finalizada!',
                text: 'Gracias por tu compra.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        });

        // Función para mostrar la interfaz actualizada del carrito
        const showHTML = () => {
            if (!allProducts.length) {
                // Mostrar mensaje si el carrito está vacío
                cartEmpty.classList.remove('hidden');
                rowProduct.classList.add('hidden');
                cartTotal.classList.add('hidden');
            } else {
                cartEmpty.classList.add('hidden');
                rowProduct.classList.remove('hidden');
                cartTotal.classList.remove('hidden');
            }

            rowProduct.innerHTML = '';

            let total = 0;
            let totalOfProducts = 0;

            allProducts.forEach(product => {
                // Crear elementos HTML para cada producto en el carrito
                const containerProduct = document.createElement('div');
                containerProduct.classList.add('cart-product');

                containerProduct.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${product.quantity}</span>
                    <p class="titulo-producto-carrito">${product.title} - Talle: ${product.size}</p>
                    <span class="precio-producto-carrito">$${(product.price * product.quantity).toFixed(2)}</span>
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

                // Calcular el total y la cantidad de productos en el carrito
                total += product.price * product.quantity;
                totalOfProducts += product.quantity;

                // Actualizar precio en la galería de productos
                const productElement = document.querySelector(`.galeria [data-producto="${product.title}"] .price`);
                if (productElement) {
                    productElement.textContent = `$${product.price}`;
                }
            });

            // Mostrar el total y la cantidad en la interfaz
            valorTotal.innerText = `$${total.toFixed(2)}`;
            countProducts.innerText = totalOfProducts;
        };

        // Función para cargar los productos desde un archivo JSON
        async function cargarProductos() {
            try {
                const response = await fetch('./productos.json');
                const data = await response.json();
                return data.productos;
            } catch (error) {
                throw new Error('Error al cargar los productos:', error);
            }
        }
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
});



// Función para cargar los talles en el select correspondiente



    // Función para cargar los talles en el select correspondiente
    /*   function cargarTalles(select, nombreProducto, productos) {
          const producto = productos.find(producto => producto.nombre === nombreProducto);
  
          if (producto) {
              for (const talle of producto.talles) {
                  const option = document.createElement('option');
                  option.value = talle;
                  option.text = talle;
                  select.add(option);
              }
          }
      }
   */

      // Función asíncrona para cargar productos desde un archivo JSON
/* async function cargarProductos() {
    try {
        const response = await fetch('ruta/del/productos.json');
        const data = await response.json();
        return data.productos;
    } catch (error) {
        // Maneja cualquier error al cargar los productos
        throw new Error('Error al cargar los productos:', error);
    }
} */

/*  function cargarTalles(select, nombreProducto, productos) {
    const producto = productos.find(producto => producto.nombre === nombreProducto);

    if (producto) {
        for (const talle of producto.talles) {
            const option = document.createElement('option');
            option.value = talle;
            option.text = talle;
            select.add(option);
        }
    }
} 
 */



  /*  // Añade un escucha de eventos de cambio a los selectores de talle
      productsList.addEventListener('change', e => {
        if (e.target.tagName === 'SELECT') {
            const product = e.target.closest('.imagen');
            const productName = product.querySelector('h2').textContent;
            const selectedSize = e.target.value;

            if (selectedSize !== '') {
                const priceElement = document.getElementById(`precio-${productName.replace(/\s+/g, '')}`);
                const productPrice = productos.find(item => item.nombre === productName)
                    .precios[selectedSize];

                if (priceElement) {
                    priceElement.textContent = productPrice;
                }

                const infoProduct = allProducts.find(p => p.title === productName);
                if (infoProduct) {
                    infoProduct.price = parseFloat(productPrice);
                    showHTML();
                }
            }
        }
    });
 */
// Añade un escucha de eventos de cambio a los selectores de talle
/* productsList.addEventListener('change', e => {
    if (e.target.tagName === 'SELECT' && e.target.value !== '') {
        // Obtiene el precio del producto según el talle seleccionado
        const product = e.target.closest('.imagen');
        const priceElement = product.querySelector('.price');
        const price = productos.find(item => item.nombre === product.querySelector('h2').textContent)
            .precios[e.target.value];

        // Actualiza el precio en el objeto infoProduct
        const infoProduct = allProducts.find(p => p.title === product.querySelector('h2').textContent);
        infoProduct.price = parseFloat(price);

        // Remueve la clase después de procesar la adición automática
        e.target.classList.remove('auto-add');

        // Llama a la función showHTML
        showHTML();
    }
}); */