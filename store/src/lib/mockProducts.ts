export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  base_price: string;
  stock_quantity: number;
  brand: string;
  category_name: string;
  attributes: Record<string, string | number>;
  images: Array<{ id: number; image_url: string; is_primary: boolean; display_order: number }> | null;
  variants: Array<{ id: number; name: string; price_override: string | null; stock_quantity: number }> | null;
}

export const mockGoodThingsProducts: Product[] = [
  {
    id: 101,
    sku: "GT-PUFFER-01",
    name: "Chamarra Puffer Acolchada Térmica con Capucha",
    description: "Chamarra acolchada con aislamiento térmico ligero, cuello alto protector y acabado resistente al viento. Ideal para días fríos y salidas casuales.",
    base_price: "299.00",
    stock_quantity: 8,
    brand: "GoodThings",
    category_name: "Suéteres & Abrigos",
    attributes: { "Material": "100% Poliéster reciclado", "Corte": "Regular Fit", "Color": "Negro Clásico" },
    images: [
      { id: 1, image_url: "/images/cat_puffer.jpg", is_primary: true, display_order: 1 },
      { id: 2, image_url: "/images/campus_cool.jpg", is_primary: false, display_order: 2 }
    ],
    variants: [
      { id: 1, name: "Talla S", price_override: null, stock_quantity: 3 },
      { id: 2, name: "Talla M", price_override: null, stock_quantity: 3 },
      { id: 3, name: "Talla L", price_override: null, stock_quantity: 2 }
    ]
  },
  {
    id: 102,
    sku: "GT-JEANS-02",
    name: "Jeans Straight Fit Denim Lavado Auténtico",
    description: "Jeans de corte recto en mezclilla de algodón suave con tecnología flex para mayor movilidad y comodidad durante todo el día.",
    base_price: "249.00",
    stock_quantity: 12,
    brand: "GoodThings",
    category_name: "Jeans",
    attributes: { "Material": "99% Algodón, 1% Elastano", "Tiro": "Medio", "Estilo": "Straight Leg" },
    images: [
      { id: 3, image_url: "/images/cat_jeans.jpg", is_primary: true, display_order: 1 },
      { id: 4, image_url: "/images/fit_for_fall.jpg", is_primary: false, display_order: 2 }
    ],
    variants: [
      { id: 4, name: "30x32", price_override: null, stock_quantity: 4 },
      { id: 5, name: "32x32", price_override: null, stock_quantity: 5 },
      { id: 6, name: "34x32", price_override: null, stock_quantity: 3 }
    ]
  },
  {
    id: 103,
    sku: "GT-HOODIE-03",
    name: "Sudadera Fleece Pullover con Capucha Softest",
    description: "Sudadera con forro interior ultra afelpado, bolsillo de canguro frontal y cordones ajustables en tono naranja vibrante de temporada.",
    base_price: "189.00",
    stock_quantity: 6,
    brand: "GoodThings",
    category_name: "Hombre",
    attributes: { "Tejido": "Fleece de Algodón Cepillado", "Color": "Naranja Otoño" },
    images: [
      { id: 5, image_url: "/images/cat_hoodie.jpg", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: 7, name: "Talla M", price_override: null, stock_quantity: 3 },
      { id: 8, name: "Talla L", price_override: null, stock_quantity: 3 }
    ]
  },
  {
    id: 104,
    sku: "GT-SWEATER-04",
    name: "Suéter Crewneck Tejido Acanalado Rib Clásico",
    description: "Elegante suéter en punto acanalado grueso de tacto ultra suave en gris carbón. Una prenda esencial para combinar en cualquier ocasión.",
    base_price: "229.00",
    stock_quantity: 5,
    brand: "GoodThings",
    category_name: "Suéteres & Abrigos",
    attributes: { "Composición": "Algodón & Fibras Térmicas", "Estilo": "Crewneck" },
    images: [
      { id: 6, image_url: "/images/cat_sweater.jpg", is_primary: true, display_order: 1 }
    ],
    variants: null
  },
  {
    id: 105,
    sku: "GT-FLANNEL-05",
    name: "Camisa de Franela a Cuadros Tartán Rojo & Azul",
    description: "Camisa de manga larga confeccionada en suave franela de algodón peinado, con doble bolsillo frontal y corte relajado.",
    base_price: "199.00",
    stock_quantity: 9,
    brand: "GoodThings",
    category_name: "Hombre",
    attributes: { "Material": "100% Algodón Franela", "Estilo": "Casual Plaid" },
    images: [
      { id: 7, image_url: "/images/cat_flannel.jpg", is_primary: true, display_order: 1 }
    ],
    variants: null
  },
  {
    id: 106,
    sku: "GT-JAMMIES-06",
    name: "Set Familiar de Pijamas Festivas Jingle Jammies",
    description: "El conjunto navideño más esperado para toda la familia. Algodón elástico respirable con diseño de rayas y cuadros en rojo y blanco.",
    base_price: "259.00",
    stock_quantity: 15,
    brand: "GoodThings",
    category_name: "Pijamas",
    attributes: { "Familia": "Unisex Adulto & Niños", "Estilo": "Holiday Pajamas" },
    images: [
      { id: 8, image_url: "/images/hero_pajamas.jpg", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: 9, name: "Adulto S", price_override: null, stock_quantity: 5 },
      { id: 10, name: "Adulto M", price_override: null, stock_quantity: 5 },
      { id: 11, name: "Infantil 6-8", price_override: "199.00", stock_quantity: 5 }
    ]
  },
  {
    id: 107,
    sku: "GT-SWEATER-CREAM-07",
    name: "Suéter Grueso Cuello Tortuga Cable-Knit Crema",
    description: "La joya de la temporada invernal. Tejido en ochos decorativos con tacto acogedor en tono crema marfil.",
    base_price: "279.00",
    stock_quantity: 4,
    brand: "GoodThings",
    category_name: "Mujer",
    attributes: { "Talla": "Oversized Fit", "Color": "Crema Marfil" },
    images: [
      { id: 9, image_url: "/images/sweater_weather.jpg", is_primary: true, display_order: 1 }
    ],
    variants: null
  },
  {
    id: 108,
    sku: "GT-HOODIE-PASTEL-08",
    name: "Sudadera Pastel Softest Fleece Celeste Cielo",
    description: "Sudadera en tono azul celeste pastel con tela de felpa cepillada ultra liviana y cálida, puños reforzados y capucha.",
    base_price: "219.00",
    stock_quantity: 7,
    brand: "GoodThings",
    category_name: "Mujer",
    attributes: { "Color": "Pastel Sky Blue", "Colección": "Softest Sweats" },
    images: [
      { id: 10, image_url: "/images/softest_sweats.jpg", is_primary: true, display_order: 1 }
    ],
    variants: null
  },
  {
    id: 109,
    sku: "GT-CHINO-09",
    name: "Pantalón Casual Chino Slim-Straight Khaki",
    description: "Pantalón versátil en sarga de algodón elástico con bolsillos delanteros y traseros. Perfecto para la oficina y el fin de semana.",
    base_price: "239.00",
    stock_quantity: 10,
    brand: "GoodThings",
    category_name: "Hombre",
    attributes: { "Corte": "Slim-Straight", "Color": "Khaki Clásico" },
    images: [
      { id: 11, image_url: "/images/cat_pants.jpg", is_primary: true, display_order: 1 }
    ],
    variants: null
  },
  {
    id: 110,
    sku: "GT-BABY-ONESIE-10",
    name: "Mameluco Polar Footed Sleeper Bebé Rayas Pastel",
    description: "Mameluco enterizo con pies antideslizantes y cierre completo de dos vías para cambiar fácilmente. 100% algodón hipoalergénico suave.",
    base_price: "129.00",
    stock_quantity: 14,
    brand: "GoodThings",
    category_name: "Bebes",
    attributes: { "Edad": "0 a 24 Meses", "Material": "100% Algodón Suave" },
    images: [
      { id: 12, image_url: "/images/cat_baby.jpg", is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: 12, name: "3-6 Meses", price_override: null, stock_quantity: 4 },
      { id: 13, name: "6-12 Meses", price_override: null, stock_quantity: 5 },
      { id: 14, name: "12-18 Meses", price_override: null, stock_quantity: 5 }
    ]
  },
  {
    id: 111,
    sku: "GT-BEANIE-SCARF-11",
    name: "Gorro Tejido Pom-Pom & Accesorios de Invierno",
    description: "Gorro de lana suave con pompón decorativo y forro térmico. Ideal para regalo o para complementar tus atuendos en días fríos.",
    base_price: "89.00",
    stock_quantity: 18,
    brand: "GoodThings",
    category_name: "Salud",
    attributes: { "Colección": "Stocking Stuffer Central", "Tipo": "Gorro & Accesorios" },
    images: [
      { id: 13, image_url: "/images/snowman_gifts.jpg", is_primary: true, display_order: 1 }
    ],
    variants: null
  },
  {
    id: 112,
    sku: "GT-VARSITY-12",
    name: "Chamarra Bomber Varsity Collegiate Retro Vintage",
    description: "Chamarra estilo universitario americano en lana combinada con mangas en contraste, botones a presión metálicos y parches bordados.",
    base_price: "349.00",
    stock_quantity: 3,
    brand: "GoodThings",
    category_name: "Hombre",
    attributes: { "Colección": "Campus Cool For Men", "Estilo": "Retro Varsity" },
    images: [
      { id: 14, image_url: "/images/campus_cool.jpg", is_primary: true, display_order: 1 }
    ],
    variants: null
  }
];
