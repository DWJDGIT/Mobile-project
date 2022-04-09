// import tpl from './index.tpl';
const tpl = require('./index.tpl')
import './index.less'
import { tplReplace } from '../../lib/utils'

export default {
    name: 'Follow',
    follow() {
        return tplReplace(tpl, {
            star: 'star',
        })
    },
    unfollow() {
        return tplReplace(tpl, {
            star: 'star-o',
        })
    },
    bindEvent(doFollow: any) {
        const oFollow: HTMLElement = document.querySelector('.follow')!
        oFollow.addEventListener(
            'click',
            this._setFollow.bind(this, oFollow, doFollow)
        )
    },
    _setFollow(oFollow: any, doFollow: any) {
        const className = oFollow.className
        oFollow.className = 'follow iconfont icon-'

        switch (className) {
            case 'follow iconfont icon-star':
                oFollow.className += 'star-o'
                doFollow(false)
                break
            case 'follow iconfont icon-star-o':
                oFollow.className += 'star'
                doFollow(true)
                break
            default:
                break
        }
    },
}
