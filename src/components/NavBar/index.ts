import './index.less'
import { tplReplace, scrollToTop } from '../../lib/utils'
const wrapperTpl = require('./tpl/index.tpl')
const itemTpl = require('./tpl/item.tpl')

export default {
    name: 'NavBar',
    _curIdx: 0,
    tpl(data: any) {
        let itemList = ''

        data.map(
            ({ type, title }: { type: string; title: string }, index: number) => {
                itemList += tplReplace(itemTpl, {
                    isCurrent: !index ? 'current' : '',
                    title,
                    type,
                })
            }
        )

        return tplReplace(wrapperTpl, {
            itemList,
            wrapperW: 0.6 * data.length,
        })
    },
    bindEvent(setType: any) {
        const oNavBar = document.querySelector('.nav')!
        const oNavItems = document.querySelectorAll('.item')!

        oNavBar.addEventListener(
            'click',
            this._setNav.bind(this, oNavItems, setType),
            false
        )
    },
    _setNav(items: any, setType: any) {
        const tar = arguments[2].target
        
        const className = tar.className.trim()
        if (className === 'item') {
            const type = tar.dataset.type
            setType(type)
            scrollToTop()
            items[this._curIdx].className = 'item'
            this._curIdx = Array.from(items).indexOf(tar)
            items[this._curIdx].className += ' current'
        }
    },
}
