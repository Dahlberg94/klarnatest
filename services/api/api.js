import fetch from "node-fetch";

export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        const products = await getProducts();
        return res.status(200).json(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' }); // Endast GET-metod stöds
    }
  }

export async function getProducts() {
    const res = await fetch(`${process.env.FAKE_STORE_API_URL}/products`);
    const products = await res.json();
    return products;
}

