---
title: GTest 断言的核心用法
date: 2026-08-01 09:59:00
categories:
  - Uncategorized
tags:
  - 笔记
---

[//]: # (heading_4 is not supported)

- `**EXPECT_*****`**（非致命断言）：** 如果判断失败，测试会标红报错，但**代码会继续往下执行**。通常用来检查不影响后续逻辑的普通数值。

- `**ASSERT_*****`**（致命断言）：** 如果判断失败，测试不仅报错，还会**立刻终止当前所在的函数**。通常用来检查“如果这里错了，下面绝对会崩溃”的严重错误（比如指针为空）。

[//]: # (heading_4 is not supported)


```c++
// 1. 判断是否相等 (Equal)
EXPECT_EQ(bpm->GetPinCount(pid), 1);  // 期望 pin_count 等于 1

// 2. 判断是否不相等 (Not Equal)
EXPECT_NE(pid, INVALID_PAGE_ID);      // 期望 pid 不是无效 ID (说明分配成功了)

// 3. 判断是否为真 (True)
ASSERT_TRUE(bpm->DeletePage(pid));    // 必须返回 true，否则立刻终止测试

// 4. 判断是否为假 (False)
EXPECT_FALSE(page_opt.has_value());   // 期望 optional 里没有值
```

[//]: # (heading_4 is not supported)


```c++
const page_id_t pid = bpm->NewPage();

// 必须分配成功，如果分配失败拿到了 INVALID_PAGE_ID，
// 下面的逻辑再测也没意义了，所以用 ASSERT_NE 立刻终止。
ASSERT_NE(pid, INVALID_PAGE_ID);

// 验证新页面的 pin_count 是否按照契约被设置为了 1。
// 如果不是 1，这是个错误，但程序不至于崩溃，所以用 EXPECT_EQ。
EXPECT_EQ(bpm->GetPinCount(pid), 1);
```

### 1. 数值大小比较 (Numerical Comparisons)

- `**EXPECT_LT(val1, val2)**`：小于 (Less Than)，即 `val1 < val2`。

- `**EXPECT_LE(val1, val2)**`：小于等于 (Less or Equal)，即 `val1 <= val2`。

- `**EXPECT_GT(val1, val2)**`：大于 (Greater Than)，即 `val1 > val2`。

- `**EXPECT_GE(val1, val2)**`：大于等于 (Greater or Equal)，即 `val1 >= val2`。

> **提示：** 对于普通的 C++ 对象或 `std::string`，你可以直接用 `EXPECT_EQ` 或 `EXPECT_LT`，只要该类重载了 `==` 或 `<` 运算符即可。

### 2. C 风格字符串比较 (C-String Comparisons)

- `**EXPECT_STREQ(str1, str2)**`：两个 C 字符串的内容相等 (String Equal)。

- `**EXPECT_STRNE(str1, str2)**`：两个 C 字符串的内容不相等 (String Not Equal)。

- `**EXPECT_STRCASEEQ(str1, str2)**`：忽略大小写，内容相等 (Case Equal)。

- `**EXPECT_STRCASENE(str1, str2)**`：忽略大小写，内容不相等 (Case Not Equal)。

### 3. 异常抛出检测 (Exception Checking)

- `**EXPECT_THROW(statement, exception_type)**`：期望某行代码（`statement`）抛出**特定类型**的异常。

	- *示例：* `EXPECT_THROW(bpm->DeletePage(pid), std::runtime_error);`

- `**EXPECT_ANY_THROW(statement)**`：期望这行代码抛出**任意类型**的异常。

- `**EXPECT_NO_THROW(statement)**`：期望这行代码**不抛出**任何异常（如果抛出了就算测试失败）。

### 4. 浮点数比较 (Floating-Point Comparisons)

- `**EXPECT_FLOAT_EQ(val1, val2)**`：判断两个 `float` 类型的数值是否“几乎相等”。

- `**EXPECT_DOUBLE_EQ(val1, val2)**`：判断两个 `double` 类型的数值是否“几乎相等”。

- `**EXPECT_NEAR(val1, val2, abs_error)**`：判断两个数的差值的绝对值，是否在你指定的误差范围 (`abs_error`) 内。

### 5. 显式失败与成功

- `**SUCCEED()**`：显式声明测试到此成功（通常用于文档意义或占位）。

- `**FAIL()**`：致命失败，立刻终止当前函数（相当于无条件的 `ASSERT` 失败）。

- `**ADD_FAILURE()**`：非致命失败，标记测试失败但继续执行后续代码。

