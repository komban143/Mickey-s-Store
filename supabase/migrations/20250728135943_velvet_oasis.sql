/*
  # Create e-commerce schema for Mickey Mouse Kids Store

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `image_url` (text)
      - `category_id` (uuid, foreign key)
      - `stock_quantity` (integer)
      - `age_range` (text)
      - `created_at` (timestamp)
    
    - `product_images`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `image_url` (text)
      - `alt_text` (text)
      - `order_index` (integer)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `total_amount` (decimal)
      - `status` (text)
      - `shipping_address` (jsonb)
      - `created_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (decimal)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for products and categories
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
  price decimal(10,2) NOT NULL,
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
  total_amount decimal(10,2) NOT NULL,
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
  price decimal(10,2) NOT NULL
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access to products" ON products FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access to product_images" ON product_images FOR SELECT TO public USING (true);

CREATE POLICY "Users can manage their own cart items" ON cart_items FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
  ('Toys', 'Fun and educational Mickey Mouse toys', 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg'),
  ('Clothing', 'Adorable Mickey Mouse themed clothing', 'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg'),
  ('Books', 'Magical Disney storybooks and learning materials', 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg'),
  ('Accessories', 'Mickey Mouse bags, hats, and accessories', 'https://images.pexels.com/photos/1070360/pexels-photo-1070360.jpeg');

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category_id, stock_quantity, age_range) VALUES
  ('Mickey Mouse Plush Toy', 'Soft and cuddly Mickey Mouse plush perfect for bedtime', 24.99, 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg', (SELECT id FROM categories WHERE name = 'Toys'), 50, '0-5 years'),
  ('Minnie Mouse Dress', 'Beautiful red polka dot dress just like Minnie Mouse', 34.99, 'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg', (SELECT id FROM categories WHERE name = 'Clothing'), 30, '2-8 years'),
  ('Mickey Mouse Clubhouse Book', 'Join Mickey and friends on magical adventures', 12.99, 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg', (SELECT id FROM categories WHERE name = 'Books'), 100, '3-7 years'),
  ('Mickey Ears Backpack', 'School backpack with iconic Mickey ears', 29.99, 'https://images.pexels.com/photos/1070360/pexels-photo-1070360.jpeg', (SELECT id FROM categories WHERE name = 'Accessories'), 25, '3-12 years'),
  ('Disney Castle Playset', 'Magical Disney castle with Mickey and friends', 89.99, 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg', (SELECT id FROM categories WHERE name = 'Toys'), 15, '4-10 years'),
  ('Mickey Mouse T-Shirt', 'Classic Mickey Mouse graphic tee', 19.99, 'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg', (SELECT id FROM categories WHERE name = 'Clothing'), 40, '2-12 years');