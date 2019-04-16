import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import form from './manageForm.js'
import user from './manageUser.js'
import blog from './manageBlog.js'
import follow from './manageFollow.js'

const store = new Vuex.Store({
  modules: {
    form_store: form,
    user_store: user,
    blog_store: blog,
    follow_store: follow
  }
})

export default store