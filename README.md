<!-- @format -->

# React Advanced Components Hands-on

- to learn more about how source code in this project is structured, refer to this GitHub [repo](https://github.com/gkhan205/cwg-react-starter/tree/main)

---

## Count-down 组件

- 如何工作

  - Countdown组件相关的utility方法以及组件本身都位于 `src/modules/Countdown`文件夹下

  - 共有4个文件

    - `Coundown.css`: 用于给Countdown组件添加一些样式（和业务逻辑无关）

    - `CoundownHelper.js`: 定义了一些实用方法供我们自定义的`useCountdown` hook来调用

      - `formatTime`: 把还是数字的时间转化为对应的字符串用于展示，比如6分钟会被转化为“06”

      - `ZERO-TIME-INFO`: 常量，定义了倒计时到零时timeInfo这个state应该是什么样的

      - `computeTimeInfo`: 通过调用系统时间来计算剩余时间并据此返回新的timeInfo state的方法

    - `useCountdown.jsx`: 自定义的hook，用于包装定义和更新timeInfo state的业务逻辑

    - `Countdown.jsx`: Countdown主要组件，通过调用`useCountdown` hook并返回展示倒计时的组件

## Infinite Scrolling (with Feeds Component) & Lazy Loading

## Tab Component with Content Caching
