const CONFIG = {
    // الرابط الجديد الذي أرسلته (تم تحديثه هنا)
    SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRU32JUZsiZ4wifXbg_cD5MhGXgbKLVlf53zg9-h9m1o85FoY1xYUdXaXYbJUqie-fQ6vVfR0KSqPWf/pub?output=csv',
    // رقم الواتساب الخاص بك
    WHATSAPP_NUMBER: '9647503475937'
};

const api = {
    async fetchData() {
        try {
            const response = await fetch(CONFIG.SHEET_URL);
            
            if (!response.ok) {
                throw new Error(`خطأ في السيرفر: ${response.status}`);
            }

            const csvText = await response.text();
            
            if (!csvText.trim() || csvText.includes('<!DOCTYPE html>')) {
                throw new Error("الملف المستلم ليس CSV صحيحاً. تأكد من اختيار CSV عند النشر.");
            }

            return this.parseCSV(csvText);
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    },

    parseCSV(csvText) {
        const lines = csvText.split(/\r?\n/); // تقسيم الأسطر بشكل أفضل
        const result = [];
        if (lines.length === 0) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        let currentCategory = '';

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = this.splitCSVLine(lines[i]);
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });

            // إذا كان حقل السعر فارغاً، نعتبر السطر "قسم" (Category)
            if (!row.price || row.price.trim() === '') {
                currentCategory = row.name;
                result.push({
                    type: 'category',
                    name: row.name,
                    image: row.image
                });
            } else {
                // إذا وجد سعر، نعتبره "منتج" (Item)
                result.push({
                    type: 'item',
                    category: currentCategory,
                    name: row.name,
                    price: parseFloat(row.price.replace(/[^0-9.]/g, '')) || 0,
                    image: row.image,
                    description: row.description
                });
            }
        }
        return result;
    },

    splitCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }
};