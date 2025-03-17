// src/app/page.tsx
"use client"

import { useState } from "react"
import TextInput from "@/components/markov/TextInput"
import MarkovGenerator from "@/components/markov/MarkovGenerator"

export default function Home() {
  const [inputText, setInputText] = useState<string>("")
  const [generatedText, setGeneratedText] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  // 处理文本输入
  const handleTextSubmit = (text: string) => {
    setInputText(text)
    setError("")
  }

  // 处理生成完成
  const handleGenerationComplete = (text: string) => {
    setGeneratedText(text)
    setIsGenerating(false)
  }

  // 处理错误
  const handleError = (message: string) => {
    setError(message)
    setIsGenerating(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 lg:p-24">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            马尔可夫链胡话生成器
          </h1>
          <p className="text-gray-600">
            上传或输入文本，使用马尔可夫链技术生成有趣的"胡话"内容
          </p>
        </div>

        {/* 文本输入组件 */}
        <div className="mb-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">步骤 1: 输入文本</h2>
          <TextInput onTextSubmit={handleTextSubmit} />
        </div>

        {/* 马尔可夫链参数和生成控制 */}
        {inputText && (
          <div className="mb-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              步骤 2: 设置参数并生成
            </h2>
            <MarkovGenerator
              inputText={inputText}
              onGenerationComplete={handleGenerationComplete}
              onError={handleError}
            />
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* 生成结果区域 */}
        {generatedText && (
          <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">生成结果</h2>
            <div className="p-4 bg-white rounded border border-indigo-100 min-h-36 whitespace-pre-wrap">
              {generatedText}
            </div>
          </div>
        )}

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            基于 Next.js 和 React 开发的马尔可夫链胡话生成器 &copy;{" "}
            {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  )
}
