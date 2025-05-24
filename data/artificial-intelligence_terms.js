// 人工智能词汇数据
const artificialIntelligenceTerms = [
    // 基础概念
    {
        id: 1,
        term: "Artificial Intelligence",
        pronunciation: "/ˌɑːrtɪˈfɪʃəl ɪnˈtelɪdʒəns/",
        definition: "The simulation of human intelligence processes by machines and computer systems.",
        translation: "人工智能",
        explanation: "机器和计算机系统模拟人类智能过程。",
        example: "Artificial intelligence is transforming various industries.",
        exampleTranslation: "人工智能正在改变各种行业。",
        category: "基础概念",
        difficulty: "基础",
        tags: ["AI", "intelligence", "simulation"]
    },
    {
        id: 2,
        term: "Machine Learning",
        pronunciation: "/məˈʃiːn ˈlɜːrnɪŋ/",
        definition: "A subset of AI that enables computers to learn and make decisions from data without explicit programming.",
        translation: "机器学习",
        explanation: "AI的一个子集，使计算机能够从数据中学习并做出决策，无需显式编程。",
        example: "Machine learning algorithms improve with more data.",
        exampleTranslation: "机器学习算法随着更多数据而改进。",
        category: "基础概念",
        difficulty: "基础",
        tags: ["ML", "learning", "data"]
    },
    {
        id: 3,
        term: "Deep Learning",
        pronunciation: "/diːp ˈlɜːrnɪŋ/",
        definition: "A subset of machine learning using artificial neural networks with multiple layers.",
        translation: "深度学习",
        explanation: "使用具有多层人工神经网络的机器学习子集。",
        example: "Deep learning excels in image and speech recognition.",
        exampleTranslation: "深度学习在图像和语音识别方面表现出色。",
        category: "基础概念",
        difficulty: "中等",
        tags: ["deep", "neural", "layers"]
    },

    // 神经网络
    {
        id: 4,
        term: "Neural Network",
        pronunciation: "/ˈnʊrəl ˈnetwɜːrk/",
        definition: "A computing system inspired by biological neural networks, consisting of interconnected nodes.",
        translation: "神经网络",
        explanation: "受生物神经网络启发的计算系统，由相互连接的节点组成。",
        example: "Neural networks can recognize patterns in complex data.",
        exampleTranslation: "神经网络可以识别复杂数据中的模式。",
        category: "神经网络",
        difficulty: "中等",
        tags: ["neural", "network", "nodes"]
    },
    {
        id: 5,
        term: "Neuron",
        pronunciation: "/ˈnʊrɑːn/",
        definition: "A basic unit of a neural network that receives, processes, and transmits information.",
        translation: "神经元",
        explanation: "神经网络的基本单位，接收、处理和传输信息。",
        example: "Each neuron applies an activation function to its input.",
        exampleTranslation: "每个神经元对其输入应用激活函数。",
        category: "神经网络",
        difficulty: "中等",
        tags: ["neuron", "unit", "processing"]
    },
    {
        id: 6,
        term: "Activation Function",
        pronunciation: "/ˌæktɪˈveɪʃən ˈfʌŋkʃən/",
        definition: "A mathematical function that determines the output of a neural network node.",
        translation: "激活函数",
        explanation: "确定神经网络节点输出的数学函数。",
        example: "ReLU is a commonly used activation function.",
        exampleTranslation: "ReLU是常用的激活函数。",
        category: "神经网络",
        difficulty: "中等",
        tags: ["activation", "function", "output"]
    },

    // 训练过程
    {
        id: 7,
        term: "Training",
        pronunciation: "/ˈtreɪnɪŋ/",
        definition: "The process of teaching a machine learning model using training data.",
        translation: "训练",
        explanation: "使用训练数据教授机器学习模型的过程。",
        example: "Model training requires large amounts of labeled data.",
        exampleTranslation: "模型训练需要大量标记数据。",
        category: "训练过程",
        difficulty: "基础",
        tags: ["training", "teaching", "data"]
    },
    {
        id: 8,
        term: "Backpropagation",
        pronunciation: "/ˌbækprɑːpəˈɡeɪʃən/",
        definition: "An algorithm for training neural networks by propagating errors backward through the network.",
        translation: "反向传播",
        explanation: "通过在网络中向后传播错误来训练神经网络的算法。",
        example: "Backpropagation adjusts weights to minimize prediction errors.",
        exampleTranslation: "反向传播调整权重以最小化预测错误。",
        category: "训练过程",
        difficulty: "高级",
        tags: ["backprop", "training", "algorithm"]
    },
    {
        id: 9,
        term: "Gradient Descent",
        pronunciation: "/ˈɡreɪdiənt dɪˈsent/",
        definition: "An optimization algorithm used to minimize the loss function by iteratively adjusting parameters.",
        translation: "梯度下降",
        explanation: "通过迭代调整参数来最小化损失函数的优化算法。",
        example: "Gradient descent finds the optimal weights for the model.",
        exampleTranslation: "梯度下降为模型找到最优权重。",
        category: "训练过程",
        difficulty: "高级",
        tags: ["optimization", "gradient", "algorithm"]
    },

    // 模型评估
    {
        id: 10,
        term: "Accuracy",
        pronunciation: "/ˈækjərəsi/",
        definition: "The percentage of correct predictions made by a machine learning model.",
        translation: "准确率",
        explanation: "机器学习模型做出正确预测的百分比。",
        example: "The model achieved 95% accuracy on the test set.",
        exampleTranslation: "该模型在测试集上达到了95%的准确率。",
        category: "模型评估",
        difficulty: "基础",
        tags: ["accuracy", "evaluation", "performance"]
    },
    {
        id: 11,
        term: "Overfitting",
        pronunciation: "/ˈoʊvərfɪtɪŋ/",
        definition: "When a model learns the training data too well and fails to generalize to new data.",
        translation: "过拟合",
        explanation: "模型过度学习训练数据，无法泛化到新数据。",
        example: "Regularization techniques help prevent overfitting.",
        exampleTranslation: "正则化技术有助于防止过拟合。",
        category: "模型评估",
        difficulty: "中等",
        tags: ["overfitting", "generalization", "problem"]
    },
    {
        id: 12,
        term: "Cross-validation",
        pronunciation: "/krɔːs væləˈdeɪʃən/",
        definition: "A technique for assessing model performance by dividing data into multiple folds.",
        translation: "交叉验证",
        explanation: "通过将数据分成多个折叠来评估模型性能的技术。",
        example: "K-fold cross-validation provides robust performance estimates.",
        exampleTranslation: "K折交叉验证提供稳健的性能估计。",
        category: "模型评估",
        difficulty: "中等",
        tags: ["validation", "evaluation", "technique"]
    },

    // 特定算法
    {
        id: 13,
        term: "Convolutional Neural Network",
        pronunciation: "/ˌkɑːnvəˈluːʃənəl ˈnʊrəl ˈnetwɜːrk/",
        definition: "A type of neural network particularly effective for image processing tasks.",
        translation: "卷积神经网络",
        explanation: "特别适用于图像处理任务的神经网络类型。",
        example: "CNNs are widely used in computer vision applications.",
        exampleTranslation: "CNN广泛用于计算机视觉应用。",
        category: "特定算法",
        difficulty: "高级",
        tags: ["CNN", "convolution", "image"]
    },
    {
        id: 14,
        term: "Recurrent Neural Network",
        pronunciation: "/rɪˈkɜːrənt ˈnʊrəl ˈnetwɜːrk/",
        definition: "A neural network designed to handle sequential data by maintaining memory of previous inputs.",
        translation: "循环神经网络",
        explanation: "通过保持对先前输入的记忆来处理序列数据的神经网络。",
        example: "RNNs are effective for natural language processing tasks.",
        exampleTranslation: "RNN对自然语言处理任务很有效。",
        category: "特定算法",
        difficulty: "高级",
        tags: ["RNN", "sequential", "memory"]
    },
    {
        id: 15,
        term: "Transformer",
        pronunciation: "/trænsˈfɔːrmər/",
        definition: "A neural network architecture that uses attention mechanisms for processing sequences.",
        translation: "变换器",
        explanation: "使用注意力机制处理序列的神经网络架构。",
        example: "Transformers power modern language models like GPT.",
        exampleTranslation: "变换器驱动现代语言模型如GPT。",
        category: "特定算法",
        difficulty: "高级",
        tags: ["transformer", "attention", "architecture"]
    },

    // 数据处理
    {
        id: 16,
        term: "Feature",
        pronunciation: "/ˈfiːtʃər/",
        definition: "An individual measurable property of an object or phenomenon being observed.",
        translation: "特征",
        explanation: "被观察对象或现象的单个可测量属性。",
        example: "Feature selection improves model performance.",
        exampleTranslation: "特征选择提高模型性能。",
        category: "数据处理",
        difficulty: "基础",
        tags: ["feature", "property", "data"]
    },
    {
        id: 17,
        term: "Normalization",
        pronunciation: "/ˌnɔːrməlaɪˈzeɪʃən/",
        definition: "The process of scaling data to a standard range to improve model training.",
        translation: "归一化",
        explanation: "将数据缩放到标准范围以改善模型训练的过程。",
        example: "Data normalization prevents features from dominating others.",
        exampleTranslation: "数据归一化防止特征压倒其他特征。",
        category: "数据处理",
        difficulty: "中等",
        tags: ["normalization", "scaling", "preprocessing"]
    },
    {
        id: 18,
        term: "Dimensionality Reduction",
        pronunciation: "/daɪˌmenʃəˈnæləti rɪˈdʌkʃən/",
        definition: "Techniques to reduce the number of features while preserving important information.",
        translation: "维度降低",
        explanation: "在保留重要信息的同时减少特征数量的技术。",
        example: "PCA is a popular dimensionality reduction technique.",
        exampleTranslation: "PCA是流行的维度降低技术。",
        category: "数据处理",
        difficulty: "中等",
        tags: ["dimensionality", "reduction", "PCA"]
    },

    // 应用领域
    {
        id: 19,
        term: "Computer Vision",
        pronunciation: "/kəmˈpjuːtər ˈvɪʒən/",
        definition: "The field of AI that enables computers to interpret and understand visual information.",
        translation: "计算机视觉",
        explanation: "使计算机能够解释和理解视觉信息的AI领域。",
        example: "Computer vision enables autonomous vehicle navigation.",
        exampleTranslation: "计算机视觉使自动驾驶车辆导航成为可能。",
        category: "应用领域",
        difficulty: "中等",
        tags: ["vision", "visual", "interpretation"]
    },
    {
        id: 20,
        term: "Natural Language Processing",
        pronunciation: "/ˈnætʃərəl ˈlæŋɡwɪdʒ ˈprɑːsesɪŋ/",
        definition: "The branch of AI that helps computers understand, interpret, and generate human language.",
        translation: "自然语言处理",
        explanation: "帮助计算机理解、解释和生成人类语言的AI分支。",
        example: "NLP powers chatbots and language translation services.",
        exampleTranslation: "NLP为聊天机器人和语言翻译服务提供支持。",
        category: "应用领域",
        difficulty: "中等",
        tags: ["NLP", "language", "processing"]
    }
];

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = artificialIntelligenceTerms;
} else {
    window.artificialIntelligenceTerms = artificialIntelligenceTerms;
} 