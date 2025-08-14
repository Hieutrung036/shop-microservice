# Shop Microservice

E-commerce platform built with React.js (Next.js) frontend and NestJS backend, running in Docker containers.

## 🚀 Features

### Customer Features
- ✅ User registration and login
- ✅ Product browsing and search
- ✅ Shopping cart management
- ✅ Multiple payment methods (COD, VNPay, MoMo, ZaloPay, Bank Transfer)
- ✅ Order tracking and history
- ✅ Address management
- ✅ Responsive mobile UI

### Admin Features
- ✅ Product management (CRUD)
- ✅ Order management with status updates
- ✅ User management
- ✅ Category and brand management
- ✅ Discount management
- ✅ Mobile-responsive admin dashboard

### Technical Features
- ✅ JWT Authentication
- ✅ RESTful API
- ✅ MySQL Database
- ✅ Docker containerization
- ✅ VPS deployment ready
- ✅ Payment gateway integration (VNPay)
- ✅ Shipping calculation (GHN API)
- ✅ File upload for product images

## 🛠 Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript, TypeORM
- **Database:** MySQL 8.0
- **Authentication:** JWT
- **Payment:** VNPay, MoMo, ZaloPay
- **Shipping:** Giao Hàng Nhanh (GHN) API
- **Deployment:** Docker, Docker Compose

## 📁 Project Structure

```
shop-microservice/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   └── public/             # Static assets
├── backend/                 # NestJS backend
│   ├── src/                # Source code
│   │   ├── auth/           # Authentication
│   │   ├── user/           # User management
│   │   ├── product/        # Product management
│   │   ├── order/          # Order management
│   │   ├── cart/           # Cart management
│   │   ├── vnpay/          # VNPay integration
│   │   └── shipping/       # Shipping calculation
│   └── uploads/            # File uploads
├── docker-compose.yml      # Docker configuration
├── DEPLOY_VPS.md          # VPS deployment guide
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Local Development

1. **Clone repository**
```bash
git clone <repository-url>
cd shop-microservice
```

2. **Environment setup**
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration

# Frontend
cd ../frontend
cp .env.example .env.local
# Edit .env.local with your API URL
```

3. **Start with Docker**
```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

4. **Access applications**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:3306

### Local Development (without Docker)

1. **Backend**
```bash
cd backend
npm install
npm run start:dev
```

2. **Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=shop_user
DATABASE_PASSWORD=shop123
DATABASE_NAME=shop_db
JWT_SECRET=your_jwt_secret_key
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/checkout/vnpay_return
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📱 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /user/change-password` - Change password

### Products
- `GET /product` - Get all products
- `GET /product/:id` - Get product by ID
- `POST /product` - Create product (Admin)
- `PUT /product/:id` - Update product (Admin)
- `DELETE /product/:id` - Delete product (Admin)

### Orders
- `GET /order` - Get all orders (Admin)
- `GET /order/user/:userId` - Get user orders
- `POST /order` - Create order
- `PUT /order/:id` - Update order status

### Cart
- `GET /cart` - Get user cart
- `POST /cart` - Add to cart
- `PUT /cart/:id` - Update cart item
- `DELETE /cart/:id` - Remove from cart

### Payment
- `POST /vnpay/create-payment` - Create VNPay payment
- `POST /vnpay/verify-return` - Verify VNPay callback

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# View logs
docker-compose logs -f [service-name]

# Access container shell
docker-compose exec [service-name] sh

# Backup database
docker-compose exec mysql mysqldump -u shop_user -pshop123 shop_db > backup.sql
```

## 🌐 Deployment

See [DEPLOY_VPS.md](./DEPLOY_VPS.md) for detailed VPS deployment instructions.

### Quick VPS Deploy
```bash
# On your VPS
git clone <repository-url>
cd shop-microservice
docker-compose up -d --build
```

## 🔐 Security

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended for production)

## 📊 Database Schema

### Main Tables
- `users` - User accounts
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items
- `cart_items` - Shopping cart
- `addresses` - User addresses
- `categories` - Product categories
- `brands` - Product brands

## 🎨 UI/UX Features

- Responsive design (mobile-first)
- Modern UI with Tailwind CSS
- Smooth animations and transitions
- Intuitive navigation
- Loading states and error handling
- Toast notifications

## 🔄 Payment Integration

### VNPay
- ✅ Sandbox and production environments
- ✅ Payment creation and verification
- ✅ Callback handling
- ✅ Error handling

### Other Payment Methods
- ✅ COD (Cash on Delivery)
- ✅ Bank Transfer (with account details)
- ⚠️ MoMo (requires merchant registration)
- ⚠️ ZaloPay (requires merchant registration)

## 🚚 Shipping Integration

### GHN (Giao Hàng Nhanh)
- ✅ Shipping fee calculation
- ✅ Delivery time estimation
- ✅ Address validation
- ✅ Multiple shipping methods

## 📱 Mobile Responsiveness

- ✅ Admin dashboard mobile UI
- ✅ Customer pages mobile UI
- ✅ Responsive tables and forms
- ✅ Touch-friendly interactions

## 🧪 Testing

### API Testing
- Use Postman or similar tools
- Test all endpoints with proper authentication
- Verify payment flows
- Test error scenarios

### Manual Testing
- User registration and login
- Product browsing and cart
- Checkout process
- Admin functions
- Payment integration

## 🚀 Performance

- Database indexing
- Image optimization
- Lazy loading
- Caching strategies
- CDN ready

## 📈 Monitoring

- Docker container monitoring
- Application logs
- Database performance
- Error tracking
- Uptime monitoring

## 🔧 Maintenance

### Regular Tasks
- Database backups
- Log rotation
- Security updates
- Performance monitoring
- SSL certificate renewal

### Updates
```bash
# Pull latest code
git pull

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the documentation
- Review the logs
- Test in isolation
- Create detailed bug reports

## 🎯 Roadmap

- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Wishlist feature
- [ ] Product reviews
- [ ] Advanced admin features

---

**Built with ❤️ using Next.js, NestJS, and Docker** 