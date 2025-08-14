# Git 安装和 GitHub 仓库设置指南

## 步骤 1: 安装 Git

### Windows 系统安装 Git:
1. 访问 [Git 官网](https://git-scm.com/download/win)
2. 下载适合您系统的 Git 安装包
3. 运行安装程序，使用默认设置即可
4. 安装完成后重启 PowerShell 或命令提示符

## 步骤 2: 配置 Git 用户信息

```bash
git config --global user.name "您的用户名"
git config --global user.email "您的邮箱@example.com"
```

## 步骤 3: 初始化 Git 仓库并推送到 GitHub

在项目目录 `D:\桌面\meirongstore` 中运行以下命令：

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加远程仓库
git remote add origin https://github.com/aaaaaaaa92/meirongstore.git

# 3. 添加所有文件到暂存区
git add .

# 4. 提交代码
git commit -m "Initial commit: 美容预约系统"

# 5. 设置主分支名称
git branch -M main

# 6. 推送到 GitHub
git push -u origin main
```

## 步骤 4: 验证推送成功

推送完成后，访问您的 GitHub 仓库 [https://github.com/aaaaaaaa92/meirongstore](https://github.com/aaaaaaaa92/meirongstore) 查看代码是否已成功上传。

## 项目文件说明

您的项目包含以下主要文件：
- `app/` - Next.js 应用主目录
- `components/` - React 组件
- `lib/` - 工具库 (包含 Supabase 配置)
- `package.json` - 项目依赖配置
- `README.md` - 项目说明文档
- `SETUP.md` - 项目设置指南
- `test-guide.md` - 测试指南
- `.gitignore` - Git 忽略文件 (已创建)

## 后续开发

设置完成后，您可以使用以下命令进行日常开发：

```bash
# 查看状态
git status

# 添加修改的文件
git add .

# 提交更改
git commit -m "描述您的更改"

# 推送到 GitHub
git push
```

## 注意事项

1. 确保创建 `.env.local` 文件并配置 Supabase 连接信息
2. 不要将 `.env.local` 文件推送到 GitHub (已在 .gitignore 中排除)
3. 如需协作开发，可以通过 GitHub 邀请其他开发者

