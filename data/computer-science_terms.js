// 计算机科学词汇数据
const computerScienceTerms = [
    // 算法和复杂度分析
    {
        id: 1,
        term: "Algorithm",
        pronunciation: "/ˈælɡərɪðəm/",
        definition: "A step-by-step procedure for solving a problem or performing a task.",
        translation: "算法",
        explanation: "解决问题或执行任务的分步骤程序。",
        example: "The sorting algorithm arranges data in ascending order.",
        exampleTranslation: "排序算法将数据按升序排列。",
        category: "算法",
        difficulty: "基础",
        tags: ["algorithm", "procedure", "problem-solving"]
    },
    {
        id: 2,
        term: "Time Complexity",
        pronunciation: "/taɪm kəmˈpleksəti/",
        definition: "A measure of the amount of time an algorithm takes to complete as a function of input size.",
        translation: "时间复杂度",
        explanation: "衡量算法完成所需时间与输入规模关系的指标。",
        example: "The time complexity of bubble sort is O(n²).",
        exampleTranslation: "冒泡排序的时间复杂度是O(n²)。",
        category: "算法分析",
        difficulty: "中等",
        tags: ["complexity", "analysis", "performance"]
    },
    {
        id: 3,
        term: "Space Complexity",
        pronunciation: "/speɪs kəmˈpleksəti/",
        definition: "The amount of memory space an algorithm uses relative to the input size.",
        translation: "空间复杂度",
        explanation: "算法相对于输入大小使用的内存空间量。",
        example: "In-place sorting algorithms have O(1) space complexity.",
        exampleTranslation: "原地排序算法具有O(1)的空间复杂度。",
        category: "算法分析",
        difficulty: "中等",
        tags: ["memory", "space", "efficiency"]
    },

    // 数据结构
    {
        id: 4,
        term: "Data Structure",
        pronunciation: "/ˈdeɪtə ˈstrʌktʃər/",
        definition: "A way of organizing and storing data to enable efficient access and modification.",
        translation: "数据结构",
        explanation: "组织和存储数据以实现高效访问和修改的方式。",
        example: "Arrays and linked lists are fundamental data structures.",
        exampleTranslation: "数组和链表是基本的数据结构。",
        category: "数据结构",
        difficulty: "基础",
        tags: ["data", "structure", "organization"]
    },
    {
        id: 5,
        term: "Binary Tree",
        pronunciation: "/ˈbaɪnəri triː/",
        definition: "A tree data structure where each node has at most two children.",
        translation: "二叉树",
        explanation: "每个节点最多有两个子节点的树型数据结构。",
        example: "Binary search trees maintain sorted data efficiently.",
        exampleTranslation: "二叉搜索树高效地维护有序数据。",
        category: "数据结构",
        difficulty: "中等",
        tags: ["tree", "binary", "hierarchy"]
    },
    {
        id: 6,
        term: "Hash Table",
        pronunciation: "/hæʃ ˈteɪbəl/",
        definition: "A data structure that maps keys to values using a hash function.",
        translation: "哈希表",
        explanation: "使用哈希函数将键映射到值的数据结构。",
        example: "Hash tables provide O(1) average-case lookup time.",
        exampleTranslation: "哈希表提供平均O(1)的查找时间。",
        category: "数据结构",
        difficulty: "中等",
        tags: ["hash", "mapping", "lookup"]
    },

    // 系统架构
    {
        id: 7,
        term: "Architecture",
        pronunciation: "/ˈɑːrkɪtektʃər/",
        definition: "The overall design and organization of a computer system or software.",
        translation: "架构",
        explanation: "计算机系统或软件的整体设计和组织。",
        example: "Microservices architecture promotes scalability.",
        exampleTranslation: "微服务架构促进可扩展性。",
        category: "系统设计",
        difficulty: "高级",
        tags: ["design", "system", "organization"]
    },
    {
        id: 8,
        term: "Scalability",
        pronunciation: "/ˌskeɪləˈbɪləti/",
        definition: "The ability of a system to handle increased workload gracefully.",
        translation: "可扩展性",
        explanation: "系统优雅地处理增加工作负载的能力。",
        example: "Cloud computing provides horizontal scalability.",
        exampleTranslation: "云计算提供水平可扩展性。",
        category: "系统设计",
        difficulty: "高级",
        tags: ["scaling", "performance", "capacity"]
    },
    {
        id: 9,
        term: "Load Balancer",
        pronunciation: "/loʊd ˈbælənsər/",
        definition: "A device that distributes network traffic across multiple servers.",
        translation: "负载均衡器",
        explanation: "将网络流量分布到多个服务器的设备。",
        example: "Load balancers ensure high availability of web services.",
        exampleTranslation: "负载均衡器确保Web服务的高可用性。",
        category: "系统设计",
        difficulty: "高级",
        tags: ["distribution", "traffic", "availability"]
    },

    // 操作系统
    {
        id: 10,
        term: "Process",
        pronunciation: "/ˈprɑːses/",
        definition: "An instance of a program in execution, with its own memory space.",
        translation: "进程",
        explanation: "程序执行的实例，拥有自己的内存空间。",
        example: "Each application runs as a separate process.",
        exampleTranslation: "每个应用程序作为单独的进程运行。",
        category: "操作系统",
        difficulty: "中等",
        tags: ["execution", "memory", "instance"]
    },
    {
        id: 11,
        term: "Thread",
        pronunciation: "/θred/",
        definition: "A lightweight unit of execution within a process.",
        translation: "线程",
        explanation: "进程内轻量级的执行单位。",
        example: "Multithreading allows parallel execution of tasks.",
        exampleTranslation: "多线程允许任务的并行执行。",
        category: "操作系统",
        difficulty: "中等",
        tags: ["execution", "parallel", "concurrency"]
    },
    {
        id: 12,
        term: "Deadlock",
        pronunciation: "/ˈdedlɑːk/",
        definition: "A situation where two or more processes are blocked forever, waiting for each other.",
        translation: "死锁",
        explanation: "两个或多个进程永远阻塞，互相等待的情况。",
        example: "Proper resource ordering can prevent deadlocks.",
        exampleTranslation: "正确的资源排序可以防止死锁。",
        category: "操作系统",
        difficulty: "高级",
        tags: ["blocking", "waiting", "synchronization"]
    },

    // 数据库
    {
        id: 13,
        term: "Database",
        pronunciation: "/ˈdeɪtəbeɪs/",
        definition: "An organized collection of structured information or data.",
        translation: "数据库",
        explanation: "结构化信息或数据的有组织集合。",
        example: "Relational databases use tables to store data.",
        exampleTranslation: "关系数据库使用表来存储数据。",
        category: "数据库",
        difficulty: "基础",
        tags: ["data", "storage", "organized"]
    },
    {
        id: 14,
        term: "Query",
        pronunciation: "/ˈkwɪri/",
        definition: "A request for information from a database.",
        translation: "查询",
        explanation: "从数据库请求信息的操作。",
        example: "SQL queries retrieve specific data from tables.",
        exampleTranslation: "SQL查询从表中检索特定数据。",
        category: "数据库",
        difficulty: "基础",
        tags: ["request", "retrieval", "SQL"]
    },
    {
        id: 15,
        term: "Index",
        pronunciation: "/ˈɪndeks/",
        definition: "A data structure that improves the speed of data retrieval operations.",
        translation: "索引",
        explanation: "提高数据检索操作速度的数据结构。",
        example: "Database indexes speed up query performance.",
        exampleTranslation: "数据库索引加速查询性能。",
        category: "数据库",
        difficulty: "中等",
        tags: ["performance", "retrieval", "optimization"]
    },

    // 网络和安全
    {
        id: 16,
        term: "Encryption",
        pronunciation: "/ɪnˈkrɪpʃən/",
        definition: "The process of converting data into a coded form to prevent unauthorized access.",
        translation: "加密",
        explanation: "将数据转换为编码形式以防止未授权访问的过程。",
        example: "HTTPS uses encryption to secure web communications.",
        exampleTranslation: "HTTPS使用加密来保护Web通信。",
        category: "安全",
        difficulty: "中等",
        tags: ["security", "protection", "coding"]
    },
    {
        id: 17,
        term: "Firewall",
        pronunciation: "/ˈfaɪərwɔːl/",
        definition: "A network security device that monitors and controls network traffic.",
        translation: "防火墙",
        explanation: "监控和控制网络流量的网络安全设备。",
        example: "Firewalls block unauthorized network access attempts.",
        exampleTranslation: "防火墙阻止未授权的网络访问尝试。",
        category: "安全",
        difficulty: "中等",
        tags: ["security", "network", "protection"]
    },
    {
        id: 18,
        term: "Protocol",
        pronunciation: "/ˈproʊtəkɔːl/",
        definition: "A set of rules for communication between devices or systems.",
        translation: "协议",
        explanation: "设备或系统之间通信的规则集合。",
        example: "TCP/IP is the fundamental protocol of the internet.",
        exampleTranslation: "TCP/IP是互联网的基础协议。",
        category: "网络",
        difficulty: "中等",
        tags: ["communication", "rules", "standard"]
    },

    // 软件工程
    {
        id: 19,
        term: "Version Control",
        pronunciation: "/ˈvɜːrʒən kənˈtroʊl/",
        definition: "A system for tracking changes to files over time.",
        translation: "版本控制",
        explanation: "跟踪文件随时间变化的系统。",
        example: "Git is a popular distributed version control system.",
        exampleTranslation: "Git是流行的分布式版本控制系统。",
        category: "软件工程",
        difficulty: "基础",
        tags: ["tracking", "changes", "management"]
    },
    {
        id: 20,
        term: "Repository",
        pronunciation: "/rɪˈpɑːzətɔːri/",
        definition: "A storage location for software packages or source code.",
        translation: "仓库",
        explanation: "软件包或源代码的存储位置。",
        example: "GitHub hosts millions of code repositories.",
        exampleTranslation: "GitHub托管数百万个代码仓库。",
        category: "软件工程",
        difficulty: "基础",
        tags: ["storage", "code", "management"]
    }
];

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = computerScienceTerms;
} else {
    window.computerScienceTerms = computerScienceTerms;
} 