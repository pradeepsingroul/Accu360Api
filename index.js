const express = require('express');


const app = express();
const port = 3232;


async function getInvoices(doctype, fields, start, limit) {

    let url = 'https://itsl.accu360.cloud/api/resource/Sales Invoice';
    url += `?fields=${JSON.stringify(fields)}&limit_start=${start}&limit_page_length=${limit}`;


    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token 71a5bfaf28ee926:ba51699d19e91b4`
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
    const { doctype, fields = '["*"]', start = 0, length = '*' } = req.query;


    console.log(`Doctype: ${doctype}, Fields: ${fields}, Page: ${start}, Length: ${length}`);

    const listResult = await getInvoices(doctype, fields, start, length)

    if (listResult.success) {
        res.status(200).json({ success: true, data: listResult.data });
    } else {
        res.status(401).json({ success: false, error: listResult.error });
    }
});

// Home route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
