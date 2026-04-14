---
title: Missing  Semester 
date: 2026-04-14 03:37:00
categories:
  - Uncategorized
tags:
  - 笔记
---

## Shell

[//]: # (heading_4 is not supported)


```bash
man [指令...]
```

<br/>

### $PATH环境变量：输入指令后，系统会从环境变量目录中寻找指令的地址并执行

<br/>

### which:会在环境变量$PATH设置的目录里查找符合条件的文件。


```bash
$ which bash #使用指令"which"查看指令"bash"的绝对路径
```


```bash
/bin/bash                   #bash可执行程序的绝对路径
```


```bash
$ which -a bash #-a 会显示所有路径
```

<br/>

### cat: 输出文件的内容

<br/>

### sort：按字典序排序当前文件里面的内容（按行）


```bash
$ sort -u [文件...]#-排序并去重
```

<br/>

### uniq（unique）：去重（按行）（且必须连续）

<br/>

### head与tail：打印文件前/后n行的内容


```bash
$  head -n3 [文件...]#打印文件前三行的内容
```

<br/>

### grep：查找目录/文件（内部）的内容

<br/>

### sed：行编辑器（用编程语言编辑你的文件）

<br/>

## Neovim

- 按 i 开始打字，按 esc 回到不能打字的模式。

- 输入 :q 退出 neovim，不行就输入 :q! 强制退出，再重新运行 nvim，多来几次。

- 学会 :w 保存文件，:wq 保存文件并退出

- 学会用 hjkl 操作方向。

<br/>

## Git


```bash
git commit ：基于当前代码提交新版本

git branch ：查看当前所有的分支（看看电脑里有几个平行宇宙，前面带 * 号的就是你当前所在的宇宙）。
git branch <分支名> ：新建一个分支。
git branch -d <分支名> ：删除一个分支。

git switch <分支名> : 切换分支。

git merge <分支名> : 合并文件，若有冲突，用vim修改

git rebase <分支名> : 将当前分支接到目标分支后面（为了美观，大部分大厂会这样做）
```

<br/>

## Tmux

<br/>

