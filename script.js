        let currentProduct = '';
        let currentProductName = '';

        // Función para mostrar interés
        function showInterest(productId, productName) {
            currentProduct = productId;
            currentProductName = productName;
            document.getElementById('selectedProduct').textContent = productName;
            document.getElementById('waitlistModal').style.display = 'block';
            
            // Track evento de interés
            if (typeof fbq === 'function') {
                fbq('trackCustom', 'ProductInterest', {
                    product_id: productId,
                    product_name: productName,
                    category: getProductCategory(productId),
                    design_type: getDesignType(productId),
                    color: getProductColor(productId),
                    gender: getProductGender(productId),
                    timestamp: new Date().getTime()
                });
            }
        }

        // Función para cerrar modal
        function closeModal() {
            document.getElementById('waitlistModal').style.display = 'none';
        }

        // Función para obtener categoría del producto
        function getProductCategory(productId) {
            if (productId.includes('hoodie')) return 'Hoodies';
            if (productId.includes('oversize')) return 'Oversized';
            if (productId.includes('top')) return 'Tops';
            return 'Other';
        }

        // Función para obtener tipo de diseño
        function getDesignType(productId) {
            if (productId.includes('aa')) return 'AA';
            if (productId.includes('poster')) return 'Poster';
            if (productId.includes('corazon')) return 'Corazón';
            if (productId.includes('rhlm2')) return 'RHLM2';
            return 'Other';
        }

        // Función para obtener color
        function getProductColor(productId) {
            if (productId.includes('blanco')) return 'Blanco';
            if (productId.includes('negro')) return 'Negro';
            if (productId.includes('rojo')) return 'Rojo';
            return 'Other';
        }

        // Función para obtener género
        function getProductGender(productId) {
            if (productId.includes('mujer')) return 'Mujer';
            if (productId.includes('hombre')) return 'Hombre';
            return 'Unisex';
        }

        // Sistema de filtros
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productItems = document.querySelectorAll('.product-item');
        const productCounter = document.getElementById('productCount');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remover active de todos los botones
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Agregar active al botón clickeado
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');
                let visibleCount = 0;

                productItems.forEach(item => {
                    if (filter === 'all') {
                        item.classList.remove('hidden');
                        visibleCount++;
                    } else {
                        if (item.getAttribute('data-category') === filter) {
                            item.classList.remove('hidden');
                            visibleCount++;
                        } else {
                            item.classList.add('hidden');
                        }
                    }
                });

                // Actualizar contador
                productCounter.textContent = visibleCount;

                // Track evento de filtro
                if (typeof fbq === 'function') {
                    fbq('trackCustom', 'FilterUsed', {
                        filter_type: filter,
                        visible_products: visibleCount,
                        timestamp: new Date().getTime()
                    });
                }
            });
        });

        // Manejar envío del formulario
        document.getElementById('waitlistForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                product_id: currentProduct,
                product_name: currentProductName,
                product_category: getProductCategory(currentProduct),
                design_type: getDesignType(currentProduct),
                color: getProductColor(currentProduct),
                gender: getProductGender(currentProduct),
                name: document.getElementById('userName').value,
                phone: document.getElementById('userPhone').value,
                email: document.getElementById('userEmail').value,
                size: document.getElementById('userSize').value,
                timestamp: new Date().getTime()
            };
            
            // Track evento de registro en waitlist
            if (typeof fbq === 'function') {
                fbq('trackCustom', 'WaitlistSignup', formData);
                fbq('track', 'Lead', {
                    content_name: currentProductName,
                    content_category: getProductCategory(currentProduct),
                    value: 1
                });
            }
            
            // Aquí enviarías los datos a tu servidor
            console.log('Datos del formulario:', formData);
            
            // Mostrar confirmación
            alert(`¡Listo! Te avisaremos cuando "${currentProductName}" esté disponible. Revisa tu WhatsApp en las próximas 24 horas.`);
            
            // Cerrar modal y limpiar formulario
            closeModal();
            document.getElementById('waitlistForm').reset();
        });

        // Cerrar modal al hacer clic fuera de él
        window.onclick = function(event) {
            const modal = document.getElementById('waitlistModal');
            if (event.target == modal) {
                closeModal();
            }
        }

        // Track page engagement
        let startTime = Date.now();
        let maxScroll = 0;

        window.addEventListener('scroll', function() {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            maxScroll = Math.max(maxScroll, scrollPercent);
        });

        window.addEventListener('beforeunload', function() {
            const timeOnPage = (Date.now() - startTime) / 1000;
            if (typeof fbq === 'function') {
                fbq('trackCustom', 'PageEngagement', {
                    time_on_page: timeOnPage,
                    max_scroll_percent: maxScroll,
                    timestamp: new Date().getTime()
                });
            }
        });

        // Track productos más vistos
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -20% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const productId = entry.target.getAttribute('data-product');
                    if (productId && typeof fbq === 'function') {
                        fbq('trackCustom', 'ProductView', {
                            product_id: productId,
                            category: getProductCategory(productId),
                            design_type: getDesignType(productId),
                            color: getProductColor(productId),
                            gender: getProductGender(productId),
                            timestamp: new Date().getTime()
                        });
                    }
                }
            });
        }, observerOptions);

        // Observar todos los productos
        document.querySelectorAll('.product-item').forEach(product => {
            observer.observe(product);
        });
