# Hướng dẫn Deploy lên VPS Ubuntu

## 1. Chuẩn bị VPS Ubuntu

### Cài đặt Docker và Docker Compose
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout và login lại để apply docker group
exit
# SSH lại vào VPS
```

## 2. Upload code lên VPS

### Cách 1: Sử dụng Git
```bash
# Clone repository
git clone <your-repo-url>
cd shop-microservice
```

### Cách 2: Upload file trực tiếp
```bash
# Sử dụng scp hoặc SFTP để upload files
scp -r ./shop-microservice user@your-vps-ip:/home/user/
```

## 3. Cấu hình Environment

### Tạo file .env cho production
```bash
# Backend .env
cd backend
cp .env.example .env
nano .env
```

Cập nhật `.env`:
```env
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_USERNAME=shop_user
DATABASE_PASSWORD=shop123
DATABASE_NAME=shop_db
JWT_SECRET=your_very_secure_jwt_secret_key_here
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://your-domain.com/checkout/vnpay_return
```

### Cập nhật Frontend API URL
```bash
# Frontend .env.local
cd frontend
nano .env.local
```

Cập nhật:
```env
NEXT_PUBLIC_API_URL=http://your-domain.com:3001
```

## 4. Deploy với Docker Compose

```bash
# Build và start containers
docker-compose up -d --build

# Kiểm tra logs
docker-compose logs -f

# Kiểm tra containers đang chạy
docker-compose ps
```

## 5. Cấu hình Nginx (Optional)

### Cài đặt Nginx
```bash
sudo apt install nginx -y
```

### Tạo Nginx config
```bash
sudo nano /etc/nginx/sites-available/shop-microservice
```

Nội dung:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable site
```bash
sudo ln -s /etc/nginx/sites-available/shop-microservice /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 6. Cấu hình Firewall

```bash
# Mở ports cần thiết
sudo ufw allow 22    # SSH
sudo ufw allow 80     # HTTP
sudo ufw allow 443    # HTTPS
sudo ufw allow 3000   # Frontend
sudo ufw allow 3001   # Backend
sudo ufw enable
```

## 7. SSL Certificate (Optional)

### Sử dụng Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## 8. Monitoring và Maintenance

### Kiểm tra logs
```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# Database logs
docker-compose logs mysql
```

### Backup database
```bash
# Tạo backup
docker-compose exec mysql mysqldump -u shop_user -pshop123 shop_db > backup.sql

# Restore backup
docker-compose exec -T mysql mysql -u shop_user -pshop123 shop_db < backup.sql
```

### Update application
```bash
# Pull latest code
git pull

# Rebuild và restart
docker-compose down
docker-compose up -d --build
```

## 9. Troubleshooting

### Kiểm tra container status
```bash
docker-compose ps
docker-compose logs [service-name]
```

### Restart services
```bash
docker-compose restart [service-name]
```

### Access container shell
```bash
docker-compose exec [service-name] sh
```

## 10. Performance Optimization

### Tăng memory cho containers
```yaml
# Trong docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
  frontend:
    deploy:
      resources:
        limits:
          memory: 256M
```

### Enable Docker logging rotation
```yaml
# Trong docker-compose.yml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Kết quả

Sau khi deploy thành công:
- **Frontend:** http://your-domain.com:3000
- **Backend API:** http://your-domain.com:3001
- **Database:** MySQL trên port 3306

## Lưu ý bảo mật

1. **Thay đổi passwords mặc định**
2. **Cấu hình JWT_SECRET mạnh**
3. **Bật UFW firewall**
4. **Sử dụng HTTPS**
5. **Regular backups**
6. **Monitor logs** 