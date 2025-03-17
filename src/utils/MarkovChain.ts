// src/utils/MarkovChain.ts

/**
 * 马尔可夫链文本生成器
 *
 * 这个类实现了基于马尔可夫链的文本生成算法。
 * 马尔可夫链的基本思想是：下一个状态（词语）的出现只依赖于当前状态，而不依赖于过去的状态。
 *
 * 在文本生成中：
 * - 我们将文本分割成词语序列
 * - 为每个词语（或词语组合）创建一个概率分布，表示在这个词语之后可能出现的下一个词语及其概率
 * - 根据这个概率分布随机生成新的文本
 */
export default class MarkovChain {
  // 状态转移表：记录每个状态（词语或词语组合）后面可能出现的词语及其出现次数
  private transitionTable: Map<string, Map<string, number>>

  // 马尔可夫链的阶数：表示模型考虑的前序状态数量，影响文本的连贯性和多样性
  private order: number

  // 起始状态集合：用于开始生成过程
  private startStates: string[]

  /**
   * 创建马尔可夫链模型
   * @param order 马尔可夫链的阶数，表示每个状态包含的词语数，默认为1
   */
  constructor(order: number = 1) {
    this.transitionTable = new Map()
    this.order = Math.max(1, order) // 阶数至少为1
    this.startStates = []
  }

  /**
   * 训练模型：分析输入文本，构建状态转移表
   * @param text 输入文本
   * @param segmentType 分词类型：'char'按字符分词，'word'按词语分词
   */
  train(text: string, segmentType: "char" | "word" = "char"): void {
    // 确保文本非空
    if (!text || text.trim().length === 0) {
      throw new Error("训练文本不能为空")
    }

    // 根据分词类型将文本分割成词元（tokens）
    const tokens = this.tokenize(text, segmentType)
    if (tokens.length <= this.order) {
      throw new Error(`文本太短，无法生成${this.order}阶马尔可夫链`)
    }

    // 清空之前的数据
    this.transitionTable.clear()
    this.startStates = []

    // 构建状态转移表
    for (let i = 0; i <= tokens.length - this.order - 1; i++) {
      // 当前状态由order个连续词元组成
      const currentState = tokens.slice(i, i + this.order).join(" ")
      const nextToken = tokens[i + this.order]

      // 记录起始状态
      if (i === 0) {
        this.startStates.push(currentState)
      }

      // 更新状态转移表
      if (!this.transitionTable.has(currentState)) {
        this.transitionTable.set(currentState, new Map())
      }

      const stateTransitions = this.transitionTable.get(currentState)!
      stateTransitions.set(
        nextToken,
        (stateTransitions.get(nextToken) || 0) + 1
      )
    }

    // 如果文本很长，可能有多个潜在的起始状态
    // 为了增加多样性，随机打乱起始状态列表
    this.shuffleArray(this.startStates)
  }

  /**
   * 生成文本
   * @param length 生成的词元数量
   * @param segmentType 分词类型：与训练时保持一致
   * @param temperature 温度参数：控制随机性，越高越随机，越低越确定性
   * @returns 生成的文本
   */
  generate(
    length: number = 100,
    segmentType: "char" | "word" = "char",
    temperature: number = 1.0
  ): string {
    // 验证模型是否已训练
    if (this.transitionTable.size === 0 || this.startStates.length === 0) {
      throw new Error("模型尚未训练，请先调用train方法")
    }

    // 随机选择一个起始状态
    let currentState =
      this.startStates[Math.floor(Math.random() * this.startStates.length)]

    // 将起始状态分解为词元
    let result = currentState.split(" ")

    // 生成指定长度的文本
    for (let i = 0; i < length; i++) {
      // 获取当前状态的转移概率
      const transitions = this.transitionTable.get(currentState)

      // 如果当前状态没有后续转移，结束生成
      if (!transitions || transitions.size === 0) {
        break
      }

      // 根据温度参数调整概率分布，选择下一个词元
      const nextToken = this.sampleNextToken(transitions, temperature)

      // 将新词元添加到结果中
      result.push(nextToken)

      // 更新当前状态（移除最早的词元，添加新词元）
      const newStateTokens = [...result.slice(result.length - this.order)]
      currentState = newStateTokens.join(" ")

      // 如果新状态不在转移表中，结束生成
      if (!this.transitionTable.has(currentState)) {
        break
      }
    }

    // 根据分词类型返回结果
    return segmentType === "char" ? result.join("") : result.join(" ")
  }

  /**
   * 获取模型的统计信息
   * @returns 包含状态数、平均分支因子的对象
   */
  getStats(): { stateCount: number; averageBranchingFactor: number } {
    let totalBranches = 0

    this.transitionTable.forEach((transitions) => {
      totalBranches += transitions.size
    })

    const stateCount = this.transitionTable.size
    const averageBranchingFactor =
      stateCount > 0 ? totalBranches / stateCount : 0

    return {
      stateCount,
      averageBranchingFactor,
    }
  }

  /**
   * 清空模型
   */
  clear(): void {
    this.transitionTable.clear()
    this.startStates = []
  }

  /**
   * 将文本分割成词元
   * @param text 输入文本
   * @param type 分词类型
   * @returns 词元数组
   */
  private tokenize(text: string, type: "char" | "word"): string[] {
    // 去除文本中的多余空白字符
    const cleanedText = text.replace(/\s+/g, " ").trim()

    if (type === "char") {
      // 按字符分词
      return cleanedText.split("")
    } else {
      // 按词语分词（以空格为分隔符）
      return cleanedText.split(/\s+/)
    }
  }

  /**
   * 根据转移概率和温度参数采样下一个词元
   * @param transitions 当前状态的转移概率
   * @param temperature 温度参数
   * @returns 选择的下一个词元
   */
  private sampleNextToken(
    transitions: Map<string, number>,
    temperature: number
  ): string {
    // 计算概率分布
    const distribution: { token: string; probability: number }[] = []
    let total = 0

    // 应用温度参数
    transitions.forEach((count, token) => {
      // temperature为0时，总是选择概率最高的词元
      // temperature为1时，使用原始概率分布
      // temperature大于1时，增加随机性，使概率分布更平坦
      const adjustedCount =
        temperature === 0
          ? count === Math.max(...Array.from(transitions.values()))
            ? 1
            : 0
          : Math.pow(count, 1 / temperature)

      distribution.push({ token, probability: adjustedCount })
      total += adjustedCount
    })

    // 归一化概率
    distribution.forEach((item) => {
      item.probability /= total
    })

    // 按概率抽样
    const random = Math.random()
    let cumulativeProbability = 0

    for (const item of distribution) {
      cumulativeProbability += item.probability
      if (random < cumulativeProbability) {
        return item.token
      }
    }

    // 防止浮点数精度问题导致未选中任何词元
    return distribution[distribution.length - 1].token
  }

  /**
   * 随机打乱数组
   * @param array 要打乱的数组
   */
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }
}
