import Cookies from "js-cookie"
export default {
    state: {
        isCollapse: false,
        tabsList: [
            {
                path:'/',
                name:'home',
                label:'首页',
                icon:'home'
            }
        ],
        currentMenu: null,
        menu: []
    },
    mutations: {
        collapseMenu(state){
            state.isCollapse = !state.isCollapse
        },
        selectMenu(state, val){
            if(val.name !== 'home'){
                state.currentMenu = val
                if(state.tabsList===null){
                    state.tabsList = val
                    return ;
                }
                const res =state.tabsList.findIndex( item => item.name === val.name)
                if(res === -1){
                    state.tabsList.push(val)
                }else{
                    state.tabsList  = null
                }
            }
        },
        closeTag(state, val){
            state.tabsList.splice(val,1)
        },
        setMenu(state,val){
            state.menu = val
            Cookies.set('menu', JSON.stringify(val))
        },
        clearMenu(state){
            state.menu = []
            Cookies.remove('menu')
        },
        addMenu(state,router){
            if(!Cookies.get('menu')){
                return
            }
            const menu = JSON.parse(Cookies.get('menu'))
            state.menu = menu
            const menuArr = []
            menu.forEach( item => {
                if(item.children){
                    item.children = item.children.map( item => {
                        item.component = () => import(`../views/${item.url}`)
                        return item
                    })
                    menuArr.push(...item.children)
                }else{
                    item.component = () => import(`../views/${item.url}`)
                    menuArr.push(item)
                }
            })
            //路由的动态添加
            menuArr.forEach( item => {
                router.addRoute('Main', item)
            })
        },
    }
}
