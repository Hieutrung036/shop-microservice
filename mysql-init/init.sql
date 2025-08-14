-- Insert sample data for shop_db

-- Insert categories
INSERT INTO category (name, description) VALUES 
('Thương hiệu', 'Các thương hiệu nổi tiếng'),
('Khuyến mãi', 'Sản phẩm đang khuyến mãi'),
('Pre-Order', 'Sản phẩm đặt trước');

-- Insert brands
INSERT INTO brand (name, description) VALUES 
('CMC', 'CMC Exclusive Models'),
('BBB', 'BBB Brand'),
('XEMH', 'XEMH Collection');

-- Insert products
INSERT INTO product (name, description, price, category_id, brand_id, stock) VALUES 
('CMC Exclusive Model', 'Mô hình CMC độc quyền', 1500000, 1, 1, 10),
('BBB Premium', 'Sản phẩm BBB cao cấp', 800000, 1, 2, 15),
('XEMH Special', 'Bộ sưu tập XEMH đặc biệt', 1200000, 1, 3, 8);

-- Insert users
INSERT INTO user (username, email, password, role) VALUES 
('hieu123', 'hieu123@example.com', '$2b$10$hashedpassword', 'user'),
('admin', 'admin@example.com', '$2b$10$hashedpassword', 'admin'); 