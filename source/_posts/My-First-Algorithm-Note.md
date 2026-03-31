---
title: My First Algorithm Note
date: 2026-03-31 21:13:09
tags:
---
This is my first post on the new local Hexo blog. Testing the native C++ code block rendering.

### C++ Two Pointers Example

Here is a classic algorithm snippet:

```cpp
#include <iostream>
#include <vector>

using namespace std;

// Find two numbers that add up to a specific target
vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0, right = numbers.size() - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            return {left + 1, right + 1};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return {-1, -1};
}

int main() {
    cout << "Hello, Hexo & C++!" << endl;
    return 0;
}
```