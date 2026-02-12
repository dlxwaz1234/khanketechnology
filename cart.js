const cart = {
    // جلب البيانات مع التحقق أنها مصفوفة فعلاً، وإلا البدء بمصفوفة فارغة
    items: (function() {
        try {
            const data = JSON.parse(localStorage.getItem('cart'));
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    })(),

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateUI();
    },

    addItem(name, price) {
        const existing = this.items.find(i => i.name === name);
        if (existing) {
            existing.qty++;
        } else {
            this.items.push({ name, price, qty: 1 });
        }
        this.save();
    },

    updateQty(name, delta) {
        const item = this.items.find(i => i.name === name);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                this.items = this.items.filter(i => i.name !== name);
            }
            this.save();
        }
    },

    getTotal() {
        if (!Array.isArray(this.items)) return 0;
        return this.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty || 0)), 0);
    },

    getCount() {
        if (!Array.isArray(this.items)) return 0;
        return this.items.reduce((total, item) => total + Number(item.qty || 0), 0);
    },

    updateUI() {
        const cartBar = document.getElementById('cart-bar');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const modalTotal = document.getElementById('modal-total');
        const cartItemsContainer = document.getElementById('cart-items');

        const count = this.getCount();
        const total = this.getTotal();

        // تحديث شريط السلة السفلي
        if (cartBar) {
            cartBar.style.display = count > 0 ? 'flex' : 'none';
            if (cartCount) cartCount.textContent = count;
            if (cartTotal) cartTotal.textContent = total.toLocaleString() + " د.ع";
        }

        // تحديث المجموع داخل النافذة المنبثقة (Modal)
        if (modalTotal) {
            modalTotal.textContent = total.toLocaleString() + " د.ع";
        }

        // تحديث قائمة العناصر داخل السلة
        if (cartItemsContainer) {
            if (this.items.length === 0) {
                cartItemsContainer.innerHTML = '<p style="text-align:center; padding:20px;">السلة فارغة</p>';
            } else {
                cartItemsContainer.innerHTML = this.items.map(item => `
                    <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                        <div>
                            <div style="font-weight:bold;">${item.name}</div>
                            <div style="color: #e67e22; font-size:0.9rem;">${(item.price * item.qty).toLocaleString()} د.ع</div>
                        </div>
                        <div class="qty-controls" style="display: flex; align-items: center; gap: 10px;">
                            <button class="qty-btn" onclick="cart.updateQty('${item.name}', -1)" style="padding: 2px 8px;">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" onclick="cart.updateQty('${item.name}', 1)" style="padding: 2px 8px;">+</button>
                        </div>
                    </div>
                `).join('');
            }
        }
    },

    sendOrder() {
        if (this.items.length === 0) {
            alert("السلة فارغة!");
            return;
        }

        let message = "🛒 *طلب جديد*:\n\n";
        this.items.forEach(item => {
            message += `• ${item.name} (العدد: ${item.qty}) = ${(item.price * item.qty).toLocaleString()} د.ع\n`;
        });
        message += `\n💰 *المجموع الكلي: ${this.getTotal().toLocaleString()} د.ع*`;

        const encodedMessage = encodeURIComponent(message);
        // تأكد من تعريف CONFIG.WHATSAPP_NUMBER في ملف الإعدادات الخاص بك
        const whatsappUrl = `https://wa.me/${typeof CONFIG !== 'undefined' ? CONFIG.WHATSAPP_NUMBER : 'YOUR_NUMBER'}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    }
};

// استدعاء التحديث فور تحميل الصفحة لضمان ظهور السلة إذا كانت تحتوي عناصر
document.addEventListener('DOMContentLoaded', () => {
    cart.updateUI();
});