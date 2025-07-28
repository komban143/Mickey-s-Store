/*
  # Create E-commerce Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, nullable)
      - `image_url` (text, nullable)
      - `created_at` (timestamp)
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, nullable)
      - `price` (numeric, not null)
      - `image_url` (text, nullable)
      - `category_id` (uuid, foreign key)
      - `stock_quantity` (integer, default 0)
      - `age_range` (text, nullable)
      - `created_at` (timestamp)
    - `product_images`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `image_url` (text, not null)
      - `alt_text` (text, nullable)
      - `order_index` (integer, default 0)
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer, default 1)
      - `created_at` (timestamp)
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `total_amount` (numeric, not null)
      - `status` (text, default 'pending')
      - `shipping_address` (jsonb, nullable)
      - `created_at` (timestamp)
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer, default 1)
      - `price` (numeric, not null)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to categories and products
    - Add policies for authenticated users to manage their cart and orders

  3. Sample Data
    - Insert sample categories (Toys, Clothing, Books, Accessories)
    - Insert sample products with Mickey Mouse theme
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  category_id uuid REFERENCES categories(id),
  stock_quantity integer DEFAULT 0,
  age_range text,
  created_at timestamptz DEFAULT now()
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  order_index integer DEFAULT 0
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  shipping_address jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer DEFAULT 1,
  price numeric(10,2) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read)
CREATE POLICY "Allow public read access to categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Create policies for products (public read)
CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Create policies for product_images (public read)
CREATE POLICY "Allow public read access to product_images"
  ON product_images
  FOR SELECT
  TO public
  USING (true);

-- Create policies for cart_items (authenticated users can manage their own)
CREATE POLICY "Users can manage their own cart items"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for orders (authenticated users can manage their own)
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for order_items (users can view their own order items)
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
  ('Toys', 'Fun and magical toys for kids', 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg'),
  ('Clothing', 'Comfortable and stylish kids clothing', 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg'),
  ('Books', 'Educational and entertaining books', 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg'),
  ('Accessories', 'Fun accessories and collectibles', 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg');

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category_id, stock_quantity, age_range) VALUES
  -- Toys
  ('Mickey Mouse Plush Toy', 'Soft and cuddly Mickey Mouse plush perfect for bedtime stories', 24.99, 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg', (SELECT id FROM categories WHERE name = 'Toys'), 50, '3-8 years'),
  ('Minnie Mouse Tea Set', 'Adorable tea set for pretend play with Minnie Mouse design', 19.99, 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg', (SELECT id FROM categories WHERE name = 'Toys'), 30, '4-10 years'),
  ('Mickey Mouse Building Blocks', 'Colorful building blocks featuring Mickey and friends', 34.99, 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg', (SELECT id FROM categories WHERE name = 'Toys'), 25, '3-7 years'),
  ('Disney Castle Playset', 'Magical castle playset with Mickey Mouse characters', 89.99, 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg', (SELECT id FROM categories WHERE name = 'Toys'), 15, '5-12 years'),
  
  -- Clothing
  ('Mickey Mouse T-Shirt', 'Comfortable cotton t-shirt with classic Mickey Mouse print', 14.99, 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg', (SELECT id FROM categories WHERE name = 'Clothing'), 100, '2-12 years'),
  ('Minnie Mouse Dress', 'Beautiful polka dot dress inspired by Minnie Mouse', 29.99, 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg', (SELECT id FROM categories WHERE name = 'Clothing'), 40, '3-10 years'),
  ('Mickey Mouse Pajamas', 'Cozy pajama set perfect for sweet dreams', 22.99, 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg', (SELECT id FROM categories WHERE name = 'Clothing'), 60, '2-10 years'),
  ('Disney Hoodie', 'Warm hoodie featuring Mickey and friends', 39.99, 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg', (SELECT id FROM categories WHERE name = 'Clothing'), 35, '4-14 years'),
  
  -- Books
  ('Mickey Mouse Adventure Book', 'Exciting adventure stories with Mickey and friends', 12.99, 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg', (SELECT id FROM categories WHERE name = 'Books'), 80, '4-8 years'),
  ('Disney Learning Book', 'Educational book with Disney characters teaching ABCs', 16.99, 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg', (SELECT id FROM categories WHERE name = 'Books'), 45, '3-6 years'),
  ('Minnie Mouse Coloring Book', 'Fun coloring book with Minnie Mouse designs', 8.99, 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg', (SELECT id FROM categories WHERE name = 'Books'), 120, '3-10 years'),
  ('Disney Storybook Collection', 'Collection of classic Disney stories', 24.99, 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg', (SELECT id FROM categories WHERE name = 'Books'), 30, '4-12 years'),
  
  -- Accessories
  ('Mickey Mouse Backpack', 'Stylish backpack perfect for school or adventures', 32.99, 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg', (SELECT id FROM categories WHERE name = 'Accessories'), 40, '5-12 years'),
  ('Minnie Mouse Hair Bow', 'Adorable hair bow set inspired by Minnie Mouse', 9.99, 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg', (SELECT id FROM categories WHERE name = 'Accessories'), 75, '3-12 years'),
  ('Mickey Mouse Watch', 'Fun and colorful watch featuring Mickey Mouse', 18.99, 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg', (SELECT id FROM categories WHERE name = 'Accessories'), 50, '6-14 years'),
  ('Disney Lunch Box', 'Insulated lunch box with Mickey and friends design', 15.99, 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg', (SELECT id FROM categories WHERE name = 'Accessories'), 65, '4-12 years');