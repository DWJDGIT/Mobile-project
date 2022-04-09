// const { dev, prod } = require('../config')
import { dev, prod } from '../config'

const doAjax = Symbol('doAjax')

// 判断是否为开发环境
const IsDev = process.env.NODE_ENV !== 'production'

class HTTP {
    [doAjax](options: any) {
        let o = window.XMLHttpRequest
            ? new XMLHttpRequest()
            : new ActiveXObject('Microsoft.XMLHTTP')

        if (!o) {
            throw new Error('您的浏览器不支持异步发起HTTP请求')
        }

        let opt = options || {},
            type = (opt.type || 'GET').toUpperCase(),
            async = '' + opt.async === 'false' ? false : true,
            dataType: any = opt.dataType || 'JSON',
            jsonp = opt.jsonp || 'cb',
            jsonpCallback =
                opt.jsonpCallback ||
                'jQuery' + rendomNum() + '_' + new Date().getTime(),
            url = (IsDev ? dev : prod) + options.url,
            data = opt.data || null,
            timeout = opt.timeout || 30000,
            error = opt.error || function () {},
            success = opt.success || function () {},
            complete = opt.complete || function () {},
            t: any = null

        if (!url) {
            throw new Error('您没有填写URL')
        }
        // console.log(dataType)

        if (dataType.toUpperCase() === 'JSONP' && type !== 'GET') {
            throw new Error('如果dataType为JSON，type请您设置为GET或不设置')
        }
        if (dataType.toUpperCase() === 'JSONP') {
            
            let oScript = document.createElement('script')
            oScript.src =
                url.indexOf('?') === -1
                    ? url + '?' + jsonp + '=' + jsonpCallback
                    : url + '&' + jsonp + '=' + jsonpCallback

            document.body.appendChild(oScript)
            document.body.removeChild(oScript)
            // 把window断言成any绕过去
            ;(window as any)[jsonpCallback] = (data: any) => {
                success(data)
            }
            return
        }
        o.onreadystatechange = () => {
            if (o.readyState === 4) {
                if ((o.status >= 200 && o.status < 300) || o.status === 304) {
                    switch (dataType.toUpperCase()) {
                        case 'JSON':
                            success(JSON.parse(o.responseText))
                            break
                        case 'TEXT':
                            success(o.responseText)
                            break
                        case 'XML':
                            success(o.responseXML)
                            break
                        default:
                            success(JSON.parse(o.responseText))
                    }
                } else {
                    error(o)
                }
                complete()
                clearTimeout(t)
                t = null
                o = null
            }
        }
        o.open(type, url, async)
        type === 'POST' &&
            o.setRequestHeader(
                'Content-type',
                'application/x-www-form-urlencoded'
            )
        o.send(type === 'GET' ? null : formatDatas(data))

        t = setTimeout(() => {
            o.abort()
            clearTimeout(t)
            t = null
            o = null
            throw new Error('本次请求已超时，API地址：' + url)
        }, timeout)
    }

    ajax(opt: any) {
        this[doAjax](opt)
    }

    post(
        url: string,
        data: any,
        dataType: string,
        successB: any,
        errorB: any,
        completeCB: any
    ) {
        this[doAjax]({
            type: 'POST',
            url: url,
            data: data,
            dataType: dataType,
            success: successB,
            error: errorB,
            complete: completeCB,
        })
    }

    get(
        url: string,
        data: any,
        dataType: string,
        successCB: any,
        errorCB: any,
        completeCB: any
    ) {
        this[doAjax]({
            type: 'GET',
            url: url,
            dataType: dataType,
            success: successCB,
            error: errorCB,
            complete: completeCB,
        })
    }
}

function formatDatas(obj: any) {
    let str = ''
    for (let key in obj) {
        str += key + '=' + obj[key] + '&'
    }
    return str.replace(/&$/, '')
}

function rendomNum() {
    let num = ''
    for (let i = 0; i < 20; i++) {
        num += Math.floor(Math.random() * 10)
    }
    return num
}

export default HTTP
