function tplReplace(template: any, templateObject: any) {
    return template().replace(/\{\{(.*?)\}\}/g, (node: any, key: any) => {
        return templateObject[key.trim()]
    })
}

function setPageData(data: any, count: number) {
    const len = data.length
    let pageData = []
    let index = 0
    while (index < len) {
        pageData.push(data.slice(index, (index += count)))
    }
    return pageData
}

function scrollToTop() {
    setTimeout(() => {
        window.scroll(0, 0)
    }, 0)
}

function scrollToBottom(callback: any) {
    if (_getScrollTop() + _getWindowHeight() === _getScrollHeight()) {
        callback()
    }
}

function getItemNode(target: any) {
    while ((target = target.parentNode)) {
        if (
            target.lastChild.className &&
            target.lastChild.className.split(' ')[0] === 'more-loading'
        ) {
            return null
        }
        if (
            target.className &&
            target.className.split(' ')[0] === 'news-item'
        ) {
            console.log(target)
            return target
        }
    }
}

function getUrlQueryValue(key: any) {
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
    const res = window.location.search.substr(1).match(reg)

    return res !== null ? decodeURIComponent(res[2]) : null
}

export {
    tplReplace,
    scrollToBottom,
    setPageData,
    scrollToTop,
    getItemNode,
    getUrlQueryValue,
}

/** 内部方法 */
function _getScrollTop(): number {
    var scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0
    if (document.body) {
        bodyScrollTop = document.body.scrollTop
    }
    if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop
    }
    scrollTop =
        bodyScrollTop - documentScrollTop > 0
            ? bodyScrollTop
            : documentScrollTop
    return scrollTop
}

function _getScrollHeight(): number {
    var scrollHeight = 0,
        bodyScrollHeight = 0,
        documentScrollHeight = 0
    if (document.body) {
        bodyScrollHeight = document.body.scrollHeight
    }
    if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight
    }
    scrollHeight =
        bodyScrollHeight - documentScrollHeight > 0
            ? bodyScrollHeight
            : documentScrollHeight
    return scrollHeight
}

function _getWindowHeight(): number {
    var windowHeight = 0
    if (document.compatMode == 'CSS1Compat') {
        windowHeight = document.documentElement.clientHeight
    } else {
        windowHeight = document.body.clientHeight
    }
    return windowHeight
}
