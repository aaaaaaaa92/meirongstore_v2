# GitHub Desktop 使用指南

## 📥 步骤 1: 下载并安装 GitHub Desktop

1. 访问 [GitHub Desktop 官网](https://desktop.github.com/)
2. 点击 "Download for Windows" 下载安装包
3. 运行下载的安装程序，按照提示完成安装

## 🔐 步骤 2: 登录 GitHub 账户

1. 打开 GitHub Desktop
2. 点击 "Sign in to GitHub.com"
3. 输入您的 GitHub 账户信息：
   - 用户名：`aaaaaaaa92`
   - 邮箱：`g544408007@gmail.com`
   - 密码：您的 GitHub 密码
4. 完成登录验证

## 📁 步骤 3: 添加现有仓库

1. 在 GitHub Desktop 中，点击左上角的 "File" 菜单
2. 选择 "Add local repository..."
3. 点击 "Choose..." 按钮
4. 浏览并选择您的项目文件夹：`D:\桌面\meirongstore`
5. 点击 "Add repository"

## 🚀 步骤 4: 发布仓库到 GitHub

1. GitHub Desktop 会检测到您的本地 Git 仓库
2. 点击右上角的 "Publish repository" 按钮
3. 在弹出的对话框中：
   - **Name**: `meirongstore`（保持默认）
   - **Description**: `美容预约系统 - 基于Next.js和Supabase的在线预约平台`
   - **Owner**: 选择 `aaaaaaaa92`
   - ✅ 确保 "Keep this code private" **未**勾选（如果您希望公开仓库）
4. 点击 "Publish repository"

## ✅ 步骤 5: 验证上传成功

1. 发布完成后，GitHub Desktop 会显示 "Published successfully"
2. 点击 "View on GitHub" 按钮，或直接访问：
   [https://github.com/aaaaaaaa92/meirongstore](https://github.com/aaaaaaaa92/meirongstore)
3. 您应该能看到所有 24 个文件已成功上传

## 📋 项目文件列表（应该都能在 GitHub 上看到）

✅ 应用核心文件：
- `app/page.tsx` - 主页面
- `app/layout.tsx` - 布局组件
- `app/admin/page.tsx` - 管理后台

✅ 组件文件：
- `components/BookingForm.tsx` - 预约表单
- `components/CustomerBookingQuery.tsx` - 预约查询
- `components/AdminBookingList.tsx` - 管理员预约列表
- `components/BookingList.tsx` - 预约列表

✅ 配置和文档：
- `package.json` - 项目依赖
- `tsconfig.json` - TypeScript 配置
- `tailwind.config.js` - 样式配置
- `README.md` - 项目说明
- `SETUP.md` - 设置指南
- `test-guide.md` - 测试指南
- `.gitignore` - Git 忽略文件

✅ 数据库文件：
- `setup.sql` - 数据库初始化脚本
- `cleanup-and-setup.sql` - 清理和设置脚本

## 🔄 后续开发流程

使用 GitHub Desktop 进行日常开发：

1. **查看更改**：在左侧面板查看修改的文件
2. **提交更改**：
   - 在底部输入提交信息
   - 点击 "Commit to main"
3. **推送到 GitHub**：
   - 点击 "Push origin" 同步到远程仓库
4. **拉取更新**：
   - 点击 "Fetch origin" 获取远程更新

## 🎯 优势

- 🖱️ **图形界面**：无需记忆命令行指令
- 🔄 **可视化差异**：清楚看到文件修改内容
- 📊 **分支管理**：轻松创建和管理分支
- 🔗 **GitHub 集成**：直接与 GitHub 仓库同步
- 📝 **提交历史**：图形化查看项目历史

## ⚠️ 注意事项

1. 确保 `.env.local` 文件不会被上传（已在 `.gitignore` 中排除）
2. 首次发布后，后续修改只需要 Commit + Push
3. 如果遇到冲突，GitHub Desktop 会提供可视化的冲突解决界面

---

完成上述步骤后，您的美容预约系统就成功上传到 GitHub 了！🎉
