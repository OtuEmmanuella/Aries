import { Rule, SchemaTypeDefinition } from '@sanity/types';
import { nanoid } from 'nanoid';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Product Schema
  {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (rule: Rule) => rule.required(),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'name',
          maxLength: 96,
          slugify: () => nanoid(8),
        },
        validation: (rule: Rule) => rule.required(),
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
      },
      {
        name: 'images',
        title: 'Images',
        type: 'array',
        of: [{ type: 'image', options: { hotspot: true } }],
        validation: (rule: Rule) => rule.required().min(1),
      },
      {
        name: 'price',
        title: 'Price',
        type: 'number',
        validation: (rule: Rule) => rule.required().positive(),
      },
      {
        name: 'compareAtPrice',
        title: 'Compare at Price',
        type: 'number',
        validation: (rule: Rule) => rule.positive(),
      },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
        options: {
          list: [
            { title: 'Men', value: 'men' },
            { title: 'Women', value: 'women' },
            { title: 'Footwear', value: 'footwear' },
            { title: 'Beauty', value: 'beauty' },
            { title: 'Gadgets', value: 'gadgets' },
          ],
        },
        validation: (rule: Rule) => rule.required(),
      },
      {
        name: 'subcategory',
        title: 'Subcategory',
        type: 'string',
        options: {
          list: [
            { title: 'Shirts', value: 'shirts' },
            { title: 'Pants', value: 'pants' },
            { title: 'Sneakers', value: 'sneakers' },
            { title: 'Caps', value: 'caps' },
            { title: 'Shorts', value: 'shorts' },
            { title: 'Bags', value: 'bags' },
            { title: 'Accessories', value: 'accessories' },
            { title: 'Dresses', value: 'dresses' },
            { title: 'Sandals', value: 'sandals' },
            { title: 'Boots', value: 'boots' },
            { title: 'Makeup', value: 'makeup' },
            { title: 'Skincare', value: 'skincare' },
            { title: 'Haircare', value: 'haircare' },
            { title: 'Laptops', value: 'laptops' },
            { title: 'Macbooks', value: 'macbooks' },
            { title: 'Phones', value: 'phones' },
            { title: 'Tablets', value: 'tablets' },
            { title: 'Smartwatches', value: 'smartwatches' },
            { title: 'Airpods', value: 'airpods' },

          ],
        },
        validation: (rule: Rule) => rule.required(),
      },
      {
        name: 'brand',
        title: 'Brand',
        type: 'string',
        options: {
          list: [
            { title: 'Nike', value: 'nike' },
            { title: 'Adidas', value: 'adidas' },
            { title: 'Zara', value: 'zara' },
            { title: 'H&M', value: 'hm' },
            { title: "Balenciaga", value: 'balenciaga' },
            { title: 'Apple', value: 'apple' },
            { title: 'Samsung', value: 'samsung' },
            { title: 'HP', value: 'hp' },
            { title: 'Dell', value: 'dell' },
            { title: 'Gymshark', value: 'gymshark' },
            { title: 'Strathberry', value: 'strathberry' },

          ],
        },
      },
      {
        name: 'collections',
        title: 'Collections',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'variants',
        title: 'Variants',
        type: 'array',
        of: [{ type: 'productVariant' }],
      },
      {
        name: 'features',
        title: 'Features',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'specs',
        title: 'Specifications',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              { name: 'key', type: 'string', title: 'Key', validation: (rule: Rule) => rule.required() },
              { name: 'value', type: 'string', title: 'Value', validation: (rule: Rule) => rule.required() },
            ],
          },
        ],
      },
      {
        name: 'status',
        title: 'Status',
        type: 'string',
        options: {
          list: [
            { title: 'Draft', value: 'draft' },
            { title: 'Published', value: 'published' },
            { title: 'Archived', value: 'archived' },
          ],
        },
        initialValue: 'draft',
        validation: (rule: Rule) => rule.required(),
      },
      {
        name: 'tags',
        title: 'Tags',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'seo',
        title: 'SEO',
        type: 'seo',
      },
      {
        name: 'productType',
        title: 'Product Type',
        type: 'string',
        options: {
          list: [
            { title: 'Clothing', value: 'clothing' },
            { title: 'Footwear', value: 'footwear' },
            { title: 'Beauty', value: 'beauty' },
            { title: 'Gadget', value: 'gadget' },
            { title: 'Accessories', value: 'accessories' },
          ],
        },
        validation: (rule: Rule) => rule.required(),
      },
      {
        name: 'clothingDetails',
        title: 'Clothing Details',
        type: 'clothingDetails',
        hidden: ({ document }) => document?.productType !== 'clothing',
      },
      {
        name: 'footwearDetails',
        title: 'Footwear Details',
        type: 'footwearDetails',
        hidden: ({ document }) => document?.productType !== 'footwear',
      },
      {
        name: 'beautyDetails',
        title: 'Beauty Details',
        type: 'beautyDetails',
        hidden: ({ document }) => document?.productType !== 'beauty',
      },
      {
        name: 'gadgetDetails',
        title: 'Gadget Details',
        type: 'gadgetDetails',
        hidden: ({ document }) => document?.productType !== 'gadget',
      },
    ],
  },
  // Clothing Details Schema
  {
    name: 'clothingDetails',
    title: 'Clothing Details',
    type: 'object',
    fields: [
      {
        name: 'size',
        title: 'Size',
        type: 'array',
        of: [{ type: 'string' }],
        options: {
          list: [
            { title: 'XS', value: 'xs' },
            { title: 'S', value: 's' },
            { title: 'M', value: 'm' },
            { title: 'L', value: 'l' },
            { title: 'XL', value: 'xl' },
            { title: 'XXL', value: 'xxl' },
          ],
        },
      },
      {
        name: 'color',
        title: 'Color',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'material',
        title: 'Material',
        type: 'string',
      },
      {
        name: 'fit',
        title: 'Fit',
        type: 'string',
        options: {
          list: [
            { title: 'Regular', value: 'regular' },
            { title: 'Slim', value: 'slim' },
            { title: 'Relaxed', value: 'relaxed' },
            { title: 'Oversized', value: 'oversized' },
          ],
        },
      },
      {
        name: 'pattern',
        title: 'Pattern',
        type: 'string',
      },
      {
        name: 'season',
        title: 'Season',
        type: 'string',
        options: {
          list: [
            { title: 'Summer', value: 'summer' },
            { title: 'Winter', value: 'winter' },
            { title: 'Spring', value: 'spring' },
            { title: 'Autumn', value: 'autumn' },
          ],
        },
      },
      {
        name: 'gender',
        title: 'Gender',
        type: 'string',
        options: {
          list: [
            { title: 'Men', value: 'men' },
            { title: 'Women', value: 'women' },
            { title: 'Unisex', value: 'unisex' },
          ],
        },
      },
    ],
  },
  // Footwear Details Schema
  {
    name: 'footwearDetails',
    title: 'Footwear Details',
    type: 'object',
    fields: [
      {
        name: 'size',
        title: 'Size',
        type: 'array',
        of: [{ type: 'number' }],
      },
      {
        name: 'color',
        title: 'Color',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'material',
        title: 'Material',
        type: 'string',
      },
      {
        name: 'style',
        title: 'Style',
        type: 'string',
      },
      {
        name: 'gender',
        title: 'Gender',
        type: 'string',
        options: {
          list: [
            { title: 'Men', value: 'men' },
            { title: 'Women', value: 'women' },
            { title: 'Unisex', value: 'unisex' },
          ],
        },
      },
    ],
  },
  // Beauty Details Schema
  {
    name: 'beautyDetails',
    title: 'Beauty Details',
    type: 'object',
    fields: [
      {
        name: 'type',
        title: 'Type',
        type: 'string',
        options: {
          list: [
            { title: 'Makeup', value: 'makeup' },
            { title: 'Skincare', value: 'skincare' },
            { title: 'Haircare', value: 'haircare' },
          ],
        },
      },
      {
        name: 'ingredients',
        title: 'Ingredients',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'skinType',
        title: 'Skin Type',
        type: 'string',
        options: {
          list: [
            { title: 'All', value: 'all' },
            { title: 'Oily', value: 'oily' },
            { title: 'Dry', value: 'dry' },
            { title: 'Combination', value: 'combination' },
            { title: 'Sensitive', value: 'sensitive' },
          ],
        },
      },
      {
        name: 'volume',
        title: 'Volume',
        type: 'string',
      },
    ],
  },
  // Gadget Details Schema
  {
    name: 'gadgetDetails',
    title: 'Gadget Details',
    type: 'object',
    fields: [
      {
        name: 'type',
        title: 'Type',
        type: 'string',
        options: {
          list: [
            { title: 'Smartphone', value: 'smartphone' },
            { title: 'Laptop', value: 'laptop' },
            { title: 'Macbook', value: 'macbook' },
            { title: 'Tablet', value: 'tablet' },
            { title: 'Smartwatch', value: 'smartwatch' },
            { title: 'Airpods', value: 'airpods' },

          ],
        },
      },
      {
        name: 'model',
        title: 'Model',
        type: 'string',
      },
      {
        name: 'storage',
        title: 'Storage',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'ram',
        title: 'RAM',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'screenSize',
        title: 'Screen Size',
        type: 'string',
      },
      {
        name: 'resolution',
        title: 'Screen Resolution',
        type: 'string',
      },
      {
        name: 'processor',
        title: 'Processor',
        type: 'string',
      },
      {
        name: 'operatingSystem',
        title: 'Operating System',
        type: 'string',
      },
    ],
  },
  // Product Variant Schema
  {
    name: 'productVariant',
    title: 'Product Variant',
    type: 'object',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (rule: Rule) => rule.required(),
      },
      {
        name: 'sku',
        title: 'SKU',
        type: 'string',
        validation: (rule: Rule) => rule.required(),
      },
      {
        name: 'price',
        title: 'Price',
        type: 'number',
        validation: (rule: Rule) => rule.required().positive(),
      },
      {
        name: 'compareAtPrice',
        title: 'Compare at Price',
        type: 'number',
      },
      {
        name: 'inventory',
        title: 'Inventory',
        type: 'inventory',
      },
    ],
  },
  // Inventory Schema
  {
    name: 'inventory',
    title: 'Inventory',
    type: 'object',
    fields: [
      {
        name: 'quantity',
        title: 'Quantity',
        type: 'number',
        validation: (rule: Rule) => rule.required().min(0),
      },
      {
        name: 'warehouseLocation',
        title: 'Warehouse Location',
        type: 'string',
      },
      {
        name: 'backorder',
        title: 'Backorder',
        type: 'boolean',
        initialValue: false,
      },
      {
        name: 'inStock',
        title: 'In Stock',
        type: 'boolean',
        initialValue: true,
      },
      {
        name: 'lowStockThreshold',
        title: 'Low Stock Threshold',
        type: 'number',
        validation: (rule: Rule) => rule.positive().integer(),
      },
    ],
  },
  // SEO Schema
  {
    name: 'seo',
    title: 'SEO',
    type: 'object',
    fields: [
      {
        name: 'title',
        title: 'SEO Title',
        type: 'string',
        validation: (rule: Rule) => rule.max(60),
      },
      {
        name: 'description',
        title: 'SEO Description',
        type: 'text',
        validation: (rule: Rule) => rule.max(160),
      },
      {
        name: 'keywords',
        title: 'SEO Keywords',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'canonicalUrl',
        title: 'Canonical URL',
        type: 'url',
      },
    ],
  },
];

export default schemaTypes;