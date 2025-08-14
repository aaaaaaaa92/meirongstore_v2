# 美容预约系统

一个基于 Next.js 和 Supabase 的美容服务预约系统，支持用户在线预约和后台管理。

## 功能特点

- 🎯 **在线预约**: 用户可以选择服务项目、日期和时间进行预约
- 📋 **预约管理**: 查看、搜索和管理所有预约记录
- 💼 **服务管理**: 管理美容服务项目和价格
- 📱 **响应式设计**: 支持手机、平板和桌面设备
- 🔒 **数据安全**: 基于 Supabase 的安全数据存储

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **后端**: Supabase (PostgreSQL + API)
- **部署**: Vercel (推荐)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env.local`，然后填入你的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 设置数据库

在 Supabase 数据库中执行以下 SQL 创建必要的表：

```sql
-- 用户表
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    phone VARCHAR(20),
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 服务项目表
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 预约表
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    service_id UUID REFERENCES services(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(appointment_date, appointment_time, service_id)
);

-- 插入示例服务数据
INSERT INTO services (name, description, duration, price) VALUES
('基础面部护理', '深层清洁、保湿、按摩', 60, 188.00),
('深层补水面膜', '玻尿酸补水面膜，适合干性肌肤', 45, 158.00),
('美白淡斑护理', '专业美白产品，改善肌肤色素沉着', 90, 288.00),
('眼部护理', '眼周肌肤护理，减少细纹', 30, 128.00),
('经典美甲', '修甲、护甲、上色', 60, 88.00);
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
├── app/                    # Next.js 13+ App Router
│   ├── layout.tsx         # 全局布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── BookingForm.tsx    # 预约表单
│   └── BookingList.tsx    # 预约列表
├── lib/                   # 工具库
│   └── supabase.ts        # Supabase 客户端配置
└── README.md              # 项目说明
```

## 主要功能

### 用户预约流程

1. 选择服务项目
2. 选择预约日期和时间
3. 填写客户信息
4. 提交预约

### 预约管理

- 查看所有预约记录
- 根据手机号搜索
- 按状态筛选预约
- 更新预约状态（确认/取消/完成）

### 预约状态

- **待确认**: 新提交的预约
- **已确认**: 已确认的预约
- **已完成**: 已完成的服务
- **已取消**: 已取消的预约

## 部署

### Vercel 部署（推荐）

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 其他平台

项目基于 Next.js，可以部署到任何支持 Node.js 的平台。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License





