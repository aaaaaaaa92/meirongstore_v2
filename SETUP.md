# 美容预约系统 - 配置指南

## 快速配置步骤

### 1. 获取 Supabase 配置信息

你的 Supabase 项目信息：
- **项目名称**: meirongstore
- **项目ID**: mdnkzndpcmgoasmxgrxt
- **数据库URL**: https://mdnkzndpcmgoasmxgrxt.supabase.co

### 2. 获取 API 密钥

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的 `meirongstore` 项目
3. 进入 Settings → API
4. 复制以下信息：
   - **URL**: `https://mdnkzndpcmgoasmxgrxt.supabase.co`
   - **anon/public key**: 复制 `anon` 密钥

### 3. 配置环境变量

在项目根目录创建 `.env.local` 文件，内容如下：

```env
NEXT_PUBLIC_SUPABASE_URL=https://mdnkzndpcmgoasmxgrxt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_密钥
```

### 4. 设置数据库

1. 在 Supabase Dashboard 中，进入 SQL Editor
2. 复制 `setup.sql` 文件中的所有内容
3. 粘贴到 SQL Editor 中并执行

这将创建以下表：
- `profiles` - 用户资料表
- `services` - 服务项目表
- `bookings` - 预约记录表

以及插入示例服务数据。

### 5. 启动项目

方法一：使用启动脚本（Windows）
```bash
./start.bat
```

方法二：手动启动
```bash
npm install
npm run dev
```

### 6. 访问应用

打开浏览器访问：http://localhost:3000

## 功能测试

### 测试预约功能
1. 选择服务项目
2. 选择日期和时间
3. 填写客户信息
4. 提交预约

### 测试查询功能
1. 切换到"查看预约"标签
2. 查看所有预约记录
3. 使用手机号搜索
4. 测试状态更新（确认、取消、完成）

## 常见问题

### Q: 无法连接到数据库
A: 检查 `.env.local` 文件中的 URL 和密钥是否正确

### Q: 提交预约时出错
A: 确保数据库表已正确创建，检查控制台错误信息

### Q: 重复时间段预约失败
A: 这是正常的，系统不允许同一时间段重复预约

## 下一步开发

1. **后台管理界面** - 管理员专用界面
2. **用户认证** - 用户登录注册功能
3. **权限控制** - 不同角色的权限管理
4. **通知功能** - 短信或邮件通知
5. **报表统计** - 预约数据分析
6. **在线支付** - 集成支付功能

## 技术支持

如有问题，请检查：
1. 控制台错误信息
2. Supabase 项目状态
3. 网络连接
4. 环境变量配置





