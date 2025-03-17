// src/components/markov/MarkovGenerator.tsx
"use client"

import React, { useState, useEffect } from "react"
import MarkovChain from "@/utils/MarkovChain"

interface MarkovGeneratorProps {
  inputText: string
  onGenerationComplete: (text: string) => void
  onError: (message: string) => void
}

/**
 * 马尔可夫链文本生成组件
 *
 * 这个组件负责对接UI和马尔可夫链模型，实现文本生成功能。
 * 它提供了对生成参数的控制，如链的阶数、生成长度、分词方式和温度等。
 */
const MarkovGenerator: React.FC<MarkovGeneratorProps> = ({
  inputText,
  onGenerationComplete,
  onError,
}) => {
  // 模型实例
  const [markovChain, setMarkovChain] = useState<MarkovChain | null>(null)

  // 生成参数
  const [order, setOrder] = useState<number>(2)
  const [outputLength, setOutputLength] = useState<number>(100)
  const [segmentType, setSegmentType] = useState<"char" | "word">("char")
  const [temperature, setTemperature] = useState<number>(1.0)

  // 模型统计信息
  const [modelStats, setModelStats] = useState<{
    stateCount: number
    averageBranchingFactor: number
  } | null>(null)

  // 生成状态
  const [isTraining, setIsTraining] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  // 在输入文本变化时重置模型
  useEffect(() => {
    // 重置模型统计信息
    setModelStats(null)

    // 创建新的马尔可夫链模型实例
    if (inputText && inputText.trim().length > 0) {
      try {
        const model = new MarkovChain(order)
        setMarkovChain(model)
      } catch (error) {
        onError((error as Error).message)
      }
    }
  }, [inputText, order, onError])

  // 训练模型函数
  const trainModel = async () => {
    if (!markovChain || !inputText || inputText.trim().length === 0) {
      onError("请先输入或上传文本")
      return
    }

    setIsTraining(true)

    try {
      // 使用setTimeout和Promise来避免UI阻塞，特别是对于长文本
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          try {
            markovChain.train(inputText, segmentType)
            setModelStats(markovChain.getStats())
            resolve()
          } catch (error) {
            onError((error as Error).message)
            resolve()
          }
        }, 0)
      })
    } finally {
      setIsTraining(false)
    }
  }

  // 生成文本函数
  const generateText = async () => {
    if (!markovChain) {
      onError("模型尚未初始化")
      return
    }

    setIsGenerating(true)

    try {
      // 检查模型是否已训练
      const stats = markovChain.getStats()
      if (stats.stateCount === 0) {
        await trainModel()
      }

      // 使用setTimeout和Promise来避免UI阻塞
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          try {
            const generatedText = markovChain.generate(
              outputLength,
              segmentType,
              temperature
            )
            onGenerationComplete(generatedText)
            resolve()
          } catch (error) {
            onError((error as Error).message)
            resolve()
          }
        }, 0)
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 马尔可夫链阶数 */}
        <div>
          <label
            htmlFor="order"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            马尔可夫链阶数: {order}
          </label>
          <input
            type="range"
            id="order"
            min="1"
            max="5"
            step="1"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={isTraining || isGenerating}
          />
          <p className="text-xs text-gray-500 mt-1">
            较高的阶数生成的文本更连贯但更接近原文，较低的阶数则更随机
          </p>
        </div>

        {/* 分词方式 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            分词方式
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-indigo-600"
                checked={segmentType === "char"}
                onChange={() => setSegmentType("char")}
                disabled={isTraining || isGenerating}
              />
              <span className="ml-2 text-sm text-gray-700">按字符</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-indigo-600"
                checked={segmentType === "word"}
                onChange={() => setSegmentType("word")}
                disabled={isTraining || isGenerating}
              />
              <span className="ml-2 text-sm text-gray-700">按词语</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            中文文本推荐按字符，英文文本推荐按词语
          </p>
        </div>

        {/* 输出长度 */}
        <div>
          <label
            htmlFor="outputLength"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            输出长度: {outputLength}{" "}
            {segmentType === "char" ? "个字符" : "个词语"}
          </label>
          <input
            type="range"
            id="outputLength"
            min="10"
            max="500"
            step="10"
            value={outputLength}
            onChange={(e) => setOutputLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={isTraining || isGenerating}
          />
        </div>

        {/* 温度参数 */}
        <div>
          <label
            htmlFor="temperature"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            随机性 (温度): {temperature.toFixed(1)}
          </label>
          <input
            type="range"
            id="temperature"
            min="0.1"
            max="2.0"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={isTraining || isGenerating}
          />
          <p className="text-xs text-gray-500 mt-1">
            较高的值增加随机性，较低的值使结果更可预测
          </p>
        </div>
      </div>

      {/* 模型统计信息 */}
      {modelStats && (
        <div className="bg-gray-50 p-3 rounded-md text-sm">
          <h3 className="font-medium text-gray-700">模型信息</h3>
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600">
            <div>状态数量:</div>
            <div>{modelStats.stateCount.toLocaleString()}</div>
            <div>平均分支因子:</div>
            <div>{modelStats.averageBranchingFactor.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={trainModel}
          disabled={isTraining || isGenerating || !inputText}
          className={`px-4 py-2 rounded-md flex items-center ${
            isTraining || isGenerating || !inputText
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {isTraining ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              训练中...
            </>
          ) : (
            "训练模型"
          )}
        </button>
        <button
          onClick={generateText}
          disabled={isTraining || isGenerating || !inputText}
          className={`px-4 py-2 rounded-md flex items-center ${
            isTraining || isGenerating || !inputText
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              生成中...
            </>
          ) : (
            "生成胡话"
          )}
        </button>
      </div>
    </div>
  )
}

export default MarkovGenerator
