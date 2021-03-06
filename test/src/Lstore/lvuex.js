// 声明store类， 维护响应式state 暴露commit dispatch
// install 注册$store

class Store {
    constructor(options) {
        // 保存选项
        this.$options = options

        this._mutations = options.mutations

        this._actions = options.actions

        this._werappedFetters = options.getters;

        // 定义computed选项
        const computed = {}
        this.getters = {}
        const store = this;
        Object.keys(this._werappedFetters).forEach(key => {
            // 获取用户定义的getter
            const fn = store._werappedFetters[key]
            // 转换为computed可以使用无参形式
            computed[key] = function(){
                return fn(store.state)
            }

            // 为getters定义只读属性
            Object.defineProperty(store.getters, key, {
                get: () => store._vm[key]
            })
        })

        // api
        // 用户传入的state选项应该是响应式的
        // Vue吧data里的数据代理到了vue实例上
        this._vm = new Vue({
            data() {
                return {
                    // 不希望¥¥state被代理，所以加¥¥
                    $$state: options.state
                }
            },
            computed: computed
        })

        this.commit = this.commit.bind(this)
        this.dispatch = this.dispatch.bind(this)
    }

    // 存取
    get state() {
        // console.log(this._vm)
        return this._vm._data.$$state
    }

    set state(v) {
        console.error('set state error')
    }

    commit(type, payload) {
        console.log(type)
        const entry = this._mutations[type]
        if (!entry) {
            console.error('commit error')
            return 
        }
        entry(this.state, payload)
    }

    dispatch(type, payload) {
        console.log(type)
        const entry = this._actions[type]
        if (!entry) {
            console.error('dispatch error')
            return 
        }
        
        // { commit , dispatch, state} 上下文不同
        return entry(this, payload)
    }

}

let Vue;

function install(_Vue) {
    Vue = _Vue

    // 注册$store
    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store
                console.log(Vue.prototype.$store)
            }
        }
    })


}

export default {
    Store, install
}