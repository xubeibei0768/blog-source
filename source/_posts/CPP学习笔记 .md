---
title: CPP学习笔记 
date: 2026-04-14 03:38:00
categories:
  - Uncategorized
tags:
  - 笔记
---

## GDB调试


```bash
Bash:g++ -g main.cpp -o main
Bash:gdb ./main
b #设置断点， 如 'b 10' 在第十行停下 'b main' 在main函数停下
r #运行
n #单步执行
p #打印变量， 如 'p x' 打印变量x的值
bt # 查看死亡现场
q #退出
```

## **类（class）**


```c++
class Vector{
    public:
				    Vector(int s) :elem{new double[s]}, sz{s} { }
				    /*
				    **成员初始化列表**
				    **: 的作用**：表示在真正执行函数体 { } 之前，就直接在内存分配的瞬间把 elem 和 sz 
				    的值给初始化好。
				    **为什么不用传统写法？** 在大括号里（比如 this->sz = s;），编译器
				    会先给 sz 赋一个垃圾随机值，然后再把 s 赋值给它，这叫“二次开销”。
				    注意此处没有写析构函数，会发生内存泄露，每运行一次就会发生一次泄露。	
				    */
						double& operator[](int i) { return elem[i]; }
						/*
						运算符重载
						operator[](int i):当使用[i]时，调用这个函数
						这里用了引用 & 使得不仅仅可以读取，还有可以修改，所得元素并非拷贝而是内存本身
						*/
						int size() { return sz; }
		private:
						double* elem;   // 指向元素的指针
						int sz;         // 元素的数量
};
```

## 联合体（union）


```c++
enum Type { ptr, num }; // 一个 Type 可以是ptr和num
//把一组值逐一列举

struct Entry {
    string name;
    Type t;     //  enum 标签，用来记录当前类型
    
    union {     // 匿名联合体：p 和 i 物理上共享同一块内存空间
        Node* p;
        int i;
    };
};
```

## **枚举（enum）**


```c++
enum class Color { red, blue, green };
enum class Traffic_light { green, yellow, red };

Color col = Color::red;
Traffic_light light = Traffic_light::red;
```

💡 `enum`后的`class`指明了这是个强类型的枚举，必须在前面加上枚举的命名空间才能使用。


```c++
Color x = red;                  // 错误：哪个颜色？
Color y = Traffic_light::red;   // 错误：此red并非Color类型
Color z = Color::red;           // OK

Color x = Color{5};             // 可行，但略有些啰嗦
Color y {6};                    // 同样可行
```


```c++
Traffic_light& operator++(Traffic_light& t)     // 前置自增：++
{
    switch (t) {
    case Traffic_light::green:  return t=Traffic_light::yellow;
    case Traffic_light::yellow: return t=Traffic_light::red;
    case Traffic_light::red:    return t=Traffic_light::green;
    }
}
Traffic_light next = ++light;   // next 将是 Traffic_light::green
```


```c++
// 有 2 个参数：第1个是被操作的枚举，第2个是用来区分前置后置的占位 int
Traffic_light operator++(Traffic_light& t, int) { // 后置自增：++
    Traffic_light temp = t;  // 1. 先把红绿灯现在的状态（旧值）记下来
    ++t;                     // 2. 调用上面的前置自增，把灯变到下一个颜色
    return temp;             // 3. 返回变灯之前的旧颜色
}
```

💡 经典的误解：以为是“先赋值给 b，然后再让 a 自增。

	## 分离编译


```c++
// Vector.h
#pragma once // 防止这个头文件被重复包含

class Vector {
private:
    double* elem;
    int sz;
public:
    Vector(int s);        // 只写名字，不写 {} 里的逻辑
    int size() const;
    double& operator[](int i);
};
```


```c++
// Vector.cpp
#include "Vector.h"

// 告诉编译器，我这是在实现 Vector 类里的构造函数
Vector::Vector(int s) {
    elem = new double[s];
    sz = s;
}

int Vector::size() const {
    return sz;
}

double& Vector::operator[](int i) {
    return elem[i];
}
```


```c++
// main.cpp
#include <iostream>
#include "Vector.h" // 拿过菜单

int main() {
    Vector a(3); // 编译器看过了 Vector.h，知道有这个东西，所以不会报错
    std::cout << "Size is: " << a.size() << std::endl;
    return 0;
}
```

---

### 在底层的 Linux 终端，分两步走：


```c++
g++ -c Vector.cpp  # 这会生成一个 Vector.o (后厨把菜炒好，装盘备用)
g++ -c main.cpp    # 这会生成一个 main.o (顾客点好单，生成小票)
```


```c++
g++ Vector.o main.o -o my_app  # 服务员把小票和菜对上号，打包成最终的 my_app
./my_app                       # 运行你的程序
```


```c++
g++ main.cpp Vector.cpp
```

💡 **那我main在调用vector.h的时候 怎么知道他的实现在哪？**

				<br/>

<br/>

