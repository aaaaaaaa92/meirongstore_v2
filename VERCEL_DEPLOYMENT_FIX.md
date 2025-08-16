# Vercel 部署失败修复指南

## 🚨 问题分析

您的项目在 Vercel 部署时失败，错误信息：
- **错误**: Build script returned non-zero exit code: 2
- **阶段**: building site
- **原因**: 缺少必要的环境变量配置

## 🔧 解决步骤

### 步骤1：获取 Supabase 配置信息

1. **登录 Supabase Dashboard**
   - 访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - 选择您的项目

2. **获取项目 URL 和 API Key**
   - 点击左侧的 "Settings" → "API"
   - 复制以下信息：
     - **URL**: `https://mdnkzndpcmgoasmxgrxt.supabase.co`
     - **anon key**: 在 "Project API keys" 部分复制 `anon` `public` key

### 步骤2：在 Vercel 中配置环境变量

1. **进入 Vercel 项目设置**
   - 在 Vercel Dashboard 中点击 `meirongstore` 项目
   - 点击顶部的 "Settings" 标签
   - 在左侧菜单选择 "Environment Variables"

2. **添加环境变量**
   点击 "Add New" 按钮，添加以下两个变量：

   **第一个变量:**
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://mdnkzndpcmgoasmxgrxt.supabase.co
   Environment: Production, Preview, Development
   ```

   **第二个变量:**
   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [从 Supabase 复制的 anon key]
   Environment: Production, Preview, Development
   ```

### 步骤3：重新部署

1. **触发重新部署**
   - 方法1：在 Vercel Dashboard 中点击 "Deployments" → 最新的部署 → "Redeploy"
   - 方法2：推送一个小的更新到 GitHub 触发自动部署

2. **或者手动触发部署**
   ```bash
   # 在本地项目目录中
   git commit --allow-empty -m "Trigger redeploy after env vars setup"
   git push origin main
   ```

### 步骤4：验证部署

部署成功后，您应该能看到：
- ✅ 部署状态变为 "Ready"
- ✅ 可以访问部署的网站
- ✅ 预约功能正常工作（连接到 Supabase）

## 🔍 常见问题排查

### 如果仍然失败：

1. **检查环境变量**
   - 确保变量名拼写正确（区分大小写）
   - 确保 anon key 完整复制（通常很长）

2. **检查 Supabase 项目状态**
   - 确保 Supabase 项目处于活动状态
   - 确保数据库表已创建（运行 setup.sql）

3. **查看 Vercel 部署日志**
   - 在 "Deployments" 中点击失败的部署
   - 查看详细的错误日志

## 📋 环境变量清单

确保在 Vercel 中设置了以下环境变量：

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🎯 部署成功后

您的美容预约系统将可以通过 Vercel 提供的 URL 访问，通常格式为：
`https://meirongstore-xxx.vercel.app`

系统将包含：
- 🏠 主页（预约功能）
- 🔍 预约查询功能
- 👤 管理后台
- 📱 响应式设计
- 💾 Supabase 数据库集成

---

## 💡 小贴士

- 环境变量更改后，总是需要重新部署
- 生产环境的环境变量不会自动同步到预览环境
- 确保 Supabase 项目没有暂停或删除
