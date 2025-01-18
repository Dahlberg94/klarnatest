import fetch from "node-fetch";

export async function getProducts() {
    const res = await fetch(`${process.env.FAKE_STORE_API_URL}/products`);
    const products = await res.json();
    return products;
}

