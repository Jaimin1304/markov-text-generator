// src/components/markov/TextInput.tsx
import React, { useState, useRef, useEffect, ChangeEvent } from "react"

interface TextInputProps {
  onTextSubmit: (text: string) => void
}

const TextInput: React.FC<TextInputProps> = ({ onTextSubmit }) => {
  const [inputText, setInputText] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理文本输入变化
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }

  // 处理文件上传按钮点击
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 处理文件选择
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 检查文件类型，仅接受文本文件
    if (!file.type.match("text/plain") && !file.name.endsWith(".txt")) {
      setUploadError("请上传文本文件 (.txt)")
      return
    }

    // 重置状态
    setUploadError("")
    setIsUploading(true)
    setFileName(file.name)

    try {
      // 读取文件内容
      const text = await readFileAsText(file)
      setInputText(text)
      setIsUploading(false)
    } catch (error) {
      setUploadError("文件读取失败，请重试")
      setIsUploading(false)
    }
  }

  // 读取文件为文本
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string)
        } else {
          reject(new Error("文件读取失败"))
        }
      }
      reader.onerror = () => reject(new Error("文件读取出错"))
      reader.readAsText(file)
    })
  }

  // 处理提交
  const handleSubmit = () => {
    if (inputText.trim()) {
      onTextSubmit(inputText)
    }
  }

  // 在组件加载后自动聚焦输入框
  useEffect(() => {
    const textArea = document.getElementById("textInput")
    if (textArea) {
      textArea.focus()
    }
  }, [])

  // 清空内容
  const handleClear = () => {
    setInputText("")
    setFileName("")
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col">
        <label htmlFor="textInput" className="text-lg font-medium mb-2">
          输入或上传文本
        </label>
        <textarea
          id="textInput"
          rows={10}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="在此输入文本，或者上传文本文件..."
          value={inputText}
          onChange={handleTextChange}
        />
      </div>

      {uploadError && <div className="text-red-500 text-sm">{uploadError}</div>}

      {fileName && (
        <div className="flex items-center text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>已上传: {fileName}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {/* 隐藏的文件输入 */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".txt,text/plain"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* 上传按钮 */}
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
        >
          {isUploading ? "上传中..." : "上传文件"}
        </button>

        {/* 清空按钮 */}
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
        >
          清空
        </button>

        {/* 提交按钮 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!inputText.trim()}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition ${
            inputText.trim()
              ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
              : "bg-indigo-300 text-white cursor-not-allowed"
          }`}
        >
          生成胡话
        </button>
      </div>
    </div>
  )
}

export default TextInput
