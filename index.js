const express = require('express');


const app = express();
const port = 3232;

async function getInvoices(doctype, fields, start, limit, filters = []) {

    let url = 'https://planetpharma.accu360.cloud/api/resource/Sales Invoice';
    url += `?fields=${JSON.stringify(fields)}&limit_start=${start}&limit_page_length=${limit}`;

   
    if (filters.length > 0) {
        url += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token 2ed5ebc5ece4903:041dee4e4e8c120`
            }
        });

        const data = await response.json();
        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, error: data };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

app.get('/get-invoices', async (req, res) => {
    const { doctype, fields = '["*"]', start = 0, length = '20', filters = '[]' } = req.query;

    console.log(`Doctype: ${doctype}, Fields: ${fields}, Page: ${start}, Length: ${length}, Filters: ${filters}`);

    let parsedFilters;
    try {
        parsedFilters = JSON.parse(filters);
    } catch (e) {
        parsedFilters = [];
    }

    const listResult = await getInvoices(doctype, fields, start, length, parsedFilters);

    if (listResult.success) {
        res.status(200).json({ success: true, data: listResult.data });
    } else {
        res.status(401).json({ success: false, error: listResult.error });
    }
});

// Home route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the API. Please use the /get-invoices endpoint for the desired functionality.",
        data: ""
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
