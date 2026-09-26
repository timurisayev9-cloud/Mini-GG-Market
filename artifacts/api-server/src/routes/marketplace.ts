import { Router, type IRouter } from "express";
import {
  CreateProductBody,
  CreateReviewBody,
  CreateReviewParams,
  DeleteProductParams,
  GetDashboardSummaryResponse,
  ListProductsQueryParams,
  ListProductsResponse,
  UpdateProductBody,
  UpdateProductParams,
} from "@workspace/api-zod";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  imageUrl: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  status: string;
  createdAt: string;
};

const products: Product[] = [
  {
    id: 1,
    title: "PlayStation 5 Slim + 2 ta pult",
    price: 5_900_000,
    category: "Elektronika",
    condition: "Yangi",
    location: "Toshkent, Yunusobod",
    imageUrl:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=85",
    sellerName: "Gaming House",
    rating: 4.9,
    reviewCount: 24,
    status: "active",
    createdAt: "2026-09-17",
  },
  {
    id: 2,
    title: "MacBook Air M2 13-inch",
    price: 8_750_000,
    category: "Elektronika",
    condition: "Yaxshi",
    location: "Toshkent, Chilonzor",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85",
    sellerName: "Tech Loft",
    rating: 4.8,
    reviewCount: 18,
    status: "active",
    createdAt: "2026-09-16",
  },
  {
    id: 3,
    title: "Minimalist ish stoli",
    price: 1_250_000,
    category: "Uy va bog‘",
    condition: "Yaxshi",
    location: "Samarqand shahri",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
    sellerName: "Home Studio",
    rating: 4.6,
    reviewCount: 9,
    status: "active",
    createdAt: "2026-09-15",
  },
  {
    id: 4,
    title: "Nike Air Max original",
    price: 980_000,
    category: "Kiyim",
    condition: "Yangi",
    location: "Toshkent, Mirzo Ulug‘bek",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    sellerName: "Sneaker Lab",
    rating: 4.7,
    reviewCount: 31,
    status: "active",
    createdAt: "2026-09-14",
  },
];

let nextProductId = 5;
let nextReviewId = 1;
const reviews = [
  {
    id: 1,
    productId: 1,
    rating: 5,
    comment: "Juda tez yetkazib berishdi, mahsulot ham a’lo.",
    authorName: "Aziza K.",
    createdAt: "2026-09-17",
  },
];

const router: IRouter = Router();

router.get("/products", (req, res) => {
  const query = ListProductsQueryParams.parse(req.query);
  const search = query.q?.toLowerCase().trim();
  const result = products.filter((product) => {
    const matchesSearch =
      !search ||
      `${product.title} ${product.category} ${product.location}`
        .toLowerCase()
        .includes(search);
    const matchesCategory =
      !query.category || query.category === "Barchasi" || product.category === query.category;
    return matchesSearch && matchesCategory;
  });
  res.json(ListProductsResponse.parse(result));
});

router.post("/products", (req, res) => {
  const input = CreateProductBody.parse(req.body);
  const product: Product = {
    ...input,
    id: nextProductId++,
    rating: 0,
    reviewCount: 0,
    status: "active",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  products.unshift(product);
  res.status(201).json(product);
});

router.patch("/products/:id", (req, res) => {
  const { id } = UpdateProductParams.parse(req.params);
  const input = UpdateProductBody.parse(req.body);
  const product = products.find((item) => item.id === id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  Object.assign(product, input);
  return res.json(product);
});

router.delete("/products/:id", (req, res) => {
  const { id } = DeleteProductParams.parse(req.params);
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products.splice(index, 1);
  return res.status(204).send();
});

router.post("/products/:id/reviews", (req, res) => {
  const { id: productId } = CreateReviewParams.parse(req.params);
  const input = CreateReviewBody.parse(req.body);
  const product = products.find((item) => item.id === productId);
  if (!product) return res.status(404).json({ error: "Product not found" });
  const review = {
    ...input,
    id: nextReviewId++,
    productId,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  reviews.push(review);
  product.rating = Number(
    (
      (product.rating * product.reviewCount + input.rating) /
      (product.reviewCount + 1)
    ).toFixed(1),
  );
  product.reviewCount += 1;
  return res.status(201).json(review);
});

router.get("/dashboard/summary", (_req, res) => {
  const activeListings = products.filter((product) => product.status === "active").length;
  const averageRating =
    products.length === 0
      ? 0
      : Number(
          (products.reduce((total, product) => total + product.rating, 0) / products.length).toFixed(1),
        );
  return res.json(
    GetDashboardSummaryResponse.parse({
      totalProducts: products.length,
      activeListings,
      totalUsers: 128,
      totalOrders: 46,
      averageRating,
    }),
  );
});

export default router;