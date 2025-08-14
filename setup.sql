-- 美容预约系统数据库设置脚本
-- 请在 Supabase SQL 编辑器中执行此脚本

-- 1. 创建用户表 (扩展 auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    phone VARCHAR(20),
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建服务项目表
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- 服务时长（分钟）
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建预约表
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 确保同一时间段不会被重复预约
    UNIQUE(appointment_date, appointment_time, service_id)
);

-- 4. 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. 为表添加更新时间触发器
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. 启用 RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 7. 创建 RLS 策略

-- 用户只能查看和更新自己的 profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 所有人都可以查看活跃的服务项目
CREATE POLICY "Anyone can view active services" ON services
    FOR SELECT USING (is_active = true);

-- 用户可以创建预约
CREATE POLICY "Anyone can create bookings" ON bookings
    FOR INSERT WITH CHECK (true);

-- 用户可以查看预约（这里简化为所有人都可以查看，实际应用中可能需要更严格的权限）
CREATE POLICY "Anyone can view bookings" ON bookings
    FOR SELECT USING (true);

-- 用户可以更新预约状态（这里简化，实际应用中应该限制为管理员）
CREATE POLICY "Anyone can update bookings" ON bookings
    FOR UPDATE USING (true);

-- 8. 插入示例服务数据
INSERT INTO services (name, description, duration, price) VALUES
('基础面部护理', '深层清洁、补水保湿、面部按摩，适合所有肌肤类型', 60, 188.00),
('深层补水面膜', '玻尿酸补水面膜，深层滋润肌肤，适合干性肌肤', 45, 158.00),
('美白淡斑护理', '专业美白产品，改善肌肤暗沉和色素沉着', 90, 288.00),
('抗衰老护理', 'Ⅴ脸紧致护理，改善细纹和松弛', 75, 358.00),
('眼部护理', '眼周肌肤专业护理，减少黑眼圈和细纹', 30, 128.00),
('经典美甲', '修甲、护甲、底油、指甲油、亮油', 60, 88.00),
('法式美甲', '经典法式美甲造型', 75, 128.00),
('美睫服务', '专业嫁接睫毛，自然浓密效果', 90, 168.00),
('肩颈按摩', '放松肩颈肌肉，缓解疲劳', 45, 98.00),
('全身SPA', '全身放松护理，包含按摩和身体护理', 120, 388.00)
ON CONFLICT DO NOTHING;

-- 完成提示
SELECT 'Database setup completed successfully!' as message;





