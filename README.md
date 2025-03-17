# 🔄 Markov Chain Text Generator

<div align="center">
  <p>
    <a href="#-introduction">English</a> •
    <a href="#-介绍">中文</a>
  </p>
</div>

<div>
  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

---

## 🇬🇧 Introduction

This project is a web-based Markov Chain Text Generator built with Next.js and React. It allows users to generate amusing "nonsense" text based on input samples using Markov chain algorithms. The generated text maintains some of the statistical patterns and style of the original text, but often creates humorous or surprising combinations.

### ✨ Features

- **Text Input**: Upload text files or paste text directly into the application
- **Configurable Parameters**: Adjust the Markov chain order, output length, and randomness
- **Segmentation Options**: Generate text based on character or word segmentation
- **Statistics Display**: View model information including state count and branching factors
- **Responsive Design**: Works on desktop and mobile devices
- **Client-side Processing**: All text processing happens in the browser for privacy

### 🛠️ Technical Implementation

The project implements a Markov chain algorithm with the following capabilities:

- **Adjustable Order**: Control the "memory" of the Markov process (higher order = more coherent but less creative text)
- **Temperature Control**: Adjust the randomness of the generation process
- **Performance Optimized**: Asynchronous processing to prevent UI blocking
- **Object-Oriented Design**: Clean, modular code architecture

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/markov-text-generator.git
cd markov-text-generator

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application running.

### Usage Instructions

1. **Input Text**: Paste text directly or upload a text file
2. **Configure Parameters**:
   - **Order**: Controls how many previous elements influence the next element
   - **Segmentation**: Choose character-based (better for Chinese) or word-based (better for English)
   - **Output Length**: Set the desired length of generated text
   - **Randomness**: Adjust the temperature parameter to control creativity
3. **Generate**: Click "Generate Nonsense" to create your text

## 💡 How It Works

The Markov chain algorithm analyzes input text to build a statistical model of transitions between states (characters or words). When generating text, it starts from a random state and moves to subsequent states based on the transition probabilities learned from the original text.

For example, in a first-order character-based Markov chain, if the letters "th" in English text are often followed by "e", then when the generator encounters "th" during text creation, it's likely to add "e" next.

Higher-order chains consider more context, making the output more coherent but potentially less creative.

## 📋 Project Structure

```
markov-text-generator/
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js app router
│   │   ├── page.tsx  # Main page component
│   │   ├── layout.tsx # App layout
│   │   └── globals.css # Global styles
│   ├── components/   # React components
│   │   └── markov/
│   │       ├── TextInput.tsx      # Text input component
│   │       └── MarkovGenerator.tsx # Generator controls
│   └── utils/        # Utility functions and classes
│       └── MarkovChain.ts # Core Markov chain implementation
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

---

## 🇨🇳 介绍

这个项目是一个基于 Next.js 和 React 构建的马尔可夫链文本生成器。它允许用户使用马尔可夫链算法基于输入样本生成有趣的"胡话"文本。生成的文本保留了原始文本的一些统计模式和风格，但通常会创造出幽默或令人惊讶的组合。

### ✨ 特点

- **文本输入**：上传文本文件或直接将文本粘贴到应用程序中
- **可配置参数**：调整马尔可夫链阶数、输出长度和随机性
- **分词选项**：基于字符或词语分词生成文本
- **统计信息显示**：查看模型信息，包括状态数量和分支因子
- **响应式设计**：适用于桌面和移动设备
- **客户端处理**：所有文本处理都在浏览器中进行，保护隐私

### 🛠️ 技术实现

该项目实现了具有以下功能的马尔可夫链算法：

- **可调节阶数**：控制马尔可夫过程的"记忆"（更高阶 = 更连贯但创造性较低的文本）
- **温度控制**：调整生成过程的随机性
- **性能优化**：异步处理以防止 UI 阻塞
- **面向对象设计**：清晰、模块化的代码架构

## 🚀 开始使用

### 前提条件

- Node.js 16.x 或更高版本
- npm 或 yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/markov-text-generator.git
cd markov-text-generator

# 安装依赖
npm install
# 或
yarn install

# 启动开发服务器
npm run dev
# 或
yarn dev
```

访问 `http://localhost:3000` 即可查看运行中的应用程序。

### 使用说明

1. **输入文本**：直接粘贴文本或上传文本文件
2. **配置参数**：
   - **阶数**：控制有多少个前序元素影响下一个元素
   - **分词方式**：选择基于字符（适合中文）或基于词语（适合英文）的分词
   - **输出长度**：设置生成文本的期望长度
   - **随机性**：调整温度参数以控制创造性
3. **生成**：点击"生成胡话"创建你的文本

## 💡 工作原理

马尔可夫链算法分析输入文本以构建状态（字符或词语）之间转换的统计模型。在生成文本时，它从随机状态开始，根据从原始文本学习到的转换概率移动到后续状态。

例如，在一阶基于字符的马尔可夫链中，如果英文文本中的字母"th"后面经常跟着"e"，那么当生成器在创建文本过程中遇到"th"时，很可能下一步会添加"e"。

更高阶的链考虑更多上下文，使输出更连贯但可能创造性较低。

## 📋 项目结构

```
markov-text-generator/
├── public/           # 静态资源
├── src/
│   ├── app/          # Next.js 应用路由
│   │   ├── page.tsx  # 主页面组件
│   │   ├── layout.tsx # 应用布局
│   │   └── globals.css # 全局样式
│   ├── components/   # React 组件
│   │   └── markov/
│   │       ├── TextInput.tsx      # 文本输入组件
│   │       └── MarkovGenerator.tsx # 生成器控制
│   └── utils/        # 实用函数和类
│       └── MarkovChain.ts # 核心马尔可夫链实现
├── package.json      # 依赖和脚本
└── README.md         # 本文件
```

## 📄 许可证

MIT © Jiamin

---

<p align="center">使用 ❤️ 和 Next.js 构建</p>
