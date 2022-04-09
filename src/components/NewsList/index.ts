const tpl0 = require('./tpl/tpl0.tpl')
const tpl1 = require('./tpl/tpl1.tpl')
const tpl2 = require('./tpl/tpl2.tpl')
const tpl3 = require('./tpl/tpl3.tpl')
const wrapperTpl = require('./tpl/wrapper.tpl')

import { tplReplace, getItemNode } from '../../lib/utils'

import './index.less'
export default {
    name: 'NewsList',
    wrapperTpl(top: any) {
        return tplReplace(wrapperTpl, { top })
    },
    tpl(options: any) {
        const { data, pageNum } = options
        let list = ''
        let tpl = ''

        data.map((item: any, index: any) => {
            if (!item.thumbnail_pic_s) {
                tpl = tpl0
            } else if (item.thumbnail_pic_s && !item.thumbnail_pic_s02) {
                tpl = tpl1
            } else if (item.thumbnail_pic_s02 && !item.thumbnail_pic_s03) {
                tpl = tpl2
            } else if (item.thumbnail_pic_s03) {
                tpl = tpl3
            }

            list += tplReplace(tpl, {
                pageNum,
                index,
                uniquekey: item.uniquekey,
                url: item.url,
                author: item.author_name,
                date: item.date,
                thumbnail_pic_s: item.thumbnail_pic_s,
                thumbnail_pic_s02: item.thumbnail_pic_s02,
                thumbnail_pic_s03: item.thumbnail_pic_s03,
                title: item.title,
                category: item.category,
            })
        })
        return list
    },
    imgShow() {
        const oImgs = document.querySelectorAll('img')
        ;[...oImgs].map((img) => {
            img.onload = function () {
                img.style.opacity = '1'
            }
        })
    },
    bindEvent(oList: any, setCurrentNews: any) {
        oList.addEventListener(
            'click',
            this._goToDetail.bind(this, setCurrentNews),
            false
        )
    },
    _goToDetail(setCurrentNews: any) {
        const oItem = getItemNode(arguments[1].target)
        if (oItem === null || oItem === undefined) {
            return
        }
        // console.log(oItem)
        const options = {
            idx: oItem.dataset.index,
            pageNum: oItem.dataset.page,
        }
        setCurrentNews(options)
        window.location.href = `detail.html?path=${location.pathname}`
    },
}
