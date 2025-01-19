import fetch from 'node-fetch';


export function getKlarnaAuth() {
	const username = process.env.PUBLIC_KEY;
	const password = process.env.SECRET_KEY;
	const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
	return auth;
}

// Skapar en order via Klarnas API
export async function createOrder(product) {
    const path = '/checkout/v3/orders';
    const auth = getKlarnaAuth();
    const url = process.env.BASE_URL + path;

    const headers = {
        'Content-Type': 'application/json',
        Authorization: auth,
    };

    const quantity = 1;
    const price = product.price * 100;
    const total_amount = price * quantity;
    const total_tax_amount = total_amount * 0.2;

    const payload = {
        purchase_country: 'SE',
        purchase_currency: 'SEK',
        locale: 'sv-SE',
        order_amount: total_amount,
        order_tax_amount: total_tax_amount,
        order_lines: [
            {
                type: 'physical',
                reference: product.id,
                name: product.title,
                quantity,
                quantity_unit: 'pcs',
                unit_price: price,
                tax_rate: 2500,
                total_amount: total_amount,
                total_discount_amount: 0,
                total_tax_amount,
            },
        ],
        merchant_urls: {
            terms: 'https://www.example.com/terms.html',
            checkout: 'https://www.example.com/checkout.html?order_id={checkout.order.id}',
            confirmation: `${process.env.CONFIRMATION_URL}?order_id={checkout.order.id}`,
            push: 'https://www.example.com/api/push?order_id={checkout.order.id}',
        },
    };

    console.log('Request payload:', JSON.stringify(payload, null, 2)); // Loggar payload

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status); // Loggar HTTP-status
    console.log('Response headers:', response.headers); // Loggar headers

    const responseBody = await response.text();
    console.log('Response body:', responseBody); // Loggar responsen som text

    if (response.status === 200 || response.status === 201) {
        return JSON.parse(responseBody); // Returnera JSON vid framgång
    } else {
        console.error('ERROR: ', responseBody);
        return {
            html_snippet: `<h1>${response.status} ${responseBody}</h1>`,
        };
    }
}


// hämtar vår egna skapade order från API
export async function retrieveOrder(order_id) {
    const path = '/checkout/v3/orders/' + order_id;
    const auth = getKlarnaAuth();
    const url = process.env.BASE_URL + path;

    const headers = { Authorization: auth };

    console.log('Retrieving order with ID:', order_id);

    const response = await fetch(url, { method: 'GET', headers });

    console.log('Response status:', response.status); // Loggar HTTP-status
    console.log('Response headers:', response.headers); // Loggar headers

    const responseBody = await response.text();
    console.log('Response body:', responseBody); // Loggar responsen som text

    if (response.status === 200 || response.status === 201) {
        return JSON.parse(responseBody); // Returnera JSON vid framgång
    } else {
        console.error('ERROR: ', responseBody);
        return {
            html_snippet: `<h1>${response.status} ${response.statusText}</h1>`,
        };
    }
}
