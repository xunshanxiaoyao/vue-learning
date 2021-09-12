

let Vue;

class VueRouter {
    constructor(options) {
        this.$options = options
        // 保存当前hash到current
        // current 响应式
        // new Vue({
        //     data() {
        //         return {
        //             current: '/'
        //         }
        //     }
        // })
        // 给指定对象定义响应式  Vue.util.defineReactive
        // Vue.util.defineReactive(this, 'current', window.location.hash.slice(1) || "/")
        this.current = window.location.hash.slice(1) || '/'
        Vue.util.defineReactive(this, 'matched', [])
        // 递归遍历路由表 获得匹配关系的数组
        this.match()

        console.log(this.matched)

        // 监控hash change
        window.addEventListener('hashchange', () => {
            this.current = window.location.hash.slice(1)
            this.matched = [];
            this.match()
        })

    }

    match(routes) {
        routes = routes || this.$options.routes
        console.log('routes', routes)

        for (const route of routes) {
            if (route.path === '/' && this.current === '/') {
                this.matched.push(route)
                return
            }

            if (route.path !== '/' && this.current.indexOf(route.path) !== -1) {
                this.matched.push(route)
                if (route.children) {
                    this.match(route.children)
                    return
                }
            }
        }
    }
}

// 形参1 vue的构造函数： 目的是便于扩展
VueRouter.install = function (_Vue) {
    console.log(_Vue)
    Vue = _Vue

    // 将$router注册 当前vue实例不存在
    // 延迟至根实例创建时 vue.mixin()
    Vue.mixin({
        beforeCreate() {
            // 只需要根实例时 执行一次
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router
            }
        }
    })

    // 注册两个全局的组建： router-link router-view
    Vue.component('router-link', {
        props: {
            to: String,
            required: () => {return true},
        },
        render(h) {
            // 获取默认插槽内容 this.$slots.default
            return h('a', {
                attrs: {
                    href: '#' + this.to
                }
            }, this.$slots.default)
        }
    })
    Vue.component('router-view', {
        render(h) {
            console.log(this.$vnode)
            // 传入组件 直接渲染
            // 根据Url的hash部分 动态匹配这个组件
            // window.location.hash
            // this.$router.current this.$router.$option.routes
            // console.log('this.$router.current', this.$router.current)
            // console.log('this.$router.$option.routes',  this.$router.$options.routes)
            // 标记当前深度
            this.$vnode.data.routerView = true;
            let depth = 0;
            let parent = this.$parent;

            while(parent) {
                const vnodeData = parent.$vnode && parent.$vnode.data;

                if (vnodeData) {
                    if (vnodeData.routerView) {
                        // 说明当前parent是一个router-view
                        depth++
                    }
                }


                parent = parent.$parent;
            }

            let component  = null;
            // const route = this.$router.$options.routes.find((route) => {
            //     return route.path === this.$router.current
            // })
            const route = this.$router.matched[depth]
            if (route) {
                component = route.component
            }
            console.log(component)
            return h(component)
        }
    })
}

export default VueRouter