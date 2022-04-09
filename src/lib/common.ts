// import FastClick from './fastclick'
const fastclick = require('./fastclick')

window.addEventListener(
    'load',
    function () {
        fastclick.attach(document.body)
    },
    false
)

document.documentElement.addEventListener(
    'touchmove',
    function (e) {
        if (e.touches.length > 1) {
            // 事件处理程序调用 preventDefault 来阻止默认滑动行为
            e.preventDefault()
        }
    },
    { passive: false }
)


function pageInit() {
    let width = document.documentElement.clientWidth
    document.documentElement.style.fontSize = width / 3.75 + 'px'
}
// 页面首次加载，应用一次
pageInit()
// 监听手机旋转的事件， 重新设置
window.addEventListener("orientationchange", pageInit)
// 监听手机窗口变化，重新设置
window.addEventListener("resize", pageInit)


// document.documentElement  取得对<html>的引用
// document.documentElement.style.fontSize =
//     document.documentElement.clientWidth / 3.75 + 'px'
