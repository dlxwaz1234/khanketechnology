const ui = {
    async initCategories() {
        const container = document.getElementById('categories-container');
        const data = await api.fetchData();
        const categories = data.filter(item => item.type === 'category');

        if (categories.length === 0) {
            container.innerHTML = '<div class="loading">لا توجد أقسام متاحة حالياً.</div>';
            return;
        }

        container.innerHTML = categories.map(cat => `
            <a href="items.html?cat=${encodeURIComponent(cat.name)}" class="category-card">
                ${cat.image ? `<img src="${cat.image}" style="width:50px; height:50px; margin-bottom:10px; object-fit:contain;">` : ''}
                <span>${cat.name}</span>
            </a>
        `).join('');
    },

    async initItems() {
        const container = document.getElementById('items-container');
        const titleEl = document.getElementById('category-title');
        
        const urlParams = new URLSearchParams(window.location.search);
        const categoryName = urlParams.get('cat');

        if (!categoryName) {
            window.location.href = 'categories.html';
            return;
        }

        titleEl.textContent = categoryName;

        const data = await api.fetchData();
        const items = data.filter(item => item.type === 'item' && item.category === categoryName);

        if (items.length === 0) {
            container.innerHTML = '<div class="loading">لا توجد منتجات في هذا القسم.</div>';
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="item-card">
                <img src="${item.image || 'https://via.placeholder.com/100'}" class="item-image" alt="${item.name}">
                <div class="item-info">
                    <div>
                        <div class="item-name">${item.name}</div>
                        <div class="item-desc">${item.description || ''}</div>
                    </div>
                    <div class="item-footer">
                        <div class="item-price">${item.price.toLocaleString()} د.ع</div>
                        <button class="add-btn" onclick="cart.addItem('${item.name}', ${item.price})">إضافة للسلة</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    toggleCart() {
        const modal = document.getElementById('cart-modal');
        const isVisible = modal.style.display === 'flex';
        modal.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
            cart.updateUI();
        }
    }
};

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
