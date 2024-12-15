import imageUrlBuilder from '@sanity/image-url';

const projectId = '26wq1wsf';
const dataset = 'production';

const builder = imageUrlBuilder({
  projectId: projectId,
  dataset: dataset,
});

export function urlFor(source) {
  return builder.image(source);
}

async function fetchFromSanity(query) {
  const url = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  console.log('Fetching from URL:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text);
      throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Unexpected content type:', contentType, 'Response:', text);
      throw new Error(`Expected JSON, but got ${contentType}`);
    }

    const data = await response.json();
    console.log('Sanity response:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchFromSanity:', error);
    throw error;
  }
}

export async function getProducts() {
  const query = `*[_type == "product"] {
    _id,
    name,
    "slug": slug.current,
    price,
    compareAtPrice,
    description,
    images,
    tags,
    specs,
    variants,
    sizes,
    category,
    subcategory,
    productType,
    brand,
    clothingDetails,
    footwearDetails,
    beautyDetails,
    gadgetDetails
  }`;

  try {
    console.log('Fetching products from Sanity...');
    const response = await fetchFromSanity(query);
    console.log('Raw Sanity response:', response);
    return response.result;
  } catch (error) {
    console.error('Detailed error in getProducts:', error);
    throw new Error(`Could not fetch products: ${error.message}`);
  }
}

export async function getProduct(slug) {
  if (!slug) {
    console.error('Invalid slug provided to getProduct');
    return null;
  }

  const query = `*[_type == "product" && slug.current == "${slug}"][0] {
    _id,
    name,
    "slug": slug.current,
    price,
    compareAtPrice,
    description,
    images,
    tags,
    specs,
    variants,
    sizes,
    category,
    subcategory,
    features,
    productType,
    brand,
    clothingDetails,
    footwearDetails,
    beautyDetails,
    gadgetDetails
  }`;

  try {
    const response = await fetchFromSanity(query);
    const product = response.result;
    if (!product) {
      console.error(`No product found for slug: ${slug}`);
    }
    return product;
  } catch (error) {
    console.error('Detailed error in getProduct:', error);
    console.error('Query:', query);
    throw new Error(`Could not fetch product: ${error.message}`);
  }
}